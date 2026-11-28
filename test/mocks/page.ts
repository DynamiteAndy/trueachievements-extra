import { toastMessage } from '@ta-x-ui';

import { settingsMenuOpen } from '../../src/features/all-pages/settings-menu/settings-menu-open';

// Each test starts on an empty page (setHtml loads a fixture into it), with no toast message waiting and the settings
// menu shut: page-wide state a test leaves behind, which would otherwise show up in the next. Mounts unmount themselves
// when their test ends (mountInPage, mountForTest), before this runs
beforeEach(() => {
  document.body?.replaceChildren();
  toastMessage.value = null;
  settingsMenuOpen.value = false;
});
