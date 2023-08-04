import { setLocalStorage } from '@ta-x-jasmine';
import { MemoizedFetch } from '@ta-x-models';
import { Cache } from './cache';

describe('cache', () => {
  describe('memoize - get', () => {
    const testCases = [
      { case: new Map<string, MemoizedFetch>(), expected: 0 },
      {
        case: new Map([['memoized', JSON.stringify([['key1', 'value']])]]),
        expected: 1
      },
      {
        case: new Map([
          [
            'memoized',
            JSON.stringify([
              ['key1', 'value'],
              ['key2', 'value']
            ])
          ]
        ]),
        expected: 2
      }
    ];

    testCases.forEach((test, index) => {
      it(`should return cached items (testcase: ${index})`, () => {
        setLocalStorage(test.case);
        expect(Cache.memoize.size).toEqual(test.expected);
      });
    });
  });

  describe('memoize - set', () => {
    const testCases = [
      { case: new Map<string, MemoizedFetch>(), expected: 0 },
      {
        case: new Map([['key1', new MemoizedFetch()]]),
        expected: 1
      },
      {
        case: new Map([
          ['key1', new MemoizedFetch()],
          ['key2', new MemoizedFetch()]
        ]),
        expected: 2
      }
    ];

    testCases.forEach((test, index) => {
      it(`should set cached items (testcase: ${index})`, () => {
        Cache.memoize = test.case;
        expect(Cache.memoize.size).toEqual(test.expected);
      });
    });
  });

  describe('forceclear', () => {
    describe('memoize', () => {
      const testCases = [
        { case: new Map<string, string>(), expected: 0 },
        {
          case: new Map([['memoized', JSON.stringify([['key1', 'value']])]]),
          expected: 0
        },
        {
          case: new Map([
            [
              'memoized',
              JSON.stringify([
                ['key1', 'value'],
                ['key2', 'value']
              ])
            ]
          ]),
          expected: 0
        }
      ];

      testCases.forEach((test, index) => {
        it(`should set cached items (testcase: ${index})`, () => {
          setLocalStorage(test.case);

          Cache.forceClear();

          expect(Cache.memoize.size).toEqual(test.expected);
        });
      });
    });
  });
});
