import { elementOf, find, mountForTest, setHtml } from '@ta-x-test';

import { PostbackButton } from './PostbackButton';

describe('PostbackButton', () => {
  beforeEach(() => {
    setHtml('@ta-x-test-views/staff-walkthrough-page/no-page-selected.html');
  });

  const mount = (button: preact.JSX.Element): HTMLElement =>
    elementOf(mountForTest(button, find('#chWalkthroughPageVersions .content .buttons')));

  test('should render a site button posting back from its href, its text bare', () => {
    const button = mount(
      <PostbackButton postback="btnAddPage" icon="/images/icons/add.png" text="Add page" id="btnAddPage" title="Add" />
    );

    expect([button.tagName, button.id, button.className, button.title]).toEqual(['A', 'btnAddPage', 'button', 'Add']);
    expect(button.getAttribute('href')).toBe("javascript:Postback('btnAddPage')");
    expect(button.hasAttribute('onclick')).toBe(false);
    const icon = find('img', button);
    expect([
      icon.getAttribute('src'),
      icon.alt,
      icon.title,
      icon.getAttribute('width'),
      icon.getAttribute('height')
    ]).toEqual(['/images/icons/add.png', 'Add page', 'Add page', '16', '16']);
    expect([...button.childNodes].map((node) => node.nodeName)).toEqual(['IMG', '#text']);
    expect(button.textContent).toBe('Add page');
  });

  test('should put its text in a span when asked, and leave out an id and title not given', () => {
    const button = mount(<PostbackButton postback="btnReady" icon="/images/icons/tick.png" text="Ready" wrapText />);

    expect([button.hasAttribute('id'), button.hasAttribute('title')]).toEqual([false, false]);
    expect([...button.childNodes].map((node) => node.nodeName)).toEqual(['IMG', 'SPAN']);
    expect(find('span', button).textContent).toBe('Ready');
  });
});
