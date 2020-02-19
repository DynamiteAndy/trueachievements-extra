const wrapper = document.createElement('div');

export const template = (element: HTMLElement, ...params: any): HTMLElement => {
  wrapper.appendChild(element);

  (wrapper.firstChild as HTMLElement).outerHTML = element.outerHTML
    .replace(/{GM_info.script.version}/g, GM_info.script.version || '');
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

  const newElement = wrapper.firstChild;

  wrapper.innerHTML = '';

  return newElement as HTMLElement;
};
