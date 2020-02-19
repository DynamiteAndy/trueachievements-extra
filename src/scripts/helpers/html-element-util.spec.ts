import { classListContains } from './html-element-util';
import { JSDOM } from 'jsdom'

describe('htmlelement-helper', () => {
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
