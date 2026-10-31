// happy-dom has no `IntersectionObserver`, and its `ResizeObserver` does nothing (there's no layout to measure), so the
// two observer services' specs swap the global for this fake: it records what it observes and lets a test report
// entries by hand.
type FakeObserver<Entry> = {
  observed: Element[];
  disconnected: boolean;
  // Reports these entries to the observer's callback, as one batch
  fire(...entries: Entry[]): void;
};

// Puts the fake in place of the global `name` for each test, and returns the observers made, in order
export const useFakeObserver = <Entry>(name: 'IntersectionObserver' | 'ResizeObserver'): FakeObserver<Entry>[] => {
  const instances: FakeObserver<Entry>[] = [];

  class Fake implements FakeObserver<Entry> {
    observed: Element[] = [];
    disconnected = false;

    constructor(private readonly callback: (entries: Entry[], observer: Fake) => void) {
      instances.push(this);
    }

    observe(element: Element): void {
      // As the real ones: observing an element already watched does nothing
      if (!this.observed.includes(element)) {
        this.observed.push(element);
      }
    }

    unobserve(element: Element): void {
      this.observed = this.observed.filter((observed) => observed !== element);
    }

    disconnect(): void {
      this.disconnected = true;
    }

    fire(...entries: Entry[]): void {
      this.callback(entries, this);
    }
  }

  const original = globalThis[name];
  beforeEach(() => {
    instances.length = 0;
    Object.defineProperty(globalThis, name, { value: Fake, writable: true, configurable: true });
  });
  afterEach(() => {
    Object.defineProperty(globalThis, name, { value: original, writable: true, configurable: true });
  });

  return instances;
};
