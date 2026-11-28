import { classNames } from '@ta-x-lib';
import { saveSetting, type Setting } from '@ta-x-storage';

import { settingId } from '../setting-id';
import styles from '../styles';

interface CheckboxSettingProps {
  label: string;
  // The setting the toggle shows and saves
  setting: Setting<boolean>;
  // Extra classes on the row (settingRowClasses)
  containerClasses?: string;
  // Shown under the toggle; leave it out when it shouldn't show. Text about the toggle's own state goes in the
  // two below
  helperText?: string;
  // Shown under the toggle while it's on
  helperTextWhenChecked?: string;
  // Shown under the toggle while it's off (e.g. what an override inherits until it's on)
  helperTextWhenUnchecked?: string;
}

// A settings menu toggle (the site's frm-tgl), bound to a setting: it shows the setting's value and saves a change
// to it
export const CheckboxSetting = ({
  label,
  setting,
  containerClasses,
  helperText,
  helperTextWhenChecked,
  helperTextWhenUnchecked
}: CheckboxSettingProps) => {
  // The checkbox's id and name, which its labels are for
  const id = settingId(setting);
  const shownHelperText = helperText ?? (setting.value ? helperTextWhenChecked : helperTextWhenUnchecked);

  return (
    <div class={classNames(styles.checkbox, containerClasses)}>
      <label for={id}>{label}</label>

      <div class="frm-grp frm-tgl">
        <input
          type="checkbox"
          id={id}
          name={id}
          checked={setting.value}
          onChange={(event) => saveSetting(setting, event.currentTarget.checked)}
        />
        <label for={id}></label>
      </div>

      {shownHelperText && <p class={styles.checkboxHelperText}>{shownHelperText}</p>}
    </div>
  );
};
