import { Constants } from '@ta-x-globals';
import { getElementCoordinates, waitForElement } from '@ta-x-utilities';

let tinymceToolbar: HTMLElement;
const variableProperty = Constants.Styles.Variables.StaffWalkthroughImprovements.EditWalkthroughPage.stickyTinymceToolbarFloatingMenu;

const setTopPosition = (): void => {
  const actualTopPosition = getElementCoordinates(tinymceToolbar);
  document.documentElement.style.setProperty(variableProperty, `${tinymceToolbar.offsetHeight + actualTopPosition.top}px`);
};

const listen = (): void => {
  window.addEventListener('scroll', setTopPosition);
};

export const fixTinymceFloatingMenus = async(): Promise<void> => {
  const tinymceContainer = await waitForElement('.mce-tinymce');
  tinymceToolbar = await waitForElement('.mce-tinymce .mce-container-body .mce-toolbar-grp', tinymceContainer);

  if (!tinymceContainer || !tinymceToolbar) return;
  
  setTopPosition();
  listen();
};

export default { fixTinymceFloatingMenus };