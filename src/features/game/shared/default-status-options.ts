import type { SelectSettingOption } from '@ta-x-ui';

// The site's All / Won / Not Won status radios on an achievements or DLC page, for the settings that pick one. DLC's
// setting inherits the achievements one (effective-settings.ts), so both use this one list
export const defaultStatusOptions: SelectSettingOption[] = [
  { value: 'rdoAllAchievements', text: 'All' },
  { value: 'rdoWonAchievements', text: 'Won' },
  { value: 'rdoNotWonAchievements', text: 'Not Won' }
];
