import { getDuplicates, waitForElement, allConcurrently } from '@ta-x-utilities';
import { Constants } from '@ta-x-globals';
import { StaffRegex } from 'globals/regex';
import html from './manage-walkthrough.html';
import { changeToDefaultStatus } from './default-status';
import { makeTableLinksClickable } from './clickable-table-links';
import { autoSelectFirst } from './auto-select-first';

let walkthroughContainer: HTMLElement;

const applyBody = async(): Promise<void> => {
  walkthroughContainer = await waitForElement('#divWalkthroughHolder');

  if (!walkthroughContainer) return;

  const editWalkthrough = await waitForElement('#chEditWalkthrough', walkthroughContainer);

  if (editWalkthrough) {
    const parsedDocument = new DOMParser().parseFromString(html, 'text/html');
    editWalkthrough.after(parsedDocument.querySelector(`.${Constants.Styles.StaffWalkthroughImprovements.ManageWalkthroughPage.containerJs}`));

    await allConcurrently(2, [adjustRightSidebar, adjustButtons]);
  }
};

const adjustButtons = async (): Promise<void> => {
  const buttonContainer = await waitForElement('#btnWalkthrough_Options', walkthroughContainer);
  let buttonsContainer: HTMLElement = null;

  [...buttonContainer.querySelectorAll('li a')].forEach(button => {
    buttonsContainer = buttonsContainer ? buttonsContainer : button.closest('.buttons');

    if (buttonsContainer) {
      button.classList.add('button');
      buttonsContainer.appendChild(button);
    }
  });

  if (buttonsContainer) {
    buttonsContainer.parentNode.insertBefore(buttonsContainer, buttonsContainer.previousElementSibling);
  }
};

const adjustRightSidebar = async(): Promise<void> => {
  const sideBarContainer =  await waitForElement(`.${Constants.Styles.StaffWalkthroughImprovements.ManageWalkthroughPage.containerJs}`, walkthroughContainer);
  
  if (sideBarContainer) {
    const walkthroughAchievementsContainer = await waitForElement('#chWalkthroughAchievements', walkthroughContainer);
    
    if (walkthroughAchievementsContainer) {
      deDupeAchievements(walkthroughAchievementsContainer);
      sideBarContainer.appendChild(walkthroughAchievementsContainer);
    }

    sideBarContainer.appendChild(await waitForElement('#chWalkthroughGames', walkthroughContainer));
    sideBarContainer.appendChild(await waitForElement('#chWalkthroughGamers', walkthroughContainer));
    sideBarContainer.appendChild(await waitForElement('#chWalkthroughOtherSiteLink', walkthroughContainer));
  }
};

const deDupeAchievements = (walkthroughAchievementsContainer: HTMLElement): void => {
  const walkthroughAchievements = [...walkthroughAchievementsContainer.querySelectorAll('#scrolllstWalkthroughAchievementID .c1')] as HTMLElement[];
  const duplicateAchievements = getDuplicates(walkthroughAchievements.map(el => el.innerText), true);
  
  if (duplicateAchievements.length > 0) {
    const currentCount = walkthroughAchievements.length;
    let removedRows = 0;

    for (let i = 0; i < duplicateAchievements.length; i++) {
      const dupeAchievementRows = walkthroughAchievements.filter(walkthroughAchievement => walkthroughAchievement.innerText.toLowerCase() === duplicateAchievements[i].toLowerCase());
      const firstInstancePageColumn = dupeAchievementRows[0].nextElementSibling as HTMLTableElement;

      for (let j = 1; j < dupeAchievementRows.length; j++) {
        const pageNumber = (dupeAchievementRows[j].nextElementSibling as HTMLTableElement).innerText.trim();
        firstInstancePageColumn.innerText += `, ${pageNumber}`;

        dupeAchievementRows[j].closest('tr').remove();
        removedRows++;
      }
    }

    const achievementsTotal = walkthroughAchievementsContainer.querySelector('#lstWalkthroughAchievementID .total') as HTMLElement;
    achievementsTotal.innerText = achievementsTotal.innerText.replace(currentCount.toString(), (currentCount - removedRows).toString());
  }
};

export default async(): Promise<void> => {
  if (!StaffRegex.Walkthroughs.Test.manageWalkthroughUrl()) return;
  
  await changeToDefaultStatus();
  await autoSelectFirst();
  await applyBody();
  await makeTableLinksClickable();
};
