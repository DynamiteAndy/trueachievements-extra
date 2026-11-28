import { getSettings } from '@ta-x-test';

import { EditWalkthroughSettings } from './EditWalkthroughSettings';

describe('EditWalkthroughSettings', () => {
  test('should render its settings, bound to their settings', () => {
    expect(getSettings(<EditWalkthroughSettings />)).toEqual([
      [
        'ta-x-staff-walkthrough-edit-walkthrough-page-improved-image-selector',
        'staff.walkthrough.editWalkthroughPage.improvedImageSelector'
      ],
      [
        'ta-x-staff-walkthrough-edit-walkthrough-page-auto-save-notification',
        'staff.walkthrough.editWalkthroughPage.autoSaveNotification'
      ]
    ]);
  });
});
