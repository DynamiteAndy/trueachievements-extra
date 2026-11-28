import { intersectionObserver } from '@ta-x-page';
import { elementOf, mountForTest, required } from '@ta-x-test';
import { act } from 'preact/test-utils';

import type { MountedRoot } from '@ta-x-page';
import type { Mock, MockInstance } from 'vitest';

import { HeaderSpacer } from './HeaderSpacer';

describe('all-pages/sticky-header/HeaderSpacer', () => {
  let header: HTMLElement;
  let onIntersect: (entry: IntersectionObserverEntry) => void;
  let stopIntersect: Mock<() => void>;
  let observe: MockInstance<(typeof intersectionObserver)['observe']>;

  beforeEach(() => {
    header = document.createElement('header');
    document.body.append(header);
    stopIntersect = vi.fn<() => void>();
    observe = vi.spyOn(intersectionObserver, 'observe').mockImplementation((_, callback) => {
      onIntersect = callback;
      return stopIntersect;
    });
  });

  const mountSpacer = async (onAtTopChange = vi.fn()) => {
    let mounted: MountedRoot | undefined;
    await act(() => {
      mounted = mountForTest(
        <HeaderSpacer height={79} background="rgb(22, 22, 22)" onAtTopChange={onAtTopChange} />,
        document.body,
        header
      );
    });
    const root = required(mounted);
    return { root, spacer: elementOf(root), onAtTopChange };
  };

  test("holds the header's place before it, at the header's height", async () => {
    const { spacer } = await mountSpacer();

    expect(header.previousElementSibling).toBe(spacer);
    expect(required(spacer).style.height).toBe('79px');
  });

  // Its space shows as the header's bar, not an empty gap, while the header is out of view at the top
  test("takes the header's background", async () => {
    const { spacer } = await mountSpacer();

    expect(required(spacer).style.backgroundColor).toBe('rgb(22, 22, 22)');
  });

  test('follows the height it is given', async () => {
    const { root, spacer, onAtTopChange } = await mountSpacer();

    await act(() =>
      root.render(<HeaderSpacer height={110} background="rgb(22, 22, 22)" onAtTopChange={onAtTopChange} />)
    );

    expect(required(spacer).style.height).toBe('110px');
  });

  test('reports whether the page is at its top: the spacer on screen', async () => {
    const { spacer, onAtTopChange } = await mountSpacer();
    expect(observe).toHaveBeenCalledWith(spacer, expect.any(Function));

    onIntersect({ isIntersecting: false } as IntersectionObserverEntry);
    onIntersect({ isIntersecting: true } as IntersectionObserverEntry);

    expect(onAtTopChange.mock.calls).toEqual([[false], [true]]);
  });

  test('stops watching once unmounted', async () => {
    const { root } = await mountSpacer();

    await act(() => root.unmount());

    expect(stopIntersect).toHaveBeenCalledOnce();
  });
});
