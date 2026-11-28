import { find, mountForTest, required } from '@ta-x-test';

import styles from '../styles';

import { WalkthroughPreviewAside } from './WalkthroughPreviewAside';

describe('staff/walkthrough/walkthrough-preview/WalkthroughPreviewAside', () => {
  // #BLUD's walkthrough (4138) and its forum thread, with no pages or achievements yet
  const walkthrough = {
    pages: null,
    thanks: { thread: 'https://www.trueachievements.com/forum/viewthread.aspx?tid=1572263', total: '0' },
    achievements: []
  };
  const sections = (): string[] => [...document.body.children].map((child) => child.classList[0]);

  test('shows the information section until the walkthrough is loaded', () => {
    const root = mountForTest(
      <WalkthroughPreviewAside status="ask" walkthrough={walkthrough} onSave={async () => undefined} />,
      document.body
    );

    expect(sections()).toEqual(['purple']);
    expect(document.querySelector(`.${styles.populateAsideContent}`)).not.toBeNull();

    root.render(<WalkthroughPreviewAside status="loaded" walkthrough={walkthrough} onSave={async () => undefined} />);

    expect(document.querySelector(`.${styles.populateAsideContent}`)).toBeNull();
    expect(document.querySelector('.page-index')).toBeNull();
    expect(document.querySelector('.walkthroughthanks')).not.toBeNull();
    expect(document.querySelector('.walkthrough-right')).not.toBeNull();

    root.render(<WalkthroughPreviewAside status="ask" onSave={async () => undefined} />);

    expect(document.querySelectorAll('section')).toHaveLength(1);
    expect(document.querySelector(`.${styles.populateAsideContent}`)).not.toBeNull();
  });

  test("renders the site's Walkthrough Thanks section: its classes, the thanks block and the thread link", () => {
    mountForTest(
      <WalkthroughPreviewAside status="loaded" walkthrough={walkthrough} onSave={async () => undefined} />,
      document.body
    );
    const section = find('.walkthroughthanks');

    expect([...section.classList]).toEqual(['purple', 'walkthroughthanks']);
    expect(required(section.firstElementChild).textContent).toBe('Walkthrough Thanks');
    expect(find('article > .thanks span', section).outerHTML).toBe('<span>0</span>');
    expect(find('.thanks img.thumbsup', section).getAttribute('src')).toBe('/images/walkthroughs/thumbs_up.png');
    expect(find('.thread a', section).getAttribute('href')).toBe(walkthrough.thanks.thread);
    expect(find('.thread', section).textContent).toBe('Discuss this walkthrough in its Walkthrough Thread.');
  });
});
