import { logger } from '@ta-x-lib';
import { tick } from '@ta-x-test';

import type { MockInstance } from 'vitest';

import { mutationObserver } from './mutation-observer';

describe('MutationObserverService', () => {
  // Whether the shared observer was left disconnected: disconnected after it last started observing
  const leftDisconnected = (observe: MockInstance, disconnect: MockInstance): boolean =>
    (disconnect.mock.invocationCallOrder.at(-1) ?? 0) > (observe.mock.invocationCallOrder.at(-1) ?? 0);

  test('onElementAdded fires when a matching node is added to the DOM', async () => {
    const found: HTMLElement[] = [];
    mutationObserver.onElementAdded('.target', (el) => {
      found.push(el);
    });

    const el = document.createElement('div');
    el.className = 'target';
    document.body.appendChild(el);

    await tick();

    expect(found).toEqual([el]);
  });

  test('onElementAdded reports the matches inside an added element that matches itself', async () => {
    const found: string[] = [];
    const first: string[] = [];
    mutationObserver.onElementAdded('li', (el) => {
      found.push(el.id);
    });
    mutationObserver.onElementAdded(
      'li',
      (el) => {
        first.push(el.id);
      },
      { once: true }
    );

    const outer = document.createElement('li');
    outer.id = 'outer';
    outer.innerHTML = '<ul><li id="inner"></li></ul>';
    document.body.appendChild(outer);

    await tick();

    expect(found).toEqual(['outer', 'inner']);
    // Only the first is wanted, so the search stops there
    expect(first).toEqual(['outer']);
  });

  test('onElementAdded matches every descendant when several arrive in one batch', async () => {
    const found: string[] = [];
    mutationObserver.onElementAdded('.target', (el) => {
      found.push(el.id);
    });

    const wrapper = document.createElement('div');
    wrapper.innerHTML =
      '<span class="target" id="a"></span><span class="target" id="b"></span><span class="target" id="c"></span>';
    document.body.appendChild(wrapper);

    await tick();

    // By id: toEqual takes elements that look alike as equal (writing-specs.md, "Exact checks")
    expect(found).toEqual(['a', 'b', 'c']);
  });

  test('once: true auto-unregisters after the first match', async () => {
    const found: HTMLElement[] = [];
    mutationObserver.onElementAdded(
      '.target',
      (el) => {
        found.push(el);
      },
      { once: true }
    );

    const el1 = document.createElement('div');
    el1.className = 'target';
    document.body.appendChild(el1);
    await tick();

    const el2 = document.createElement('div');
    el2.className = 'target';
    document.body.appendChild(el2);
    await tick();

    expect(found).toHaveLength(1);
    expect(found[0]).toBe(el1);
  });

  test('once: true fires once for an added element holding several matches', async () => {
    const callback = vi.fn();
    mutationObserver.onElementAdded('.target', callback, { once: true });

    document.body.insertAdjacentHTML('beforeend', '<div><p class="target"></p><p class="target"></p></div>');
    await tick();

    expect(callback).toHaveBeenCalledOnce();
    expect(callback.mock.calls[0][0]).toBe(document.querySelector('.target'));
  });

  test('a matcher registered from a callback also sees the rest of that batch', async () => {
    // As waitForElement does inside a callback: the matchers are kept in a Set gone through as it changes
    const found: string[] = [];
    mutationObserver.onElementAdded(
      '.first',
      () => {
        mutationObserver.onElementAdded('.second', (el) => {
          found.push(el.className);
        });
      },
      { once: true }
    );

    document.body.insertAdjacentHTML('beforeend', '<div class="first"></div><div class="second"></div>');
    await tick();

    expect(found).toEqual(['second']);
  });

  test("stopped from an attribute callback, that element's other matchers don't fire", async () => {
    const el = document.createElement('div');
    document.body.append(el);
    const second = vi.fn();
    mutationObserver.onAttributeChange(el, ['data-a'], () => mutationObserver.stop());
    mutationObserver.onAttributeChange(el, ['data-a'], second);

    el.setAttribute('data-a', '1');
    await tick();

    expect(second).not.toHaveBeenCalled();
  });

  test('onElementAdded respects a scoped root, ignoring matches outside it', async () => {
    const scoped = document.createElement('div');
    document.body.appendChild(scoped);
    const outside = document.createElement('div');
    document.body.appendChild(outside);

    const found: HTMLElement[] = [];
    mutationObserver.onElementAdded(
      '.target',
      (el) => {
        found.push(el);
      },
      { root: scoped }
    );

    const inScope = document.createElement('div');
    inScope.className = 'target';
    scoped.appendChild(inScope);

    const outOfScope = document.createElement('div');
    outOfScope.className = 'target';
    outside.appendChild(outOfScope);

    await tick();

    expect(found).toEqual([inScope]);
  });

  describe('what the observer watches', () => {
    const observed = (observe: { mock: { calls: unknown[][] } }) => observe.mock.calls.at(-1)?.[1];

    test('should watch child lists only while there are only element matchers', () => {
      const observe = vi.spyOn(MutationObserver.prototype, 'observe');

      mutationObserver.onElementAdded('.target', () => {});

      expect(observed(observe)).toEqual({ childList: true, subtree: true });
    });

    test('should watch only the attributes its matchers name, together', () => {
      const observe = vi.spyOn(MutationObserver.prototype, 'observe');

      mutationObserver.onAttributeChange(document.documentElement, ['class'], () => {});
      const unregister = mutationObserver.onAttributeChange(document.body, ['style', 'class'], () => {});
      expect(observed(observe)).toEqual({
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['class', 'style']
      });

      unregister();
      expect(observed(observe)).toEqual({
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['class']
      });
    });

    test('should stop watching attributes, then everything, as matchers unregister', () => {
      const observe = vi.spyOn(MutationObserver.prototype, 'observe');
      const disconnect = vi.spyOn(MutationObserver.prototype, 'disconnect');

      const unregisterAdded = mutationObserver.onElementAdded('.target', () => {});
      const unregisterAttribute = mutationObserver.onAttributeChange(document.body, ['class'], () => {});

      unregisterAttribute();
      expect(observed(observe)).toEqual({ childList: true, subtree: true });

      const observeCalls = observe.mock.calls.length;
      unregisterAdded();
      expect(observe.mock.calls).toHaveLength(observeCalls);
      expect(leftDisconnected(observe, disconnect)).toBe(true);
    });

    test('should not re-observe while the options stay the same', () => {
      const observe = vi.spyOn(MutationObserver.prototype, 'observe');

      mutationObserver.onElementAdded('.one', () => {});
      mutationObserver.onElementAdded('.two', () => {})();
      mutationObserver.onElementAdded('.three', () => {});

      expect(observe).toHaveBeenCalledExactlyOnceWith(document.documentElement, { childList: true, subtree: true });
    });

    test('should still deliver changes made before the options changed', async () => {
      const found: HTMLElement[] = [];
      mutationObserver.onElementAdded('.target', (el) => {
        found.push(el);
      });
      const unregister = mutationObserver.onAttributeChange(document.body, ['class'], () => {});

      const el = document.createElement('div');
      el.className = 'target';
      document.body.appendChild(el);
      unregister();

      await tick();

      expect(found).toEqual([el]);
    });
  });

  describe('onAttributeChange', () => {
    test('should fire when a named attribute changes on the element itself', async () => {
      const element = document.createElement('div');
      const child = document.createElement('span');
      element.appendChild(child);
      document.body.appendChild(element);

      const found: HTMLElement[] = [];
      mutationObserver.onAttributeChange(element, ['class'], (el) => {
        found.push(el);
      });

      // Another watcher of data-other, so the change reaches the observer and only this matcher's own filter leaves it
      mutationObserver.onAttributeChange(document.body, ['data-other'], () => {});
      child.className = 'child';
      element.setAttribute('data-other', 'x');
      element.appendChild(document.createElement('span'));
      await tick();
      expect(found).toEqual([]);

      element.className = 'changed';
      await tick();
      expect(found).toEqual([element]);
    });
  });

  describe('onElementRemoved', () => {
    test('should fire once when the element, or an ancestor, leaves the page, and be let go', async () => {
      const wrapper = document.createElement('div');
      const element = document.createElement('span');
      wrapper.append(element);
      document.body.append(wrapper);
      const removed = vi.fn<(element: HTMLElement) => void>();
      mutationObserver.onElementRemoved(element, removed);

      wrapper.remove();
      await tick();
      document.body.append(wrapper);
      wrapper.remove();
      await tick();

      expect(removed).toHaveBeenCalledExactlyOnceWith(element);
    });

    test('should not fire for an element moved within the page, or for other removals', async () => {
      const element = document.createElement('span');
      const other = document.createElement('p');
      document.body.append(element, other);
      const removed = vi.fn<(element: HTMLElement) => void>();
      onTestFinished(mutationObserver.onElementRemoved(element, removed));

      document.body.prepend(element);
      other.remove();
      await tick();

      expect(removed).not.toHaveBeenCalled();
    });
  });

  describe('a failing callback', () => {
    test('should not stop the other matchers, and is logged', async () => {
      const error = vi.spyOn(logger, 'error').mockImplementation(() => {});
      const found: string[] = [];
      mutationObserver.onElementAdded('.target', () => {
        throw new Error('first');
      });
      mutationObserver.onElementAdded('.target', async () => {
        throw new Error('second');
      });
      mutationObserver.onElementAdded('.target', (el) => {
        found.push(el.id);
      });

      document.body.innerHTML = '<div class="target" id="a"></div>';
      document.body.appendChild(Object.assign(document.createElement('div'), { className: 'target', id: 'b' }));
      await tick();

      expect(found).toEqual(['a', 'b']);
      expect(error.mock.calls.map(([scope, cause]) => [scope, (cause as Error).message])).toEqual([
        ['mutation-observer', 'first'],
        ['mutation-observer', 'first'],
        ['mutation-observer', 'second'],
        ['mutation-observer', 'second']
      ]);
    });
  });

  test('stop disconnects the observer so no further matches fire', async () => {
    const found: HTMLElement[] = [];
    mutationObserver.onElementAdded('.target', (el) => {
      found.push(el);
    });
    mutationObserver.stop();

    const el = document.createElement('div');
    el.className = 'target';
    document.body.appendChild(el);
    await tick();

    expect(found).toEqual([]);
  });
});
