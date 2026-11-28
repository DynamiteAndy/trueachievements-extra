import { onThisSite } from '@ta-x-site';

// Whether this page load is a fresh arrival at the page, not the user changing the page they're on. A default (a
// default status, a default forum tab) applies only on a fresh arrival, so a filter the user picks afterwards sticks.
//
// The user's own changes all reach the page from the page itself: a filter posts the page back to its own address, and
// the game forum's thread tabs load it again with ?type=…. Both arrive with the page's own pathname as the referrer,
// where a fresh visit's referrer is another page, or none. The browser can't tell a script whether a load was a POST,
// so the referrer is the signal; a reload counts as staying on the page too
export const isFreshArrival = (): boolean => {
  const [navigation] = performance.getEntriesByType('navigation') as PerformanceNavigationTiming[];

  if (navigation?.type === 'reload') {
    return false;
  }

  if (!document.referrer) {
    return true;
  }

  const referrer = URL.parse(document.referrer);

  return !referrer || !onThisSite(referrer.href) || referrer.pathname !== window.location.pathname;
};
