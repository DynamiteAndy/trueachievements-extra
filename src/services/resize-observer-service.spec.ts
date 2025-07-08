import { resizeObserver } from './resize-observer-service';

// happy-dom's real `ResizeObserver` is a documented no-op (`observe`/`unobserve` do nothing,
// since there's no real layout engine to measure box sizes against) -- confirmed directly
// before writing this file. So these tests swap in a fake that records calls and lets each
// test fire a synthetic entry manually, rather than relying on an actual size change.
class FakeResizeObserver {
  static instances: FakeResizeObserver[] = [];

  observed: Element[] = [];
  disconnected = false;

  constructor(private readonly callback: ResizeObserverCallback) {
    FakeResizeObserver.instances.push(this);
  }

  observe(element: Element): void {
    // Real `ResizeObserver.observe()` is idempotent -- re-observing an already-watched
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

  fire(target: Element): void {
    this.callback([{ target } as ResizeObserverEntry], this as unknown as ResizeObserver);
  }
}

describe('ResizeObserverService', () => {
  const originalResizeObserver = globalThis.ResizeObserver;

  beforeEach(() => {
    FakeResizeObserver.instances = [];
    globalThis.ResizeObserver = FakeResizeObserver as unknown as typeof ResizeObserver;
  });

  afterEach(() => {
    resizeObserver.stop();
    globalThis.ResizeObserver = originalResizeObserver;
  });

  test('observe registers the element with a single shared native ResizeObserver', () => {
    const el = document.createElement('div');
    resizeObserver.observe(el, () => {});

    expect(FakeResizeObserver.instances).toHaveLength(1);
    expect(FakeResizeObserver.instances[0].observed).toEqual([el]);
  });

  test('reuses the same native observer instance across multiple observe calls', () => {
    resizeObserver.observe(document.createElement('div'), () => {});
    resizeObserver.observe(document.createElement('div'), () => {});

    expect(FakeResizeObserver.instances).toHaveLength(1);
  });

  test("fires the callback registered for the entry's target, not other observed elements", () => {
    const elA = document.createElement('div');
    const elB = document.createElement('div');
    const firedA: ResizeObserverEntry[] = [];
    const firedB: ResizeObserverEntry[] = [];

    resizeObserver.observe(elA, (entry) => firedA.push(entry));
    resizeObserver.observe(elB, (entry) => firedB.push(entry));

    FakeResizeObserver.instances[0].fire(elA);

    expect(firedA).toHaveLength(1);
    expect(firedB).toHaveLength(0);
  });

  test('the unregister function returned by observe stops future callbacks and unobserves the element', () => {
    const el = document.createElement('div');
    const fired: ResizeObserverEntry[] = [];
    const unregister = resizeObserver.observe(el, (entry) => fired.push(entry));

    unregister();

    const [instance] = FakeResizeObserver.instances;
    expect(instance.observed).toEqual([]);

    instance.fire(el);
    expect(fired).toHaveLength(0);
  });

  test('once: true auto-unregisters after the first firing', () => {
    const el = document.createElement('div');
    const fired: ResizeObserverEntry[] = [];
    resizeObserver.observe(el, (entry) => fired.push(entry), { once: true });

    const [instance] = FakeResizeObserver.instances;
    instance.fire(el);
    instance.fire(el);

    expect(fired).toHaveLength(1);
  });

  test('multiple observe calls on the same element each fire independently', () => {
    const el = document.createElement('div');
    const firedA: ResizeObserverEntry[] = [];
    const firedB: ResizeObserverEntry[] = [];

    resizeObserver.observe(el, (entry) => firedA.push(entry));
    resizeObserver.observe(el, (entry) => firedB.push(entry));

    FakeResizeObserver.instances[0].fire(el);

    expect(firedA).toHaveLength(1);
    expect(firedB).toHaveLength(1);
  });

  test('unregistering one of two matchers on the same element keeps the element observed for the other', () => {
    const el = document.createElement('div');
    const firedA: ResizeObserverEntry[] = [];
    const firedB: ResizeObserverEntry[] = [];

    const unregisterA = resizeObserver.observe(el, (entry) => firedA.push(entry));
    resizeObserver.observe(el, (entry) => firedB.push(entry));

    unregisterA();

    const [instance] = FakeResizeObserver.instances;
    expect(instance.observed).toEqual([el]);

    instance.fire(el);
    expect(firedA).toHaveLength(0);
    expect(firedB).toHaveLength(1);
  });

  test('stop disconnects the observer and clears registrations', () => {
    const el = document.createElement('div');
    resizeObserver.observe(el, () => {});

    resizeObserver.stop();

    expect(FakeResizeObserver.instances[0].disconnected).toBe(true);
  });
});
