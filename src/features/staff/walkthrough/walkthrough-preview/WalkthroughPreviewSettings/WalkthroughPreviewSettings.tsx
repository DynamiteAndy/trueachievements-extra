import { settings } from '@ta-x-storage';
import { Accordion, CheckboxSetting } from '@ta-x-ui';

import { previewStatusesText } from '../preview-statuses';

export const WalkthroughPreviewSettings = () => {
  const walkthroughPreview = settings.staff.walkthrough.walkthroughPreview;

  return (
    <Accordion title="Walkthrough Preview" contentClasses="t-settings">
      <CheckboxSetting
        label="Fill In Side Column"
        setting={walkthroughPreview.populateAsideContent}
        helperTextWhenChecked={`This feature supports ${previewStatusesText} walkthroughs (a published one shows its thanks and achievements from its public page, updated every 4 hours), let me know if you want it to support others!`}
      />
    </Accordion>
  );
};
