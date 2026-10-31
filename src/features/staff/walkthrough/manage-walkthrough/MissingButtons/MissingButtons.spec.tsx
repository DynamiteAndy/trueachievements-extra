import { elementOf, find, mountForTest, required, setHtml } from '@ta-x-test';

import { MissingButtons } from './MissingButtons';

describe('MissingButtons', () => {
  const mountButtons = () => {
    const siteButtons = find('#btnCancel').parentElement;

    return mountForTest(<MissingButtons />, required(required(siteButtons).parentElement), siteButtons);
  };

  beforeEach(() => {
    setHtml('@ta-x-test-views/staff-manage-walkthrough/page-selected.html');
  });

  test('should render a site buttons row', () => {
    const root = mountButtons();

    expect(elementOf(root).tagName).toBe('DIV');
    expect(elementOf(root)).toHaveExactClasses(['buttons']);
  });

  test('should render the page buttons as site buttons that post back', () => {
    const buttons = [...elementOf(mountButtons()).querySelectorAll('a')];

    expect(buttons.map((button) => [button.className, button.textContent.trim(), button.getAttribute('href')])).toEqual(
      [
        ['button', 'Add page', "javascript:Postback('btnAddPage')"],
        ['button', 'Preview', "javascript:Postback('btnPreview')"],
        ['button', 'View and edit content', "javascript:Postback('btnViewContent')"]
      ]
    );
    buttons.forEach((button) => expect(find('img', button).getAttribute('width')).toBe('16'));
  });
});
