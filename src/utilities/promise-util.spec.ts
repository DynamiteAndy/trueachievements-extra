import { allConcurrently, allSequentially } from './promise-util';
import { logger, LogLevel } from '@ta-x-services';

describe('allConcurrently', () => {
  test.concurrent.each([
    {
      input: [
        { name: 'Task 1', task: () => 'Result 1' },
        { name: 'Task 2', task: () => Promise.resolve('Result 2') },
        { name: 'Task 3', task: async () => 'Result 3' },
        { name: 'Task 4', task: () => 'Result 4' },
        { name: 'Task 5', task: () => Promise.resolve('Result 5') },
        { name: 'Task 6', task: async () => 'Result 6' }
      ],
      expected: ['Result 1', 'Result 2', 'Result 3', 'Result 4', 'Result 5', 'Result 6']
    },
    {
      input: [],
      expected: []
    }
  ])('should execute tasks concurrently and return results', async ({ input, expected }) => {
    expect(await allConcurrently('Test', input)).toEqual(expected);
  });
});

describe('allSequentially', () => {
  test.concurrent.each([
    {
      input: [
        { name: 'Task 1', task: () => 'Result 1' },
        { name: 'Task 2', task: () => Promise.resolve('Result 2') },
        { name: 'Task 3', task: async () => 'Result 3' },
        { name: 'Task 4', task: () => 'Result 4' },
        { name: 'Task 5', task: () => Promise.resolve('Result 5') },
        { name: 'Task 6', task: async () => 'Result 6' }
      ],
      expected: ['Result 1', 'Result 2', 'Result 3', 'Result 4', 'Result 5', 'Result 6']
    },
    {
      input: [],
      expected: []
    }
  ])('should execute tasks sequentially and return results', async ({ input, expected }) => {
    expect(await allSequentially('Test', input)).toEqual(expected);
  });
});

describe('allConcurrently logging', () => {
  beforeEach(() => {
    logger.setLevel(LogLevel.Debug);
    vi.spyOn(console, 'debug').mockImplementation(() => {});
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    logger.setLevel(LogLevel.Warn);
    vi.restoreAllMocks();
  });

  test('logs a debug message for each finished task and the overall run, scoped to the given name', async () => {
    await allConcurrently('My Group', [
      { name: 'Task A', task: () => 'a' },
      { name: 'Task B', task: () => 'b' }
    ]);

    expect(console.debug).toHaveBeenCalledWith(
      '%c[My Group]',
      expect.any(String),
      expect.stringContaining('Task A finished')
    );
    expect(console.debug).toHaveBeenCalledWith(
      '%c[My Group]',
      expect.any(String),
      expect.stringContaining('Task B finished')
    );
    expect(console.debug).toHaveBeenCalledWith('%c[My Group]', expect.any(String), expect.stringContaining('finished 2 task(s)'));
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

    expect(console.debug).toHaveBeenCalledWith('%c[My Group]', expect.any(String), expect.stringContaining('[thread 0] Task A finished'));
    expect(console.debug).toHaveBeenCalledWith('%c[My Group]', expect.any(String), expect.stringContaining('[thread 1] Task B finished'));
  });

  test('logs an error and rethrows when a task fails', async () => {
    const error = new Error('boom');

    await expect(
      allConcurrently('My Group', [{ name: 'Failing Task', task: () => Promise.reject(error) }], 1)
    ).rejects.toThrow(error);

    expect(console.error).toHaveBeenCalledWith(
      '%c[My Group]',
      expect.any(String),
      expect.stringContaining('Failing Task failed'),
      error
    );
  });
});
