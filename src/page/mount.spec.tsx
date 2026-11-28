import { find, ids, required } from '@ta-x-test';
import { useEffect, useState } from 'preact/hooks';
import { act } from 'preact/test-utils';

import type { VNode } from 'preact';

import { mount, type MountedRoot } from './mount';

const setupParent = (): HTMLElement => {
  document.body.innerHTML = '<ul id="parent"><li id="first"></li><li id="last"></li></ul>';
  return find('#parent');
};

// Shows its middle item (#b) when a `toggle` event reaches the document; `flip` hides it again on the next one
const Toggle = ({ flip = false, withLast = false }: { flip?: boolean; withLast?: boolean }) => {
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const toggle = () => setShown((value) => (flip ? !value : true));
    document.addEventListener('toggle', toggle);

    return () => document.removeEventListener('toggle', toggle);
  }, [flip]);

  return (
    <>
      <li id="a" />
      {shown && <li id="b" />}
      {withLast && <li id="c" />}
    </>
  );
};

// Mounted inside act(), which runs the component's effects, so Toggle is listening before the first toggle
const mountToggle = async (vnode: VNode, parent: HTMLElement, before: Node | null = null): Promise<MountedRoot> => {
  let mounted: MountedRoot | undefined;
  await act(() => {
    mounted = mount(vnode, parent, before);
  });
  const root = required(mounted);
  // Unmounted when the test ends, so its document listener doesn't hear the next test's toggles
  onTestFinished(() => act(() => root.unmount()));

  return root;
};

const toggle = () => act(() => void document.dispatchEvent(new Event('toggle')));

describe('mount', () => {
  test('should append when no sibling is given', () => {
    const parent = setupParent();

    mount(<li id="mounted" />, parent);

    expect(ids(parent)).toEqual(['first', 'last', 'mounted']);
  });

  test('should keep the order of multiple root nodes', () => {
    const parent = setupParent();

    const root = mount(
      <>
        <li id="a" />
        <li id="b" />
      </>,
      parent,
      document.getElementById('last')
    );

    expect(ids(parent)).toEqual(['first', 'a', 'b', 'last']);
    expect(root.nodes.map((node) => (node as Element).id)).toEqual(['a', 'b']);
    expect(required(root.element).id).toBe('a');
  });

  test('should re-render in place when state changes', async () => {
    const parent = setupParent();

    await mountToggle(<Toggle flip withLast />, parent, document.getElementById('last'));
    expect(ids(parent)).toEqual(['first', 'a', 'c', 'last']);

    await toggle();
    expect(ids(parent)).toEqual(['first', 'a', 'b', 'c', 'last']);

    await toggle();
    expect(ids(parent)).toEqual(['first', 'a', 'c', 'last']);
  });

  test('should re-render in place with new props', () => {
    const parent = setupParent();
    const Item = ({ text }: { text: string }) => <li id="mounted">{text}</li>;
    const root = mount(<Item text="before" />, parent, document.getElementById('last'));
    const element = root.element;

    root.render(<Item text="after" />);

    expect(ids(parent)).toEqual(['first', 'mounted', 'last']);
    expect(root.element).toBe(element);
    expect(required(element).textContent).toBe('after');
  });

  test('should only remove its own nodes when unmounted', () => {
    const parent = setupParent();

    const root = mount(<li id="mounted" />, parent, document.getElementById('last'));
    root.unmount();

    expect(ids(parent)).toEqual(['first', 'last']);
    expect(root.nodes).toEqual([]);
  });

  test('should append if the sibling it was mounted before has since been removed', async () => {
    const parent = setupParent();
    const last = document.getElementById('last');

    await mountToggle(<Toggle />, parent, last);
    required(last).remove();
    await toggle();

    expect(ids(parent)).toEqual(['first', 'a', 'b']);
  });

  test('should keep separate mounts in the same parent independent', () => {
    const parent = setupParent();

    const one = mount(<li id="one" />, parent, document.getElementById('last'));
    const two = mount(<li id="two" />, parent);

    expect(ids(parent)).toEqual(['first', 'one', 'last', 'two']);

    one.unmount();

    expect(ids(parent)).toEqual(['first', 'last', 'two']);
    expect(required(two.element).id).toBe('two');
  });

  test('should remove nodes added by a state change when unmounted', async () => {
    const parent = setupParent();

    const root = await mountToggle(<Toggle />, parent, document.getElementById('last'));
    await toggle();
    root.unmount();

    expect(ids(parent)).toEqual(['first', 'last']);
  });

  test('should have no element when only text is mounted', () => {
    const parent = setupParent();

    const root = mount('just text', parent);

    expect(root.element).toBeNull();
    expect(root.nodes).toHaveLength(1);
    expect(required(parent.lastChild).textContent).toBe('just text');
  });
});
