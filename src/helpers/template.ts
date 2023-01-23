import { TemplateOptions } from '@ta-x-types';

const wrapper = document.createElement('template');

export const template = (el: HTMLElement, opts: TemplateOptions = {}): HTMLElement => {
  const { element, urls, populateAsideContentPreviewPage, populateAsideContentPreviewAchievement, populateAsideContentPreviewThanks } = opts;
  wrapper.appendChild(el);

  wrapper.innerHTML = el.outerHTML
    .replace(/(\r\n|\n|\r)/gm, '')
    .replace(/{GM_info.script.version}/g, GM_info.script.version || '')
    .replace(/{element.title}/g, element?.title || '')
    .replace(/{urls.walkthroughPreviewWithWalkthroughId}/g, urls?.walkthroughPreviewWithWalkthroughId || '')
    .replace(/{urls.walkthroughPreviewWithPageId}/g, urls?.walkthroughPreviewWithPageId || '')
    .replace(/{urls.walkthroughPreviewWithPageIdAndAchievementId}/g, urls?.walkthroughPreviewWithPageIdAndAchievementId || '')
    .replace(/{populateAsideContentPreviewPage.index}/g, populateAsideContentPreviewPage?.index.toString() || '')
    .replace(/{populateAsideContentPreviewPage.title}/g, populateAsideContentPreviewPage?.title || '')
    .replace(/{populateAsideContentPreviewPage.id}/g, populateAsideContentPreviewPage?.id || '')
    .replace(/{populateAsideContentPreviewAchievement.title}/g, populateAsideContentPreviewAchievement?.title || '')
    .replace(/{populateAsideContentPreviewAchievement.id}/g, populateAsideContentPreviewAchievement?.id || '')
    .replace(/{populateAsideContentPreviewAchievement.description}/g, populateAsideContentPreviewAchievement?.description || '')
    .replace(/{populateAsideContentPreviewAchievement.src}/g, populateAsideContentPreviewAchievement?.src || '')
    .replace(/{populateAsideContentPreviewThanks.total}/g, populateAsideContentPreviewThanks?.total || '')
    .replace(/{populateAsideContentPreviewThanks.thread}/g, populateAsideContentPreviewThanks?.thread || '')
    .replace(/{element.outerHTML}/g, element?.outerHTML || '');
    // .replace(/{link}/g, obj.link || '')
    // .replace(/{name}/g, obj.name || '')
    // .replace(/{gamer.name}/g, obj.gamer ? obj.gamer.name : '' || '')
    // .replace(/{name\|\|gamer.name}/g, obj.name || (obj.gamer ? obj.gamer.name : '') || '')
    // .replace(/{achievement.name}/g, (obj.achievement ? obj.achievement.name : '') || '')
    // .replace(/{compareLink}/g, obj.compareLink || '')
    // .replace(/{achievementLink}/g, obj.achievementLink || '')
    // .replace(/{score}/g, obj.score || '')
    // .replace(/{unlockDate}/g, obj.unlockDate ? new Date(obj.unlockDate).toLocaleDateString('en-GB', {
    //   day: 'numeric',
    //   month: 'long',
    //   year: 'numeric'
    // }) : '' || '');

  const newElement = wrapper.content.firstChild;

  wrapper.innerHTML = '';

  return newElement as HTMLElement;
};
