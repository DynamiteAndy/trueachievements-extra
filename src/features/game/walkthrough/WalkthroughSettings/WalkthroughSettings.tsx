import { settings } from '@ta-x-storage';
import { Accordion, CheckboxSetting } from '@ta-x-ui';

// A game's walkthrough settings in the settings menu's Games tab
export const WalkthroughSettings = () => {
  const walkthrough = settings.game.walkthrough;

  return (
    <Accordion title="Walkthrough" contentClasses="t-settings">
      <CheckboxSetting
        label="Highlight Progress On Hover"
        setting={walkthrough.hoverableParagraphs}
        helperTextWhenChecked="Hover over a paragraph to highlight your current progress in the walkthrough."
      />
    </Accordion>
  );
};
