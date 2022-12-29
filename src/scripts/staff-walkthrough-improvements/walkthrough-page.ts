import * as fs from 'fs';
import { log } from 'missionlog';
import config from '../../config';
import { Constants } from '../../constants';
import regex from '../../regex';
import { classListContains } from '../helpers/html-element-util';
import { waitForElement } from '../helpers/wait';
import { allConcurrently } from '../components/promise';


// Elements -------
let walkthroughContainer: HTMLElement;
let walkthoughPageVersions: HTMLElement;
let stickyNavBarEnabled: boolean;
let stickyNavBarElement: HTMLElement;

const applyBody = async(): Promise<void> => {
  log.debug('Walkthrough-Page', 'Started - applyBody');

  const html = fs.readFileSync('./src/views/staff-walkthrough-improvements.html', 'utf8');
  const parsedDocument = new DOMParser().parseFromString(html, 'text/html');
  walkthoughPageVersions = await waitForElement('#chWalkthroughPageVersions');

  walkthoughPageVersions.parentElement.insertBefore(parsedDocument.querySelector(`.${Constants.Styles.StaffWalkthroughImprovements.WalkthroughPage.containerJs}`),
    walkthoughPageVersions);

  walkthroughContainer = document.querySelector(`.${Constants.Styles.StaffWalkthroughImprovements.WalkthroughPage.containerJs}`);
  walkthroughContainer.appendChild(walkthoughPageVersions);

  allConcurrently(3, [moveWalkthroughPagePreview, applyStickyNavBar, applyEditPageLeft, applyWalkthroughTeamButton]);

  log.debug('Walkthrough-Page', 'Finished - applyBody');
};

const moveWalkthroughPagePreview = async(): Promise<void> => {
  const walkthoughPagePreview = await waitForElement('#chWalkthroughPagePreview');
  
  if (walkthoughPagePreview) {
    walkthroughContainer.appendChild(walkthoughPagePreview);
  } else {
    log.warn('Walkthrough-Page', 'moveWalkthroughPagePreview - did not find walkthrough preview');
  }
};

const applyStickyNavBar = async(): Promise<void> => {
  if (!config.staffWalkthroughImprovements.stickyPageHistory) return;

  log.debug('Walkthrough-Page', 'Started - applyStickyNavBar');

  stickyNavBarEnabled = config.stickyHeader.enabled;
  stickyNavBarElement = stickyNavBarEnabled
    ? await waitForElement(`.${Constants.Styles.StickyHeader.featureJs}`)
    : await waitForElement('.header');

  walkthoughPageVersions.classList.add(Constants.Styles.StaffWalkthroughImprovements.WalkthroughPage.stickyPageHistoryJs,
    Constants.Styles.StaffWalkthroughImprovements.WalkthroughPage.stickyPageHistoryStyle);

  setTopStyle(true);

  log.debug('Walkthrough-Page', 'Finished - applyStickyNavBar');
};

const applyEditPageLeft = async(): Promise<void> => {
  if (!config.staffWalkthroughImprovements.editPageLeft) return;

  log.debug('Walkthrough-Page', 'Started - applyEditPageLeft');

  walkthroughContainer.classList.add(Constants.Styles.StaffWalkthroughImprovements.WalkthroughPage.editPageLeftStyle);

  const editButton = await waitForElement('[id="btnEditPage"], [id="btnEditPage2"]', walkthroughContainer);

  if (editButton) {
    editButton.classList.add(Constants.Styles.StaffWalkthroughImprovements.WalkthroughPage.editPageLeftJs);

    const walkthroughPageButtons =  await waitForElement('.content .buttons', walkthoughPageVersions);

    if (walkthroughPageButtons) {
      walkthroughPageButtons.insertBefore(editButton, walkthroughPageButtons.firstElementChild);
    } else {
      log.warn('Walkthrough-Page', 'applyEditPageLeft - did not find walkthrough buttons on page versions element');
    }
  } else {
    log.warn('Walkthrough-Page', 'applyEditPageLeft - did not find walkthrough edit page buttons on walkthrough preview');
  }

  log.debug('Walkthrough-Page', 'Finished - applyEditPageLeft');
};

const applyWalkthroughTeamButton = async(): Promise<void> => {
  if (!config.staffWalkthroughImprovements.walkthroughTeamButton) return;

  log.debug('Walkthrough-Page', 'Started - applyWalkthroughTeamButton');

  walkthroughContainer.classList.add(Constants.Styles.StaffWalkthroughImprovements.WalkthroughPage.walkthroughTeamButtonStyle);

  const html = fs.readFileSync('./src/views/staff-walkthrough-improvements.html', 'utf8');
  const parsedDocument = new DOMParser().parseFromString(html, 'text/html');
  const walkthroughPageButtons =  await waitForElement('.content .buttons', walkthoughPageVersions);

  if (walkthroughPageButtons) {
    walkthroughPageButtons.appendChild(parsedDocument.querySelector(`.${Constants.Styles.StaffWalkthroughImprovements.WalkthroughPage.walkthroughTeamButtonJs}`));
  } else {
    log.warn('Walkthrough-Page', 'applyWalkthroughTeamButton - did not find walkthrough buttons on page versions element');
  }

  log.debug('Walkthrough-Page', 'Finished - applyWalkthroughTeamButton');
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
  log.debug('Walkthrough-Preview', 'Started - listen');

  if (config.staffWalkthroughImprovements.stickyPageHistory) {
    log.debug('Walkthrough-Page', 'Starting stickyPageHistory - listen');

    window.addEventListener('scroll', () => setTopStyle(!classListContains(walkthoughPageVersions, [
      Constants.Styles.Animations.yHideNoTransition,
      Constants.Styles.Animations.yHide,
      Constants.Styles.Animations.yShow
    ])));

    log.debug('Walkthrough-Page', 'Finished stickyPageHistory - listen');
  }

  log.debug('Walkthrough-Page', 'Finished - listen');
};

export default async(): Promise<void> => {
  if (!regex.test.staff.walkthrough.walkthroughPageUrl(window.location.href)) return;

  log.debug('Walkthrough-Page', 'Started');

  await applyBody();
  listen();

  log.debug('Walkthrough-Page', 'Finished');
};
