const noBorder = 'ta-x-hide-border';
const noBorderWhenChecked = 'ta-x-hide-border-when-checked';
const underToggle = 'ta-x-hide-padding-top';

// Row classes the settings panels share (their rules are in _settings.scss). They only say how a row sits in a
// toggle's group: the stylesheet draws the lines a row's place in its tab calls for (a group's last row, the row above
// a group's header, a tab's last row) whatever its classes
export const settingRowClasses = {
  // A toggle whose rows show while it's checked: no line below while checked
  noBorderWhenChecked,
  // A setting shown under the toggle that reveals it: no gap above
  underToggle,
  // A setting under its toggle with more of them after it, all with no line between: no gap above, no line below
  underToggleNoBorder: `${underToggle} ${noBorder}`,
  // A setting under its toggle that reveals rows of its own while checked: no gap above, no line below while checked
  underToggleNoBorderWhenChecked: `${underToggle} ${noBorderWhenChecked}`
} as const;
