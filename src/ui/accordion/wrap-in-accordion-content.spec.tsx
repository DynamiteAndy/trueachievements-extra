import { mountInPage } from '@ta-x-test';

import { Accordion } from './Accordion';
import { wrapInAccordionContent } from './wrap-in-accordion-content';

describe('ui/accordion/wrapInAccordionContent', () => {
  // The site's group: two rows in a list
  const group = (): { parent: HTMLElement; rows: HTMLElement[] } => {
    const parent = document.body.appendChild(document.createElement('ul'));
    const rows = [1, 2].map(() => parent.appendChild(document.createElement('li')));
    return { parent, rows };
  };

  test('should give each wrapper its own id, the same again when the page is wrapped again', () => {
    const first = group();
    const second = group();

    const wrapped = [
      wrapInAccordionContent(first.parent, first.rows[0], first.rows),
      wrapInAccordionContent(second.parent, second.rows[0], second.rows)
    ];
    const ids = wrapped.map(({ content }) => content.id);
    wrapped.forEach(({ unwrap }) => unwrap());
    const again = [
      wrapInAccordionContent(first.parent, first.rows[0], first.rows),
      wrapInAccordionContent(second.parent, second.rows[0], second.rows)
    ];

    expect(new Set(ids).size).toBe(2);
    expect(again.map(({ content }) => content.id)).toEqual(ids);
  });

  // The settings menu's accordions are on every page too: a collapse button's aria-controls mustn't find one of theirs
  test("should never share an id with an Accordion's content on the same page", () => {
    const { parent, rows } = group();
    const { content } = wrapInAccordionContent(parent, rows[0], rows);
    const { container } = mountInPage(<Accordion title="Group">Setting</Accordion>);
    const accordionIds = [...container.querySelectorAll('[id]')].map(({ id }) => id);

    expect(accordionIds.length).toBeGreaterThan(0);
    expect(accordionIds).not.toContain(content.id);
    expect(document.querySelectorAll(`[id="${content.id}"]`)).toHaveLength(1);
  });
});
