import * as fs from 'fs';
import { log } from 'missionlog';
import { getDuplicates, toInt, waitForElement, allConcurrently } from '@ta-x-utilities';
import { template, memoizeFetch } from '@ta-x-helpers';
import { Constants } from '@ta-x-globals';
import config from '../../config';
import regex, { extractAllBetween } from '../../regex';

// Elements -------
let walkthroughContainer: HTMLElement;

const applyBody = async(): Promise<void> => {
  log.debug('Manage-Walkthrough', 'Started - applyBody');

  const html = fs.readFileSync('./src/views/staff-walkthrough-improvements.html', 'utf8');
  const parsedDocument = new DOMParser().parseFromString(html, 'text/html');
  walkthroughContainer = await waitForElement('#divWalkthroughHolder');

  await applyDefaultStatus();

  const editWalkthrough = await waitForElement('#chEditWalkthrough', walkthroughContainer);
  
  if (editWalkthrough) {
    editWalkthrough.after(parsedDocument.querySelector(`.${Constants.Styles.StaffWalkthroughImprovements.ManageWalkthroughPage.containerJs}`));

    await allConcurrently(2, [adjustRightSidebar, adjustButtons, applyClickableTableLinks]);
  } else {
    log.warn('Manage-Walkthrough', 'Did not find edit walkthrough container');
  }

  log.debug('Manage-Walkthrough', 'Finished - applyBody');
};

const applyDefaultStatus = async(): Promise<void> => {
  if (!config.staffWalkthroughImprovements.manageWalkthroughDefaultStatus) return;
  if (regex.test.staff.walkthrough.manageWalkthroughUrlWithWalkthroughId(window.location.href)) return;

  log.debug('Manage-Walkthrough', 'Started - applyDefaultStatus');

  const status = await waitForElement('#ddlStatusFilter') as HTMLSelectElement;

  if (status.querySelector('[selected]') === null &&
    status.value !== config.staffWalkthroughImprovements.manageWalkthroughDefaultStatusValue) {
    status.value = config.staffWalkthroughImprovements.manageWalkthroughDefaultStatusValue;
    status.onchange(null);
  } else {
    log.info('Manage-Walkthrough', 'A status has already been selected');
  }

  log.debug('Manage-Walkthrough', 'Started - applyDefaultStatus');
};

const adjustButtons = async (): Promise<void> => {
  log.debug('Manage-Walkthrough', 'Started - adjustButtons');

  const buttonContainer = await waitForElement('#btnWalkthrough_Options', walkthroughContainer);
  let buttonsContainer: HTMLElement = null;

  [...buttonContainer.querySelectorAll('li a')].forEach(button => {
    button.classList.add('button');

    if (buttonsContainer === null) {
      buttonsContainer = button.closest('.buttons');
    }

    if (buttonsContainer) {
      buttonsContainer.appendChild(button);
    }
  });

  if (buttonsContainer) {
    buttonsContainer.parentNode.insertBefore(buttonsContainer, buttonsContainer.previousElementSibling);
  } else {
    log.warn('Manage-Walkthrough', 'Did not find walkthrough options button container');
  }

  log.debug('Manage-Walkthrough', 'Finished - adjustButtons');
};

const adjustRightSidebar = async(): Promise<void> => {
  log.debug('Manage-Walkthrough', 'Started - adjustButtons');

  const sideBarContainer =  await waitForElement(`.${Constants.Styles.StaffWalkthroughImprovements.ManageWalkthroughPage.containerJs}`, walkthroughContainer);
  
  if (sideBarContainer) {
    sideBarContainer.appendChild(await waitForElement('#chWalkthroughGames', walkthroughContainer));
    
    const walkthroughAchievementsContainer = await waitForElement('#chWalkthroughAchievements', walkthroughContainer);
    
    if (walkthroughAchievementsContainer) {
      deDupeAchievements(walkthroughAchievementsContainer);
      sideBarContainer.appendChild(walkthroughAchievementsContainer);
    }

    sideBarContainer.appendChild(await waitForElement('#chWalkthroughGamers', walkthroughContainer));
    sideBarContainer.appendChild(await waitForElement('#chWalkthroughOtherSiteLink', walkthroughContainer));
  } else {
    log.warn('Manage-Walkthrough', 'Did not find walkthrough sidebar container');
  }

  log.debug('Manage-Walkthrough', 'Finished - adjustButtons');
};

const applyClickableTableLinks = async(): Promise<void> => {
  if (!config.staffWalkthroughImprovements.clickableTableLinks) return;

  log.debug('Manage-Walkthrough', 'Started - applyClickableTableLinks');

  const html = fs.readFileSync('./src/views/templates/manage-walkthrough-achievement-row.html', 'utf8');
  const parsedDocument = new DOMParser().parseFromString(html, 'text/html');
  const container = document.querySelector(`.${Constants.Styles.StaffWalkthroughImprovements.ManageWalkthroughPage.containerJs}`);
  const selectedWalkthrough = await waitForElement('#lstWalkthroughIDselectedrow a') as HTMLAnchorElement;

  if (!selectedWalkthrough) {
    log.error('Manage-Walkthrough', 'no walkthrough is currently selected');
    return;
  }

  const walkthroughId = toInt(extractAllBetween("'", selectedWalkthrough.href)[1]);
  const walthroughPreviewResponse = await memoizeFetch(`https://www.trueachievements.com/staff/walkthrough/walkthroughpreview.aspx?walkthroughid=${walkthroughId}`);
  const walthroughPreviewDocument = new DOMParser().parseFromString(walthroughPreviewResponse, 'text/html');

  const clickableGames = async() => {
    if (await waitForElement('#chWalkthroughGamers', walkthroughContainer)) {
      const games =  ([...walthroughPreviewDocument.querySelectorAll('.walkthroughsummary .games a.gamelink')] as HTMLElement[]);
      
      ([...container.querySelectorAll('#scrolllstWalkthroughGames .c1')] as HTMLElement[]).forEach(el => {
        const gameName = el.innerText.trim();
        const walkthroughPreviewGame = games.find(game => game.innerText.toLowerCase() === gameName.toLowerCase());
        
        if (walkthroughPreviewGame) {
          el.innerText = '';
          el.innerHTML = walkthroughPreviewGame.outerHTML;
        }
      });
    } else {
      log.warn('Manage-Walkthrough', 'Did not find walkthrough games container');
    }
  };

  const clickableGamers = async() => {
    if (await waitForElement('#chWalkthroughGamers', walkthroughContainer)) {
      const editors =  ([...walthroughPreviewDocument.querySelectorAll('.walkthroughsummary .editors dd a')] as HTMLElement[]);
      
      ([...container.querySelectorAll('#scrolllstWalkthroughGamers .c1')] as HTMLElement[]).forEach(el => {
        const gamerName = el.innerText.trim();
        const walkthroughPreviewGamer = editors.find(editor => editor.innerText.toLowerCase() === gamerName.toLowerCase());
        
        if (walkthroughPreviewGamer) {
          el.innerText = '';
          el.innerHTML = walkthroughPreviewGamer.outerHTML;
        }
      });
    } else {
      log.warn('Manage-Walkthrough', 'Did not find walkthrough gamers container');
    }
  };

  const clickableAndMissedAchievements = async() => {
    if (await waitForElement('#chWalkthroughGamers', walkthroughContainer) &&
    await waitForElement('#chWalkthroughAchievements', walkthroughContainer)) {

      const walkthroughAchievements = [...container.querySelectorAll('#chWalkthroughAchievements #scrolllstWalkthroughAchievementID .c1')] as HTMLElement[];
      const walkthroughAchievementContainer = container.querySelector('#chWalkthroughAchievements #scrolllstWalkthroughAchievementID tbody') as HTMLElement;

      if (!walkthroughAchievementContainer) {
        log.warn('Manage-Walkthrough', 'Did not find walkthrough achievement container');
        return;
      }

      await allConcurrently(3, ([...container.querySelectorAll('#scrolllstWalkthroughGames .c1 a')] as HTMLElement[]).map(async (game: HTMLAnchorElement) => {
        const gameResponse = await memoizeFetch(game.href);
        const gameDocument = new DOMParser().parseFromString(gameResponse, 'text/html');
        
        ([...gameDocument.querySelectorAll('main ul.ach-panels li a.title')] as HTMLElement[]).forEach((gameAchievement: HTMLElement) => {
        const achievementName = gameAchievement.innerText.trim();
          const walkthroughAchievement = walkthroughAchievements.find(walkthroughAchievement => walkthroughAchievement.innerText.toLowerCase() === achievementName.toLowerCase());

          if (walkthroughAchievement) {
            walkthroughAchievement.innerText = '';
            walkthroughAchievement.innerHTML = gameAchievement.outerHTML;

            const link = walkthroughAchievement.querySelector('a') as HTMLAnchorElement;
            link.href = regex.test.achievements.achievementUrlWithGamerId(link.href) ? new URL(link.href).pathname : link.href;
          } else {
            const clonedAchievementRow = (parsedDocument.querySelector(`#${Constants.Templates.StaffWalkthroughImprovements.ManageWalkthroughPage.achievementRow}`) as HTMLTemplateElement).content.firstElementChild.cloneNode(true);
            const achievementRow = template(clonedAchievementRow as HTMLElement, { element: gameAchievement });
            const link = achievementRow.querySelector('a') as HTMLAnchorElement;
            achievementRow.querySelector('a').href = regex.test.achievements.achievementUrlWithGamerId(link.href) ? new URL(link.href).pathname : link.href;

            walkthroughAchievementContainer.appendChild(achievementRow);
          }
        });
      }));

      const achievementsTotal = walkthroughContainer.querySelector('#chWalkthroughAchievements #lstWalkthroughAchievementID .total') as HTMLElement;
      achievementsTotal.innerText = `${achievementsTotal.innerText}/${ [...container.querySelectorAll('#chWalkthroughAchievements #scrolllstWalkthroughAchievementID .c1')].length}`;
    } else {
      log.warn('Manage-Walkthrough', 'Did not find walkthrough games container');
    }
  };

  await allConcurrently(2, [clickableGames, clickableGamers]);
  await allConcurrently(2, [clickableAndMissedAchievements]);

  log.debug('Manage-Walkthrough', 'Finished - applyClickableTableLinks');
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

const listen = (): void => {
  // Nothing to listen to yet!
};

export default async(): Promise<void> => {
  if (!regex.test.staff.walkthrough.manageWalkthroughUrl(window.location.href)) return;

  log.debug('Manage-Walkthrough', 'Started');

  await applyBody();
  listen();

  log.debug('Manage-Walkthrough', 'Finished');
};
