import { getSettings, mountInPage, setHtml, setSettings, shownSettings } from '@ta-x-test';

import { ManageWalkthroughSettings } from './ManageWalkthroughSettings';

describe('ManageWalkthroughSettings', () => {
  test('should show every setting while the settings it depends on are on, each saving to its own', () => {
    setSettings({ 'staff.walkthrough.manageWalkthrough.defaultStatus': true });

    expect(getSettings(<ManageWalkthroughSettings />)).toEqual([
      [
        'ta-x-staff-walkthrough-manage-walkthrough-clickable-table-links',
        'staff.walkthrough.manageWalkthrough.clickableTableLinks'
      ],
      [
        'ta-x-staff-walkthrough-manage-walkthrough-add-missing-buttons',
        'staff.walkthrough.manageWalkthrough.addMissingButtons'
      ],
      [
        'ta-x-staff-walkthrough-manage-walkthrough-auto-select-first',
        'staff.walkthrough.manageWalkthrough.autoSelectFirst'
      ],
      ['ta-x-staff-walkthrough-manage-walkthrough-default-status', 'staff.walkthrough.manageWalkthrough.defaultStatus'],
      [
        'ta-x-staff-walkthrough-manage-walkthrough-default-status-value',
        'staff.walkthrough.manageWalkthrough.defaultStatusValue'
      ]
    ]);
  });

  test("should offer exactly the statuses of the site's own status filter", () => {
    setHtml('@ta-x-test-views/staff-manage-walkthrough/no-walkthrough-selected.html');
    const siteOptions = [...document.querySelectorAll<HTMLOptionElement>('#ddlStatusFilter option')].map(
      ({ value, text }) => [value, text]
    );
    setSettings({ 'staff.walkthrough.manageWalkthrough.defaultStatus': true });

    const { container } = mountInPage(<ManageWalkthroughSettings />);
    const ourOptions = [
      ...container.querySelectorAll<HTMLOptionElement>(
        '#ta-x-staff-walkthrough-manage-walkthrough-default-status-value option'
      )
    ].map(({ value, text }) => [value, text]);

    expect(siteOptions).toHaveLength(8);
    expect(ourOptions).toEqual(siteOptions);
  });

  test('should leave out the settings that depend on the default status while that is off', () => {
    expect(shownSettings(<ManageWalkthroughSettings />)).toEqual([
      'ta-x-staff-walkthrough-manage-walkthrough-clickable-table-links',
      'ta-x-staff-walkthrough-manage-walkthrough-add-missing-buttons',
      'ta-x-staff-walkthrough-manage-walkthrough-auto-select-first',
      'ta-x-staff-walkthrough-manage-walkthrough-default-status'
    ]);
  });
});
