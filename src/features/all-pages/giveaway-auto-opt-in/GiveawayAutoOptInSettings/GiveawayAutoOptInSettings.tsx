import { settings } from '@ta-x-storage';
import { CheckboxSetting } from '@ta-x-ui';

// Giveaway auto opt in's setting in the settings menu, the General tab's last row
export const GiveawayAutoOptInSettings = () => {
  const allPages = settings.allPages;

  return <CheckboxSetting label="Auto Opt In To Giveaways" setting={allPages.giveawayAutoOptIn} />;
};
