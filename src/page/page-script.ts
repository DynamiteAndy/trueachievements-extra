// Scripts that run in the page itself rather than in the userscript's sandbox: anything using the page's own globals
// (TinyMCE's editor, the site's jQuery and functions), which the userscript can't reach (`unsafeWindow` is banned).
//
// A page function is an ordinary function in our code, so it's type-checked, linted and minified with the rest of the
// bundle, but it's injected as its own source text. So it may use only its parameters and what the page itself has
// (`document`, `window`, `console`): never an import, a constant from its module or a helper beside it. Its inputs are
// passed as arguments: JSON values, page globals by name (`pageGlobal('tinymce')`), or other page functions (by their
// source, for one to call). page-script.spec.ts runs each of ours from its source in an empty context, which fails on
// anything it reaches for outside itself.

// A page global, by name, passed to a page function as that global itself (e.g. the editor: `tinymce.activeEditor`)
interface PageGlobal {
  pageGlobal: string;
}

export const pageGlobal = (expression: string): PageGlobal => ({ pageGlobal: expression });

// Any function: each page function types its own parameters (for TinyMCE's, see tinymce/tinymce-api.ts)
export type PageFunction = (...args: never[]) => unknown;

type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue };
export type PageArgument = JsonValue | PageGlobal | PageFunction;

const isPageGlobal = (arg: PageArgument): arg is PageGlobal =>
  typeof arg === 'object' && arg !== null && !Array.isArray(arg) && typeof arg.pageGlobal === 'string';

const argumentSource = (arg: PageArgument): string => {
  if (typeof arg === 'function') {
    return `(${String(arg)})`;
  }

  return isPageGlobal(arg) ? arg.pageGlobal : JSON.stringify(arg);
};

// The source that calls `fn` with `args` in the page: `(fn)(arg, …);`
export const pageScript = (fn: PageFunction, ...args: PageArgument[]): string =>
  `(${String(fn)})(${args.map(argumentSource).join(', ')});`;

// A <script> running `fn` with `args` once it's added to the page
export const createPageScript = (id: string, fn: PageFunction, args: PageArgument[]): HTMLScriptElement => {
  const script = document.createElement('script');
  script.id = id;
  script.textContent = pageScript(fn, ...args);

  return script;
};

// Runs `fn` with `args` in the page, through a <script> added to its head
export const addPageScript = (id: string, fn: PageFunction, args: PageArgument[] = []): HTMLScriptElement =>
  (document.head || document.documentElement).appendChild(createPageScript(id, fn, args));
