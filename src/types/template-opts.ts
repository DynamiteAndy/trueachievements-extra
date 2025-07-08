import type { ListSettingItemOptions } from './components/list-setting-item';
import type { TabTemplateOptions } from './components/tabs';
import type { EmojiTemplateOptions } from './features/emojis';
import type {
  AsideContentPreviewPage,
  AsideContentPreviewAchievement,
  AsideContentPreviewThanks
} from './features/staff-walkthrough-improvements/walkthrough-preview/populate-aside-contents';
import type { AchievementGuideSolutionOptions } from './features/games-improvements/achievements/achievement-guide-solution';

export type TemplateOptions = {
  element?: HTMLElement;
  listSetting?: ListSettingItemOptions;
  tab?: TabTemplateOptions;
  emojis?: EmojiTemplateOptions;
  urls?: {
    walkthroughPreviewWithWalkthroughId?: string;
    walkthroughPreviewWithPageId?: string;
    walkthroughPreviewWithPageIdAndAchievementId?: string;
  };
  populateAsideContentPreviewPage?: AsideContentPreviewPage;
  populateAsideContentPreviewAchievement?: AsideContentPreviewAchievement;
  populateAsideContentPreviewThanks?: AsideContentPreviewThanks;
  achievementGuideSolution?: AchievementGuideSolutionOptions;
};
