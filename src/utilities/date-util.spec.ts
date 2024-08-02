import { isValid, isAfterNow } from './date-util';

describe('isValid', () => {
  const today = new Date(new Date().setHours(0, 0, 0, 0));
  const yesterday = new Date(new Date(today).setDate(today.getDate() - 1));

  test.concurrent.each([
    { input: today, expected: true },
    { input: yesterday, expected: true },
    { input: 'a', expected: false },
    { input: '12-12-2022', expected: true },
    { input: null, expected: false }
  ])('should validate that date $input is either valid or invalid', ({ input, expected }) => {
    expect(isValid(input)).toEqual(expected);
  });
});

describe('isAfterNow', () => {
  const today = new Date(new Date().setHours(0, 0, 0, 0));
  const yesterday = new Date(new Date(today).setDate(today.getDate() - 1));
  const tomorrow = new Date(new Date(today).setDate(today.getDate() + 1));

  test.concurrent.each([
    { input: tomorrow.toString(), expected: true },
    { input: yesterday.toString(), expected: false },
    { input: tomorrow, expected: true },
    { input: yesterday, expected: false }
  ])('should validate that now is after $input', ({ input, expected }) => {
    expect(isAfterNow(input)).toEqual(expected);
  });
});
