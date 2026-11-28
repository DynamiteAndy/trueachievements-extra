import { find, readFixtureDocument, renderElement } from '@ta-x-test';

import { Section } from './Section';

describe('ui/section/Section', () => {
  test("renders the site's side column section: its colour, the title in a div, then the body in an article", () => {
    // The site's own Walkthrough Thanks section on a walkthrough's side column
    const site = find(
      'section.walkthroughthanks',
      readFixtureDocument('@ta-x-test-views/game-walkthrough/mirrors-edge.html')
    );

    const section = renderElement(<Section colour="purple" title="Walkthrough Thanks" class="walkthroughthanks" />);
    // Its body as the site's (the body is whatever the feature gives it)
    find('article', section).innerHTML = find('article', site).innerHTML;

    expect(section.outerHTML).toBe(site.outerHTML);
  });

  test("puts the feature's classes after the colour, and any other attributes on the section", () => {
    const section = renderElement(
      <Section
        colour="purple"
        title="Walkthrough Thanks"
        class="walkthroughthanks js-ta-x-thanks"
        data-ta-x-loaded="true"
      >
        <div class="thanks" />
      </Section>
    );

    expect(section.className).toBe('purple walkthroughthanks js-ta-x-thanks');
    expect(section.getAttribute('data-ta-x-loaded')).toBe('true');
    expect([...section.children].map((child) => child.tagName)).toEqual(['DIV', 'ARTICLE']);
    expect(find('article', section).innerHTML).toBe('<div class="thanks"></div>');
  });

  test('renders an empty article when it has no body yet', () => {
    expect(find('article', renderElement(<Section colour="green" title="Walkthrough Achievements" />)).outerHTML).toBe(
      '<article></article>'
    );
  });
});
