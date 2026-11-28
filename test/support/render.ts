import { mount, type MountedRoot } from '@ta-x-page';
import { renderToString } from 'preact-render-to-string';
import { act } from 'preact/test-utils';

import type { VNode } from 'preact';

// Renders a component to markup (no effects run, clicks do nothing) and parses it back, off the page. A <template>
// parses any element on its own, including ones that need a parent elsewhere (a <tr>, an <li>)
export const renderFragment = (vnode: VNode): DocumentFragment => {
  const template = document.createElement('template');
  template.innerHTML = renderToString(vnode);

  return template.content;
};

// renderFragment's first element
export const renderElement = <T extends Element = HTMLElement>(vnode: VNode): T =>
  renderFragment(vnode).firstElementChild as T;

// The element a mount rendered, failing the test when it rendered none
export const elementOf = (root: MountedRoot): HTMLElement => {
  if (!root.element) {
    throw new Error('Nothing was mounted');
  }

  return root.element;
};

// Mounts a component live into a container on the page, so its effects run and its signals re-render it. It's
// unmounted when the test ends, so nothing it subscribes to or listens for carries into the next test
export const mountInPage = (vnode: VNode): { container: HTMLElement; root: MountedRoot } => {
  const container = document.createElement('div');
  document.body.append(container);

  let mounted: MountedRoot | undefined;
  // Not awaited: act() renders a synchronous callback's result before it returns (its promise is already resolved),
  // so this stays synchronous for callers that use what it returns
  void act(() => {
    mounted = mount(vnode, container);
  });
  if (!mounted) {
    throw new Error('Nothing was mounted');
  }
  const root = mounted;
  onTestFinished(async () => {
    await act(() => root.unmount());
    container.remove();
  });

  return { container, root };
};

// mount() where a spec needs the component among the site's markup, unmounted when the test ends (inside act(), so its
// effects' clean-ups run), so nothing it subscribes to or listens for carries into the next test
export const mountForTest = (vnode: VNode, parent: Node, before: Node | null = null): MountedRoot => {
  const root = mount(vnode, parent, before);
  onTestFinished(() => act(() => root.unmount()));

  return root;
};
