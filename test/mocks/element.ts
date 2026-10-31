// happy-dom's innerText keeps the markup's whitespace and line structure as written, while browsers render it: spaces
// collapse, a <br> is a line break, and blocks start on lines of their own (a paragraph with a blank line around it).
// This follows the browser's rules closely enough for the text our features read; it has no layout, so hidden elements
// still count. A plain getter rather than a vi.spyOn, so restoreMocks doesn't put happy-dom's version back before each
// test.
const blocks = new Set([
  'ADDRESS',
  'ARTICLE',
  'ASIDE',
  'BLOCKQUOTE',
  'DD',
  'DIV',
  'DL',
  'DT',
  'FIELDSET',
  'FIGCAPTION',
  'FIGURE',
  'FOOTER',
  'FORM',
  'H1',
  'H2',
  'H3',
  'H4',
  'H5',
  'H6',
  'HEADER',
  'HR',
  'LI',
  'MAIN',
  'NAV',
  'OL',
  'PRE',
  'SECTION',
  'TABLE',
  'TR',
  'UL'
]);
const unrendered = new Set(['SCRIPT', 'STYLE', 'TEMPLATE', 'NOSCRIPT']);

// Text pieces, and the line breaks a block asks for between them (the most asked for wins)
type Piece = string | { breaks: number };

const collect = (node: Node, pieces: Piece[]): void => {
  if (node.nodeType === Node.TEXT_NODE) {
    pieces.push((node.textContent ?? '').replace(/\s+/g, ' '));
    return;
  }

  if (!(node instanceof Element) || unrendered.has(node.tagName)) {
    return;
  }

  if (node.tagName === 'BR') {
    pieces.push('\n');
    return;
  }

  const breaks = node.tagName === 'P' ? 2 : blocks.has(node.tagName) ? 1 : 0;
  if (breaks) {
    pieces.push({ breaks });
  }

  for (const child of node.childNodes) {
    collect(child, pieces);
  }

  if (breaks) {
    pieces.push({ breaks });
  }
};

const render = (pieces: Piece[]): string => {
  let text = '';
  let pending = 0;

  for (const piece of pieces) {
    if (typeof piece !== 'string') {
      pending = Math.max(pending, piece.breaks);
      continue;
    }

    if (piece === '') {
      continue;
    }

    if (pending && text) {
      text = text.replace(/ +$/, '') + '\n'.repeat(pending);
    }
    pending = 0;

    // A space never starts a line, nor doubles one already there
    text += /(^|[ \n])$/.test(text) ? piece.replace(/^ +/, '') : piece;
  }

  return text.replace(/ +\n/g, '\n').trim();
};

Object.defineProperty(HTMLElement.prototype, 'innerText', {
  configurable: true,
  get(this: HTMLElement) {
    const pieces: Piece[] = [];
    for (const child of this.childNodes) {
      collect(child, pieces);
    }

    return render(pieces);
  }
});
