import { TemplateOptions } from '@ta-x-types';

const wrapper = document.createElement('template');

export const template = (el: HTMLElement | Node, opts: TemplateOptions = {}): HTMLElement => {
  wrapper.appendChild(el);

  let html = (el as HTMLElement).outerHTML.replace(/(\r\n|\n|\r)/gm, '')
  .replace(/{GM_info.script.version}/g, GM_info.script.version || '');

  for (const opt in opts) {
    for (const prop in opts[opt]) {
      const regex = new RegExp(`{${opt}.${prop}}`, 'g');
      html = html.replace(regex, opts[opt][prop]);
    }
  }

  wrapper.innerHTML = html;

  const newElement = wrapper.content.firstChild;

  wrapper.innerHTML = '';

  return newElement as HTMLElement;
};
