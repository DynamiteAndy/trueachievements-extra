import { settings } from '@ta-x-storage';
import { CheckboxSetting } from '@ta-x-ui';

// The emoji picker's setting in the settings menu
export const EmojisSettings = () => {
  const allPages = settings.allPages;

  return <CheckboxSetting label="More Emojis" setting={allPages.emojis} />;
};
