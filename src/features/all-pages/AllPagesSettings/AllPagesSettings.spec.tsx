import { setSettings, shownSettings } from '@ta-x-test';

import { AllPagesSettings } from './AllPagesSettings';

describe('AllPagesSettings', () => {
  test('should render the sticky header, emojis and giveaway settings, in that order', () => {
    setSettings({ 'allPages.stickyHeader.enabled': true });
    expect(shownSettings(<AllPagesSettings />)).toEqual([
      'ta-x-all-pages-sticky-header-enabled',
      'ta-x-all-pages-sticky-header-remain-stuck',
      'ta-x-all-pages-sticky-header-fit-menus',
      'ta-x-all-pages-emojis',
      'ta-x-all-pages-giveaway-auto-opt-in'
    ]);
  });
});
