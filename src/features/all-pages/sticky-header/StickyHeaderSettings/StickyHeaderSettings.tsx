import { settings } from '@ta-x-storage';
import { CheckboxSetting, settingRowClasses } from '@ta-x-ui';

// The sticky header's settings in the settings menu
export const StickyHeaderSettings = () => {
  const stickyHeader = settings.allPages.stickyHeader;

  return (
    <>
      <CheckboxSetting
        label="Sticky Header"
        setting={stickyHeader.enabled}
        containerClasses={settingRowClasses.noBorderWhenChecked}
        helperTextWhenChecked="This feature may cause some sticky elements to look buggy. Let me know what you spot!"
      />

      {stickyHeader.enabled.value && (
        <>
          <CheckboxSetting
            label="Remain Stuck"
            setting={stickyHeader.remainStuck}
            containerClasses={settingRowClasses.underToggleNoBorder}
          />
          <CheckboxSetting
            label="Fit Menus To Window"
            setting={stickyHeader.fitMenus}
            containerClasses={settingRowClasses.underToggle}
            helperText="Adds columns to the header's menus when they're too tall for the window."
          />
        </>
      )}
    </>
  );
};
