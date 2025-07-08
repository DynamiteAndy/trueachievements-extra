import { intersectionObserver } from './intersection-observer-service';

// happy-dom doesn't implement `IntersectionObserver` at all -- confirmed directly before
// writing this file. So these tests swap in a fake that records calls and lets each test
// fire a synthetic entry manually, rather than relying on real layout/viewport intersection.
class FakeIntersectionObserver {
  static instances: FakeIntersectionObserver[] = [];

  observed: Element[] = [];
  disconnected = false;

  constructor(
    private readonly callback: IntersectionObserverCallback,
    public readonly options?: IntersectionObserverInit
  ) {
    FakeIntersectionObserver.instances.push(this);
  }

  observe(element: Element): void {
    // Real `IntersectionObserver.observe()` is idempotent -- re-observing an already-watched
    // element is a no-op, not a duplicate registration.
    if (!this.observed.includes(element)) {
      this.observed.push(element);
    }
  }

  unobserve(element: Element): void {
    this.observed = this.observed.filter((el) => el !== element);
  }

  disconnect(): void {
    this.disconnected = true;
  }

  fire(target: Element, isIntersecting: boolean): void {
    this.callback(
      [{ target, isIntersecting } as IntersectionObserverEntry],
      this as unknown as IntersectionObserver
    );
  }
}

describe('IntersectionObserverService', () => {
  const originalIntersectionObserver = globalThis.IntersectionObserver;

  beforeEach(() => {
    FakeIntersectionObserver.instances = [];
    globalThis.IntersectionObserver = FakeIntersectionObserver as unknown as typeof IntersectionObserver;
  });

  afterEach(() => {
    intersectionObserver.stop();
    globalThis.IntersectionObserver = originalIntersectionObserver;
  });

  test('observe registers the element with a single shared native IntersectionObserver', () => {
    const el = document.createElement('div');
    intersectionObserver.observe(el, () => {});

    expect(FakeIntersectionObserver.instances).toHaveLength(1);
    expect(FakeIntersectionObserver.instances[0].observed).toEqual([el]);
  });

  test('reuses the same native observer instance across multiple observe calls with matching options', () => {
    intersectionObserver.observe(document.createElement('div'), () => {});
    intersectionObserver.observe(document.createElement('div'), () => {});

    expect(FakeIntersectionObserver.instances).toHaveLength(1);
  });

  test('creates a separate native observer for a different root/rootMargin/threshold combination', () => {
    const root = document.createElement('div');
    intersectionObserver.observe(document.createElement('div'), () => {});
    intersectionObserver.observe(document.createElement('div'), () => {}, { root, threshold: 1 });

    expect(FakeIntersectionObserver.instances).toHaveLength(2);
  });

  test("fires the callback registered for the entry's target, not other observed elements", () => {
    const elA = document.createElement('div');
    const elB = document.createElement('div');
    const firedA: IntersectionObserverEntry[] = [];
    const firedB: IntersectionObserverEntry[] = [];

    intersectionObserver.observe(elA, (entry) => firedA.push(entry));
    intersectionObserver.observe(elB, (entry) => firedB.push(entry));

    FakeIntersectionObserver.instances[0].fire(elA, true);

    expect(firedA).toHaveLength(1);
    expect(firedB).toHaveLength(0);
  });

  test('the unregister function returned by observe stops future callbacks and unobserves the element', () => {
    const el = document.createElement('div');
    const fired: IntersectionObserverEntry[] = [];
    const unregister = intersectionObserver.observe(el, (entry) => fired.push(entry));

    unregister();

    const [instance] = FakeIntersectionObserver.instances;
    expect(instance.observed).toEqual([]);

    instance.fire(el, true);
    expect(fired).toHaveLength(0);
  });

  test('once: true auto-unregisters after the first firing', () => {
    const el = document.createElement('div');
    const fired: IntersectionObserverEntry[] = [];
    intersectionObserver.observe(el, (entry) => fired.push(entry), { once: true });

    const [instance] = FakeIntersectionObserver.instances;
    instance.fire(el, true);
    instance.fire(el, true);

    expect(fired).toHaveLength(1);
  });

  test('multiple observe calls on the same element each fire independently', () => {
    const el = document.createElement('div');
    const firedA: IntersectionObserverEntry[] = [];
    const firedB: IntersectionObserverEntry[] = [];

    intersectionObserver.observe(el, (entry) => firedA.push(entry));
    intersectionObserver.observe(el, (entry) => firedB.push(entry));

    FakeIntersectionObserver.instances[0].fire(el, true);

    expect(firedA).toHaveLength(1);
    expect(firedB).toHaveLength(1);
  });

  test('unregistering one of two matchers on the same element keeps the element observed for the other', () => {
    const el = document.createElement('div');
    const firedA: IntersectionObserverEntry[] = [];
    const firedB: IntersectionObserverEntry[] = [];

    const unregisterA = intersectionObserver.observe(el, (entry) => firedA.push(entry));
    intersectionObserver.observe(el, (entry) => firedB.push(entry));

    unregisterA();

    const [instance] = FakeIntersectionObserver.instances;
    expect(instance.observed).toEqual([el]);

    instance.fire(el, true);
    expect(firedA).toHaveLength(0);
    expect(firedB).toHaveLength(1);
  });

  test('stop disconnects every shared observer and clears registrations', () => {
    const root = document.createElement('div');
    intersectionObserver.observe(document.createElement('div'), () => {});
    intersectionObserver.observe(document.createElement('div'), () => {}, { root });

    intersectionObserver.stop();

    expect(FakeIntersectionObserver.instances.every((instance) => instance.disconnected)).toBe(true);
  });
});
