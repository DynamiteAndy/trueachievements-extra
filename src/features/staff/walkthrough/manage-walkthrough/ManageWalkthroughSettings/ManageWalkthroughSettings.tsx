import { settings } from '@ta-x-storage';
import { Accordion, CheckboxSetting, SelectSetting, type SelectSettingOption, settingRowClasses } from '@ta-x-ui';

// The manage walkthrough page's status filter
const statusOptions: SelectSettingOption[] = [
  { value: '-1', text: '(All)' },
  { value: 'New', text: 'New' },
  { value: 'In progress', text: 'In progress' },
  { value: 'Ready for review', text: 'Ready for review' },
  { value: 'Ready for publish', text: 'Ready for publish' },
  { value: 'Published', text: 'Published' },
  { value: 'Merged', text: 'Merged' },
  { value: 'New owner required', text: 'New owner required' }
];

export const ManageWalkthroughSettings = () => {
  const manageWalkthrough = settings.staff.walkthrough.manageWalkthrough;

  return (
    <Accordion title="Manage Walkthrough" contentClasses="t-settings">
      <CheckboxSetting label="Clickable Table Links" setting={manageWalkthrough.clickableTableLinks} />

      <CheckboxSetting label="Add Missing Buttons" setting={manageWalkthrough.addMissingButtons} />

      {/* Its helper text is about the default status setting below, so it shows when that's on */}
      <CheckboxSetting
        label="Auto Select First Walkthrough"
        setting={manageWalkthrough.autoSelectFirst}
        helperText={
          manageWalkthrough.defaultStatus.value ? 'This feature runs after the default status has been set.' : undefined
        }
      />

      <CheckboxSetting
        label="Default Status"
        setting={manageWalkthrough.defaultStatus}
        containerClasses={settingRowClasses.noBorderWhenChecked}
      />

      {manageWalkthrough.defaultStatus.value && (
        <SelectSetting
          ariaLabel="Default Status value"
          setting={manageWalkthrough.defaultStatusValue}
          containerClasses={settingRowClasses.underToggle}
          options={statusOptions}
        />
      )}
    </Accordion>
  );
};
