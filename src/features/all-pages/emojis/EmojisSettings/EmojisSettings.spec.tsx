import { getSettings } from '@ta-x-test';

import { EmojisSettings } from './EmojisSettings';

describe('EmojisSettings', () => {
  test('should render its settings, bound to their settings', () => {
    expect(getSettings(<EmojisSettings />)).toEqual([['ta-x-all-pages-emojis', 'allPages.emojis']]);
  });
});
