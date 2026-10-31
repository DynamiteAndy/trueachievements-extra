import { setSettings } from '@ta-x-test';

import { slideClasses, stickyAnimations } from './slide-classes';
import { applyStickyElementStyle, clearStickyAnimations } from './sticky';

import type { StickyElementOptions } from './sticky';

describe('page/sticky/sticky', () => {
  const top = '--test-sticky-top';
  const { yShow, yHide, yHideNoTransition } = slideClasses;
  // The sticky header's class for the site's header (its styles.ts): the helper doesn't read it, but the real page
  // has it
  const stickyHeaderClass = 'ta-x-sticky-header';

  let header: HTMLElement;
  let container: HTMLElement;
  let element: HTMLElement;

  // The top is set on the element itself (each stickUnderHeader element reads its own)
  const variable = (name: string): string => element.style.getPropertyValue(name);

  // The header 79px tall (as live): showing (y-show), slid away (y-hide), or not slid yet (neither: it's in view, as
  // before the user's first scroll); the container's top `containerTop` px down the window
  const setUp = ({
    enabled = true,
    stuck = false,
    showing = true,
    slid = true,
    hiddenBy = yHide
  }: {
    enabled?: boolean;
    stuck?: boolean;
    showing?: boolean;
    slid?: boolean;
    // How the header slid away: with its transition, or without (as on a reload partway down)
    hiddenBy?: string;
  }) => {
    setSettings({
      'allPages.stickyHeader.enabled': enabled,
      'allPages.stickyHeader.remainStuck': stuck
    });
    // The site's header, marked as the sticky header when it's on
    header = document.createElement('header');
    if (enabled) {
      header.classList.add(stickyHeaderClass);
    }
    if (slid) {
      header.classList.add(showing ? yShow : hiddenBy);
    }
    Object.defineProperty(header, 'offsetHeight', { value: 79 });
    container = document.createElement('div');
    element = document.createElement('div');
    container.append(element);
    document.body.replaceChildren(header, container);
  };

  // Placed under the site's header (as stickUnderHeader hands it over), its container's top `containerTop` px down
  const stick = (
    containerTop: number,
    opts: StickyElementOptions = {},
    siteHeader: HTMLElement | null = header
  ): void => {
    container.getBoundingClientRect = () => ({ top: containerTop }) as DOMRect;
    applyStickyElementStyle(top, element, container, siteHeader, opts);
  };

  beforeEach(() => {
    document.documentElement.removeAttribute('style');
  });

  test('should leave an element in place while its container is below the header', () => {
    setUp({});

    stick(200);

    expect(variable(top)).toBe('0px');
    expect(element).toHaveExactClasses([]);
  });

  test('should stick an element under the showing header, and the gap, once its container has scrolled past', () => {
    setUp({});

    stick(-150, { paddingFromTop: 5 });

    // The header and the gap (its owner fixes it in place)
    expect(variable(top)).toBe('84px');
    expect(element).toHaveExactClasses([yShow]);
    // On the element, not the page
    expect(document.documentElement.style.getPropertyValue(top)).toBe('');
  });

  test.each([yHide, yHideNoTransition])(
    'should slide a stuck element away with a header hidden by %s',
    async (hiddenBy) => {
      setUp({ showing: false, hiddenBy });

      stick(-150);

      expect(element).toHaveExactClasses([yHideNoTransition]);
    }
  );

  test('should bring an element placed under the hidden header back with the header, without its old slide', () => {
    setUp({});
    element.classList.add(yHideNoTransition);

    stick(-150);

    expect([...element.classList]).toEqual([yShow]);
  });

  test("should keep an element in view under a header that stays stuck, though it's marked hidden", () => {
    setUp({ stuck: true, showing: false });

    stick(-150);

    expect(variable(top)).toBe('79px');
    expect(element).toHaveExactClasses([yShow]);
  });

  test("should leave an element in place once its container's top is below the header's bottom", () => {
    setUp({});

    // The header's bottom is at 79px
    stick(100);

    expect(variable(top)).toBe('0px');
    expect(element).toHaveExactClasses([]);
  });

  test("should place an element that hasn't slid yet without its transition, and with it once it has", () => {
    setUp({ showing: false });

    // The first time: none of the slide classes yet
    stick(-150);
    expect(element).toHaveExactClasses([yHideNoTransition]);

    // Once it has slid (shown with the header), it slides back out with its transition
    element.classList.replace(yHideNoTransition, yShow);
    stick(-150);
    expect(element).toHaveExactClasses([yHide]);
  });

  // As after a page loads part way down: placed hidden without its transition, then placed again while still hidden
  test('should keep one hide class on an element placed twice under the hidden header', () => {
    setUp({ showing: false });

    stick(-150);
    stick(-150);

    expect(element).toHaveExactClasses([yHide]);
  });

  test("should stick an element under a header that hasn't slid yet, which is in view", () => {
    // With the page scrolled before the user has scrolled (e.g. a reload keeping its place), the header is in view with
    // neither class, and the stuck toolbar mustn't slide up under it
    setUp({ slid: false });

    stick(-150);

    expect(variable(top)).toBe('79px');
    expect(element).toHaveExactClasses([yShow]);
  });

  test('should take the slide classes off an element with clearStickyAnimations', () => {
    const el = document.createElement('div');
    el.classList.add('keep', ...stickyAnimations);

    clearStickyAnimations(el);

    expect([...el.classList]).toEqual(['keep']);
  });

  test('should stick an element under the showing header while it covers the top of its container', () => {
    setUp({});

    // The header's bottom is at 79px; the container's top at 30px, under it
    stick(30, { paddingFromTop: 5 });

    expect(variable(top)).toBe('84px');
    expect(element).toHaveExactClasses([yShow]);
  });

  test('should leave an element in place under a hidden header while its container is in view', () => {
    setUp({ showing: false });

    stick(30);

    expect(variable(top)).toBe('0px');
  });

  test('should stick an element its owner has stuck, under the hiding header, though its container is in view', () => {
    // The editor's top 20px down, under the header as it slides away: the toolbar its owner has stuck mustn't be taken
    // for in place, its top 0 and its slide gone (79px up)
    setUp({ showing: false });

    stick(30, { stuck: true });

    expect(variable(top)).toBe('79px');
    expect(element).toHaveExactClasses([yHideNoTransition]);
  });

  test('should stick an element under a header that stays stuck, even without its show class', () => {
    setUp({ stuck: true, slid: false });

    stick(30, { stuck: true });

    expect(element).toHaveExactClasses([yShow]);
  });

  // The header it's given is the site's <header>, read by its tag, so it's placed under it before the sticky header has
  // marked it with its class
  test("should stick under the header it's given, though the sticky header hasn't marked it yet", () => {
    setUp({});
    header.classList.remove(stickyHeaderClass);

    stick(-150);

    expect(variable(top)).toBe('79px');
    expect(element).toHaveExactClasses([yShow]);
  });

  test('should stick under nothing, at the gap, on a page without a header', () => {
    setUp({});

    stick(-150, { paddingFromTop: 5 }, null);

    expect(variable(top)).toBe('5px');
  });

  test('should stick under nothing when the sticky header is off', () => {
    setUp({ enabled: false });

    stick(30);
    expect(variable(top)).toBe('0px');

    stick(-150, { paddingFromTop: 5 });
    expect(variable(top)).toBe('5px');
    expect(element).toHaveExactClasses([]);
  });
});
