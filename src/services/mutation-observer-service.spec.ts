import { mutationObserver } from './mutation-observer-service';

describe('MutationObserverService', () => {
  afterEach(() => {
    mutationObserver.stop();
    document.body.innerHTML = '';
  });

  test('onElementAdded fires when a matching node is added to the DOM', async () => {
    const found: HTMLElement[] = [];
    mutationObserver.onElementAdded('.target', (el) => {
      found.push(el);
    });

    const el = document.createElement('div');
    el.className = 'target';
    document.body.appendChild(el);

    await new Promise((resolve) => setTimeout(resolve, 10));

    expect(found).toEqual([el]);
  });

  test('onElementAdded matches a descendant of the added node, not just the node itself', async () => {
    const found: HTMLElement[] = [];
    mutationObserver.onElementAdded('.target', (el) => {
      found.push(el);
    });

    const wrapper = document.createElement('div');
    wrapper.innerHTML = '<span class="target"></span>';
    document.body.appendChild(wrapper);

    await new Promise((resolve) => setTimeout(resolve, 10));

    expect(found).toHaveLength(1);
    expect(found[0].className).toBe('target');
  });

  test('onElementAdded matches every descendant when several arrive in one batch', async () => {
    const found: HTMLElement[] = [];
    mutationObserver.onElementAdded('.target', (el) => {
      found.push(el);
    });

    const wrapper = document.createElement('div');
    wrapper.innerHTML = '<span class="target"></span><span class="target"></span><span class="target"></span>';
    document.body.appendChild(wrapper);

    await new Promise((resolve) => setTimeout(resolve, 10));

    expect(found).toHaveLength(3);
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
    await new Promise((resolve) => setTimeout(resolve, 10));

    const el2 = document.createElement('div');
    el2.className = 'target';
    document.body.appendChild(el2);
    await new Promise((resolve) => setTimeout(resolve, 10));

    expect(found).toEqual([el1]);
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

    await new Promise((resolve) => setTimeout(resolve, 10));

    expect(found).toEqual([inScope]);
  });

  test('the unregister function returned by onElementAdded stops future matches', async () => {
    const found: HTMLElement[] = [];
    const unregister = mutationObserver.onElementAdded('.target', (el) => {
      found.push(el);
    });
    unregister();

    const el = document.createElement('div');
    el.className = 'target';
    document.body.appendChild(el);
    await new Promise((resolve) => setTimeout(resolve, 10));

    expect(found).toEqual([]);
  });

  test('onMutation fires on an attribute change matching attributeFilter', async () => {
    const container = document.createElement('div');
    container.className = 'content';
    document.body.appendChild(container);

    const found: HTMLElement[] = [];
    mutationObserver.onMutation(
      '.content',
      (el) => {
        found.push(el);
      },
      { attributeFilter: ['class'] }
    );

    container.classList.add('expanded');
    await new Promise((resolve) => setTimeout(resolve, 10));

    expect(found).toEqual([container]);
  });

  test('onMutation ignores attribute changes outside attributeFilter', async () => {
    const container = document.createElement('div');
    container.className = 'content';
    document.body.appendChild(container);

    const found: HTMLElement[] = [];
    mutationObserver.onMutation(
      '.content',
      (el) => {
        found.push(el);
      },
      { attributeFilter: ['class'] }
    );

    container.setAttribute('data-other', 'x');
    await new Promise((resolve) => setTimeout(resolve, 10));

    expect(found).toEqual([]);
  });

  test('onMutation fires on childList changes within a matching ancestor', async () => {
    const container = document.createElement('div');
    container.className = 'content';
    document.body.appendChild(container);

    const found: HTMLElement[] = [];
    mutationObserver.onMutation('.content', (el) => {
      found.push(el);
    });

    container.appendChild(document.createElement('span'));
    await new Promise((resolve) => setTimeout(resolve, 10));

    expect(found).toEqual([container]);
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
    await new Promise((resolve) => setTimeout(resolve, 10));

    expect(found).toEqual([]);
  });
});
