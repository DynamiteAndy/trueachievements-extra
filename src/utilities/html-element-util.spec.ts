import { JSDOM } from 'jsdom';
import { classListContains } from './html-element-util';

describe('html-element-util', () => {
  describe('classListContains', () => {
    const { document } = (new JSDOM()).window;
    const element = document.createElement('div');
    const testCases = [
      { case: 'class-a', expected: true },
      { case: 'class-b', expected: true },
      { case: [ 'class-a' ], expected: true},
      { case: [ 'class-b' ], expected: true},
      { case: 'class-d', expected: false },
      { case: [ 'class-d' ], expected: false }
    ];

    beforeAll(() => {
      element.classList.add('class-a', 'class-b', 'class-c');
    });

    testCases.forEach((test, index) => {
      it(`should return if "${test.case}" is contained in classList (testcase: ${index + 1})`, () => {
        expect(classListContains(element, test.case)).toEqual(test.expected);
      });
    });
  });
});
