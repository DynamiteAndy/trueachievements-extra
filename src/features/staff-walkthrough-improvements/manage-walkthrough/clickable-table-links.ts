import achievementRow from '@ta-x-views/templates/manage-walkthrough-achievement-row.html';
import { Constants, manageWalkthrough, AchievementsRegex } from '@ta-x-globals';
import { memoizeFetch, template } from '@ta-x-helpers';
import { allConcurrently, toInt, waitForElement, extractAllBetween } from '@ta-x-utilities';

const clickableAchievements = async(walkthroughContainer: HTMLElement, walthroughPreviewDocument: Document) => {
  if (await waitForElement('#chWalkthroughAchievements', walkthroughContainer)) {
    const parsedDocument = new DOMParser().parseFromString(achievementRow, 'text/html');
    const walkthroughAchievements = [...walkthroughContainer.querySelectorAll('#chWalkthroughAchievements #scrolllstWalkthroughAchievementID .c1')] as HTMLElement[];
    let walkthroughAchievementContainer = walkthroughContainer.querySelector('#chWalkthroughAchievements #scrolllstWalkthroughAchievementID tbody') as HTMLElement;

    if (!walkthroughAchievementContainer) {
      const walkthroughAchievementTable = walkthroughContainer.querySelector('#chWalkthroughAchievements #scrolllstWalkthroughAchievementID table');
      walkthroughAchievementContainer = walkthroughAchievementTable.appendChild(document.createElement('tbody'));
    }

    const games = ([...walthroughPreviewDocument.querySelectorAll('.walkthroughsummary .games a.gamelink')] as HTMLAnchorElement[]);

    await allConcurrently('ClickableAchievements - Games', games.map((game: HTMLAnchorElement) => ({
        name: `manage-walkthrough-clickable-table-links-clickable-achievements-${game.innerText}`,
        task: async () => {
          const gameResponse = await memoizeFetch(game.href);
          const gameDocument = new DOMParser().parseFromString(gameResponse, 'text/html');
          const gameAchievements = ([...gameDocument.querySelectorAll('main ul.ach-panels li a.title')] as HTMLElement[]);

          await allConcurrently('ClickableAchievements - Achievements', gameAchievements.map((gameAchievement: HTMLElement) => ({
            name: `manage-walkthrough-clickable-table-links-clickable-achievements-${game.innerText}-${gameAchievement.innerText.trim()}`,
            task: async (): Promise<void> => {
              const achievementName = gameAchievement.innerText.trim();
              const walkthroughAchievement = walkthroughAchievements.find(walkthroughAchievement => walkthroughAchievement.innerText.toLowerCase() === achievementName.toLowerCase());

              console.log(achievementName, walkthroughAchievement);
              if (walkthroughAchievement) {
                walkthroughAchievement.innerText = '';
                walkthroughAchievement.innerHTML = gameAchievement.outerHTML;

                const link = walkthroughAchievement.querySelector('a') as HTMLAnchorElement;
                link.href = AchievementsRegex.Test.achievementUrlWithGamerId(link.href) ? new URL(link.href).pathname : link.href;
              } else {
                const clonedAchievementRow = (parsedDocument.querySelector(`#${Constants.Templates.StaffWalkthroughImprovements.ManageWalkthroughPage.achievementRow}`) as HTMLTemplateElement).content.firstElementChild.cloneNode(true);
                const achievementRow = template(clonedAchievementRow as HTMLElement, { element: gameAchievement });
                const link = achievementRow.querySelector('a') as HTMLAnchorElement;
                achievementRow.querySelector('a').href = AchievementsRegex.Test.achievementUrlWithGamerId(link.href) ? new URL(link.href).pathname : link.href;

                walkthroughAchievementContainer.appendChild(achievementRow);
              }
            }
          })), 5);
        }
      })
    ));

    const achievementsTotal = walkthroughContainer.querySelector('#chWalkthroughAchievements #lstWalkthroughAchievementID .total') as HTMLElement;
    achievementsTotal.innerText = `${achievementsTotal.innerText}/${ [...walkthroughAchievementContainer.querySelectorAll('#chWalkthroughAchievements #scrolllstWalkthroughAchievementID .c1')].length}`;
  }
};

const clickableGames = async(walkthroughContainer: HTMLElement, walthroughPreviewDocument: Document) => {
  if (await waitForElement('#chWalkthroughGamers', walkthroughContainer)) {
    const games = ([...walthroughPreviewDocument.querySelectorAll('.walkthroughsummary .games a.gamelink')] as HTMLElement[]);
    
    ([...walkthroughContainer.querySelectorAll('#scrolllstWalkthroughGames .c1')] as HTMLElement[]).forEach(el => {
      const gameName = el.innerText.trim();
      const walkthroughPreviewGame = games.find(game => game.innerText.toLowerCase() === gameName.toLowerCase());
      
      if (walkthroughPreviewGame) {
        el.innerText = '';
        el.innerHTML = walkthroughPreviewGame.outerHTML;
      }
    });
  }
};

const clickableGamers = async(walkthroughContainer: HTMLElement, walthroughPreviewDocument: Document) => {
  if (await waitForElement('#chWalkthroughGamers', walkthroughContainer)) {
    const editors =  ([...walthroughPreviewDocument.querySelectorAll('.walkthroughsummary .editors dd a')] as HTMLElement[]);
  
    ([...walkthroughContainer.querySelectorAll('#scrolllstWalkthroughGamers .c1')] as HTMLElement[]).forEach(el => {
      const gamerName = el.innerText.trim();
      const walkthroughPreviewGamer = editors.find(editor => editor.innerText.toLowerCase() === gamerName.toLowerCase());
      
      if (walkthroughPreviewGamer) {
        el.innerText = '';
        el.innerHTML = walkthroughPreviewGamer.outerHTML;
      }
    });
  }
};

export const makeTableLinksClickable = async(): Promise<void> => {
  if (!manageWalkthrough.clickableTableLinks) return;

  const selectedWalkthrough = await waitForElement('#lstWalkthroughIDselectedrow a') as HTMLAnchorElement;

  if (!selectedWalkthrough) {
    return;
  }

  const walkthroughContainer = document.querySelector(`.${Constants.Styles.StaffWalkthroughImprovements.ManageWalkthroughPage.containerJs}`) as HTMLElement;
  const walkthroughId = toInt(extractAllBetween("'", selectedWalkthrough.href)[1]);
  const walthroughPreviewResponse = await memoizeFetch(`https://www.trueachievements.com/staff/walkthrough/walkthroughpreview.aspx?walkthroughid=${walkthroughId}`);
  const walthroughPreviewDocument = new DOMParser().parseFromString(walthroughPreviewResponse, 'text/html');

  await allConcurrently('Manage Walkthrough Page Clickable Table Links', [
    { name: 'manage-walkthrough-clickable-table-links-clickable-achievements', task: async() => clickableAchievements(walkthroughContainer, walthroughPreviewDocument) },
    { name: 'manage-walkthrough-clickable-table-links-clickable-games', task: async() => clickableGames(walkthroughContainer, walthroughPreviewDocument) },
    { name: 'manage-walkthrough-clickable-table-links-clickable-gamers', task: async() => clickableGamers(walkthroughContainer, walthroughPreviewDocument) }
  ]);
};

export default { makeTableLinksClickable };