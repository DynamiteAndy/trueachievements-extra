import { find, setHtml } from '@ta-x-test';

import { sameName, selectedWalkthroughId } from './walkthrough-markup';

describe('staff/walkthrough/shared/walkthrough-markup', () => {
  test.each([
    ['Gold Honors', 'gold honors'],
    [' Gold Honors', 'Gold Honors'],
    ['Gold Honors ', ' gold honors']
  ])('should take %j and %j for the same name (case, and spaces at either end, aside)', (a, b) => {
    expect(sameName(a, b)).toBe(true);
  });

  test('should tell different names apart', () => {
    expect(sameName('Gold Honors', 'Silver Honors')).toBe(false);
    expect(sameName('Gold  Honors', 'Gold Honors')).toBe(false);
  });

  describe('selectedWalkthroughId', () => {
    const selectRow = (href: string): void => {
      setHtml('@ta-x-test-views/staff-manage-walkthrough/walkthrough-selected.html');
      find('#lstWalkthroughIDselectedrow a').setAttribute('href', href);
    };

    test("should read the selected walkthrough's id from its row's postback", () => {
      selectRow("javascript:Postback('lstWalkthroughIDE','3567')");

      expect(selectedWalkthroughId()).toBe('3567');
    });

    test("should give null when the postback's argument isn't an id", () => {
      selectRow("javascript:Postback('lstWalkthroughIDE','new')");

      expect(selectedWalkthroughId()).toBeNull();
    });

    test('should give null when no walkthrough is selected', () => {
      setHtml('@ta-x-test-views/staff-manage-walkthrough/no-walkthrough-selected.html');

      expect(selectedWalkthroughId()).toBeNull();
    });
  });
});
