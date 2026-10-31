// Dev builds only (the dev entry runs this just after the start mark, before anything else; the release build never
// includes it).
//
// The Preact DevTools extension puts its hook on the page's window, but with @grant our script runs in Tampermonkey's
// sandbox, whose window can't see it. preact/debug (next in the dev entry) looks for the hook on globalThis as it
// loads, so hand it the page's hook first. This is the one use of unsafeWindow allowed: an extension's hook, in dev
// builds only, never the site's globals.
type DevToolsWindow = { __PREACT_DEVTOOLS__?: unknown };

// Missing until the installed dev script is replaced with one that grants it (see build/metadata.ts)
const hook =
  typeof unsafeWindow === 'undefined' ? undefined : (unsafeWindow as unknown as DevToolsWindow).__PREACT_DEVTOOLS__;

if (hook) {
  (globalThis as DevToolsWindow).__PREACT_DEVTOOLS__ = hook;
}
