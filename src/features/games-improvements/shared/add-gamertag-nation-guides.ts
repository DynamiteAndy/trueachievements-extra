import { Constants, ExternalRegex, gamesImprovements } from '@ta-x-globals';
import { deleteMemoizedCorsFetch, memoizeCorsFetch, template } from '@ta-x-helpers';
import { extractText, waitForElement } from '@ta-x-utilities';
import { ImportableGuide } from '@ta-x-models';
import { GamertagNationOptions } from '@ta-x-types';
import templatedAchievementGuideSolution from '@ta-x-views/templates/achievement-guide-solution.html';

class GamertagNation extends ImportableGuide {
  public constructor(opts: GamertagNationOptions) {
    super(opts);
  }

  getAchievementGuide = async (url: string): Promise<void> => {
    const achievementTitle = (
      (await waitForElement('.ach-panel:not([data-secret]) .title')) as HTMLSpanElement
    )?.innerText?.trim();
    const guideResponse = await memoizeCorsFetch(url);
    const guideDocument = new DOMParser().parseFromString(guideResponse, 'text/html');
    const guides = [...guideDocument.querySelectorAll('.content li[id^="guide-"]')].map((el: HTMLLIElement) => ({
      title: (el.querySelector('.user-feed-text a') as HTMLHeadingElement)?.innerText?.trim(),
      href: (el.querySelector('.user-feed-text a') as HTMLAnchorElement)?.href?.trim(),
      guide: ([...el.querySelectorAll('.user-feed-addon')] as HTMLDivElement[]).map((el) => {
        if (el.classList.contains('text-break')) {
          return extractText(el).join('<br>');
        } else if (el.classList.contains('achievement-list')) {
          const achievement = el.querySelector('.achievement-list-title') as HTMLAnchorElement;
          achievement.innerHTML = achievement.innerHTML.trim();
          achievement.setAttribute('href', achievement.href);

          return achievement.outerHTML;
        }

        return '';
      })
    }));

    const guide = guides.find((guide) => guide.title === achievementTitle);

    if (!guide) {
      deleteMemoizedCorsFetch(url);
      return;
    }

    const parsedTemplateDocument = new DOMParser().parseFromString(templatedAchievementGuideSolution, 'text/html');
    const clonedAchievementGuideSolution = (
      parsedTemplateDocument.querySelector(
        `#${Constants.Templates.GamesImprovements.Achievements.achievementGuideSolution}`
      ) as HTMLTemplateElement
    ).content.firstElementChild.cloneNode(true);

    const achievementGuideSolution = template(clonedAchievementGuideSolution as HTMLElement, {
      achievementGuideSolution: {
        name: this.guideName,
        href: `${new URL(url).origin}${new URL(guide.href).pathname}${new URL(guide.href).search}`,
        guide: guide.guide.join('<br>'),
        info: this.guideInfo
      }
    });

    const gamerSideBar = achievementGuideSolution.querySelector('.gamer');
    gamerSideBar.removeChild(gamerSideBar.firstChild);

    let existingGuides = document.querySelector('ul.posts');
    if (!existingGuides) {
      const heading = document.createElement('h2');
      heading.innerText = `How to unlock the ${guide.title} achievement`;
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
  };
}

export const addGamertagNationGuides = async (): Promise<void> => {
  const gamertagNation = new GamertagNation({
    extensionEnabled: gamesImprovements.achievements.gameAchievementsShowGamertagNationGuides,
    extensionSelector: `.${Constants.Styles.GamesImprovements.Achievements.showGamertagNationGuidesJs}`,
    extensionSetting: 'gameAchievementsGamertagNationGuideUrl',
    importableGuideUrlTest: ExternalRegex.Test.gamertagNationGuide,
    guide: {
      name: 'Gamertag Nation',
      info: 'This guide was imported from GamertagNation.com',
      svg: null
    }
  });

  await gamertagNation.applyBody();
  gamertagNation.listen();
};

export default { addGamertagNationGuides };
