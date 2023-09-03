import { pubSub } from '@ta-x-components';
import { Constants } from '@ta-x-globals';
import { applyStickyElementStyle } from '@ta-x-helpers';
import { classListContains, waitForElement } from '@ta-x-utilities';

let tinymceContainer: HTMLElement;
let tinymceToolbar: HTMLElement;
const variableProperty =
  Constants.Styles.Variables.StaffWalkthroughImprovements.EditWalkthroughPage.stickyTinymceToolbarTop;

const listen = async (): Promise<void> => {
  window.addEventListener('scroll', async () => {
    await applyStickyElementStyle(variableProperty, tinymceToolbar, tinymceContainer, {
      noTransitionStyle: !classListContains(tinymceToolbar, [
        Constants.Styles.Animations.yHideNoTransition,
        Constants.Styles.Animations.yHide,
        Constants.Styles.Animations.yShow
      ]),
      isRelativeToParent: true
    });

    setTimeout(() => pubSub.publish('tinymce:repositionFloatingMenus'), 250);
  });
};

export const setFullWidthToolbar = async (container: HTMLElement): Promise<void> => {
  tinymceContainer = container;
  tinymceToolbar = await waitForElement('.mce-container-body .mce-toolbar-grp', container);

  if (!tinymceToolbar) {
    return;
  }

  tinymceToolbar.classList.add(
    Constants.Styles.StaffWalkthroughImprovements.EditWalkthroughPage.stickyTinymceToolbarStyles
  );
  document.documentElement.style.setProperty(
    Constants.Styles.Variables.StaffWalkthroughImprovements.EditWalkthroughPage.stickyTinymceToolbarWidth,
    `${tinymceToolbar.parentElement.scrollWidth}px`
  );

  await applyStickyElementStyle(variableProperty, tinymceToolbar, tinymceContainer, {
    noTransitionStyle: true,
    isRelativeToParent: true
  });
  await listen();
};

export default { setFullWidthToolbar };
