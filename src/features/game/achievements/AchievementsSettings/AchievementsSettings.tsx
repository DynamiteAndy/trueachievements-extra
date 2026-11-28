import { settings } from '@ta-x-storage';
import { Accordion, CheckboxSetting, SelectSetting, settingRowClasses } from '@ta-x-ui';

import { defaultStatusOptions } from '../../shared';

// A game's achievements page settings in the settings menu's Games tab
export const AchievementsSettings = () => {
  const achievements = settings.game.achievements;

  return (
    <Accordion title="Achievements" contentClasses="t-settings">
      <CheckboxSetting label="Show Progress As XX/XX" setting={achievements.individualProgress} />

      <CheckboxSetting label="Collapsible Groups" setting={achievements.collapsibleGroups} />

      <CheckboxSetting
        label="Default Status"
        setting={achievements.defaultStatus}
        containerClasses={settingRowClasses.noBorderWhenChecked}
      />

      {achievements.defaultStatus.value && (
        <SelectSetting
          ariaLabel="Default Status value"
          setting={achievements.defaultStatusValue}
          containerClasses={settingRowClasses.underToggle}
          options={defaultStatusOptions}
        />
      )}
    </Accordion>
  );
};
