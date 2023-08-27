import { Constants } from '@ta-x-globals';
import { dispatchEvent } from '@ta-x-helpers';
import { toInt } from '@ta-x-utilities';
import { default as pubSub } from './pub-sub';

export const accordion = (): void => {
  document.addEventListener('click', ({ target }): void => {
    if (!(target instanceof HTMLElement)) {
      return;
    }
    if (!target.classList.contains(Constants.Styles.Components.accordion)) {
      return;
    }

    target.classList.toggle('expanded');

    if (target.hasAttribute('data-checkbox-accordion')) {
      const toggle = target.querySelector('input') as HTMLInputElement;
      toggle.checked = target.classList.contains('expanded');
      dispatchEvent('change', toggle);
    }

    const content = target.nextElementSibling as HTMLElement;
    const parentBodyHeight = content.style.maxHeight ? -content.scrollHeight : content.scrollHeight;
    content.style.maxHeight
      ? (content.style.maxHeight = null)
      : (content.style.maxHeight = `${content.scrollHeight}px`);

    const parentAccordionBody = target.closest('[data-parent-accordion-body]') as HTMLElement;

    if (parentAccordionBody) {
      parentAccordionBody.style.maxHeight = `${toInt(parentAccordionBody.style.maxHeight) + parentBodyHeight}px`;
    }
  });

  pubSub.subscribe('accordion:setMaxHeight', (content: HTMLElement) => {
    if (!content.style.maxHeight) {
      return;
    }
    content.style.maxHeight = `${content.scrollHeight}px`;
  });

  pubSub.subscribe('accordion:toggleState', (header: HTMLElement) => {
    header.classList.toggle('expanded');

    const content = header.nextElementSibling as HTMLElement;
    content.style.maxHeight = `${content.scrollHeight}px`;
  });
};

export default accordion;
