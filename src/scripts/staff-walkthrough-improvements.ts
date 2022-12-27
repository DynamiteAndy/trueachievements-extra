import * as fs from 'fs';
import config from '../config';
import { Constants } from '../constants';
import { staffEditWalkthroughPage, staffManageWalkthroughPage, staffWalkthroughPage, staffWalkthroughPagePreviewPage, staffWalkthroughPreviewPage } from '../regex';
import { classListContains } from './helpers/html-element-util';
import { waitForElement } from './helpers/wait';

// Elements -------
let walkthroughContainer: HTMLElement;
let walkthoughPageVersions: HTMLElement;
let stickyNavBarEnabled: boolean;
let stickyNavBarElement: HTMLElement;

const atTopOfPage = (): boolean => window.pageYOffset <= (walkthroughContainer.offsetTop + (stickyNavBarEnabled ? stickyNavBarElement.offsetHeight : 0));

const setTopStyle = (noTransitionStyle?: boolean): void => {
  let addAnimation: string;
  let removeAnimation = [Constants.Styles.Animations.yShow, Constants.Styles.Animations.yHide, Constants.Styles.Animations.yHideNoTransition];
  let topStyle = window.pageYOffset - walkthroughContainer.offsetTop + 5;

  const apply = () => {
    document.documentElement.style.setProperty(Constants.Styles.Variables.StaffWalkthroughImprovements.WalkthroughPage.stickyPageHistoryTop, `${topStyle}px`);
    
    walkthoughPageVersions.classList.remove(...removeAnimation);
    if (addAnimation) walkthoughPageVersions.classList.add(addAnimation);
  };

  if (!atTopOfPage()) {
    if (stickyNavBarEnabled) {
      if (!stickyNavBarElement.classList.contains(Constants.Styles.Animations.yShow)) {
        addAnimation = noTransitionStyle ? Constants.Styles.Animations.yHideNoTransition : Constants.Styles.Animations.yHide;
        removeAnimation = [Constants.Styles.Animations.yShow];
      } else {
        if (window.pageYOffset <= (window.pageYOffset + stickyNavBarElement.offsetTop)) {
          topStyle += stickyNavBarElement.offsetTop
        }

        addAnimation = Constants.Styles.Animations.yShow;
        removeAnimation = [Constants.Styles.Animations.yHide, Constants.Styles.Animations.yHideNoTransition];
      }
    } else {
      topStyle -= stickyNavBarElement.offsetHeight;
    }

    if (topStyle >= (stickyNavBarEnabled ? stickyNavBarElement.offsetHeight : 0)) {
      apply();
      return;
    }
  }
  
  if (stickyNavBarEnabled && topStyle >= 0) {
    if (stickyNavBarElement.classList.contains(Constants.Styles.Animations.yShow)) {
      addAnimation = Constants.Styles.Animations.yShow;
      apply();
      return;
    }
  }

  topStyle = 0;
  apply();
}

const applyBody = async(): Promise<void> => {
  document.body.classList.add(Constants.Styles.StaffWalkthroughImprovements.featureJs, Constants.Styles.StaffWalkthroughImprovements.featureStyle);

  if (staffWalkthroughPage(window.location.href)) {
    const html = fs.readFileSync('./src/views/staff-walkthrough-improvements.html', 'utf8');
    const parsedDocument = new DOMParser().parseFromString(html, 'text/html');
    walkthoughPageVersions = await waitForElement('#chWalkthroughPageVersions');
    const walkthoughPagePreview = await waitForElement('#chWalkthroughPagePreview');
  
    walkthoughPageVersions.parentElement.insertBefore(parsedDocument.querySelector(`.${Constants.Styles.StaffWalkthroughImprovements.WalkthroughPage.containerJs}`),
      walkthoughPageVersions);
  
    walkthroughContainer = document.querySelector(`.${Constants.Styles.StaffWalkthroughImprovements.WalkthroughPage.containerJs}`);
    walkthroughContainer.appendChild(walkthoughPageVersions);

    if (walkthoughPagePreview) {
      walkthroughContainer.appendChild(walkthoughPagePreview);

      await applyStickyNavBar();
      await applyEditPageLeft();
      applyWalkthroughTeamButton();
    }
  } else if (staffManageWalkthroughPage(window.location.href)) {
    const html = fs.readFileSync('./src/views/staff-walkthrough-improvements.html', 'utf8');
    const parsedDocument = new DOMParser().parseFromString(html, 'text/html');
    const walkthroughHolder = await waitForElement('#divWalkthroughHolder');

    if (await waitForElement('#lstWalkthroughIDselectedrow') === null) {
      return;
    }

    if (await waitForElement('#chWalkthroughGames') !== null) {
      const editWalkthrough = await waitForElement('#chEditWalkthrough', walkthroughHolder);
      editWalkthrough.after(
        parsedDocument.querySelector(`.${Constants.Styles.StaffWalkthroughImprovements.ManageWalkthroughPage.containerJs}`));

      const sideBarContainer = walkthroughHolder.querySelector(`.${Constants.Styles.StaffWalkthroughImprovements.ManageWalkthroughPage.containerJs}`);
      sideBarContainer.appendChild(await waitForElement('#chWalkthroughGames', walkthroughHolder));
      sideBarContainer.appendChild(await waitForElement('#chWalkthroughAchievements', walkthroughHolder));
      sideBarContainer.appendChild(await waitForElement('#chWalkthroughGamers', walkthroughHolder));
      sideBarContainer.appendChild(await waitForElement('#chWalkthroughOtherSiteLink', walkthroughHolder));

      let buttonsContainer: HTMLElement = null;
      [...document.querySelectorAll('#btnWalkthrough_Options li a')].forEach(button => {
        button.classList.add('button');
  
        if (buttonsContainer === null) {
          buttonsContainer = button.closest('.buttons');
        }
  
        buttonsContainer.appendChild(button);
      })
  
      buttonsContainer.parentNode.insertBefore(buttonsContainer, buttonsContainer.previousElementSibling);
    }
  } else if (staffWalkthroughPreviewPage(window.location.href) || staffWalkthroughPagePreviewPage(window.location.href)) {
    const main = await waitForElement('.page main');
    main.parentElement.classList.add('no-aside');
    main.classList.add('no-aside');

    const aside = await waitForElement('.page aside');
    aside.remove();
  }
};

const applyStickyNavBar = async(): Promise<void> => {
  if (config.staffWalkthroughImprovements.stickyPageHistory) {
    stickyNavBarEnabled = config.stickyHeader.enabled;
    stickyNavBarElement = stickyNavBarEnabled
      ? await waitForElement(`.${Constants.Styles.StickyHeader.featureJs}`)
      : await waitForElement('.header')

    walkthoughPageVersions.classList.add(Constants.Styles.StaffWalkthroughImprovements.WalkthroughPage.stickyPageHistoryJs,
      Constants.Styles.StaffWalkthroughImprovements.WalkthroughPage.stickyPageHistoryStyle);

    setTopStyle(true);
  }
}

const applyEditPageLeft = async(): Promise<void> => {
  if (config.staffWalkthroughImprovements.editPageLeft) {
    walkthroughContainer.classList.add(Constants.Styles.StaffWalkthroughImprovements.WalkthroughPage.editPageLeftStyle);

    const editButton = await waitForElement('[id="btnEditPage"], [id="btnEditPage2"]', walkthroughContainer);
    editButton.classList.add(Constants.Styles.StaffWalkthroughImprovements.WalkthroughPage.editPageLeftJs);
    walkthoughPageVersions.querySelector('.content .buttons')?.appendChild(editButton);
  }
}

const applyWalkthroughTeamButton = (): void => {
  if (config.staffWalkthroughImprovements.walkthroughTeamButton) {
    walkthroughContainer.classList.add(Constants.Styles.StaffWalkthroughImprovements.WalkthroughPage.walkthroughTeamButtonStyle);

    const html = fs.readFileSync('./src/views/staff-walkthrough-improvements.html', 'utf8');
    const parsedDocument = new DOMParser().parseFromString(html, 'text/html');

    walkthoughPageVersions.querySelector('.content .buttons').appendChild(
      parsedDocument.querySelector(`.${Constants.Styles.StaffWalkthroughImprovements.WalkthroughPage.walkthroughTeamButtonJs}`));
  }
}

const listen = (): void => {
  if(config.staffWalkthroughImprovements.enabled && staffWalkthroughPage(window.location.href)) {
    window.addEventListener('scroll', () => setTopStyle(!classListContains(walkthoughPageVersions, [
      Constants.Styles.Animations.yHideNoTransition,
      Constants.Styles.Animations.yHide,
      Constants.Styles.Animations.yShow
    ])));
  }
};

export const render = async(): Promise<void> => {
  if (!config.staffWalkthroughImprovements.enabled) return;
  if (!staffManageWalkthroughPage(window.location.href) && !staffWalkthroughPage(window.location.href) &&
    !staffEditWalkthroughPage(window.location.href) && !staffWalkthroughPreviewPage(window.location.href) &&
    !staffWalkthroughPagePreviewPage(window.location.href)) return;

  await applyBody();
  listen();
};
