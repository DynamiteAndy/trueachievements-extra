// Dev builds only (the dev entry runs this before the script; the release build never includes it): Preact's debug
// warnings (bad props, misused hooks, missing keys) in the console, and the DevTools connection, which needs the hook
// devtools-hook.ts hands over first.
import 'preact/debug';
