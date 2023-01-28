import { AsideContentPreviewPage, AsideContentPreviewAchievement, AsideContentPreviewThanks } from './features/staff-walkthrough-improvements/walkthrough-preview/populate-aside-contents';
import { TabTemplateOptions } from './components/tabs';

export type TemplateOptions = {
  element?: HTMLElement,
  tab?: TabTemplateOptions,
  urls?: {
    walkthroughPreviewWithWalkthroughId?: string,
    walkthroughPreviewWithPageId?: string,
    walkthroughPreviewWithPageIdAndAchievementId?: string
  },
  populateAsideContentPreviewPage?: AsideContentPreviewPage,
  populateAsideContentPreviewAchievement?: AsideContentPreviewAchievement
  populateAsideContentPreviewThanks?: AsideContentPreviewThanks
}