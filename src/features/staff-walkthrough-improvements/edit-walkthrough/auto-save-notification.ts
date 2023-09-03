import { pubSub } from '@ta-x-components';
import { AjaxRegex, editWalkthrough } from '@ta-x-globals';

export const autoSaveNotification = async (): Promise<void> => {
  if (!editWalkthrough.autoSaveNotification) {
    return;
  }

  pubSub.subscribe('ajaxIntercept:response', (response: XMLHttpRequest) => {
    if (!AjaxRegex.Test.autosave(response.responseURL)) {
      return;
    }

    pubSub.publish('snackbar:show', {
      text: response.status === 200 ? 'Autosave successful.' : 'Autosave failed.',
      type: response.status === 200 ? 'success' : 'danger'
    });
  });
};

export default { autoSaveNotification };
