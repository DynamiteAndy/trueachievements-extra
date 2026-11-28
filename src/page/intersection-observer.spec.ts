import { logger } from '@ta-x-lib';

import { useFakeObserver } from './fake-observer.spec-helpers';
import { intersectionObserver } from './intersection-observer';

// An entry as the native observer reports it
const entry = (target: Element, isIntersecting: boolean): IntersectionObserverEntry =>
  ({ target, isIntersecting }) as IntersectionObserverEntry;

describe('IntersectionObserverService', () => {
  const instances = useFakeObserver<IntersectionObserverEntry>('IntersectionObserver');

  test('observe registers each element with one shared native IntersectionObserver, for matching options', () => {
    const elA = document.createElement('div');
    const elB = document.createElement('div');
    intersectionObserver.observe(elA, () => {});
    intersectionObserver.observe(elB, () => {});

    expect(instances).toHaveLength(1);
    expect(instances[0].observed).toEqual([elA, elB]);
  });

  test('creates a separate native observer for a different root/rootMargin/threshold combination', () => {
    const root = document.createElement('div');
    intersectionObserver.observe(document.createElement('div'), () => {});
    intersectionObserver.observe(document.createElement('div'), () => {}, { root, threshold: 1 });

    expect(instances).toHaveLength(2);
  });

  test("fires the callback registered for the entry's target, not other observed elements", () => {
    const elA = document.createElement('div');
    const elB = document.createElement('div');
    const firedA: IntersectionObserverEntry[] = [];
    const firedB: IntersectionObserverEntry[] = [];

    intersectionObserver.observe(elA, (entry) => firedA.push(entry));
    intersectionObserver.observe(elB, (entry) => firedB.push(entry));

    instances[0].fire(entry(elA, true));

    expect(firedA).toEqual([{ target: elA, isIntersecting: true }]);
    expect(firedB).toEqual([]);
  });

  test('unregistering one of two matchers on the same element keeps the element observed for the other', () => {
    const el = document.createElement('div');
    const firedA: IntersectionObserverEntry[] = [];
    const firedB: IntersectionObserverEntry[] = [];

    const unregisterA = intersectionObserver.observe(el, (entry) => firedA.push(entry));
    intersectionObserver.observe(el, (entry) => firedB.push(entry));

    unregisterA();

    const [instance] = instances;
    expect(instance.observed).toEqual([el]);

    instance.fire(entry(el, true));
    expect(firedA).toEqual([]);
    expect(firedB).toEqual([{ target: el, isIntersecting: true }]);
  });

  test('a second matcher on an element already watched unobserves it first, so the native observer reports it again', () => {
    // The native observer sends a first entry only for an element it doesn't watch yet
    const el = document.createElement('div');
    intersectionObserver.observe(el, () => {});
    const [instance] = instances;
    const unobserve = vi.spyOn(instance as unknown as IntersectionObserver, 'unobserve');
    const observe = vi.spyOn(instance as unknown as IntersectionObserver, 'observe');

    intersectionObserver.observe(el, () => {});

    expect(unobserve).toHaveBeenCalledExactlyOnceWith(el);
    expect(observe).toHaveBeenCalledExactlyOnceWith(el);
    expect(unobserve.mock.invocationCallOrder[0]).toBeLessThan(observe.mock.invocationCallOrder[0]);
    expect(instance.observed).toEqual([el]);
  });

  test('an entry only reaches the matchers registered with the options of the observer that reported it', () => {
    // The same element watched at two thresholds: each has its own native observer
    const el = document.createElement('div');
    const atAll = vi.fn();
    const atHalf = vi.fn();
    intersectionObserver.observe(el, atAll);
    intersectionObserver.observe(el, atHalf, { threshold: 0.5 });
    const [allObserver, halfObserver] = instances;

    allObserver.fire(entry(el, true));

    expect(atAll).toHaveBeenCalledExactlyOnceWith({ target: el, isIntersecting: true });
    expect(atHalf).not.toHaveBeenCalled();

    halfObserver.fire(entry(el, false));

    expect(atHalf).toHaveBeenCalledExactlyOnceWith({ target: el, isIntersecting: false });
    expect(atAll).toHaveBeenCalledOnce();
  });

  test('unregistering unobserves the element from its own observer, even while another observer still watches it', () => {
    const el = document.createElement('div');
    intersectionObserver.observe(el, () => {});
    const stopHalf = intersectionObserver.observe(el, () => {}, { threshold: 0.5 });
    const [allObserver, halfObserver] = instances;

    stopHalf();

    expect(halfObserver.observed).toEqual([]);
    expect(allObserver.observed).toEqual([el]);
  });

  test('disconnects a native observer once its last element is let go, and makes a new one for the next', () => {
    const el = document.createElement('div');
    const other = document.createElement('div');
    const stopEl = intersectionObserver.observe(el, () => {});
    const stopOther = intersectionObserver.observe(other, () => {});
    const [first] = instances;

    stopEl();
    expect(first.disconnected).toBe(false);
    stopOther();
    expect(first.disconnected).toBe(true);

    intersectionObserver.observe(el, () => {});
    expect(instances).toHaveLength(2);
    expect(instances[1].observed).toEqual([el]);
  });

  test('a callback throwing does not stop the others, and is logged', () => {
    const el = document.createElement('div');
    const error = new Error('broken consumer');
    const logged = vi.spyOn(logger, 'error').mockImplementation(() => {});
    const after = vi.fn();
    intersectionObserver.observe(el, () => {
      throw error;
    });
    intersectionObserver.observe(el, after);

    instances[0].fire(entry(el, true));

    expect(after).toHaveBeenCalledExactlyOnceWith({ target: el, isIntersecting: true });
    expect(logged).toHaveBeenCalledExactlyOnceWith('intersection-observer', error);
  });

  test("stopped from a callback, that element's other matchers don't fire", () => {
    const el = document.createElement('div');
    const second = vi.fn();
    intersectionObserver.observe(el, () => intersectionObserver.stop());
    intersectionObserver.observe(el, second);

    instances[0].fire(entry(el, true));

    expect(second).not.toHaveBeenCalled();
  });

  test('stop disconnects every shared observer and clears registrations', () => {
    const root = document.createElement('div');
    intersectionObserver.observe(document.createElement('div'), () => {});
    intersectionObserver.observe(document.createElement('div'), () => {}, { root });

    intersectionObserver.stop();

    expect(instances.map((instance) => instance.disconnected)).toEqual([true, true]);
    // Cleared, so watching again starts an observer of its own rather than reusing a disconnected one
    intersectionObserver.observe(document.createElement('div'), () => {});
    expect(instances.map((instance) => instance.disconnected)).toEqual([true, true, false]);
  });
});
