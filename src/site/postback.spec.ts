import { find, setHtml } from '@ta-x-test';

import { parsePostback, postbackBody } from './postback';

describe('site/postback', () => {
  test.each([
    {
      name: 'a walkthrough link, its id quoted',
      text: "javascript:Postback('lstWalkthroughIDE','4138')",
      expected: { command: 'lstWalkthroughIDE', argument: '4138' }
    },
    {
      name: 'a vote link, with a space after the comma',
      text: "javascript:Postback('btnGoodVote', '35418')",
      expected: { command: 'btnGoodVote', argument: '35418' }
    },
    {
      name: 'the same as an href, its space percent-encoded',
      text: "javascript:Postback('btnGoodVote',%20'35418')",
      expected: { command: 'btnGoodVote', argument: '35418' }
    },
    {
      name: "the giveaway's entry button markup, its argument not quoted",
      text: '<a href="javascript:Postback(\'btnEnterContest\', 1170)">Enter</a>',
      expected: { command: 'btnEnterContest', argument: '1170' }
    },
    {
      name: 'a button with no argument',
      text: "javascript:Postback('btnReadyForReview_click')",
      expected: { command: 'btnReadyForReview_click', argument: '' }
    },
    {
      // decodeURIComponent throws on it
      name: 'a link with a lone % in it, as it is',
      text: "javascript:Postback('btnSearch','50%')",
      expected: { command: 'btnSearch', argument: '50%' }
    }
  ])('should read $name', ({ text, expected }) => {
    expect(parsePostback(text)).toEqual(expected);
  });

  test.each(['/game/Gears-of-War-4/achievements', "javascript:LaunchChild('/screenshots.aspx?relatedid=1')", ''])(
    'should answer null for %j, which is no postback',
    (text) => {
      expect(parsePostback(text)).toBeNull();
    }
  );

  describe('postbackBody', () => {
    // The site's Postback writes its Command and Argument into the form before submitting it, so a form can still hold
    // an earlier postback's pair (a page brought back by Back)
    test("should post the form's fields, an earlier postback's Command and Argument replaced by this one's, last", () => {
      setHtml('@ta-x-test-views/giveaway/active.html', { url: '/win-xbox-games' });
      const form = find<HTMLFormElement>('#frm');
      form.insertAdjacentHTML(
        'beforeend',
        '<input type="hidden" name="Command" value="btnSearch"><input type="hidden" name="Argument" value="halo">'
      );

      expect([...postbackBody(form, { command: 'btnEnterContest', argument: '2916' }).entries()]).toEqual([
        ['txtSearch', ''],
        ['txtSearchLookupID', ''],
        ['txtSearchOnSelect', 'Postback'],
        ['__VIEWSTATEGENERATOR', '09F0F734'],
        ['Command', 'btnEnterContest'],
        ['Argument', '2916']
      ]);
    });
  });
});
