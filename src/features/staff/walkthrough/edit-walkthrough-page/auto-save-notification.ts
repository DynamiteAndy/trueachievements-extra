import { httpIntercept } from '@ta-x-fetch';
import { AjaxRegex } from '@ta-x-site';
import { settings, whileSetting } from '@ta-x-storage';
import { showToast } from '@ta-x-ui';

const { editWalkthroughPage } = settings.staff.walkthrough;

// On the edit page (the entry checks), says how each of the site's autosaves went, while the setting is on: applied
// live, so turning it off in the menu stops listening at once. Returns the stop
export const autoSaveNotification = (): (() => void) =>
  whileSetting(
    [editWalkthroughPage.autoSaveNotification],
    () => editWalkthroughPage.autoSaveNotification.value,
    () =>
      httpIntercept.onResponse(({ req, res }) => {
        if (!AjaxRegex.Test.autosave(req.url)) {
          return;
        }

        showToast({
          text: res.status === 200 ? 'Autosave successful.' : 'Autosave failed.',
          type: res.status === 200 ? 'success' : 'danger'
        });
      })
  );
