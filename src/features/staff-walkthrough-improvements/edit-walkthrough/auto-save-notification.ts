import { broadcast, subscribe } from '@ta-x-components';
import { AjaxRegex, editWalkthrough } from '@ta-x-globals';

export const autoSaveNotification = async(): Promise<void> => {
  if (!editWalkthrough.autoSaveNotification) return;

  subscribe('ajaxIntercept:response', (response: XMLHttpRequest) => {
    if (!AjaxRegex.Test.autosave(response.responseURL)) return;

    if (response.status === 200) {
      broadcast('snackbar:show', undefined, {
        text: 'Autosave successful.',
        type: 'success'
      });
    } else {
      broadcast('snackbar:show', undefined, {
        text: 'Autosave failed.',
        type: 'danger'
      });
    }
  });
};

export default { autoSaveNotification };