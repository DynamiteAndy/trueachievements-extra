const wrapper = document.createElement('template');

export const template = (el: HTMLElement, opts: any = {}): HTMLElement => {
  const { image, element } = opts;
  wrapper.appendChild(el);

  wrapper.innerHTML = el.outerHTML
    .replace(/(\r\n|\n|\r)/gm, '')
    .replace(/{GM_info.script.version}/g, GM_info.script.version || '')
    .replace(/{image.title}/g, image?.title || '')
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
