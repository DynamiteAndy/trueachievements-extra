// Measures the mutation observer's record handling, which runs for every mutation on every page. Run with
// `pnpm vitest bench mutation-observer` (plain `vitest run` ignores it). To compare a change: add
// `{ writeResult: './dist/test-results/benchmarks/mutation-observer/<name>.json' }` (git ignores it) before it,
// then `bench.compare(bench.from('before', thatPath), bench('after', …))`.
import { find } from '@ta-x-test';

import { mutationObserver } from './mutation-observer';

type Handler = { handleMutations: (records: MutationRecord[]) => void };

// A page's matchers, as live: the emoji reply boxes, the forum links, a few waitForElements, the sticky header's gamer
// menu, and two attribute watchers (the editor's theme sync)
const setUpPage = () => {
  document.body.innerHTML =
    '<div class="page" data-theme="dark"><nav class="nav-gamer"></nav><button data-x="dark"></button></div>';
  const page = find('.page');
  const noop = () => undefined;
  mutationObserver.onElementAdded('#aeb_txtQuickReply, #aeb_aebMessageBody, #aeb_aebComment', noop);
  mutationObserver.onElementAdded('a[href*="/forum"]', noop);
  // waitForElement-style matchers that never match here, so they stay registered for every iteration
  for (const selector of ['.mce-tinymce', '#txtWalkthrough_ifr', '.js-ta-x-settings-menu-wrench', '.author']) {
    mutationObserver.onElementAdded(selector, noop, { once: true });
  }
  mutationObserver.onAttributeChange(find('.nav-gamer', page), ['class'], noop);
  mutationObserver.onAttributeChange(page, ['data-theme'], noop);
  mutationObserver.onAttributeChange(find('button', page), ['data-x'], noop);

  // Ad slots filling in: a small subtree each, then attribute churn on it, as ad scripts do
  const records: MutationRecord[] = [];
  const none = [] as unknown as NodeList;
  for (let i = 0; i < 50; i++) {
    const slot = document.createElement('div');
    slot.innerHTML = '<div class="ad"><ins class="adsbygoogle"></ins><span><a href="/x">x</a></span><img></div>';
    page.append(slot);
    records.push({
      type: 'childList',
      target: page,
      addedNodes: [slot] as unknown as NodeList,
      removedNodes: none
    } as unknown as MutationRecord);
    for (let j = 0; j < 4; j++) {
      records.push({
        type: 'attributes',
        target: slot.firstElementChild,
        attributeName: 'style',
        addedNodes: none,
        removedNodes: none
      } as unknown as MutationRecord);
    }
  }

  return { records, attributeOnly: records.filter((record) => record.type === 'attributes') };
};

const handler = mutationObserver as unknown as Handler;

test('mutation observer: a batch of 250 records (50 ad slots added, 200 attribute changes)', async ({ bench }) => {
  const { records } = setUpPage();

  await bench('mixed batch', () => handler.handleMutations(records)).run();
});

test('mutation observer: 200 attribute changes', async ({ bench }) => {
  const { attributeOnly } = setUpPage();

  await bench('attribute changes', () => handler.handleMutations(attributeOnly)).run();
});
