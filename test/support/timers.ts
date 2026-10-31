// Imports nothing from src, so the pure specs (plain Node, no page) take these from @ta-x-test-timers; the rest
// through @ta-x-test

// One real turn of the event loop: lets what happy-dom delivers in a microtask (mutation records) and what the code
// under test awaits run before a spec checks the result. Specs that test timeouts or waits use fake timers instead
// (`useFakeTimers` below, then `vi.advanceTimersByTimeAsync`); under fake timers this only resolves once they're
// advanced.
export const tick = (): Promise<void> => new Promise((resolve) => setTimeout(resolve, 0));

// What the code under test waits on: timeouts and animation frames. A spec that needs others (the clock, `performance`)
// names its own list
type FakeTimerOptions = NonNullable<Parameters<typeof vi.useFakeTimers>[0]>;
const timeoutsAndFrames: FakeTimerOptions['toFake'] = [
  'setTimeout',
  'clearTimeout',
  'requestAnimationFrame',
  'cancelAnimationFrame'
];

// Fake timers for this test, timeouts and animation frames unless `options` says otherwise (`{ toFake: ['Date'], now }`
// for code that reads the clock). Real timers come back when the test ends, even when it fails, so call it in the test
// or its `beforeEach` with no `afterEach` of its own
export const useFakeTimers = (options: FakeTimerOptions = {}): void => {
  vi.useFakeTimers({ toFake: timeoutsAndFrames, ...options });
  onTestFinished(() => {
    vi.useRealTimers();
  });
};

// On fake timers: whether the promise has settled once pending microtasks have run, and with what
export const outcome = async <T>(promise: Promise<T>): Promise<{ settled: boolean; value?: T }> => {
  let result: { settled: boolean; value?: T } = { settled: false };
  // Not awaited: it may never settle, which is what this checks
  void promise.then((value) => {
    result = { settled: true, value };
  });
  await vi.advanceTimersByTimeAsync(0);

  return result;
};
