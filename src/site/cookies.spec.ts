import { getCookie, signedInGamerId } from './cookies';

describe('getCookie', () => {
  test.each([
    { input: 'testCookie', expected: '12345' },
    { input: 'nonExistentCookie', expected: null }
  ])('should return if $input is contained in document.cookie', ({ input, expected }) => {
    vi.spyOn(document, 'cookie', 'get').mockReturnValueOnce('testCookie=12345');

    const cookieValue = getCookie(input);

    expect(cookieValue).toBe(expected);
  });

  test.each([
    {
      name: 'the first of a cookie set twice (the browser lists the most specific path first)',
      cookie: 'a=1; GamerID=5; GamerID=6',
      expected: '5'
    },
    { name: 'only a cookie of that exact name', cookie: 'OldGamerID=4; GamerID=5', expected: '5' }
  ])('should read $name', ({ cookie, expected }) => {
    vi.spyOn(document, 'cookie', 'get').mockReturnValue(cookie);

    expect(getCookie('GamerID')).toBe(expected);
  });
});

describe('signedInGamerId', () => {
  test.each([
    { name: 'signed in', cookie: 'ASP.NET_SessionId=abc; GamerID=52877; theme=dark', expected: '52877' },
    { name: 'signed out', cookie: 'ASP.NET_SessionId=abc', expected: null }
  ])("should read the site's GamerID cookie $name", ({ cookie, expected }) => {
    vi.spyOn(document, 'cookie', 'get').mockReturnValue(cookie);

    expect(signedInGamerId()).toBe(expected);
  });
});
