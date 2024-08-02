import { allConcurrently, allSequentially } from './promise-util';

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
