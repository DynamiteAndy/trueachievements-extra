import { AllPagesSettings } from './all-pages';
import startSettingsMenu, { type SettingsTab } from './all-pages/settings-menu';
import { ForumSettings } from './forum';
import { GameSettings, settingsAppliedOnArrival } from './game';
import { GamerSettings } from './gamer';
import { GamesListSettings } from './games-list';
import { NewsSettings } from './news';
import { StaffWalkthroughSettings } from './staff/walkthrough';

// The Games tab: the games list's row, then a game's pages
const GamesSettings = () => (
  <>
    <GamesListSettings />
    <GameSettings />
  </>
);

// The settings menu's tabs, in the menu's order, each showing one or more areas' settings. Handed to the menu here (with
// the game area's settings that apply only on a fresh arrival, for its reload notice) rather than imported by it, as
// features import the menu (the sticky header, the giveaway opt-in)
export const settingsTabs: SettingsTab[] = [
  { id: 'general', label: 'General', Settings: AllPagesSettings },
  { id: 'forums', label: 'Forums', Settings: ForumSettings },
  { id: 'gamer', label: 'Gamer', Settings: GamerSettings },
  { id: 'games', label: 'Games', Settings: GamesSettings },
  { id: 'news', label: 'News', Settings: NewsSettings },
  { id: 'staff', label: 'Staff', Settings: StaffWalkthroughSettings }
];

export const settingsMenu = (): Promise<void> => startSettingsMenu(settingsTabs, settingsAppliedOnArrival);
