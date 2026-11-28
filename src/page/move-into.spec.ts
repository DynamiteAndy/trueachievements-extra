import { find, ids } from '@ta-x-test';

import { moveInto } from './move-into';

describe('moveInto', () => {
  // The site's list, and a container of ours
  const setup = (): { site: HTMLElement; ours: HTMLElement } => {
    document.body.innerHTML =
      '<ul id="site"><li id="a"></li><li id="b"></li><li id="c"></li><li id="d"></li></ul><div id="ours"></div>';
    return { site: find('#site'), ours: find('#ours') };
  };

  test('should move the nodes to the end of ours, in their order', () => {
    const { site, ours } = setup();
    ours.append(document.createElement('hr'));

    moveInto(ours, [find('#b'), find('#c')]);

    expect(ids(site)).toEqual(['a', 'd']);
    expect([...ours.children].map((child) => child.id || child.tagName)).toEqual(['HR', 'b', 'c']);
  });

  test('should put each back where it was, nodes next to each other included', () => {
    const { site, ours } = setup();

    const putBack = moveInto(ours, [find('#a'), find('#b'), find('#d')]);
    putBack();

    expect(ids(site)).toEqual(['a', 'b', 'c', 'd']);
    expect(ours.children).toHaveLength(0);
  });

  test('should put a node back last in its parent once its sibling has gone elsewhere', () => {
    const { site, ours } = setup();

    const putBack = moveInto(ours, [find('#b')]);
    find('#c').remove();
    putBack();

    expect(ids(site)).toEqual(['a', 'd', 'b']);
  });

  test('should leave a node that had no parent where it is', () => {
    const { ours } = setup();
    const loose = document.createElement('p');

    const putBack = moveInto(ours, [loose]);
    putBack();

    expect(loose.parentNode).toBe(ours);
  });
});
