import { getSettings, setSettings } from '@ta-x-test';
import { renderToString } from 'preact-render-to-string';

import { WalkthroughPreviewSettings } from './WalkthroughPreviewSettings';

describe('WalkthroughPreviewSettings', () => {
  test('should render its settings, bound to their settings', () => {
    expect(getSettings(<WalkthroughPreviewSettings />)).toEqual([
      [
        'ta-x-staff-walkthrough-walkthrough-preview-populate-aside-content',
        'staff.walkthrough.walkthroughPreview.populateAsideContent'
      ]
    ]);
  });

  test('should name the statuses it supports under the setting once on', () => {
    setSettings({ 'staff.walkthrough.walkthroughPreview.populateAsideContent': true });

    expect(renderToString(<WalkthroughPreviewSettings />)).toContain(
      'This feature supports &quot;In progress&quot;, &quot;Ready for review&quot;, &quot;Ready for publish&quot; and &quot;Published&quot; walkthroughs (a published one shows its thanks and achievements from its public page, updated every 4 hours), let me know if you want it to support others!'
    );
  });
});
