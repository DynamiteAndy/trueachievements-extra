import { render, type ComponentChild } from 'preact';

export interface DetachedRoot {
  // Re-renders the root with new props in place
  render: (vnode: ComponentChild) => void;
  unmount: () => void;
}

// For a controller that renders nothing on the page itself (all it adds goes into the site's elements, through
// portals): renders `vnode` into a root of its own that isn't on the page
export const mountDetached = (vnode: ComponentChild): DetachedRoot => {
  const root = document.createElement('div');
  render(vnode, root);

  return {
    render: (next: ComponentChild) => render(next, root),
    unmount: () => render(null, root)
  };
};
