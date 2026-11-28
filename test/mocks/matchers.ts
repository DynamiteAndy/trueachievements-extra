// Matchers that make the exact check the easy one to write, in place of loose `classList.contains` and position checks.
// Added for every spec by setup.ts.
//   expect(element).toHaveExactClasses(['a', 'b'])  its classes are these, in any order, and no others (each once)
//   expect(element).toBeLastChildOf(parent)          it's the parent's last element child
import { expect } from 'vitest';

// Vitest 5's interface for custom matchers (its type parameters exactly as it declares them, or the merge fails)
declare module 'vitest' {
  interface Matchers<R extends void | Promise<void> = void | Promise<void>, T = unknown> {
    toHaveExactClasses: (classes: string[]) => R;
    toBeLastChildOf: (parent: Element) => R;
  }
}

const describe = (element: unknown): string =>
  element instanceof Element ? `<${element.tagName.toLowerCase()} class="${element.className}">` : String(element);

expect.extend({
  toHaveExactClasses(received: unknown, classes: string[]) {
    if (!(received instanceof Element)) {
      return { pass: false, message: () => `expected an element, got ${describe(received)}` };
    }
    const repeated = classes.filter((name, i) => classes.indexOf(name) !== i);
    if (repeated.length > 0) {
      // A repeat is usually a copy-paste where a different class was meant, so it fails even under `.not`.
      throw new Error(`toHaveExactClasses lists ${[...new Set(repeated)].join(' ')} more than once`);
    }
    const actual = [...received.classList].sort();
    const expected = [...classes].sort();
    const pass = actual.length === expected.length && actual.every((name, i) => name === expected[i]);
    return {
      pass,
      message: () =>
        pass
          ? `expected ${describe(received)} not to have exactly the classes ${expected.join(' ')}`
          : `expected ${describe(received)} to have exactly the classes ${expected.join(' ')}`,
      actual,
      expected
    };
  },
  toBeLastChildOf(received: unknown, parent: Element) {
    const pass = received instanceof Element && parent.lastElementChild === received;
    return {
      pass,
      message: () =>
        pass
          ? `expected ${describe(received)} not to be the last child of ${describe(parent)}`
          : `expected ${describe(received)} to be the last child of ${describe(parent)}, which ends with ${describe(parent.lastElementChild)}`
    };
  }
});

// DOM nodes are equal only when they're the same node, in toEqual and the call matchers too (toHaveBeenCalledWith…).
// Vitest's own rule is isEqualNode (same tag, attributes and children), which lets a check of which element pass for
// a look-alike sibling or a detached copy. Compare content through what tells nodes apart (textContent, outerHTML)
expect.addEqualityTesters([
  function sameNode(a: unknown, b: unknown): boolean | undefined {
    return a instanceof Node || b instanceof Node ? a === b : undefined;
  }
]);
