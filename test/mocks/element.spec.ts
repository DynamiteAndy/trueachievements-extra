import { required, setHtml } from '@ta-x-test';

describe('test/mocks/element innerText', () => {
  const textOf = (html: string): string => {
    const div = document.createElement('div');
    div.innerHTML = html;
    return div.innerText;
  };

  test('should collapse spaces and trim them at each end', () => {
    expect(textOf('  one \n  two  <span> three </span> ')).toBe('one two three');
  });

  test('should break a line at a <br>, with no space either side', () => {
    expect(textOf('line <br> break')).toBe('line\nbreak');
  });

  test('should put a block on a line of its own, and a paragraph between blank lines', () => {
    expect(textOf('before<div>block</div>after')).toBe('before\nblock\nafter');
    expect(textOf('before<p>paragraph</p>after')).toBe('before\n\nparagraph\n\nafter');
    expect(textOf('<p>one</p><p>two</p>')).toBe('one\n\ntwo');
  });

  test('should leave out what a browser never renders', () => {
    expect(textOf('shown<script>hidden()</script><style>.x{}</style>')).toBe('shown');
  });

  // As Chrome reads the post: the sentence's two <br>s are a blank line, not run together
  test("should keep the line breaks in a walkthrough's published post", () => {
    setHtml('@ta-x-test-views/forum-thread/digimon-survive-walkthrough.html');
    const post = [...document.querySelectorAll<HTMLElement>('.posts li .body')].find((body) =>
      body.textContent.includes('has now been published')
    );

    expect(required(post).innerText).toMatch(/published\.\n\nYou can find it here/);
  });
});
