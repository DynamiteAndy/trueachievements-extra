import { Cache, Constants, StaffRegex, walkthroughPreview } from '@ta-x-globals';
import { AsideContentPreviewAchievement, AsideContentPreviewPage } from '@ta-x-types';
import { waitForElement, extractAllBetween, toInt } from '@ta-x-utilities';
import { memoizeFetch, template } from '@ta-x-helpers';
import { pubSub } from '@ta-x-components';
import templatedPageRows from '@ta-x-views/templates/walkthrough-preview-walkthrough-pages.html';
import html from './walkthrough-preview.hbs';

// Elements -------
let extensionBody: HTMLElement;
let askForWalkthroughBody: HTMLElement;

const applyBody = async (): Promise<void> => {
  const parsedDocument = new DOMParser().parseFromString(html, 'text/html');
  const asideColumn = await waitForElement('.main aside');

  asideColumn.appendChild(
    parsedDocument.querySelector(
      `.${Constants.Styles.StaffWalkthroughImprovements.WalkthroughPreview.populateAsideContentJs}`
    )
  );

  extensionBody = asideColumn.querySelector(
    `.${Constants.Styles.StaffWalkthroughImprovements.WalkthroughPreview.populateAsideContentJs}`
  );
  askForWalkthroughBody = extensionBody.querySelector(`.${Constants.Styles.Components.AskLoader.askJs}`);

  getAchievementWalkthroughId();
};

const listen = (): void => {
  const button = extensionBody.querySelector(`.${Constants.Styles.Components.AskLoader.buttonJs}`);
  const input = extensionBody.querySelector(`.${Constants.Styles.Components.AskLoader.inputJs}`) as HTMLInputElement;

  button.addEventListener('click', async (e: Event) => {
    if (!(e.target instanceof HTMLElement)) {
      return;
    }
    e.preventDefault();
    e.stopPropagation();

    try {
      if (input.value === '') {
        return;
      }

      toggleAskForWalkthrough();
      await getAsideContent(input.value);
    } catch {
      return;
    }
  });
};

const getAchievementWalkthroughId = async (): Promise<void> => {
  const cachedWalkthroughIds = Cache.walkthroughPreviewWalkthroughId;
  let walkthroughId: string = null;

  if (StaffRegex.Walkthroughs.Test.walkthroughPreviewUrlWithWalkthroughId()) {
    walkthroughId = new URLSearchParams(window.location.search).get('walkthroughid');
  } else if (StaffRegex.Walkthroughs.Test.walkthroughPagePreviewUrlWithPageId()) {
    const pageId = new URLSearchParams(window.location.search).get('pageid');
    const foundWalkthroughId = [...cachedWalkthroughIds.entries()].find((walkthroughs) =>
      walkthroughs[1].includes(pageId)
    );

    if (foundWalkthroughId) {
      walkthroughId = foundWalkthroughId[0];
    }
  }

  if (!walkthroughId) {
    toggleAskForWalkthrough();
    return;
  }

  getAsideContent(walkthroughId);
};

const getAsideContent = async (walkthroughId: string): Promise<void> => {
  const asideColumn = await waitForElement('.main aside');
  const parsedDocument = new DOMParser().parseFromString(html, 'text/html');
  const parsedTemplateDocument = new DOMParser().parseFromString(templatedPageRows, 'text/html');
  const manageWalkthroughResponse = await memoizeFetch(
    `https://www.trueachievements.com/staff/walkthrough/managewalkthrough.aspx?walkthroughid=${walkthroughId}`,
    {},
    { deleteAfter: { value: 4, period: 'hours' } }
  );
  const manageWalkthroughDocument = new DOMParser().parseFromString(manageWalkthroughResponse, 'text/html');
  const supportedStatuses = ['In progress', 'Ready for review', 'Ready for publish'];

  if (
    !supportedStatuses.includes(
      (manageWalkthroughDocument.querySelector('#txtStatusReadOnly') as HTMLInputElement).value
    )
  ) {
    extensionBody.remove();
    pubSub.publish('walkthroughPreview:removeAside');
    return;
  }

  const gameUrl = await getGameUrl(walkthroughId);
  const gameResponse = await memoizeFetch(gameUrl);
  const gameDocument = new DOMParser().parseFromString(gameResponse, 'text/html');

  const thanks = await getWalkthroughThanks(walkthroughId, parsedDocument);
  const achievements = getAchievementsInWalkthrough(
    manageWalkthroughDocument,
    gameDocument,
    parsedDocument,
    parsedTemplateDocument
  );

  let asideContent = [thanks, achievements];

  if (StaffRegex.Walkthroughs.Test.walkthroughPagePreviewUrlWithPageId()) {
    const pages = getPagesInWalkthrough(
      walkthroughId,
      manageWalkthroughDocument,
      parsedDocument,
      parsedTemplateDocument
    );
    asideContent = [pages].concat(asideContent);
  }

  extensionBody.remove();

  asideColumn.append(...asideContent);

  const cachedWalkthroughPreviewWalkthroughId = Cache.walkthroughPreviewWalkthroughId;
  cachedWalkthroughPreviewWalkthroughId.set(
    walkthroughId,
    getPages(manageWalkthroughDocument).map((page) => page.id)
  );
  Cache.walkthroughPreviewWalkthroughId = cachedWalkthroughPreviewWalkthroughId;
};

const getGameUrl = async (walkthroughId: string): Promise<string> => {
  const game = document.querySelector('.walkthroughsummary .games a.gamelink') as HTMLAnchorElement;

  if (game) {
    return game.href;
  }

  const walkthroughPreviewResponse = await memoizeFetch(
    `https://www.trueachievements.com/staff/walkthrough/walkthroughpreview.aspx?walkthroughid=${walkthroughId}`
  );
  const walkthroughPreviewDocument = new DOMParser().parseFromString(walkthroughPreviewResponse, 'text/html');

  return (walkthroughPreviewDocument.querySelector('.walkthroughsummary .games a.gamelink') as HTMLAnchorElement).href;
};

const getPages = (manageWalkthroughDocument: Document): AsideContentPreviewPage[] => {
  return (
    [...manageWalkthroughDocument.querySelectorAll('#scrolllstWalkthroughPages tbody .c2 a')] as HTMLAnchorElement[]
  ).map((page, index) => ({
    index: (index + 1).toString(),
    title: page.innerText,
    id: toInt(extractAllBetween("'", page.href)[1]).toString()
  }));
};

const getPagesInWalkthrough = (
  walkthroughId: string,
  manageWalkthroughDocument: Document,
  featureDocument: Document,
  templateDocument: Document
): HTMLElement => {
  if (!StaffRegex.Walkthroughs.Test.walkthroughPagePreviewUrlWithPageId()) {
    return null;
  }

  const pagesInWalkthroughSection = featureDocument.querySelector(
    `.${Constants.Styles.StaffWalkthroughImprovements.WalkthroughPreview.populateAsideContentWalkthroughPagesJs}`
  );
  const pagesinWalkthroughTable = pagesInWalkthroughSection.querySelector('tbody');
  const clonedSummaryRow = (
    templateDocument.querySelector(
      `#${Constants.Templates.StaffWalkthroughImprovements.WalkthroughPreview.walkthroughPagesSummary}`
    ) as HTMLTemplateElement
  ).content.firstElementChild.cloneNode(true);

  const summaryRow = template(clonedSummaryRow as HTMLElement, {
    urls: {
      walkthroughPreviewWithWalkthroughId: `/staff/walkthrough/walkthroughpreview.aspx?walkthroughid=${walkthroughId}`
    }
  });

  pagesinWalkthroughTable.appendChild(summaryRow);

  getPages(manageWalkthroughDocument).forEach((populateAsideContentPreviewPage) => {
    const pageId = new URLSearchParams(window.location.search).get('pageid');
    const pageRow = (
      pageId === populateAsideContentPreviewPage.id
        ? (templateDocument.querySelector(
            `#${Constants.Templates.StaffWalkthroughImprovements.WalkthroughPreview.walkthroughPagesNumberedSelected}`
          ) as HTMLTemplateElement)
        : (templateDocument.querySelector(
            `#${Constants.Templates.StaffWalkthroughImprovements.WalkthroughPreview.walkthroughPagesNumbered}`
          ) as HTMLTemplateElement)
    ).content.firstElementChild.cloneNode(true);
    const templatedRow = template(pageRow as HTMLElement, {
      populateAsideContentPreviewPage,
      urls: {
        walkthroughPreviewWithPageId: `/staff/walkthrough/walkthroughpagepreview.aspx?pageid=${populateAsideContentPreviewPage.id}`
      }
    });

    pagesinWalkthroughTable.appendChild(templatedRow);
  });

  return pagesInWalkthroughSection as HTMLElement;
};

const getAchievementsInWalkthrough = (
  manageWalkthroughDocument: Document,
  gameDocument: Document,
  featureDocument: Document,
  templateDocument: Document
): HTMLElement => {
  const achievementsInWalkthroughSection = featureDocument.querySelector(
    `.${Constants.Styles.StaffWalkthroughImprovements.WalkthroughPreview.populateAsideContentWalkthroughAchievementsJs}`
  );
  const achievementsInWalkthroughTable = achievementsInWalkthroughSection.querySelector('ul');
  const walkthroughAchievements = [
    ...manageWalkthroughDocument.querySelectorAll('#scrolllstWalkthroughAchievementID tbody tr')
  ] as HTMLElement[];
  const gameAchievements = [...gameDocument.querySelectorAll('main ul.ach-panels li')] as HTMLElement[];
  const achievementsMerged: AsideContentPreviewAchievement[] = [];
  const pages = getPages(manageWalkthroughDocument);

  gameAchievements.forEach((gameAchievement) => {
    const achievementName = (gameAchievement.querySelector('a.title') as HTMLElement).innerText.trim();
    const walkthroughAchievement = walkthroughAchievements.find(
      (walkthroughAchievement) =>
        (walkthroughAchievement.querySelector('.c1') as HTMLElement).innerText.toLowerCase().trim() ===
        achievementName.toLowerCase()
    );

    if (!walkthroughAchievement) {
      return;
    }

    const achievementInfo: AsideContentPreviewAchievement = {
      title: achievementName,
      description: gameAchievement.querySelector('p').innerText,
      page: pages.find(
        (page) =>
          (walkthroughAchievement.querySelector('.c2') as HTMLElement).innerText.trim() === page.index.toString()
      ),
      id: new URL((gameAchievement.querySelector('a.title') as HTMLAnchorElement).href).pathname.split('/')[1].slice(1),
      src: 'https://www.trueachievements.com/imagestore/m/0004101700/4101796.jpg'
    };

    achievementsMerged.push(achievementInfo);
  });

  achievementsMerged.sort((a, b) => toInt(a.page.index) - toInt(b.page.index));

  achievementsMerged.forEach((populateAsideContentPreviewAchievement) => {
    const achievementRow = (
      templateDocument.querySelector(
        `#${Constants.Templates.StaffWalkthroughImprovements.WalkthroughPreview.walkthroughAchievements}`
      ) as HTMLTemplateElement
    ).content.firstElementChild.cloneNode(true);

    const templatedRow = template(achievementRow as HTMLElement, {
      populateAsideContentPreviewAchievement,
      urls: {
        walkthroughPreviewWithPageIdAndAchievementId: `/staff/walkthrough/walkthroughpagepreview.aspx?pageid=${populateAsideContentPreviewAchievement.page.id}#ap${populateAsideContentPreviewAchievement.id}`
      }
    });

    achievementsInWalkthroughTable.appendChild(templatedRow);
  });

  return achievementsInWalkthroughSection as HTMLElement;
};

const getWalkthroughThanks = async (walkthroughId: string, featureDocument: Document): Promise<HTMLElement> => {
  const thanks = featureDocument.querySelector(
    `.${Constants.Styles.StaffWalkthroughImprovements.WalkthroughPreview.populateAsideContentWalkthroughThanksJs}`
  );
  const walkthroughPreviewResponse = await memoizeFetch(
    `https://www.trueachievements.com/staff/walkthrough/walkthroughpreview.aspx?walkthroughid=${walkthroughId}`
  );
  const walkthroughPreviewDocument = new DOMParser().parseFromString(walkthroughPreviewResponse, 'text/html');
  const threadUrl = (walkthroughPreviewDocument.querySelector('.summary dd a') as HTMLAnchorElement).href;

  return template(thanks as HTMLElement, {
    populateAsideContentPreviewThanks: { thread: threadUrl, total: '0' }
  });
};

const toggleAskForWalkthrough = (): void => {
  askForWalkthroughBody.classList.toggle('ta-x-hide');

  if (!askForWalkthroughBody.classList.contains('ta-x-hide')) {
    extensionBody.setAttribute('data-ta-x-loaded', 'true');
  } else {
    extensionBody.removeAttribute('data-ta-x-loaded');
  }
};

export const populateAsideContent = async (): Promise<void> => {
  if (!walkthroughPreview.populateAsideContent) {
    return;
  }

  await applyBody();
  listen();
};

export default { populateAsideContent };
