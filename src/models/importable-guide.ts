import { waitForElement } from '@ta-x-utilities';
import { ImportableGuideOptions } from '@ta-x-types';
import { AchievementsRegex, Constants, Cache } from '@ta-x-globals';
import { pubSub } from '@ta-x-components';

export class ImportableGuide {
  private extensionEnabled: boolean;
  private extensionSelector: string;
  private extensionSetting: string;

  private importableGuideUrlTest: (str?: string) => boolean;

  public guideName: string;
  public guideInfo: string;
  public guideIcon: string;
  public guideIconClass: string;

  private extensionBody: HTMLElement;
  private askForLinkBody: HTMLElement;

  public constructor(opts: ImportableGuideOptions) {
    this.extensionEnabled = opts.extensionEnabled;
    this.extensionSelector = opts.extensionSelector;
    this.extensionSetting = opts.extensionSetting;
    this.importableGuideUrlTest = opts.importableGuideUrlTest;
    this.guideName = opts.guide.name;
    this.guideInfo = opts.guide.info;
    this.guideIcon = opts.guide.svg.svgHTML;
    this.guideIconClass = opts.guide.svg.svgClass;
  }

  public applyBody = async (): Promise<void> => {
    const asideColumn = await waitForElement('.main aside');

    this.extensionBody = asideColumn.querySelector(this.extensionSelector);
    this.askForLinkBody = this.extensionBody.querySelector(`.${Constants.Styles.Components.AskLoader.askJs}`);

    if (this.extensionEnabled) {
      await this.getAchievementWalkthroughUrl();
    } else {
      this.hideBody();
    }
  };

  public listen = (): void => {
    const button = this.extensionBody.querySelector(`.${Constants.Styles.Components.AskLoader.buttonJs}`);
    const input = this.extensionBody.querySelector(
      `.${Constants.Styles.Components.AskLoader.inputJs}`
    ) as HTMLInputElement;

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

        if (!this.importableGuideUrlTest(input.value)) {
          return;
        }

        this.toggleAskForLink();
        this.saveAchievementWalkthroughUrl(input.value);

        if (AchievementsRegex.Test.achievementUrl()) {
          await this.getAchievementGuide(input.value);
        }

        this.hideBody();
      } catch {
        return;
      }
    });
  };

  public getAchievementGuide = async (url: string): Promise<void> => {
    throw `Not implemented for ${url}`;
  };

  private getGameName = (): string => {
    return new URL((document.querySelector('.game h2 a') as HTMLAnchorElement).href).pathname.slice(1).split('/')[1];
  };

  private getAchievementWalkthroughUrl = async (): Promise<void> => {
    const cachedGuideUrls = Cache[this.extensionSetting];
    const gameName = this.getGameName();
    const url = cachedGuideUrls.get(gameName);

    if (!url) {
      this.toggleAskForLink();
      return;
    }

    if (AchievementsRegex.Test.achievementUrl()) {
      await this.getAchievementGuide(url);
    }

    this.hideBody();
  };

  private saveAchievementWalkthroughUrl = (url: string) => {
    const cachedGuideUrls = Cache[this.extensionSetting];
    const gameName = this.getGameName();

    if (!cachedGuideUrls.has(gameName)) {
      cachedGuideUrls.set(gameName, url);
      Cache[this.extensionSetting] = cachedGuideUrls;
    }
  };

  private toggleAskForLink = (): void => {
    this.askForLinkBody.classList.toggle('ta-x-hide');

    if (!this.askForLinkBody.classList.contains('ta-x-hide')) {
      this.extensionBody.setAttribute('data-ta-x-loaded', 'true');
    } else {
      this.extensionBody.removeAttribute('data-ta-x-loaded');
    }
  };

  private hideBody = (): void => {
    this.extensionBody.setAttribute('data-ta-x-loaded', 'true');
    this.extensionBody.classList.add('ta-x-hide');

    pubSub.publish('tabs:hide', this.extensionBody);
  };
}
