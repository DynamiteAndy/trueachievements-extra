import { settings } from '@ta-x-storage';
import { Accordion, CheckboxSetting, SelectSetting, type SelectSettingOption, settingRowClasses } from '@ta-x-ui';

// The site's challenge filter radio buttons
const challengeStatusOptions: SelectSettingOption[] = [
  { value: 'rdoAllChallenges', text: 'All' },
  { value: 'rdoWonChallenges', text: 'Won' },
  { value: 'rdoNotWonChallenges', text: 'Not Won' }
];

// A game's challenges page settings in the settings menu's Games tab. Without the override, challenges
// use the achievements settings
export const ChallengesSettings = () => {
  const challenges = settings.game.challenges;

  return (
    <Accordion title="Challenges" contentClasses="t-settings">
      <CheckboxSetting
        label="Override Achievement Settings"
        setting={challenges.overrideAchievementsIndividualProgress}
        helperTextWhenUnchecked="Some settings will be inherited from Achievements."
        containerClasses={settingRowClasses.noBorderWhenChecked}
      />

      {challenges.overrideAchievementsIndividualProgress.value && (
        <CheckboxSetting
          label="Show Progress As XX/XX"
          setting={challenges.individualProgress}
          containerClasses={settingRowClasses.underToggle}
        />
      )}

      <CheckboxSetting
        label="Default Status"
        setting={challenges.defaultStatus}
        containerClasses={settingRowClasses.noBorderWhenChecked}
      />

      {challenges.defaultStatus.value && (
        <SelectSetting
          ariaLabel="Default Status value"
          setting={challenges.defaultStatusValue}
          containerClasses={settingRowClasses.underToggle}
          options={challengeStatusOptions}
        />
      )}
    </Accordion>
  );
};
