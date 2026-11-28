import { settings } from '@ta-x-storage';
import { Accordion, CheckboxSetting } from '@ta-x-ui';

export const EditWalkthroughSettings = () => {
  const editWalkthroughPage = settings.staff.walkthrough.editWalkthroughPage;

  return (
    <Accordion title="Edit Walkthrough" contentClasses="t-settings">
      <CheckboxSetting label="Improved Image Selector" setting={editWalkthroughPage.improvedImageSelector} />

      <CheckboxSetting label="Show Autosave Notifications" setting={editWalkthroughPage.autoSaveNotification} />
    </Accordion>
  );
};
