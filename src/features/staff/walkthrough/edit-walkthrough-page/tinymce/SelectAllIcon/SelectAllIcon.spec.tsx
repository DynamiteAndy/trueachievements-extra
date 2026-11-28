import { find, renderElement } from '@ta-x-test';

import { SelectAllIcon } from './SelectAllIcon';

describe('staff/walkthrough/edit-walkthrough-page/tinymce/SelectAllIcon', () => {
  test("should draw TinyMCE 6's select-all icon in the text's colour", () => {
    const svg = renderElement<SVGSVGElement>(<SelectAllIcon />);

    expect(svg.tagName.toLowerCase()).toBe('svg');
    expect(svg.getAttribute('viewBox')).toBe('0 0 24 24');
    expect(svg.getAttribute('aria-hidden')).toBe('true');
    expect(find('path', svg).getAttribute('fill')).toBe('currentColor');
    // Its dashed border's first corner, then the box inside it
    expect(find('path', svg).getAttribute('d')).toMatch(/^M3 5h2V3a2 2 0 0 0-2 2Z.*M7 17h10V7H7v10Zm2-8h6v6H9V9Z$/);
  });
});
