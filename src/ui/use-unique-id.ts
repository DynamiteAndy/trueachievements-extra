import { useState } from 'preact/hooks';

let lastId = 0;

// An id unique on the page, the same for the component's whole life. Not Preact's useId: that counts per render root,
// and we mount many roots (two would give the same id)
export const useUniqueId = (prefix: string): string => {
  const [id] = useState(() => `${prefix}-${++lastId}`);

  return id;
};
