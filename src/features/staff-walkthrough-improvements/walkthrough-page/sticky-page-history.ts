import { Constants, walkthroughPage } from '@ta-x-globals';
import { applyStickyElementStyle } from '@ta-x-helpers';
import { classListContains } from '@ta-x-utilities';

let walkthroughContainer: HTMLElement;
let walkthoughPageVersions: HTMLElement;
const variableProperty = Constants.Styles.Variables.StaffWalkthroughImprovements.WalkthroughPage.stickyPageHistoryTop;

const listen = async (): Promise<void> => {
  window.addEventListener(
    'scroll',
    async () =>
      await applyStickyElementStyle(variableProperty, walkthoughPageVersions, walkthroughContainer, {
        noTransitionStyle: !classListContains(walkthoughPageVersions, [
          Constants.Styles.Animations.yHideNoTransition,
          Constants.Styles.Animations.yHide,
          Constants.Styles.Animations.yShow
        ]),
        paddingFromTop: 5
      })
  );
};

export const setPageHistorySticky = async (container: HTMLElement, pageVersions: HTMLElement): Promise<void> => {
  if (!walkthroughPage.stickyPageHistory) return;
  if (!container || !pageVersions) return;

  walkthroughContainer = container;
  walkthoughPageVersions = pageVersions;

  pageVersions.classList.add(
    Constants.Styles.StaffWalkthroughImprovements.WalkthroughPage.stickyPageHistoryJs,
    Constants.Styles.StaffWalkthroughImprovements.WalkthroughPage.stickyPageHistoryStyle
  );

  await applyStickyElementStyle(variableProperty, pageVersions, container, {
    noTransitionStyle: true,
    paddingFromTop: 5
  });
  await listen();
};

export default { setPageHistorySticky };
