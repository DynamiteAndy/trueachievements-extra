import { find, getSettings, mountInPage, required, setSettings, shownSettings } from '@ta-x-test';

import { StickyHeaderSettings } from './StickyHeaderSettings';

describe('StickyHeaderSettings', () => {
  test('should show every setting while the settings it depends on are on, each saving to its own', () => {
    setSettings({ 'allPages.stickyHeader.enabled': true });

    expect(getSettings(<StickyHeaderSettings />)).toEqual([
      ['ta-x-all-pages-sticky-header-enabled', 'allPages.stickyHeader.enabled'],
      ['ta-x-all-pages-sticky-header-remain-stuck', 'allPages.stickyHeader.remainStuck'],
      ['ta-x-all-pages-sticky-header-fit-menus', 'allPages.stickyHeader.fitMenus']
    ]);
  });

  test('should leave out the settings that depend on the sticky header while that is off', () => {
    expect(shownSettings(<StickyHeaderSettings />)).toEqual(['ta-x-all-pages-sticky-header-enabled']);
  });

  test('should put Remain Stuck and Fit Menus To Window right under Sticky Header, with no line between them', () => {
    setSettings({ 'allPages.stickyHeader.enabled': true });
    const { container } = mountInPage(<StickyHeaderSettings />);
    const rowOf = (id: string) => required(find(id, container).closest('.ta-x-checkbox'));

    expect(rowOf('#ta-x-all-pages-sticky-header-enabled')).toHaveExactClasses([
      'ta-x-checkbox',
      'ta-x-hide-border-when-checked'
    ]);
    expect(rowOf('#ta-x-all-pages-sticky-header-remain-stuck')).toHaveExactClasses([
      'ta-x-checkbox',
      'ta-x-hide-padding-top',
      'ta-x-hide-border'
    ]);
    expect(rowOf('#ta-x-all-pages-sticky-header-fit-menus')).toHaveExactClasses([
      'ta-x-checkbox',
      'ta-x-hide-padding-top'
    ]);
  });
});
