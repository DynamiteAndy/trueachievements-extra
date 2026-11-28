import { find, renderElement } from '@ta-x-test';

import { WalkthroughPageRow } from './WalkthroughPageRow';

describe('WalkthroughPageRow', () => {
  const page = { index: '4', title: 'School Daze', id: '26664' };
  const render = (selected?: boolean): Element => {
    return renderElement(<WalkthroughPageRow page={page} selected={selected} />);
  };

  test('should render a page index row linking to the page preview', () => {
    const row = render();

    expect(find('td.pos', row).textContent).toBe('4');
    expect(find('td[data-wp]', row).getAttribute('data-wp')).toBe('26664');
    expect(find('td[data-wp] a', row).getAttribute('href')).toBe(
      '/staff/walkthrough/walkthroughpagepreview.aspx?pageid=26664'
    );
    expect(find('td[data-wp] a', row).textContent).toBe('School Daze');
  });

  test('should not link the page being viewed', () => {
    const row = render(true);

    expect(row.querySelector('td[data-wp] a')).toBeNull();
    expect(find('td[data-wp]', row).textContent).toBe('School Daze');
  });

  test('should render the title as text', () => {
    const row = renderElement(<WalkthroughPageRow page={{ ...page, title: '<b>School Daze</b>' }} />);

    expect(find('td[data-wp] a', row).textContent).toBe('<b>School Daze</b>');
  });
});
