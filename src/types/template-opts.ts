import { AsideContentPreviewPage, AsideContentPreviewAchievement, AsideContentPreviewThanks } from './features/staff-walkthrough-improvements/walkthrough-preview/populate-aside-contents';
import { ListSettingItemOptions } from './components/list-setting-item';
import { TabTemplateOptions } from './components/tabs';
import { EmojiTemplateOptions } from './features/emojis';

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
};