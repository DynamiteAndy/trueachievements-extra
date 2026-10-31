import { settings } from '@ta-x-storage';
import { Accordion, CheckboxSetting, SelectSetting, type SelectSettingOption, settingRowClasses } from '@ta-x-ui';

import { ThreadFilterSettings } from '../../../forum';

// The site's thread type filter
const defaultThreadOptions: SelectSettingOption[] = [
  { value: 'all', text: 'All Threads' },
  { value: 'community', text: 'Community Threads' },
  { value: 'gameinfo', text: 'Game Info Threads' }
];

// A game's forum settings in the settings menu's Games tab. Without the override, the thread filter is
// the Forums tab's own
export const GameForumSettings = () => {
  const forum = settings.game.forum;

  return (
    <Accordion title="Forums" contentClasses="t-settings">
      <ThreadFilterSettings
        override={forum.overrideForumThreadFilter}
        threadFilter={forum.threadFilter}
        keywords={forum.threadFilterKeywords}
      />

      <CheckboxSetting
        label="Default Thread Type"
        setting={forum.defaultThread}
        containerClasses={settingRowClasses.noBorderWhenChecked}
      />

      {forum.defaultThread.value && (
        <SelectSetting
          ariaLabel="Default Thread Type value"
          setting={forum.defaultThreadValue}
          containerClasses={settingRowClasses.underToggle}
          options={defaultThreadOptions}
        />
      )}
    </Accordion>
  );
};
