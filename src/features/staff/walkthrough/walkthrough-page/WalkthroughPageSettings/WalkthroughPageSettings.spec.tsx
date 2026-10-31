import { getSettings } from '@ta-x-test';

import { WalkthroughPageSettings } from './WalkthroughPageSettings';

describe('WalkthroughPageSettings', () => {
  test('should render its settings, bound to their settings', () => {
    expect(getSettings(<WalkthroughPageSettings />)).toEqual([
      [
        'ta-x-staff-walkthrough-walkthrough-page-sticky-page-history',
        'staff.walkthrough.walkthroughPage.stickyPageHistory'
      ],
      [
        'ta-x-staff-walkthrough-walkthrough-page-move-buttons-to-left',
        'staff.walkthrough.walkthroughPage.moveButtonsToLeft'
      ],
      [
        'ta-x-staff-walkthrough-walkthrough-page-walkthrough-team-button',
        'staff.walkthrough.walkthroughPage.walkthroughTeamButton'
      ],
      [
        'ta-x-staff-walkthrough-walkthrough-page-highlight-page-locked',
        'staff.walkthrough.walkthroughPage.highlightPageLocked'
      ]
    ]);
  });
});
