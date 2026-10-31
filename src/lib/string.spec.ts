import { toInt } from './string';

describe('toInt', () => {
  test.concurrent.each([
    { input: '12', expected: 12 },
    // As the site writes its stats
    { input: '1,234', expected: 1234 },
    { input: 12, expected: 12 },
    { input: 'a', expected: null },
    { input: null, expected: null }
  ])('should parse $input to $expected', ({ input, expected }) => {
    expect(toInt(input)).toEqual(expected);
  });
});
