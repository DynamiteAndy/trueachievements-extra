import { settings } from '@ta-x-storage';
import { Accordion, CheckboxSetting } from '@ta-x-ui';

export const WalkthroughPageSettings = () => {
  const walkthroughPage = settings.staff.walkthrough.walkthroughPage;

  return (
    <Accordion title="Walkthrough Page" contentClasses="t-settings">
      <CheckboxSetting label="Stick Page History To The Left" setting={walkthroughPage.stickyPageHistory} />

      <CheckboxSetting label="Move Buttons To The Left" setting={walkthroughPage.moveButtonsToLeft} />

      <CheckboxSetting label="Add Walkthrough Team Button" setting={walkthroughPage.walkthroughTeamButton} />

      <CheckboxSetting label="Highlight Page Locked Message" setting={walkthroughPage.highlightPageLocked} />
    </Accordion>
  );
};
