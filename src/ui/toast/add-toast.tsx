import { mount, bodyReady } from '@ta-x-page';

import { Toast } from './Toast';

// Resolves with what takes it out again
export const toast = async (): Promise<() => void> => {
  const root = mount(<Toast />, await bodyReady());

  return () => root.unmount();
};
