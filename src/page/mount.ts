import { render, type ComponentChild } from 'preact';

export interface MountedRoot {
  readonly nodes: Node[];
  readonly element: HTMLElement | null;
  // Re-renders the root with new props in place; Preact diffs it against what's there
  render: (vnode: ComponentChild) => void;
  unmount: () => void;
}

// Preact's render() owns every child of the container it is given, which would wipe out the site's own markup.
// Instead we hand Preact a stand-in parent that forwards inserts to the real one, so components can be placed
// between existing siblings without a wrapper element. Preact walks real nextSibling pointers to pick its reference
// node and removes nodes with node.remove(), so the stand-in only needs to know where the mount point is.
const createRootFragment = (parent: Node, before: Node | null) => {
  const inserted = new Set<Node>();

  const insertBefore = <T extends Node>(child: T, ref?: Node | null): T => {
    const anchor = ref?.parentNode === parent ? ref : before?.parentNode === parent ? before : null;

    parent.insertBefore(child, anchor);
    inserted.add(child);

    return child;
  };

  const nodes = (): Node[] =>
    [...inserted]
      .filter((node) => node.parentNode === parent)
      .sort((a, b) => (a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1));

  const fragment = {
    nodeType: 1,
    parentNode: parent,
    ownerDocument: parent.ownerDocument ?? document,
    namespaceURI: (parent as Element).namespaceURI,
    get firstChild(): Node | null {
      return nodes()[0] ?? null;
    },
    get childNodes(): Node[] {
      return nodes();
    },
    insertBefore,
    appendChild: <T extends Node>(child: T): T => insertBefore(child, null),
    removeChild: <T extends Node>(child: T): T => {
      child.parentNode?.removeChild(child);
      return child;
    }
  };

  return { fragment: fragment as unknown as Element, nodes };
};

export const mount = (vnode: ComponentChild, parent: Node, before: Node | null = null): MountedRoot => {
  const { fragment, nodes } = createRootFragment(parent, before);

  render(vnode, fragment);

  return {
    get nodes(): Node[] {
      return nodes();
    },
    get element(): HTMLElement | null {
      return (nodes().find((node) => node.nodeType === Node.ELEMENT_NODE) as HTMLElement) ?? null;
    },
    render: (next: ComponentChild) => render(next, fragment),
    unmount: () => render(null, fragment)
  };
};
