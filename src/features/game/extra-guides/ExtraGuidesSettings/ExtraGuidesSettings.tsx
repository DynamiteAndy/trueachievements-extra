import { settings } from '@ta-x-storage';
import { Accordion, CheckboxSetting } from '@ta-x-ui';

// The guide sites' settings in the settings menu's Games tab: their guides show on a game's achievements, DLC and
// achievement pages
export const ExtraGuidesSettings = () => {
  const extraGuides = settings.game.extraGuides;

  return (
    <Accordion title="Extra Guides" contentClasses="t-settings">
      <CheckboxSetting
        label="Show XboxAchievements.com Guides"
        setting={extraGuides.showXboxAchievementGuides}
        helperTextWhenChecked="Guides are read from the game's guide page, in a background tab that closes itself."
      />

      <CheckboxSetting
        label="Show PlaystationTrophies.org Guides"
        setting={extraGuides.showPlaystationTrophyGuides}
        helperTextWhenChecked="Guides are read from the game's guide pages, in a background tab that closes itself. A game can link several."
      />

      <CheckboxSetting
        label="Show GamertagNation.com Guides"
        setting={extraGuides.showGamertagNationGuides}
        helperTextWhenChecked="Guides are read from the game's guides page, in a background tab that closes itself."
      />
    </Accordion>
  );
};
