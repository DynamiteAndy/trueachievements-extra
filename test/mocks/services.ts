import { httpIntercept } from '@ta-x-fetch';
import { intersectionObserver, mutationObserver, resizeObserver } from '@ta-x-page';

// The services are page-wide singletons, so a listener a test registers (directly, or through a feature's
// waitForElement or listen code) would otherwise keep running in every later test
afterEach(() => {
  mutationObserver.stop();
  resizeObserver.stop();
  intersectionObserver.stop();
  httpIntercept.stop();
});
