// Dev builds only (the dev entry runs this before the script; the release build never includes it): logs each signal
// change and the effects it runs to the console, settings by their storage key. The Signals DevTools extension can't
// see the script's sandboxed signals, so the console log is what it gives here
import '@preact/signals-debug';
