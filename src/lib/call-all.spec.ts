import { callAll } from './call-all';

describe('callAll', () => {
  test('calls each function in order', () => {
    const calls: number[] = [];
    callAll([() => calls.push(1), () => calls.push(2), () => calls.push(3)]);
    expect(calls).toEqual([1, 2, 3]);
  });

  test('calls the last first with reverse', () => {
    const calls: number[] = [];
    callAll([() => calls.push(1), () => calls.push(2), () => calls.push(3)], { reverse: true });
    expect(calls).toEqual([3, 2, 1]);
  });

  test('takes any iterable, such as a set', () => {
    const calls: string[] = [];
    callAll(new Set([() => calls.push('a'), () => calls.push('b')]));
    expect(calls).toEqual(['a', 'b']);
  });

  test('does nothing for an empty list', () => {
    expect(() => callAll([])).not.toThrow();
  });
});
