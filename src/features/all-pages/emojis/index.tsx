import { allConcurrently, callAll } from '@ta-x-lib';
import { mount, mutationObserver, waitForElement, whenParsed } from '@ta-x-page';
import { settings, whileSetting } from '@ta-x-storage';
import { type Compressed, decompress } from 'compress-json';
import emojiJson from 'emoji.json';

import { ensureDropdownButtonPanelToggle } from './dropdown-toggle';
import { EmojiPicker, type EmojiGroup } from './EmojiPicker';
import styles from './styles';

const { emojis: setting } = settings.allPages;

let emojiGroups: EmojiGroup[] | null = null;
// The site's reply and comment boxes
const replyBoxes = [
  '#aeb_txtQuickReply',
  '#aeb_aebMessageBody',
  '#aeb_aebMessage',
  '#aeb_txtAddSubComment',
  '#aeb_aebComment'
].join(', ');

const loadEmojiGroups = (): EmojiGroup[] =>
  (emojiGroups ??= decompress<EmojiGroup[]>(emojiJson as unknown as Compressed));

// Adds a picker to each reply box, with what the pickers need the first time, keeping each picker's unmount in
// `pickers`. Once `aborted` (the setting went off), a box still waiting for its toolbar gets none
const addPickers = async (containers: HTMLElement[], pickers: (() => void)[], aborted: AbortSignal): Promise<void> => {
  if (containers.length === 0) {
    return;
  }

  const groups = loadEmojiGroups();
  ensureDropdownButtonPanelToggle();

  await allConcurrently(
    'Emojis - Pickers',
    containers.map((container: HTMLElement) => ({
      name: 'all-pages:emojis:picker',
      task: async (): Promise<void> => {
        const textareaId = container.querySelector('textarea')?.id;
        // A box that has its picker already (one the site put back, or seen twice) keeps the one
        if (!textareaId || container.querySelector(`.${styles.jsEmojis}`)) {
          return;
        }

        const toolbar = await waitForElement('.toolbar .formatbuttons:last-child', {
          root: container,
          signal: aborted
        });
        // A box seen again while its toolbar was awaited gets its picker from whichever call resumes first
        if (!toolbar || aborted.aborted || container.querySelector(`.${styles.jsEmojis}`)) {
          return;
        }

        // The site's smiley and controller buttons: each a div in the toolbar holding its trigger and usually its
        // dropdown, though some boxes (an achievement's comment box) have the smiley trigger alone, which does nothing
        const slotOf = (selector: string): Element | null =>
          container.querySelector(selector)?.closest('.formatbuttons > div') ?? null;
        const smileySlot = slotOf('.smileydropdown, .toolbar .fa-smile-o');
        const controllerSlot = slotOf('.controllerbuttondropdown, .toolbar .fa-gamepad');

        // The picker has both in its own tabs, so it takes the smiley button's place, hiding both slots while it's
        // there. Its root is a slot itself (a div in the toolbar group, as the site's are), so the site's button styles
        // (`.formatbuttons > div > a`) reach its trigger. A box without a smiley button gets it at the end of the
        // toolbar
        const siteButtons = [smileySlot, controllerSlot].filter((slot): slot is Element => slot !== null);
        const picker = <EmojiPicker textareaId={textareaId} groups={groups} siteButtons={siteButtons} />;

        const mounted = smileySlot?.parentNode
          ? mount(picker, smileySlot.parentNode, smileySlot.nextSibling)
          : mount(picker, toolbar);
        pickers.push(mounted.unmount);
      }
    }))
  );
};

// A picker in every reply box while the setting is on: applied live, so turning it off in the menu takes each picker
// out (giving the site's own buttons back) and stops watching for new boxes at once. The dropdown toggle page script
// stays once added: it only defines the site's own function where the page lacks it. Returns the stop
export default (): (() => void) =>
  whileSetting(
    [setting],
    () => setting.value,
    async (aborted) => {
      // The boxes in the page's own markup, once it's parsed; from then on, the ones added later (e.g. a comment's
      // reply box). Both in the same task, so no box is missed or done twice
      await whenParsed();
      if (aborted.aborted) {
        return undefined;
      }

      const pickers: (() => void)[] = [];
      const boxes = [...document.querySelectorAll<HTMLElement>(replyBoxes)];
      const stopWatching = mutationObserver.onElementAdded(replyBoxes, (element) =>
        addPickers([element], pickers, aborted)
      );

      // Turned off while a box still waits for its toolbar, the wait gives up at once (it takes `aborted`), so this
      // undo follows straight away
      await addPickers(boxes, pickers, aborted);

      return (): void => {
        stopWatching();
        callAll(pickers.splice(0));
      };
    }
  );
