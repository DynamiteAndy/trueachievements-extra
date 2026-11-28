import { find, renderElement, required } from '@ta-x-test';

import styles from '../styles';

import { WalkthroughEditors } from './WalkthroughEditors';

// Mirror's Edge's gamers involved, as its walkthrough page lists them
describe('forum/view-thread/show-owner-progress/WalkthroughEditors', () => {
  test('renders a row per gamer with their avatar and role, as the site lists them', () => {
    const wrapper = renderElement(
      <WalkthroughEditors
        rows={[
          {
            avatar: {
              src: '//www.trueachievements.com/imagestore/thumbs/0002836700/2836701.jpg',
              alt: 'nanoc1111',
              link: { href: '/gamer/nanoc1111', iml: true }
            },
            editors: [{ name: 'nanoc1111', href: '/gamer/nanoc1111', role: 'Owner', rel: null }]
          },
          {
            avatar: {
              src: '//www.trueachievements.com//Imagestore/thumbs/0004852200/4852216.jpg',
              alt: 'LifeExpectancy',
              link: { href: '/gamer/LifeExpectancy', iml: false }
            },
            editors: [{ name: 'LifeExpectancy', href: '/gamer/LifeExpectancy', role: 'Overseer', rel: null }]
          }
        ]}
      />
    );

    expect(wrapper.className).toBe(styles.showOwnerProgressEditorWrapper);
    const rows = [...wrapper.children];
    expect(rows).toHaveLength(2);
    expect(rows[0].outerHTML).toBe(
      `<div class="${styles.showOwnerProgressEditorRow}"><a href="/gamer/nanoc1111" class="iml"><img src="//www.trueachievements.com/imagestore/thumbs/0002836700/2836701.jpg" alt="nanoc1111" title="nanoc1111" class="smallicon" width="32" height="32"></a><div class="${styles.showOwnerProgressEditor}"><a href="/gamer/nanoc1111">nanoc1111</a> (Owner)</div></div>`
    );
    expect(find('a', rows[1]).hasAttribute('class')).toBe(false);
    expect(rows[1].textContent).toBe('LifeExpectancy (Overseer)');
  });

  test("renders each of a gamer's roles, and no avatar when there is none", () => {
    const wrapper = renderElement(
      <WalkthroughEditors
        rows={[
          {
            avatar: null,
            editors: [
              { name: 'nanoc1111', href: '/gamer/nanoc1111', role: 'Owner', rel: null },
              { name: 'nanoc1111', href: '/gamer/nanoc1111', role: 'Editor', rel: null }
            ]
          }
        ]}
      />
    );

    expect(wrapper.querySelector('img')).toBeNull();
    expect([...wrapper.querySelectorAll(`.${styles.showOwnerProgressEditor}`)].map((e) => e.textContent)).toEqual([
      'nanoc1111 (Owner)',
      'nanoc1111 (Editor)'
    ]);
  });

  test('renders a bare picture when the walkthrough does not link it, and keeps a link rel', () => {
    // Mad Riders' single-page walkthrough
    const wrapper = renderElement(
      <WalkthroughEditors
        rows={[
          {
            avatar: {
              src: '//www.trueachievements.com/imagestore/thumbs/0000789800/789833.jpg',
              alt: 'litepink',
              link: null
            },
            editors: [{ name: 'litepink', href: '/gamer/litepink', role: 'Owner', rel: 'nofollow' }]
          }
        ]}
      />
    );

    expect(required(wrapper.firstElementChild).outerHTML).toBe(
      `<div class="${styles.showOwnerProgressEditorRow}"><img src="//www.trueachievements.com/imagestore/thumbs/0000789800/789833.jpg" alt="litepink" title="litepink" class="smallicon" width="32" height="32"><div class="${styles.showOwnerProgressEditor}"><a href="/gamer/litepink" rel="nofollow">litepink</a> (Owner)</div></div>`
    );
  });
});
