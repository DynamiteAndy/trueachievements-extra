import { toInt, toBool, toDate } from './parse';

describe('parse', () => {
  describe('toInt', () => {
    const positiveTestCases = [
      { case: '12', expected: 12 },
      { case: '120', expected: 120 },
      { case: 12, expected: 12 },
      { case: 120, expected: 120 },
      { case: true, expected: 1 },
      { case: false, expected: 0 },
    ];

    positiveTestCases.forEach((test, index) => {
      it(`should parse "${test.case}" correctly (testcase: ${index + 1})`, () => {
        expect(toInt(test.case)).toEqual(test.expected);
      });
    });

    const negativeTestCases = [
      { case: 'a', expected: null },
      { case: 'b', expected: null },
      { case: null, expected: null }
    ];

    negativeTestCases.forEach((test, index) => {
      it(`should parse "${test.case}" correctly (testcase: ${index + 1})`, () => {
        expect(toInt(test.case)).toEqual(test.expected);
      });
    });
  });

  describe('toDate', () => {
    const today = new Date(new Date().setHours(0, 0, 0, 0));
    const yesterday = new Date(new Date(today).setDate(today.getDate() - 1));
    const positiveTestCases = [
      { case: 'today', expected: today },
      { case: 'Today', expected: today },
      { case: 'yesterday', expected: yesterday },
      { case: 'Yesterday', expected: yesterday },
      { case: '2022/12/11', expected: new Date('2022/12/11') }
    ];

    positiveTestCases.forEach((test, index) => {
      it(`should parse "${test.case}" correctly (testcase: ${index + 1})`, () => {
        const date = toDate(test.case);

        expect(date.getDay()).toEqual(test.expected.getDay());
        expect(date.getMonth()).toEqual(test.expected.getMonth());
        expect(date.getFullYear()).toEqual(test.expected.getFullYear());
      });
    });

    const negativeTestCases = [
      { case: 'tomorrow', expected: null },
      { case: 'Tomorrow', expected: null },
    ];

    negativeTestCases.forEach((test, index) => {
      it(`should parse "${test.case}" correctly (testcase: ${index + 1})`, () => {
        expect(toDate(test.case)).toEqual(test.expected);
      });
    });
  });

  describe('toBool', () => {
    const positiveTestCases = [
      { case: 'true', expected: true },
      { case: 'True', expected: true },
      { case: 'false', expected: false },
      { case: 'False', expected: false },
      { case: 1, expected: true },
      { case: 0, expected: false },
      { case: true, expected: true },
      { case: false, expected: false },
    ];

    positiveTestCases.forEach((test, index) => {
      it(`should parse "${test.case}" correctly (testcase: ${index + 1})`, () => {
        expect(toBool(test.case)).toEqual(test.expected);
      });
    });

    const negativeTestCases = [
      { case: 'a', expected: null },
      { case: 'b', expected: null },
      { case: 2, expected: null },
      { case: null, expected: null }
    ];

    negativeTestCases.forEach((test, index) => {
      it(`should parse "${test.case}" correctly (testcase: ${index + 1})`, () => {
        expect(toBool(test.case)).toEqual(test.expected);
      });
    });
  });
});
