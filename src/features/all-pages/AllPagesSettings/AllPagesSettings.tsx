import { EmojisSettings } from '../emojis/EmojisSettings';
import { GiveawayAutoOptInSettings } from '../giveaway-auto-opt-in/GiveawayAutoOptInSettings';
import { StickyHeaderSettings } from '../sticky-header/StickyHeaderSettings';

// The settings menu's General tab
export const AllPagesSettings = () => (
  <>
    <StickyHeaderSettings />
    <EmojisSettings />
    <GiveawayAutoOptInSettings />
  </>
);
