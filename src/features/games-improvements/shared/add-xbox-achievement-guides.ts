import { AchievementsRegex, Cache, Constants, ExternalRegex } from '@ta-x-globals';
import { waitForElement } from '@ta-x-utilities';
import { deleteMemoizedCorsFetch, memoizeCorsFetch, template } from '@ta-x-helpers';
import templatedAchievementGuideSolution from '@ta-x-views/templates/achievement-guide-solution.html';
import svg from '@ta-x-svgs/xboxachievements-icon.hbs';
import html from './xbox-achievements.hbs';

// Elements -------
let extensionBody: HTMLElement;
let askForLinkBody: HTMLElement;

const applyBody = async (): Promise<void> => {
  const parsedDocument = new DOMParser().parseFromString(html, 'text/html');
  const asideColumn = await waitForElement('.main aside');
  const firstSection = await waitForElement('section:not(.smallpanel)', asideColumn);

  asideColumn.insertBefore(
    parsedDocument.querySelector(`.${Constants.Styles.GamesImprovements.Achievements.showXboxAchievementGuidesJs}`),
    firstSection
  );

  extensionBody = asideColumn.querySelector(
    `.${Constants.Styles.GamesImprovements.Achievements.showXboxAchievementGuidesJs}`
  );
  askForLinkBody = extensionBody.querySelector(`.${Constants.Styles.Components.AskLoader.askJs}`);

  await getAchievementWalkthroughUrl();
};

const listen = (): void => {
  const button = extensionBody.querySelector(`.${Constants.Styles.Components.AskLoader.buttonJs}`);
  const input = extensionBody.querySelector(`.${Constants.Styles.Components.AskLoader.inputJs}`) as HTMLInputElement;

  button.addEventListener('click', async (e: Event) => {
    if (!(e.target as Element)?.nodeName) {
      return;
    }

    e.preventDefault();
    e.stopPropagation();

    try {
      if (!input.value) {
        return;
      }

      if (!ExternalRegex.Test.xboxAchievementsGuide(input.value)) {
        return;
      }

      toggleAskForLink();

      if (AchievementsRegex.Test.achievementUrl()) {
        await getAchievementGuide(input.value);
      } else {
        hideBody();
      }
    } catch {
      return;
    }
  });
};

const getGameName = () =>
  new URL((document.querySelector('.game h2 a') as HTMLAnchorElement).href).pathname.slice(1).split('/')[1];

const getAchievementWalkthroughUrl = async (): Promise<void> => {
  const cachedXboxAchievementGuideUrls = Cache.gameAchievementsXboxAchievementsGuideUrl;
  const gameName = getGameName();
  const url = cachedXboxAchievementGuideUrls.get(gameName);

  if (!url) {
    toggleAskForLink();
    return;
  }

  if (AchievementsRegex.Test.achievementUrl()) {
    await getAchievementGuide(url);
  } else {
    hideBody();
  }
};

const getAchievementGuide = async (url: string): Promise<void> => {
  const achievementTitle = (
    (await waitForElement('.ach-panel:not([data-secret]) .title')) as HTMLSpanElement
  )?.innerText?.trim();
  const guideResponse = await memoizeCorsFetch(url);
  const guideDocument = new DOMParser().parseFromString(guideResponse, 'text/html');
  const achievementGuides = [...guideDocument.querySelectorAll('.achilist .achilist__guide')].map(
    (el: HTMLLIElement) => ({
      title: (el.querySelector('.achilist__title') as HTMLHeadingElement)?.innerText?.trim(),
      href: (el.querySelector('.achilist__header a') as HTMLAnchorElement)?.href?.trim(),
      description: (el.querySelector('.achilist__data > p') as HTMLParagraphElement)?.innerText?.trim(),
      guide: ([...el.querySelectorAll('.text_res')] as HTMLDivElement[]).map((el) => {
        const guide = el.innerHTML.trim();
        return guide;
      })
    })
  );

  const achievementGuide = achievementGuides.find((guide) => guide.title === achievementTitle);
  const cachedXboxAchievementGuideUrls = Cache.gameAchievementsXboxAchievementsGuideUrl;
  const gameName = getGameName();

  if (!cachedXboxAchievementGuideUrls.has(gameName)) {
    cachedXboxAchievementGuideUrls.set(gameName, url);
    Cache.gameAchievementsXboxAchievementsGuideUrl = cachedXboxAchievementGuideUrls;
  }

  if (achievementGuide) {
    const parsedTemplateDocument = new DOMParser().parseFromString(templatedAchievementGuideSolution, 'text/html');
    const parsedSvgDocument = new DOMParser()
      .parseFromString(svg, 'text/html')
      .body.firstElementChild.cloneNode(true) as HTMLElement;
    const clonedAchievementGuideSolution = (
      parsedTemplateDocument.querySelector(
        `#${Constants.Templates.GamesImprovements.Achievements.achievementGuideSolution}`
      ) as HTMLTemplateElement
    ).content.firstElementChild.cloneNode(true);

    const achievementGuideSolution = template(clonedAchievementGuideSolution as HTMLElement, {
      achievementGuideSolution: {
        name: '360Achievements',
        href: `${new URL(url).origin}${new URL(achievementGuide.href).pathname}`,
        guide: achievementGuide.guide.join('<br>'),
        info: 'This guide was imported from 360Achievements.com'
      }
    });

    parsedSvgDocument.classList.add('ta-x-xboxachievements-icon');

    const gamerSideBar = achievementGuideSolution.querySelector('.gamer');
    gamerSideBar.removeChild(gamerSideBar.firstChild);
    gamerSideBar.prepend(parsedSvgDocument);

    let existingGuides = document.querySelector('ul.posts');
    if (!existingGuides) {
      const heading = document.createElement('h2');
      heading.innerText = `How to unlock the ${achievementGuide.title} achievement`;
      heading.classList.add('block', 'topmargin');
      heading.id = 'oSolutions';

      const achievementGuides = document.createElement('ul');
      achievementGuides.classList.add('posts');

      const elBeforeUl = document.querySelector('main .nn_player_w');
      elBeforeUl.parentElement.insertBefore(heading, elBeforeUl.nextElementSibling);
      elBeforeUl.parentElement.insertBefore(achievementGuides, heading.nextElementSibling);

      existingGuides = document.querySelector('ul.posts');
    }

    existingGuides.prepend(achievementGuideSolution);
  } else {
    deleteMemoizedCorsFetch(url);
  }

  hideBody();
};

const toggleAskForLink = (): void => {
  askForLinkBody.classList.toggle('ta-x-hide');

  if (!askForLinkBody.classList.contains('ta-x-hide')) {
    extensionBody.setAttribute('data-ta-x-loaded', 'true');
  } else {
    extensionBody.removeAttribute('data-ta-x-loaded');
  }
};

const hideBody = (): void => {
  extensionBody.setAttribute('data-ta-x-loaded', 'true');
  extensionBody.classList.add('ta-x-hide');
};

export const addXboxAchievementGuides = async (): Promise<void> => {
  if (!(await waitForElement('.game h2 a'))) {
    return;
  }

  await applyBody();
  listen();
};

export default { addXboxAchievementGuides };
