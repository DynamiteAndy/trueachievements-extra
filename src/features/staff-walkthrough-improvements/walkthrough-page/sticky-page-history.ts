import { Constants, stickyHeader, walkthroughPage } from '@ta-x-globals';
import { classListContains, waitForElement } from '@ta-x-utilities';

let stickyNavBarEnabled: boolean;
let stickyNavBarElement: HTMLElement;
let walkthroughContainer: HTMLElement;
let walkthoughPageVersions: HTMLElement;

const setTopStyle = (noTransitionStyle?: boolean): void => {
  let addAnimation: string;
  let removeAnimation = [Constants.Styles.Animations.yShow, Constants.Styles.Animations.yHide, Constants.Styles.Animations.yHideNoTransition];
  let topStyle = window.pageYOffset - walkthroughContainer.offsetTop + 5;

  const apply = () => {
    document.documentElement.style.setProperty(Constants.Styles.Variables.StaffWalkthroughImprovements.WalkthroughPage.stickyPageHistoryTop, `${topStyle}px`);
    
    walkthoughPageVersions.classList.remove(...removeAnimation);
    if (addAnimation) walkthoughPageVersions.classList.add(addAnimation);
  };

  const atTopOfPage = (): boolean => window.pageYOffset <= walkthroughContainer.offsetTop + (stickyNavBarEnabled ? stickyNavBarElement.offsetHeight : 0);

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
  window.addEventListener('scroll', () => setTopStyle(!classListContains(walkthoughPageVersions, [
    Constants.Styles.Animations.yHideNoTransition,
    Constants.Styles.Animations.yHide,
    Constants.Styles.Animations.yShow
  ])));
};

export const setPageHistorySticky = async(container: HTMLElement, pageVersions: HTMLElement): Promise<void> => {
  if (!walkthroughPage.stickyPageHistory) return;
  if (!container || !pageVersions) return;

  walkthroughContainer = container;
  walkthoughPageVersions = pageVersions;
  stickyNavBarEnabled = stickyHeader.enabled;
  stickyNavBarElement = stickyNavBarEnabled
    ? await waitForElement(`.${Constants.Styles.StickyHeader.featureJs}`)
    : await waitForElement('.header');

  pageVersions.classList.add(Constants.Styles.StaffWalkthroughImprovements.WalkthroughPage.stickyPageHistoryJs,
    Constants.Styles.StaffWalkthroughImprovements.WalkthroughPage.stickyPageHistoryStyle);

  setTopStyle(true);
  listen();
};

export default { setPageHistorySticky };