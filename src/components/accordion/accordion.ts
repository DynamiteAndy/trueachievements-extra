import { until } from '@ta-x-helpers';
import { waitForElement } from '@ta-x-utilities';
import { mutationObserver } from '@ta-x-services';
import styles from './styles';
import attributes from './attributes';

const getAccordionContent = async (target: HTMLElement): Promise<HTMLElement> => {
  const targetSelector = target.getAttribute(attributes.accordionTarget);
  const content = document.querySelector(targetSelector) as HTMLElement;

  if (!content.style.maxHeight) {
    content.style.maxHeight = `${content.scrollHeight}px`;

    await until(() => content.style.maxHeight === `${content.scrollHeight}px`, 1000);
  }

  return content;
};

export const accordion = async (): Promise<void> => {
  document.addEventListener('click', async ({ target }): Promise<void> => {
    if (!(target instanceof HTMLElement)) {
      return;
    }

    if (!target.classList.contains(styles.jsAccordion)) {
      return;
    }

    target.classList.toggle('expanded');

    const content = await getAccordionContent(target);
    content.style.maxHeight !== '0px'
      ? (content.style.maxHeight = '0px')
      : (content.style.maxHeight = `${content.scrollHeight}px`);
  });

  await waitForElement('body');

  mutationObserver.onMutation(
    `.${styles.jsAccordionContent}`,
    (content) => {
      content.style.maxHeight = `${content.scrollHeight}px`;
    },
    { attributeFilter: ['class'] }
  );
};

export default accordion;
