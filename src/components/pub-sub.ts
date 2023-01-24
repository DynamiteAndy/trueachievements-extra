import { PubSubType } from '@ta-x-types';

type Events = {
  'ajaxIntercept:request': XMLHttpRequest;
  'ajaxIntercept:response': XMLHttpRequest;
  'snackbar:show': { text: string, type: string };
  'accordion:setMaxHeight': HTMLElement;
  'accordion:toggleState': HTMLElement;
  'tinymce:repositionFloatingMenus': null;
  'walkthroughPreview:removeAside': null;
};

function PubSub<E>(): PubSubType<E> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handlers: { [key: string]: any[] } = {};

  return {
    publish: (event, msg) => {
      (handlers[event] ?? []).forEach((h) => h(msg));
    },

    subscribe: (event, callback) => {
      const list = handlers[event] ?? [];
      list.push(callback);
      handlers[event] = list;

      return callback;
    },

    unsubscribe: (event, callback) => {
      let list = handlers[event] ?? [];
      list = list.filter((h) => h !== callback);
      handlers[event] = list;
    }
  };
}

export default PubSub<Events>();