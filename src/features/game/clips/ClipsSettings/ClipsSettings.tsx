import { settings } from '@ta-x-storage';
import { Accordion, CheckboxSetting, SelectSetting, type SelectSettingOption, settingRowClasses } from '@ta-x-ui';

// The site's clip filter options
const recordedByOptions: SelectSettingOption[] = [
  { value: '', text: 'Anyone' },
  { value: 'My friends', text: 'My friends' },
  { value: 'Me', text: 'Me' }
];

const savedByOptions: SelectSettingOption[] = [
  { value: '', text: 'Anyone' },
  { value: 'Gamer', text: 'Gamer' },
  { value: 'Xbox', text: 'Xbox' }
];

const recordedTimeOptions: SelectSettingOption[] = [
  { value: '7', text: 'This week' },
  { value: '30', text: 'This month' },
  { value: '365', text: 'This year' },
  { value: '0', text: 'All' }
];

const sortByOptions: SelectSettingOption[] = [
  { value: 'Most viewed', text: 'Most viewed' },
  { value: 'Most favourited', text: 'Most favourited' },
  { value: 'Most commented', text: 'Most commented' },
  { value: 'Longest', text: 'Longest' },
  { value: 'GamerTag', text: 'GamerTag' }
];

// A game's clips page settings in the settings menu's Games tab
export const ClipsSettings = () => {
  const clips = settings.game.clips;

  return (
    <Accordion title="Clips" contentClasses="t-settings">
      <CheckboxSetting
        label="Default Filters"
        setting={clips.defaultStatus}
        helperTextWhenChecked="Arriving at a game's clips page reloads it once, to apply these defaults."
        containerClasses={settingRowClasses.noBorderWhenChecked}
      />

      {clips.defaultStatus.value && (
        <>
          <SelectSetting
            label="Recorded by"
            setting={clips.defaultRecordedByValue}
            containerClasses={settingRowClasses.underToggleNoBorder}
            options={recordedByOptions}
          />

          <SelectSetting
            label="Saved by"
            setting={clips.defaultSavedByValue}
            containerClasses={settingRowClasses.underToggleNoBorder}
            options={savedByOptions}
          />

          <SelectSetting
            label="Recorded"
            setting={clips.defaultRecordedValue}
            containerClasses={settingRowClasses.underToggleNoBorder}
            options={recordedTimeOptions}
          />

          <SelectSetting
            label="Sort by"
            setting={clips.defaultSortByValue}
            containerClasses={settingRowClasses.underToggle}
            options={sortByOptions}
          />
        </>
      )}
    </Accordion>
  );
};
