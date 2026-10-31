import { condense } from './condense';

describe('test/tools/fixtures/condense', () => {
  const options = { page: 'https://www.trueachievements.com/news/example', date: '2026-11-23', note: 'A test.' };

  test('should start the fixture with its page, date and note', () => {
    const out = condense('<p>Hi</p>', { ...options, note: 'Kept: the paragraph.\nCut: nothing.' });

    expect(out.split('\n').slice(0, 5)).toEqual([
      '<!--',
      '  https://www.trueachievements.com/news/example, captured 2026-11-23.',
      '  Kept: the paragraph.',
      '  Cut: nothing.',
      '-->'
    ]);
    expect(out).toContain('<p>Hi</p>');
  });

  test('should sanitise as the skill says: our elements, scripts, hidden inputs, handlers, queries, long values', () => {
    const out = condense(
      `<div class="row ta-x-added">ours</div><script>x()</script><input type="hidden" value="s">
       <a href="/game/X?gamerid=1" onclick="go()">game</a><a href="javascript:Postback('a','b')">post</a>
       <span data-q="a=1&b=2" data-kind="row" title="${'t'.repeat(301)}">kept</span>`,
      options
    );

    expect(out).not.toContain('ours');
    expect(out).not.toContain('<script');
    expect(out).not.toContain('type="hidden"');
    expect(out).toContain('<a href="/game/X">game</a>');
    expect(out).toContain('<a href="#">post</a>');
    expect(out).toContain('<span data-kind="row">kept</span>');
  });

  test('should remove our elements by their class names, and keep site classes that only contain ta-x', () => {
    const out = condense(
      '<p class="meta-xbox">site</p><p class="js-ta-x-menu">js</p><p class="row mce-ta-x-group">mce</p>',
      options
    );

    expect(out).toContain('<p class="meta-xbox">site</p>');
    expect(out).not.toContain('js');
    expect(out).not.toContain('mce');
  });

  test('should keep only the parts under test, with their ancestors', () => {
    const out = condense(
      '<header>menu</header><main><aside>side</aside><div class="newsitem"><p>news</p></div></main><footer>f</footer>',
      { ...options, keep: ['.newsitem'] }
    );

    expect(out).toContain('<main><div class="newsitem"><p>news</p></div></main>');
    expect(out).not.toContain('menu');
    expect(out).not.toContain('side');
    expect(out).not.toContain('<footer');
  });

  test('should cut repeated rows to the ones picked, in page order, and say when a row is missing', () => {
    const table =
      '<table><tbody><tr><td>0</td></tr><tr><td>1</td></tr><tr><td>2</td></tr><tr><td>3</td></tr></tbody></table>';

    const out = condense(table, { ...options, rows: [{ selector: 'tbody tr', indices: [3, 1] }] });

    expect([...out.matchAll(/<td>(\d)<\/td>/g)].map((match) => match[1])).toEqual(['1', '3']);
    expect(() => condense(table, { ...options, rows: [{ selector: 'tbody tr', indices: [4] }] })).toThrow(
      'tbody tr has 4 rows (0 to 3), so no row 4'
    );
  });

  test('should keep the hidden inputs named, and only those', () => {
    const form =
      '<form><input type="hidden" name="txtSearchLookupID" value="1"><input type="hidden" name="__EVENTTARGET" value="">' +
      '<input type="text" name="txtSearch"></form>';

    const out = condense(form, { ...options, keepHidden: ['txtSearchLookupID'] });

    expect([...out.matchAll(/<input [^>]*name="(\w+)"/g)].map((match) => match[1])).toEqual([
      'txtSearchLookupID',
      'txtSearch'
    ]);
  });

  test('should refuse to keep __VIEWSTATE, and refuse a hidden input name that matches nothing', () => {
    const form = '<form><input type="hidden" name="__VIEWSTATE" value="state"></form>';

    expect(() => condense(form, { ...options, keepHidden: ['__VIEWSTATE'] })).toThrow('__VIEWSTATE is never kept');
    expect(() => condense(form, { ...options, keepHidden: ['txtSearchLookupID'] })).toThrow(
      'no hidden input is named txtSearchLookupID'
    );
  });

  test('should keep the query parameters named on the links that have them, even past the length limit', () => {
    const store = `https://www.xbox.com/en-GB/games/store/${'a'.repeat(300)}/9MZ8F6B0SL7M`;
    const links =
      `<a href="/ext?u=${encodeURIComponent(store)}&amp;s=tracking">buy</a>` +
      '<a href="/ext?s=tracking">other</a><a href="/game/X?gamerid=1">game</a>';

    const out = condense(links, { ...options, keepQuery: ['u'] });

    expect([...out.matchAll(/<a href="([^"]*)"/g)].map((match) => match[1])).toEqual([
      `/ext?u=${encodeURIComponent(store)}`,
      '/ext',
      '/game/X'
    ]);
  });

  test('should refuse a query parameter name that no link has', () => {
    expect(() => condense('<a href="/ext?s=1">buy</a>', { ...options, keepQuery: ['u'] })).toThrow(
      'no link has a query parameter named u'
    );
  });

  test('should refuse a date that is not YYYY-MM-DD, and refuse keep selectors that match nothing', () => {
    expect(() => condense('<p></p>', { ...options, date: '23/11/2026' })).toThrow('date should be YYYY-MM-DD');
    expect(() => condense('<p></p>', { ...options, keep: ['.missing'] })).toThrow('nothing matches .missing');
  });
});
