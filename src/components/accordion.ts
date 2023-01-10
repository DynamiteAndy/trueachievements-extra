import { Constants } from '@ta-x-globals';
import { default as pubSub } from './pub-sub';

export const accordion = (): void => {
  document.addEventListener('click', ({ target }): void => {
    if (!(target instanceof HTMLElement)) return;
    if (!target.classList.contains(Constants.Styles.Components.accordion)) return;

    target.classList.toggle('expanded');

    const content = target.nextElementSibling as HTMLElement;
    content.style.maxHeight
      ? content.style.maxHeight = null
      : content.style.maxHeight = `${content.scrollHeight}px`;
  });

  pubSub.subscribe('accordion:setMaxHeight', (content: HTMLElement) => {
    if (!content.style.maxHeight) return;
    content.style.maxHeight = `${content.scrollHeight}px`;
  });
};

export default accordion;