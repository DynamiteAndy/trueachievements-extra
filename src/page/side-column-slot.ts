import { waitForElement, whenParsed } from './wait';

interface SideColumnSlot {
  // The side column (`.main aside`)
  parent: HTMLElement;
  // Its first full section (not a `.smallpanel`), which a section of ours goes before: null to go last
  before: HTMLElement | null;
}

const fullSection = 'section:not(.smallpanel)';

// Where a section of ours goes at the top of the side column: before its first full section, as the site's own side
// sections go after its small panels and ads. Null if the page has no side column, or once `signal` aborts
export const waitForSideColumnSlot = async (signal?: AbortSignal): Promise<SideColumnSlot | null> => {
  const parent = await waitForElement('.main aside', { signal });
  if (!parent) {
    return null;
  }
  if (signal?.aborted) {
    return null;
  }

  // A side column with only small panels has no full section to wait for once the page is parsed
  const stop = new AbortController();
  signal?.addEventListener('abort', () => stop.abort(), { once: true });
  void whenParsed().then(() => stop.abort());
  const found = await waitForElement(fullSection, { root: parent, signal: stop.signal });
  stop.abort();

  return signal?.aborted ? null : { parent, before: found ?? parent.querySelector<HTMLElement>(fullSection) };
};
