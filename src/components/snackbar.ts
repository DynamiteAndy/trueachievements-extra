import { Constants } from '@ta-x-globals';
import html from '@ta-x-views/components/snackbar.html';
import { waitForElement } from '../utilities/html-element-util';
import pubSub from './pub-sub';

export const snackbar = async (): Promise<void> => {
  if (!await waitForElement('body')) return;
  
  const parsedDocument = new DOMParser().parseFromString(html, 'text/html');
  document.body.appendChild(parsedDocument.querySelector(`.${Constants.Styles.Components.snackbar}`));

  const snackbar = document.querySelector(`.${Constants.Styles.Components.snackbar}`) as HTMLElement;
  const textContainer = snackbar.querySelector('h2');

  pubSub.subscribe('snackbar:show', ({ text, type }) => {
    if (!snackbar) return;
    textContainer.innerText = text;
    textContainer.classList.add(type);
    snackbar.classList.toggle(Constants.Styles.Components.showSnackbar);

    setTimeout(() => {
      snackbar.classList.toggle(Constants.Styles.Components.showSnackbar);
      textContainer.classList.remove(type);
    }, 3000);
  });
};

export default snackbar;