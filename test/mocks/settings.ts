import { reloadSettings } from '@ta-x-storage';

// Settings are signals that read Tampermonkey storage once and then follow its changes. Before every test (every spec,
// through test/mocks/setup.ts) Tampermonkey's storage (localStorage, tampermonkey.ts) is cleared, then every setting
// reads its stored value again and listens again. Cleared here, just before the reload: a hook registered after this
// one would clear it after the settings had read the previous test's values
beforeEach(() => {
  localStorage.clear();
  reloadSettings();
});
