// Moves the site's `nodes` to the end of `parent` (one of ours), in their order, and returns how to put each back where
// it was: before the sibling node it had (a text node too, such as the whitespace between rows), or last in its parent
// once that sibling has gone elsewhere. Put back last first, so a node whose sibling was moved with it finds that
// sibling back in place
export const moveInto = (parent: Node, nodes: Node[]): (() => void) => {
  const moved = nodes.map((node) => ({ node, from: node.parentNode, next: node.nextSibling }));
  moved.forEach(({ node }) => parent.appendChild(node));

  return () =>
    [...moved]
      .reverse()
      .forEach(({ node, from, next }) => from?.insertBefore(node, next?.parentNode === from ? next : null));
};
