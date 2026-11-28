import { settings } from '@ta-x-storage';
import { Accordion, CheckboxSetting } from '@ta-x-ui';

// Walkthrough threads' settings in the settings menu's Forums tab
export const WalkthroughThreadsSettings = () => {
  const viewThread = settings.forum.viewThread;

  return (
    <Accordion title="Walkthrough Threads" contentClasses="t-settings">
      <CheckboxSetting label="Show Walkthrough Information" setting={viewThread.showOwnerProgress} />
    </Accordion>
  );
};
