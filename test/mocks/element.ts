import sanitizeHtml from 'sanitize-html';

const spyGet = vi.spyOn(HTMLElement.prototype, 'innerText', 'get');
spyGet.mockImplementation(function () {
  return sanitizeHtml(this.textContent || '', {
    allowedTags: [],
    allowedAttributes: {}
  })
    .replace(/\s+/g, ' ')
    .trim();
});