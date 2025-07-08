import { allConcurrently, waitForElement } from '@ta-x-utilities';
import html from './collapsible-groups.hbs';
import styles from './styles';
import attributes from './attributes';

const applyBody = (header: HTMLElement, index: number): void => {
  const parsedDocument = new DOMParser().parseFromString(html, 'text/html');
  parsedDocument.body.firstElementChild.setAttribute(attributes.accordionTarget, `.${styles.jsCollapsibleGroupsGroup}-${index}`);
  
  const options = header.querySelector('.options') as HTMLElement;
  options.prepend(parsedDocument.body.firstElementChild);
};

const getBaseAchievementGroup = (el: HTMLElement): HTMLElement => {
  const baseAchievementHeader = el.querySelector('.pnl-hd.no-pills.no-pr.game:not(.gamer):not(.dlc)') as HTMLElement;

  if (!baseAchievementHeader) {
    return null;
  }

  const baseAchievementTitle = (baseAchievementHeader.querySelector('h2 a') as HTMLElement).innerText;

  if (baseAchievementTitle === 'Overall DLC Stats') {
    return null;
  }

  return baseAchievementHeader;
};

const getDLCAchievementGroups = (el: HTMLElement): HTMLElement[] => {
  const dlcAchievementHeaders = [...el.querySelectorAll('.pnl-hd.dlc')] as HTMLElement[];

  return dlcAchievementHeaders;
};

export const applyCollapsibleGroups = async () => {
  if (!(await waitForElement('body'))) {
    return;
  }

  const body = document.querySelector('main')
  body.classList.add(styles.collapsibleGroups);

  const headers = [getBaseAchievementGroup(body), ...getDLCAchievementGroups(body)].filter((el: HTMLElement) => el !== null);

  await allConcurrently(
    'collapsibleGroups - Apply',
    headers.map((achievementGroup: HTMLElement) => ({
      name: 'collapsible-groups-apply',
      task: (index: number): void => {
        applyBody(achievementGroup, index);

        const accordionContent = document.createElement('div');
        accordionContent.className = `${styles.accordionContent} ${styles.jsCollapsibleGroupsGroup}-${index}`;

        let currentElement = achievementGroup.nextElementSibling;
        achievementGroup.parentNode.insertBefore(accordionContent, currentElement);

        while (
          currentElement &&
          !currentElement.matches(`.pnl-hd.dlc, .${styles.accordionContent}`) &&
          currentElement.tagName !== 'SECTION'
        ) {
          const nextElement = currentElement.nextElementSibling as HTMLElement;
          accordionContent.appendChild(currentElement);
          currentElement = nextElement;
        }
      }
    })),
    5
  );
};

export default { applyCollapsibleGroups };
