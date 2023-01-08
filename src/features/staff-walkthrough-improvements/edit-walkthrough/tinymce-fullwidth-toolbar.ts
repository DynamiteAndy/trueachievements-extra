import { Constants } from '@ta-x-globals';
import { applyStickyElementStyle } from '@ta-x-helpers';
import { classListContains, waitForElement } from '@ta-x-utilities';

let tinymceContainer: HTMLElement;
let tinymceToolbar: HTMLElement;
const variableProperty = Constants.Styles.Variables.StaffWalkthroughImprovements.EditWalkthroughPage.stickyTinymceToolbarTop;

const listen = async (): Promise<void> => {
  window.addEventListener('scroll', async() => await applyStickyElementStyle(variableProperty, tinymceToolbar, tinymceContainer,
    {
      noTransitionStyle: !classListContains(tinymceToolbar, [
        Constants.Styles.Animations.yHideNoTransition,
        Constants.Styles.Animations.yHide,
        Constants.Styles.Animations.yShow
      ]),
      isRelativeToParent: true
  }));
};

export const fixTinymceFullWidthToolbar = async(): Promise<void> => {
  tinymceContainer = await waitForElement('.mce-tinymce');
  tinymceToolbar = await waitForElement('.mce-tinymce .mce-container-body .mce-toolbar-grp', tinymceContainer);

  if (!tinymceContainer || !tinymceToolbar) return;
  
  tinymceToolbar.classList.add(Constants.Styles.StaffWalkthroughImprovements.EditWalkthroughPage.stickyTinymceToolbarStyles);
  document.documentElement.style.setProperty(Constants.Styles.Variables.StaffWalkthroughImprovements.EditWalkthroughPage.stickyTinymceToolbarWidth, `${tinymceToolbar.parentElement.scrollWidth}px`);

  await applyStickyElementStyle(variableProperty, tinymceToolbar, tinymceContainer, { noTransitionStyle: true, isRelativeToParent: true });
  await listen();
};

export default { fixTinymceFullWidthToolbar };