import sanitizeHtml from 'sanitize-html';

let spyGet;
let spySet;

export const createSpies = () => {
  Object.defineProperty(Object.prototype, 'innerText', {
    get: () => undefined,
    set: () => undefined,
    configurable: true
  });

  // eslint-disable-next-line @typescript-eslint/ban-types
  spyGet = jest.spyOn(Object.prototype, 'innerText' as keyof Object, 'get');
  spyGet.mockImplementation(function () {
    if (this.textContent === undefined) {
      return undefined;
    }

    return sanitizeHtml(this.textContent, {
      allowedTags: [],
      allowedAttributes: {}
    })
      .split('\\n')
      .filter((text: string) => text && !text.match(/^\\s+$/))
      .map((text: string) => text.trim())
      .join('\\n')
      .replace(/\s+/g, ' ')
      .trim();
  });

  // eslint-disable-next-line @typescript-eslint/ban-types
  spySet = jest.spyOn(Object.prototype, 'innerText' as keyof Object, 'set');
  spySet.mockImplementation(function (value: unknown) {
    this.textContent = value;
  });
};

afterEach(() => {
  spyGet?.mockRestore();
  spySet?.mockRestore();
});
