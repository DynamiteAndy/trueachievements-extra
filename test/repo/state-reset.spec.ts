// Every spec starts with empty storage and settings at their defaults, without importing @ta-x-test (the reset is in
// test/mocks, which vitest.config.mts loads for every spec). The tests run in order: the first leaves values behind,
// the second checks none of them carried over.
import { settings } from '@ta-x-storage';

import { setHtml } from '../support/document';

describe('state reset between tests', { shuffle: false }, () => {
  const stickyHeader = settings.allPages.stickyHeader.enabled;

  test('leaves a Tampermonkey value, a setting and a session value behind', () => {
    GM_setValue('ta-x-reset-check', 'left behind');
    GM_setValue('allPages.stickyHeader.enabled', true);
    sessionStorage.setItem('ta-x-reset-check', 'left behind');

    expect(GM_getValue('ta-x-reset-check')).toBe('left behind');
    expect(stickyHeader.peek()).toBe(true);
  });

  test('starts the next test without any of them', () => {
    expect(GM_getValue('ta-x-reset-check')).toBeUndefined();
    expect(localStorage.length).toBe(0);
    expect(stickyHeader.peek()).toBe(false);
    expect(sessionStorage.getItem('ta-x-reset-check')).toBeNull();
  });
});

// setHtml always sets the page's address, so a test that gives none doesn't run at the one the test before it set
describe('the page address setHtml leaves', { shuffle: false }, () => {
  test('is the one it was given', () => {
    setHtml('@ta-x-test-views/empty.html', { url: 'https://www.trueachievements.com/game/BLUD/achievements' });

    expect(window.location.href).toBe('https://www.trueachievements.com/game/BLUD/achievements');
  });

  test("is the test page's own when it's given none", () => {
    setHtml('@ta-x-test-views/empty.html');

    expect(window.location.href).toBe('http://localhost:3000/');
  });
});
