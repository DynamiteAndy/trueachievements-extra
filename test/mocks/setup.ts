import './tampermonkey';
import './settings';
import './element';
import './services';
import './indexed-db';
import './network';
import './page';
import './matchers';

// Our shared barrels whose exports specs spy on (lib, fetch, page) as themselves, but in a module object specs can
// `vi.spyOn`. Applies to every spec; one that needs something else mocks the module itself, which wins.
vi.mock('@ta-x-lib', async () => await vi.importActual('@ta-x-lib'));
vi.mock('@ta-x-fetch', async () => await vi.importActual('@ta-x-fetch'));
vi.mock('@ta-x-page', async () => await vi.importActual('@ta-x-page'));

// Each test starts as a new tab would: nothing in its session storage
beforeEach(() => {
  sessionStorage.clear();
});
