import type { PubSubType } from '@ta-x-types';

type Events = {
  'ajaxIntercept:request': XMLHttpRequest;
  'ajaxIntercept:response': XMLHttpRequest;
  'snackbar:show': { text: string; type: string; timeoutMS?: number };
  'hideableRow:hide': { element: HTMLElement; method: 'forum' | 'table'; filterText?: string };
  'accordion:setMaxHeight': HTMLElement;
  'accordion:toggleState': HTMLElement;
  'tabs:set': HTMLElement;
  'tabs:hide': HTMLElement;
  'tabs:delete': HTMLElement;
  'tinymce:repositionFloatingMenus': null;
  'walkthroughPreview:removeAside': null;
  'test:subscribeEvent': string;
  'test:unsubscribeEvent': string;
};

function PubSub<E extends Record<string, unknown>>(): PubSubType<E> {
  const handlers: { [K in keyof E]?: Array<(msg: E[K]) => void> } = {};

  return {
    publish: (event, msg) => {
      handlers[event]?.forEach((h) => h(msg));
    },

    subscribe: (event, callback) => {
      (handlers[event] ??= []).push(callback);
      return callback;
    },

    unsubscribe: (event, callback) => {
      const list = handlers[event] ?? [];
      handlers[event] = list.filter((h) => h !== callback);
    }
  };
}

export default PubSub<Events>();