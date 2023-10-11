import each from 'jest-each';
import { toInt, toBool, toDate, extractBetween, extractAllBetween, insertSeperator } from './string-util';

describe('toInt', () => {
  each([
    { input: '12', expected: 12 },
    { input: '120', expected: 120 },
    { input: 12, expected: 12 },
    { input: 120, expected: 120 },
    { input: true, expected: 1 },
    { input: false, expected: 0 },
    { input: 'a', expected: null },
    { input: 'b', expected: null },
    { input: null, expected: null },
    { input: {}, expected: null }
  ]).test.concurrent('should parse $input to $expected', ({ input, expected }) => {
    expect(toInt(input)).toEqual(expected);
  });
});

describe('toDate', () => {
  const today = new Date(new Date().setHours(0, 0, 0, 0));
  const yesterday = new Date(new Date(today).setDate(today.getDate() - 1));

  each([
    { input: 'today', expected: today },
    { input: 'Today', expected: today },
    { input: 'yesterday', expected: yesterday },
    { input: 'Yesterday', expected: yesterday },
    { input: '2022/12/11', expected: new Date('2022/12/11') },
    { input: 'tomorrow', expected: null },
    { input: 'Tomorrow', expected: null },
    { input: {}, expected: null }
  ]).test.concurrent('should parse $input to $expected', ({ input, expected }) => {
    const date = toDate(input);

    expect(date?.getDay()).toEqual(expected?.getDay());
    expect(date?.getMonth()).toEqual(expected?.getMonth());
    expect(date?.getFullYear()).toEqual(expected?.getFullYear());
  });
});

describe('toBool', () => {
  each([
    { input: 'true', expected: true },
    { input: 'True', expected: true },
    { input: 'false', expected: false },
    { input: 'False', expected: false },
    { input: 1, expected: true },
    { input: 0, expected: false },
    { input: true, expected: true },
    { input: false, expected: false },
    { input: 'a', expected: null },
    { input: 'b', expected: null },
    { input: 2, expected: null },
    { input: null, expected: null },
    { input: {}, expected: null }
  ]).test.concurrent('should parse $input to $expected', ({ input, expected }) => {
    expect(toBool(input)).toEqual(expected);
  });
});

describe('extractBetween', () => {
  each([
    {
      input: `ƒ onclick(event) {
      InsertAtCursor('aebMessage','[smile]', 'smileydropdown'); return false;
      }`,
      between: "'",
      expected: 'aebMessage'
    },
    {
      input: 'This is %%some%% text with %%multiple%% delimiters.',
      between: '%%',
      expected: 'some'
    },
    {
      input: '',
      between: '%%',
      expected: null
    }
  ]).test.concurrent('should extract $expected from $input', ({ input, between, expected }) => {
    expect(extractBetween(between, input)).toEqual(expected);
  });
});

describe('extractAllBetween', () => {
  each([
    {
      input: `ƒ onclick(event) {
      InsertAtCursor('aebMessage','[smile]', 'smileydropdown'); return false;
      }`,
      between: "'",
      expected: ['aebMessage', '[smile]', 'smileydropdown']
    },
    {
      input: 'This is %%some%% text with %%multiple%% delimiters.',
      between: '%%',
      expected: ['some', 'multiple']
    },
    {
      input: '',
      between: '%%',
      expected: null
    }
  ]).test.concurrent('should extract $expected from $input', ({ input, between, expected }) => {
    expect(extractAllBetween(between, input)).toEqual(expected);
  });
});

describe('insertSeperator', () => {
  each([
    {
      input: 1000000,
      separator: ',',
      expected: '1,000,000'
    },
    {
      input: '1234567',
      separator: '-',
      expected: '1-234-567'
    },
    {
      input: null,
      separator: ',',
      expected: null
    }
  ]).test.concurrent('should insert seperator $expected to $input', ({ input, separator, expected }) => {
    expect(insertSeperator(input, separator)).toEqual(expected);
  });
});
