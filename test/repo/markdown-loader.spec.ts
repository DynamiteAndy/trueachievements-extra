import { find } from '@ta-x-test';

import { loadMarkdown } from '../../build/loaders/markdown-loader';

describe('build/loaders/markdown-loader', () => {
  const render = async (markdown: string, query?: string): Promise<HTMLElement> => {
    const container = document.createElement('div');
    const html = await loadMarkdown(markdown, query);
    if (typeof html !== 'string') {
      throw new TypeError('expected HTML, not the documentation sections');
    }
    container.innerHTML = html;

    return container;
  };

  test('should render markdown with the settings menu marker on each list item', async () => {
    const container = await render('## 3.2.0\n\n- First change\n- Second change\n');
    const items = [...container.querySelectorAll('li')];

    expect(find('h2', container).textContent).toBe('3.2.0');
    expect(items).toHaveLength(2);
    expect(
      items.map((item) => [find('span.ta-x-markdown-marker', item).textContent, find('p', item).textContent])
    ).toEqual([
      ['➤', 'First change'],
      ['➤', 'Second change']
    ]);
  });

  // The marker's <p> can only hold one line: a block inside it renders as broken markup and empty paragraphs
  test.each([
    ['a blank line between items', '- First change\n\n- Second change\n'],
    ['a nested list', '- First change\n  - A detail\n- Second change\n']
  ])('should stop the build for a list item with %s', async (_, markdown) => {
    await expect(render(markdown)).rejects.toThrow('keep each list item to one line of text');
  });

  test('should remove scripts and inline handlers', async () => {
    const container = await render(
      '<script>alert(1)</script>\n\n<a href="https://example.com" onclick="alert(1)">link</a>\n'
    );

    expect(container.querySelector('script')).toBeNull();
    expect(find('a', container).hasAttribute('onclick')).toBe(false);
  });

  test('should give only the latest version of the changelog with ?latest, then a link to the rest', async () => {
    const container = await render('## 3.2.0\n\n- Latest\n\n## 3.1.0\n\n- Older\n', '?latest');
    const link = find('a.ta-x-settings-menu-changelog-link', container);

    expect([...container.querySelectorAll('li p')].map((item) => item.textContent)).toEqual(['Latest']);
    expect(container.textContent).not.toContain('3.1.0');
    expect(link.getAttribute('href')).toBe(
      'https://github.com/dynamiteandy/trueachievements-extra/blob/main/CHANGELOG.md'
    );
    expect(link.textContent).toBe('See the full changelog here');
  });

  test('should keep the space between two inline elements', async () => {
    const container = await render('**Bold** *italic* `code`\n');

    expect(find('p', container).textContent).toBe('Bold italic code');
  });

  test('should split the documentation at its top-level headings with ?sections, the first being the intro', async () => {
    const documentation = await loadMarkdown(
      '# Docs\n\nIntro.\n\n# First Tab\n\n## Group\n\n### Setting\n\n- Item\n\n# Second Tab\n\nText.\n',
      '?sections'
    );

    expect(documentation).toEqual({
      intro: '<h1>Docs</h1><p>Intro.</p>',
      sections: [
        {
          title: 'First Tab',
          html: '<h2>Group</h2><h3>Setting</h3><ul> <li><span class=ta-x-markdown-marker>➤</span><p>Item</li> </ul>'
        },
        { title: 'Second Tab', html: '<p>Text.</p>' }
      ]
    });
  });

  test.each([
    {
      name: 'documentation with no section after its title',
      markdown: '# Docs\n\nIntro.\n',
      query: '?sections',
      message: 'expected a title and at least one section heading'
    },
    {
      name: 'a changelog with no list',
      markdown: '## 3.2.0\n',
      query: '?latest',
      message: 'expected the changelog to contain a <ul> element'
    }
  ])('should fail for $name', async ({ markdown, query, message }) => {
    await expect(loadMarkdown(markdown, query)).rejects.toThrow(message);
  });
});
