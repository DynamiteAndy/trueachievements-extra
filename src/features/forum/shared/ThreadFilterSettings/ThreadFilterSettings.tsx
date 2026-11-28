import { CheckboxSetting, ListSetting, settingRowClasses } from '@ta-x-ui';

import type { Setting } from '@ta-x-storage';

export interface ThreadFilterSettingsProps {
  // A group with its own filter (My Threads, a game's forum) shows it only while its override of the forums' is on
  override?: Setting<boolean>;
  threadFilter: Setting<boolean>;
  keywords: Setting<string[]>;
}

// The thread filter's settings rows, for the forums, My Threads and a game's forum: the override reveals the filter,
// which reveals its keywords
export const ThreadFilterSettings = ({ override, threadFilter, keywords }: ThreadFilterSettingsProps) => {
  const shown = !override || override.value;

  return (
    <>
      {override && (
        <CheckboxSetting
          label="Override Forum Settings"
          setting={override}
          helperTextWhenUnchecked="Some settings will be inherited from the Forums tab."
          containerClasses={settingRowClasses.noBorderWhenChecked}
        />
      )}

      {shown && (
        <CheckboxSetting
          label="Hide Threads By Keyword"
          setting={threadFilter}
          containerClasses={
            override ? settingRowClasses.underToggleNoBorderWhenChecked : settingRowClasses.noBorderWhenChecked
          }
        />
      )}

      {shown && threadFilter.value && (
        <ListSetting
          setting={keywords}
          label="Keywords"
          buttonText="Add Keyword"
          containerClasses={settingRowClasses.underToggle}
        />
      )}
    </>
  );
};
