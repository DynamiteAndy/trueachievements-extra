import { faPencil } from '@fortawesome/free-solid-svg-icons/faPencil';
import { faPlus } from '@fortawesome/free-solid-svg-icons/faPlus';
import { faXmark } from '@fortawesome/free-solid-svg-icons/faXmark';
import { click, elementOf, find, mountForTest, pressKey, required } from '@ta-x-test';
import { AskLoaderStyles } from '@ta-x-ui';
import { useState } from 'preact/hooks';
import { act } from 'preact/test-utils';

import { guideLinkSelectors } from '../guide-site-panel.spec-helpers';
import styles from '../styles';

import { GuideLinks, type GuideLinksProps } from './GuideLinks';

describe('game/extra-guides/GuideLinks', () => {
  // Metal Gear Solid HD Edition's games on PlaystationTrophies
  const mgs2 = 'https://www.playstationtrophies.org/game/metal-gear-solid-2-hd/guide/';
  const mgs3 = 'https://www.playstationtrophies.org/game/metal-gear-solid-3-snake-eater-hd/guide/';
  const props: GuideLinksProps = {
    site: 'Playstation Trophies',
    links: [],
    multiple: true,
    summary: "This game's guides from PlaystationTrophies.org, shown at the top of each achievement's solutions.",
    askInformation: 'Please enter a direct link to this game from PlaystationTrophies.org',
    askLabel: 'PlaystationTrophies Url',
    onAdd: () => true,
    onRemove: () => undefined,
    onImport: () => undefined
  };
  const render = (overrides: Partial<GuideLinksProps>): HTMLElement =>
    elementOf(mountForTest(<GuideLinks {...props} {...overrides} />, document.body));
  const form = (panel: HTMLElement | null) => panel?.querySelector(`.${AskLoaderStyles.askLoaderAsk}`) ?? null;
  const rows = (panel: HTMLElement | null) => [...(panel?.querySelectorAll(guideLinkSelectors.row) ?? [])];

  test('asks for a link straight away when there are none, like the ask panel', () => {
    const panel = render({});

    expect(panel.querySelector(`.${styles.guideLinksList}`)).toBeNull();
    expect(find('p', form(panel)).textContent).toBe(
      'Please enter a direct link to this game from PlaystationTrophies.org'
    );
    expect(find('label', form(panel)).textContent).toBe('PlaystationTrophies Url');
  });

  test("lists the game's pages with their guides' status, keeping the field behind +", () => {
    const panel = render({
      links: [
        { url: mgs2, guides: 46, importing: false },
        { url: mgs3, guides: null, importing: false }
      ]
    });

    expect(rows(panel)).toHaveLength(2);
    expect(find('p', panel).textContent).toBe(
      "This game's guides from PlaystationTrophies.org, shown at the top of each achievement's solutions."
    );
    expect(rows(panel).map((row) => find('a', row).textContent)).toEqual([
      'metal-gear-solid-2-hd/guide/',
      'metal-gear-solid-3-snake-eater-hd/guide/'
    ]);
    expect(find('a', rows(panel)[0]).getAttribute('href')).toBe(mgs2);
    expect(find('span', rows(panel)[0]).textContent).toBe('46 guides');
    expect(find(guideLinkSelectors.importLink, rows(panel)[1]).textContent).toBe('Import');
    expect(form(panel)).toBeNull();
    expect(find(`${guideLinkSelectors.addLink} svg path`, panel).getAttribute('d')).toBe(faPlus.icon[4]);

    click(find(guideLinkSelectors.addLink, panel));

    expect(find<HTMLInputElement>('input[type="submit"]', form(panel)).value).toBe('Add');
    expect(panel.querySelector(guideLinkSelectors.addLink)).toBeNull();
    // The summary already explains the tab, so the field comes without the ask's text
    expect(required(form(panel)).querySelector('p')).toBeNull();
  });

  test("says what's happening while a page's guides are imported", () => {
    const panel = render({ links: [{ url: mgs2, guides: null, importing: true }] });

    expect(find('span', rows(panel)[0]).textContent).toBe('Importing…');
    expect(find('p.small', panel).textContent).toBe(
      "Playstation Trophies doesn't let me fetch its guides, so I'm reading them from the guide page in a new tab. If " +
        "it doesn't finish, switch to that tab: Playstation Trophies may want you to confirm you're not a bot."
    );
  });

  test('says where to look under a row whose import is taking a while, and not once it has finished', () => {
    const panel = render({
      links: [
        { url: mgs2, guides: null, importing: true, slow: true },
        { url: mgs3, guides: 46, importing: false, slow: true }
      ]
    });

    expect(find('span', rows(panel)[0]).textContent).toBe('Importing…');
    expect(find(`.${styles.guideLinksSlow}`, rows(panel)[0]).textContent).toBe(
      'This is taking a while: check the guide tab, or open the guide page yourself and close that tab.'
    );
    expect(rows(panel)[1].querySelector(`.${styles.guideLinksSlow}`)).toBeNull();
  });

  test('passes on what was typed, then hides the field again once it was added', () => {
    const onAdd = vi.fn(() => true);
    const panel = render({ links: [{ url: mgs2, guides: 46, importing: false }], onAdd });
    click(find(guideLinkSelectors.addLink, panel));
    find<HTMLInputElement>('input[type="text"]', form(panel)).value = mgs3;

    const event = click(find('input[type="submit"]', form(panel)));

    expect(onAdd).toHaveBeenCalledExactlyOnceWith(mgs3);
    expect(event.defaultPrevented).toBe(true);
    expect(form(panel)).toBeNull();
  });

  test("lists the first page once it's added, as the feature re-renders straight away", () => {
    const root = mountForTest(<GuideLinks {...props} />, document.body);
    const onAdd = (url: string) => {
      root.render(<GuideLinks {...props} links={[{ url, guides: null, importing: true }]} onAdd={onAdd} />);
      return true;
    };
    root.render(<GuideLinks {...props} onAdd={onAdd} />);
    find<HTMLInputElement>('input[type="text"]', form(root.element)).value = mgs2;

    click(find('input[type="submit"]', form(root.element)));

    expect(rows(root.element)).toHaveLength(1);
    expect(form(root.element)).toBeNull();
  });

  test("keeps the field and what was typed when it isn't a guide page", () => {
    const panel = render({ onAdd: () => false });
    find<HTMLInputElement>('input[type="text"]', form(panel)).value = 'not-a-guide-page';

    click(find('input[type="submit"]', form(panel)));

    expect(find<HTMLInputElement>('input[type="text"]', form(panel)).value).toBe('not-a-guide-page');
  });

  test('removes or imports a page without following its link', () => {
    const onRemove = vi.fn();
    const onImport = vi.fn();
    const panel = render({ links: [{ url: mgs3, guides: null, importing: false }], onRemove, onImport });

    const importClick = click(find(guideLinkSelectors.importLink, panel));
    const remove = find(guideLinkSelectors.removeLink, panel);
    expect(find('svg path', remove).getAttribute('d')).toBe(faXmark.icon[4]);
    const removeClick = click(remove);

    expect(onImport).toHaveBeenCalledExactlyOnceWith(mgs3);
    expect(onRemove).toHaveBeenCalledExactlyOnceWith(mgs3);
    expect([importClick.defaultPrevented, removeClick.defaultPrevented]).toEqual([true, true]);
  });

  test.each([
    { name: 'Enter', key: 'Enter' },
    { name: 'Space', key: ' ' }
  ])('removes, imports or opens the field to add a page with $name, as buttons', ({ key }) => {
    const onRemove = vi.fn();
    const onImport = vi.fn();
    const panel = render({ links: [{ url: mgs3, guides: null, importing: false }], onRemove, onImport });
    const controls = [guideLinkSelectors.importLink, guideLinkSelectors.removeLink, guideLinkSelectors.addLink].map(
      (selector) => find(selector, panel)
    );

    expect(controls.map((control) => control.getAttribute('role'))).toEqual(['button', 'button', 'button']);
    expect(controls.map((control) => pressKey(control, key).defaultPrevented)).toEqual([true, true, true]);
    expect(onImport).toHaveBeenCalledExactlyOnceWith(mgs3);
    expect(onRemove).toHaveBeenCalledExactlyOnceWith(mgs3);
    expect(form(panel)).not.toBeNull();
  });

  // The links as the panel above them keeps them: a remove takes the row away, an import marks it importing
  const Panel = ({ initial }: { initial: GuideLinksProps['links'] }) => {
    const [links, setLinks] = useState(initial);

    return (
      <GuideLinks
        {...props}
        links={links}
        onRemove={(url) => setLinks((current) => current.filter((link) => link.url !== url))}
        onImport={(url) =>
          setLinks((current) => current.map((link) => (link.url === url ? { ...link, importing: true } : link)))
        }
      />
    );
  };

  // The × goes with its row, so the focus goes to the next row's ×, the last one left, or the field once none is
  test("puts the focus on the next page's remove once one is removed, the new last one's, then on the field", async () => {
    const mgs5 = 'https://www.playstationtrophies.org/game/metal-gear-solid-v-the-phantom-pain/guide/';
    const panel = elementOf(
      mountForTest(
        <Panel
          initial={[
            { url: mgs2, guides: 46, importing: false },
            { url: mgs3, guides: 12, importing: false },
            { url: mgs5, guides: 50, importing: false }
          ]}
        />,
        document.body
      )
    );
    const removes = () => [...panel.querySelectorAll<HTMLElement>(guideLinkSelectors.removeLink)];
    expect(removes().map((remove) => remove.getAttribute('aria-label'))).toEqual([
      'Remove metal-gear-solid-2-hd/guide/',
      'Remove metal-gear-solid-3-snake-eater-hd/guide/',
      'Remove metal-gear-solid-v-the-phantom-pain/guide/'
    ]);

    await act(() => {
      click(removes()[2]);
    });
    expect(document.activeElement).toBe(removes()[1]);
    expect(removes()).toHaveLength(2);

    await act(() => {
      click(removes()[0]);
    });
    expect(document.activeElement).toBe(removes()[0]);
    expect(removes()[0].getAttribute('aria-label')).toBe('Remove metal-gear-solid-3-snake-eater-hd/guide/');

    await act(() => {
      click(removes()[0]);
    });
    expect(document.activeElement).toBe(find('input[type="text"]', form(panel)));
  });

  // Import goes from under the focus as the row starts importing: the row's status, read out as it changes, takes it
  test("keeps the focus on a page's status once Import is pressed, and has it read out", async () => {
    const panel = elementOf(
      mountForTest(<Panel initial={[{ url: mgs3, guides: null, importing: false }]} />, document.body)
    );
    const status = find(`${guideLinkSelectors.row} > span`, panel);
    expect(status.getAttribute('aria-live')).toBe('polite');

    await act(() => {
      click(find(guideLinkSelectors.importLink, panel));
    });

    expect(document.activeElement).toBe(status);
    expect(status.textContent).toBe('Importing…');
  });

  test('changes the only link instead of adding one, when the site allows a single page', () => {
    const panel = render({
      site: 'XboxAchievements',
      multiple: false,
      links: [{ url: 'https://www.xboxachievements.com/game/mass-effect/guide/', guides: 49, importing: false }]
    });
    const change = find(guideLinkSelectors.addLink, panel);

    expect(change.getAttribute('title')).toBe('Change the XboxAchievements guide page');
    expect(find('svg path', change).getAttribute('d')).toBe(faPencil.icon[4]);

    click(change);

    expect(find<HTMLInputElement>('input[type="submit"]', form(panel)).value).toBe('Change');
  });

  // Opened by + (or the pencil), the field can be closed without adding
  test('closes the field opened by + with its Cancel, adding nothing, and shows + again', () => {
    const onAdd = vi.fn(() => true);
    const panel = render({ links: [{ url: mgs2, guides: 46, importing: false }], onAdd });
    click(find(guideLinkSelectors.addLink, panel));

    click(find('input[value="Cancel"]', form(panel)));

    expect(form(panel)).toBeNull();
    expect(onAdd).not.toHaveBeenCalled();
    expect(panel.querySelector(guideLinkSelectors.addLink)).not.toBeNull();
  });

  test("has no Cancel on the first link's field, which shows while there are none", () => {
    const panel = render({ links: [] });

    expect(required(form(panel)).querySelector('input[value="Cancel"]')).toBeNull();
  });
});
