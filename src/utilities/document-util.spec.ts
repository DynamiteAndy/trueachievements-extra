import each from 'jest-each';
import { setHtml } from '@ta-x-jest';
import { getCookie } from './document-util';

describe('getCookie', () => {
  each([
    { input: 'testCookie', expected: '12345' },
    { input: 'nonExistentCookie', expected: null }
  ]).test.concurrent('should return if $input is contained in document.cookie', async ({ input, expected }) => {
    await setHtml('@ta-x-jest-views/empty.html');

    jest.spyOn(document, 'cookie', 'get').mockReturnValueOnce('testCookie=12345');

    const cookieValue = getCookie(input);

    expect(cookieValue).toBe(expected);
  });
});
