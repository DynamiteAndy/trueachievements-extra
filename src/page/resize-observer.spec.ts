import { logger } from '@ta-x-lib';

import { useFakeObserver } from './fake-observer.spec-helpers';
import { resizeObserver } from './resize-observer';

// An entry as the native observer reports it
const entry = (target: Element): ResizeObserverEntry => ({ target }) as ResizeObserverEntry;

describe('ResizeObserverService', () => {
  const instances = useFakeObserver<ResizeObserverEntry>('ResizeObserver');

  test('observe registers each element with one shared native ResizeObserver', () => {
    const elA = document.createElement('div');
    const elB = document.createElement('div');
    resizeObserver.observe(elA, () => {});
    resizeObserver.observe(elB, () => {});

    expect(instances).toHaveLength(1);
    expect(instances[0].observed).toEqual([elA, elB]);
  });

  test("fires the callback registered for the entry's target, not other observed elements", () => {
    const elA = document.createElement('div');
    const elB = document.createElement('div');
    const firedA: ResizeObserverEntry[] = [];
    const firedB: ResizeObserverEntry[] = [];

    resizeObserver.observe(elA, (entry) => firedA.push(entry));
    resizeObserver.observe(elB, (entry) => firedB.push(entry));

    instances[0].fire(entry(elA));

    expect(firedA).toEqual([{ target: elA }]);
    expect(firedB).toEqual([]);
  });

  test('unregistering one of two matchers on the same element keeps the element observed for the other', () => {
    const el = document.createElement('div');
    const firedA: ResizeObserverEntry[] = [];
    const firedB: ResizeObserverEntry[] = [];

    const unregisterA = resizeObserver.observe(el, (entry) => firedA.push(entry));
    resizeObserver.observe(el, (entry) => firedB.push(entry));

    unregisterA();

    const [instance] = instances;
    expect(instance.observed).toEqual([el]);

    instance.fire(entry(el));
    expect(firedA).toEqual([]);
    expect(firedB).toEqual([{ target: el }]);
  });

  test('unobserves the element when its last matcher unregisters', () => {
    const el = document.createElement('div');
    const unregister = resizeObserver.observe(el, () => {});
    const [instance] = instances;

    unregister();

    expect(instance.observed).toEqual([]);
  });

  test('a callback throwing does not stop the others, and is logged', () => {
    const el = document.createElement('div');
    const other = document.createElement('div');
    const error = new Error('broken consumer');
    const logged = vi.spyOn(logger, 'error').mockImplementation(() => {});
    const after = vi.fn();
    const otherFired = vi.fn();
    resizeObserver.observe(el, () => {
      throw error;
    });
    resizeObserver.observe(el, after);
    resizeObserver.observe(other, otherFired);

    instances[0].fire(entry(el), entry(other));

    expect(after).toHaveBeenCalledExactlyOnceWith({ target: el });
    expect(otherFired).toHaveBeenCalledExactlyOnceWith({ target: other });
    expect(logged).toHaveBeenCalledExactlyOnceWith('resize-observer', error);
  });

  test('stop disconnects the observer and clears registrations', () => {
    const el = document.createElement('div');
    resizeObserver.observe(el, () => {});

    resizeObserver.stop();

    expect(instances.map((instance) => instance.disconnected)).toEqual([true]);
    // Cleared, so watching again starts an observer of its own rather than reusing the disconnected one
    resizeObserver.observe(el, () => {});
    expect(instances.map((instance) => instance.disconnected)).toEqual([true, false]);
  });
});
