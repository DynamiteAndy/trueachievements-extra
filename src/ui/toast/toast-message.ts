import { signal } from '@preact/signals';

import type { ToastMessage } from './Toast';

// The latest message for the site's toast. Toast shows it; anything can set it through showToast, before or after
// the toast is mounted (it shows once it is).
export const toastMessage = signal<ToastMessage | null>(null);

// Shows a message in the site's toast, replacing any showing. Each call is a new object, so the same text twice shows
// twice.
export const showToast = (message: ToastMessage): void => {
  toastMessage.value = { ...message };
};
