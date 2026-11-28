import { AchievementsSettings } from '../achievements/AchievementsSettings';
import { ChallengesSettings } from '../challenges/ChallengesSettings';
import { ClipsSettings } from '../clips/ClipsSettings';
import { DlcSettings } from '../dlc/DlcSettings';
import { ExtraGuidesSettings } from '../extra-guides/ExtraGuidesSettings';
import { GameForumSettings } from '../forum/GameForumSettings';
import { WalkthroughSettings } from '../walkthrough/WalkthroughSettings';

// A game's pages' settings, in the settings menu's Games tab (after the games list's, settings-tabs.tsx), in the order a
// game's page lists its tabs, then Extra Guides, which covers several of them
export const GameSettings = () => (
  <>
    <AchievementsSettings />
    <ChallengesSettings />
    <GameForumSettings />
    <ClipsSettings />
    <WalkthroughSettings />
    <DlcSettings />
    <ExtraGuidesSettings />
  </>
);
