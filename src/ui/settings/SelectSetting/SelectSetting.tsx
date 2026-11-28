import { classNames } from '@ta-x-lib';
import { saveSetting, type Setting } from '@ta-x-storage';

import { settingId } from '../setting-id';
import styles from '../styles';

export interface SelectSettingOption {
  value: string;
  text: string;
}

interface SelectSettingProps {
  // The setting the dropdown shows and saves: a string, or a list saved from an option's value split on its commas
  // (e.g. 'product,game')
  setting: Setting<string> | Setting<string[]>;
  options: SelectSettingOption[];
  // Extra classes on the row around the select (settingRowClasses)
  containerClasses?: string;
  // What the dropdown sets, beside it: for a dropdown with no option row of its own above it to name it
  label?: string;
  // The dropdown's name for a screen reader when it has no label beside it (the toggle above names its checkbox only)
  ariaLabel?: string;
  // Shown under the dropdown; leave it out when it shouldn't show
  helperText?: string;
}

// A settings menu dropdown (the site's frm-sel), bound to a setting
export const SelectSetting = ({
  setting,
  options,
  containerClasses,
  label,
  ariaLabel,
  helperText
}: SelectSettingProps) => {
  const id = settingId(setting);

  const value = setting.value;
  const isList = Array.isArray(setting.defaultValue);

  return (
    <>
      <div class={classNames('frm-grp frm-sel', containerClasses, styles.select)}>
        {label && (
          <label for={id} class={styles.selectLabel}>
            {label}
          </label>
        )}
        <select
          id={id}
          name={id}
          aria-label={label ? undefined : ariaLabel}
          class="dropdown"
          value={Array.isArray(value) ? value.join(',') : value}
          onChange={({ currentTarget }) =>
            saveSetting(
              setting as Setting<string | string[]>,
              isList ? currentTarget.value.split(',') : currentTarget.value
            )
          }
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.text}
            </option>
          ))}
        </select>
      </div>

      {helperText && <p class={styles.selectHelperText}>{helperText}</p>}
    </>
  );
};
