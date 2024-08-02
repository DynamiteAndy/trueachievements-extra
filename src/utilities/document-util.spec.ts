import { setHtml } from '@ta-x-test';
import { getCookie } from './document-util';

describe('getCookie', () => {
  test.concurrent.each([
    { input: 'testCookie', expected: '12345' },
    { input: 'nonExistentCookie', expected: null }
  ])('should return if $input is contained in document.cookie', async ({ input, expected }) => {
    await setHtml('@ta-x-test-views/empty.html');

    vi.spyOn(document, 'cookie', 'get').mockReturnValueOnce('testCookie=12345');

    const cookieValue = getCookie(input);

    expect(cookieValue).toBe(expected);
  });
});
