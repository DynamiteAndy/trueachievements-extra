import { settings } from '@ta-x-storage';
import { Accordion, CheckboxSetting, SelectSetting, settingRowClasses } from '@ta-x-ui';

import { defaultStatusOptions } from '../../shared';

// A game's DLC page settings in the settings menu's Games tab. Without the override, DLC uses the
// achievements settings
export const DlcSettings = () => {
  const dlc = settings.game.dlc;

  return (
    <Accordion title="DLC" contentClasses="t-settings">
      <CheckboxSetting
        label="Override Achievement Settings"
        setting={dlc.overrideAchievementsPageSettings}
        helperTextWhenUnchecked="Some settings will be inherited from Achievements."
        containerClasses={settingRowClasses.noBorderWhenChecked}
      />

      {dlc.overrideAchievementsPageSettings.value && (
        <>
          <CheckboxSetting
            label="Show Progress As XX/XX"
            setting={dlc.individualProgress}
            containerClasses={settingRowClasses.underToggleNoBorder}
          />

          <CheckboxSetting
            label="Collapsible Groups"
            setting={dlc.collapsibleGroups}
            containerClasses={settingRowClasses.underToggleNoBorder}
          />

          <CheckboxSetting
            label="Default Status"
            setting={dlc.defaultStatus}
            containerClasses={settingRowClasses.underToggleNoBorderWhenChecked}
          />
        </>
      )}

      {dlc.overrideAchievementsPageSettings.value && dlc.defaultStatus.value && (
        <SelectSetting
          ariaLabel="Default Status value"
          setting={dlc.defaultStatusValue}
          containerClasses={settingRowClasses.underToggle}
          options={defaultStatusOptions}
        />
      )}
    </Accordion>
  );
};
