import html from '@ta-x-views/staff-walkthrough-improvements.html';
import { Constants } from '@ta-x-globals';
import { classListContains, waitForElement, allConcurrently } from '@ta-x-utilities';
import config from '../../config';
import regex from '../../regex';

// Elements -------
let walkthroughContainer: HTMLElement;
let walkthoughPageVersions: HTMLElement;
let stickyNavBarEnabled: boolean;
let stickyNavBarElement: HTMLElement;

const applyBody = async(): Promise<void> => {
  const parsedDocument = new DOMParser().parseFromString(html, 'text/html');
  walkthoughPageVersions = await waitForElement('#chWalkthroughPageVersions');

  walkthoughPageVersions.parentElement.insertBefore(parsedDocument.querySelector(`.${Constants.Styles.StaffWalkthroughImprovements.WalkthroughPage.containerJs}`),
    walkthoughPageVersions);

  walkthroughContainer = document.querySelector(`.${Constants.Styles.StaffWalkthroughImprovements.WalkthroughPage.containerJs}`);
  walkthroughContainer.appendChild(walkthoughPageVersions);

  allConcurrently(3, [moveWalkthroughPagePreview, applyStickyNavBar, applyEditPageLeft, applyWalkthroughTeamButton]);
};

const moveWalkthroughPagePreview = async(): Promise<void> => {
  const walkthoughPagePreview = await waitForElement('#chWalkthroughPagePreview');
  
  if (walkthoughPagePreview) {
    walkthroughContainer.appendChild(walkthoughPagePreview);
  }
};

const applyStickyNavBar = async(): Promise<void> => {
  if (!config.staffWalkthroughImprovements.stickyPageHistory) return;

  stickyNavBarEnabled = config.stickyHeader.enabled;
  stickyNavBarElement = stickyNavBarEnabled
    ? await waitForElement(`.${Constants.Styles.StickyHeader.featureJs}`)
    : await waitForElement('.header');

  walkthoughPageVersions.classList.add(Constants.Styles.StaffWalkthroughImprovements.WalkthroughPage.stickyPageHistoryJs,
    Constants.Styles.StaffWalkthroughImprovements.WalkthroughPage.stickyPageHistoryStyle);

  setTopStyle(true);
};

const applyEditPageLeft = async(): Promise<void> => {
  if (!config.staffWalkthroughImprovements.editPageLeft) return;

  walkthroughContainer.classList.add(Constants.Styles.StaffWalkthroughImprovements.WalkthroughPage.editPageLeftStyle);

  const editButton = await waitForElement('[id="btnEditPage"], [id="btnEditPage2"]', walkthroughContainer);

  if (editButton) {
    editButton.classList.add(Constants.Styles.StaffWalkthroughImprovements.WalkthroughPage.editPageLeftJs);

    const walkthroughPageButtons =  await waitForElement('.content .buttons', walkthoughPageVersions);

    if (walkthroughPageButtons) {
      walkthroughPageButtons.insertBefore(editButton, walkthroughPageButtons.firstElementChild);
    }
  }
};

const applyWalkthroughTeamButton = async(): Promise<void> => {
  if (!config.staffWalkthroughImprovements.walkthroughTeamButton) return;

  walkthroughContainer.classList.add(Constants.Styles.StaffWalkthroughImprovements.WalkthroughPage.walkthroughTeamButtonStyle);

  const parsedDocument = new DOMParser().parseFromString(html, 'text/html');
  const walkthroughPageButtons =  await waitForElement('.content .buttons', walkthoughPageVersions);

  if (walkthroughPageButtons) {
    walkthroughPageButtons.appendChild(parsedDocument.querySelector(`.${Constants.Styles.StaffWalkthroughImprovements.WalkthroughPage.walkthroughTeamButtonJs}`));
  }
};

const setTopStyle = (noTransitionStyle?: boolean): void => {
  let addAnimation: string;
  let removeAnimation = [Constants.Styles.Animations.yShow, Constants.Styles.Animations.yHide, Constants.Styles.Animations.yHideNoTransition];
  let topStyle = window.pageYOffset - walkthroughContainer.offsetTop + 5;

  const apply = () => {
    document.documentElement.style.setProperty(Constants.Styles.Variables.StaffWalkthroughImprovements.WalkthroughPage.stickyPageHistoryTop, `${topStyle}px`);
    
    walkthoughPageVersions.classList.remove(...removeAnimation);
    if (addAnimation) walkthoughPageVersions.classList.add(addAnimation);
  };

  const atTopOfPage = (): boolean =>
    window.pageYOffset <=
    walkthroughContainer.offsetTop +
      (stickyNavBarEnabled ? stickyNavBarElement.offsetHeight : 0);

  if (!atTopOfPage()) {
    if (stickyNavBarEnabled) {
      if (!stickyNavBarElement.classList.contains(Constants.Styles.Animations.yShow)) {
        addAnimation = noTransitionStyle ? Constants.Styles.Animations.yHideNoTransition : Constants.Styles.Animations.yHide;
        removeAnimation = [Constants.Styles.Animations.yShow];
      } else {
        if (window.pageYOffset <= (window.pageYOffset + stickyNavBarElement.offsetTop)) {
          topStyle += stickyNavBarElement.offsetTop;
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
};

const listen = (): void => {
  if (config.staffWalkthroughImprovements.stickyPageHistory) {
    window.addEventListener('scroll', () => setTopStyle(!classListContains(walkthoughPageVersions, [
      Constants.Styles.Animations.yHideNoTransition,
      Constants.Styles.Animations.yHide,
      Constants.Styles.Animations.yShow
    ])));
  }
};

export default async(): Promise<void> => {
  if (!regex.test.staff.walkthrough.walkthroughPageUrl(window.location.href)) return;

  await applyBody();
  listen();
};
