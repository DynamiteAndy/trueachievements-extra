import { outcome, tick, useFakeTimers } from '@ta-x-test-timers';

import { logger, LogLevel } from './logger';
import { allConcurrently, type TaskDefinition, until, yieldToPage } from './promise';

describe('allConcurrently', () => {
  test.concurrent.each([
    {
      input: [
        { name: 'Task 1', task: () => 'Result 1' },
        { name: 'Task 2', task: () => Promise.resolve('Result 2') },
        { name: 'Task 3', task: async () => 'Result 3' }
      ],
      expected: ['Result 1', 'Result 2', 'Result 3']
    },
    {
      input: [],
      expected: []
    }
  ])("returns each task's result in order", async ({ input, expected }) => {
    expect(await allConcurrently('Test', input)).toEqual(expected);
  });
});

describe('allConcurrently: when tasks run', () => {
  // Tasks that each wait for the test to let them finish, recording when they start
  const gated = (count: number): { started: number[]; finish: () => void; tasks: TaskDefinition<number>[] } => {
    const started: number[] = [];
    const { promise: gate, resolve: finish } = Promise.withResolvers<void>();

    return {
      started,
      finish: () => finish(),
      tasks: Array.from({ length: count }, (_, index) => ({
        name: `Task ${index}`,
        task: async (): Promise<number> => {
          started.push(index);
          await gate;
          return index;
        }
      }))
    };
  };

  test('starts every task at once, in order, before any of them finishes', async () => {
    const { started, finish, tasks } = gated(8);

    const running = allConcurrently('Test', tasks);
    await tick();

    expect(started).toEqual([0, 1, 2, 3, 4, 5, 6, 7]);
    finish();
    expect(await running).toEqual([0, 1, 2, 3, 4, 5, 6, 7]);
  });

  test('runs at most `max` tasks together when given one, starting the next as one finishes', async () => {
    const { started, finish, tasks } = gated(5);

    const running = allConcurrently('Test', tasks, 2);
    await tick();

    expect(started).toEqual([0, 1]);
    finish();
    expect(await running).toEqual([0, 1, 2, 3, 4]);
    expect(started).toEqual([0, 1, 2, 3, 4]);
  });

  // A task with an optional parameter (runMigrations' list, say) must get its default, not an index
  test('calls each task with no arguments', async () => {
    const task = vi.fn();

    await allConcurrently('Test', [
      { name: 'Task A', task },
      { name: 'Task B', task }
    ]);

    expect(task.mock.calls).toEqual([[], []]);
  });

  test('marks each finished task on the performance timeline only while debug logging is on', async () => {
    const mark = vi.spyOn(performance, 'mark');

    await allConcurrently('Quiet', [{ name: 'Task A', task: () => 'a' }]);
    logger.setLevel(LogLevel.Debug);
    onTestFinished(() => logger.setLevel(LogLevel.Warn));
    vi.spyOn(console, 'debug').mockImplementation(() => {});
    await allConcurrently('My Group', [{ name: 'Task B', task: () => 'b' }]);

    expect(mark.mock.calls).toEqual([['ta-x My Group: Task B']]);
  });
});

describe('allConcurrently logging', () => {
  beforeEach(() => {
    logger.setLevel(LogLevel.Debug);
    vi.spyOn(console, 'debug').mockImplementation(() => {});
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  // The spies are restored by the config (restoreMocks); the level isn't
  afterEach(() => {
    logger.setLevel(LogLevel.Warn);
  });

  // Each task's line is checked with its thread below
  test('logs a debug message for the overall run, scoped to the given name', async () => {
    await allConcurrently('My Group', [
      { name: 'Task A', task: () => 'a' },
      { name: 'Task B', task: () => 'b' }
    ]);

    expect(console.debug).toHaveBeenCalledWith(
      '%c[My Group]',
      expect.any(String),
      expect.stringMatching(/^finished 2 task\(s\) in \d+ms$/)
    );
  });

  test('includes the executing thread index in each task log line', async () => {
    await allConcurrently(
      'My Group',
      [
        { name: 'Task A', task: () => 'a' },
        { name: 'Task B', task: () => 'b' }
      ],
      2
    );

    expect(console.debug).toHaveBeenCalledWith(
      '%c[My Group]',
      expect.any(String),
      expect.stringMatching(/^\[thread 0\] Task A finished in \d+ms \(at \d+ms\)$/)
    );
    expect(console.debug).toHaveBeenCalledWith(
      '%c[My Group]',
      expect.any(String),
      expect.stringMatching(/^\[thread 1\] Task B finished in \d+ms \(at \d+ms\)$/)
    );
  });

  test('logs an error when a task fails, and carries on with the rest', async () => {
    const error = new Error('boom');

    await expect(
      allConcurrently(
        'My Group',
        [
          { name: 'Failing Task', task: () => Promise.reject(error) },
          { name: 'Next Task', task: () => 'next' }
        ],
        1
      )
    ).resolves.toStrictEqual([undefined, 'next']);

    expect(console.error).toHaveBeenCalledWith(
      '%c[My Group]',
      expect.any(String),
      '[thread 0] Failing Task failed',
      error
    );
  });

  // A hole (or an array ending short) would slip past a caller reading every slot
  test('leaves an undefined slot, not a hole, for a failed last task', async () => {
    const results = await allConcurrently('My Group', [
      { name: 'Task', task: () => 'first' },
      { name: 'Failing Task', task: () => Promise.reject(new Error('boom')) }
    ]);

    expect(results).toStrictEqual(['first', undefined]);
    expect(1 in results).toBe(true);
  });
});

describe('yieldToPage', () => {
  test("resolves in a later task, after the page's own queued tasks", async () => {
    const order: string[] = [];
    setTimeout(() => order.push('queued task'));

    await yieldToPage();
    order.push('after yielding');

    expect(order).toEqual(['queued task', 'after yielding']);
  });
});

// On fake timers: each wait is advanced through rather than sat out
describe('wait helpers', () => {
  beforeEach(() => {
    useFakeTimers({ toFake: ['setTimeout', 'clearTimeout', 'Date'] });
  });

  describe('until', () => {
    test('should resolve to true once the condition is met, checking on its interval', async () => {
      let conditionMet = false;
      const promise = until(() => conditionMet, 1000);

      await vi.advanceTimersByTimeAsync(480);
      expect(await outcome(promise)).toEqual({ settled: false });

      conditionMet = true;
      await vi.advanceTimersByTimeAsync(20);

      expect(await outcome(promise)).toEqual({ settled: true, value: true });
    });

    test('should resolve to false when the condition is not met within the timeout', async () => {
      const promise = until(() => false, 500);

      await vi.advanceTimersByTimeAsync(480);
      expect(await outcome(promise)).toEqual({ settled: false });

      await vi.advanceTimersByTimeAsync(40);

      expect(await outcome(promise)).toEqual({ settled: true, value: false });
    });

    test('should keep checking when the condition throws, logging each throw', async () => {
      const logged = vi.spyOn(logger, 'debug').mockImplementation(() => {});
      let calls = 0;
      const promise = until(() => {
        calls++;
        if (calls < 3) {
          throw new Error('not ready');
        }
        return true;
      }, 1000);

      await vi.advanceTimersByTimeAsync(40);

      expect(await outcome(promise)).toEqual({ settled: true, value: true });
      expect(logged.mock.calls).toEqual([
        ['until', 'check threw', new Error('not ready')],
        ['until', 'check threw', new Error('not ready')]
      ]);
    });
  });
});
