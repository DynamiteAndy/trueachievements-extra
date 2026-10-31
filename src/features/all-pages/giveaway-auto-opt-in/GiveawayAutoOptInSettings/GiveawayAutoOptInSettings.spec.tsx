import { getSettings } from '@ta-x-test';

import { GiveawayAutoOptInSettings } from './GiveawayAutoOptInSettings';

describe('GiveawayAutoOptInSettings', () => {
  test('should render its settings, bound to their settings', () => {
    expect(getSettings(<GiveawayAutoOptInSettings />)).toEqual([
      ['ta-x-all-pages-giveaway-auto-opt-in', 'allPages.giveawayAutoOptIn']
    ]);
  });
});
