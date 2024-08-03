import { JSDOM } from 'jsdom';

class DOMParser {
  parseFromString(data: string, mimeType?: undefined): Document {
    const dom = new JSDOM(data, { contentType: mimeType });
    return dom.window.document;
  }
}

global.DOMParser = DOMParser;
