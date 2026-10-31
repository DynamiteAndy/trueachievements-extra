import { arriveFrom, setHtml } from '@ta-x-test';

import { isFreshArrival } from './arrival';

describe('page/arrival', () => {
  const page = 'https://www.trueachievements.com/game/Gears-of-War-4/dlc/June-Update';

  const arrive = ({
    referrer,
    type,
    url = page
  }: {
    referrer: string;
    type?: NavigationTimingType;
    url?: string;
  }): void => {
    setHtml('@ta-x-test-views/empty.html', { url });
    arriveFrom(referrer, type);
  };

  test.each([
    { from: 'another page of the site', referrer: 'https://www.trueachievements.com/game/Gears-of-War-4/dlc' },
    { from: 'no referrer', referrer: '' },
    { from: 'another site', referrer: 'https://www.google.com/' },
    { from: 'a referrer no address can be made from', referrer: 'http://' },
    // Another site's page at the same path (a guide site's /game/… addresses can match ours)
    {
      from: 'the same path on another site',
      referrer: 'https://www.xboxachievements.com/game/Gears-of-War-4/dlc/June-Update'
    }
  ])('should count a visit from $from as a fresh arrival', ({ referrer }) => {
    arrive({ referrer });

    expect(isFreshArrival()).toBe(true);
  });

  test("should count the page's own post back as staying on it (seen live: a filter posts back to the same address)", () => {
    arrive({ referrer: page });

    expect(isFreshArrival()).toBe(false);
  });

  test('should count the same page with another query as staying on it (seen live: the forum tabs add ?type=)', () => {
    arrive({
      referrer: 'https://www.trueachievements.com/game/Gears-of-War-4/forum',
      url: 'https://www.trueachievements.com/game/Gears-of-War-4/forum?type=community'
    });

    expect(isFreshArrival()).toBe(false);
  });

  test('should count a reload as staying on the page, whatever the referrer', () => {
    arrive({ referrer: 'https://www.trueachievements.com/game/Gears-of-War-4/dlc', type: 'reload' });

    expect(isFreshArrival()).toBe(false);
  });
});
