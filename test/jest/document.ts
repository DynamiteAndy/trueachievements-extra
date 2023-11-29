import { JSDOM } from 'jsdom';
import fs from 'fs-extra';
import getPathByAlias from './get-path-by-alias';

const polyFill = (jsdom: JSDOM) => {
  global.window = jsdom.window as unknown as Window & typeof globalThis;
  global.document = global.window.document;
  global.HTMLElement = global.window.HTMLElement;
  global.HTMLInputElement = global.window.HTMLInputElement;
  global.MutationObserver = global.window.MutationObserver;
  global.Event = global.window.Event;
  global.CustomEvent = global.window.CustomEvent;

  class Image extends window.Image {
    private srcValue: string;
    private completeValue: boolean;

    constructor() {
      super();

      Object.defineProperty(this, 'complete', {
        get() {
          return this.completeValue;
        },
        set(value: boolean) {
          this.completeValue = value;
        },
        configurable: true,
        enumerable: true
      });

      Object.defineProperty(this, 'src', {
        get() {
          return this.srcValue;
        },
        set(value: string) {
          this.srcValue = value;

          if (value === 'load-image.jpg' || value === 'error-image.jpg') {
            this.complete = false;

            const eventName = value === 'load-image.jpg' ? 'load' : 'error';

            setTimeout(() => {
              this.dispatchEvent(new Event(eventName));
            }, 250);
          } else {
            this.complete = true;
          }
        },
        configurable: true,
        enumerable: true
      });
    }
  }

  global.Image = Image;
};

export const setHtml = (path: string, opts?: { url?: string }): void => {
  const html = fs.readFileSync(getPathByAlias(path));
  polyFill(new JSDOM(html, opts));
};

polyFill(new JSDOM());
