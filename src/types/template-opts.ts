import { AsideContentPreviewPage, AsideContentPreviewAchievement, AsideContentPreviewThanks } from './features/staff-walkthrough-improvements/walkthrough-preview/populate-aside-contents';

export type TemplateOptions = {
  element?: HTMLElement,
  urls?: {
    walkthroughPreviewWithWalkthroughId?: string,
    walkthroughPreviewWithPageId?: string,
    walkthroughPreviewWithPageIdAndAchievementId?: string
  },
  populateAsideContentPreviewPage?: AsideContentPreviewPage,
  populateAsideContentPreviewAchievement?: AsideContentPreviewAchievement
  populateAsideContentPreviewThanks?: AsideContentPreviewThanks
}