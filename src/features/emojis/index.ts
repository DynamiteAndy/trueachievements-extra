import emojiJson from 'emoji.json';
import { Compressed, decompress } from 'compress-json';
import { pubSub } from '@ta-x-components';
import { Constants, emojis } from '@ta-x-globals';
import { allConcurrently, extractBetween, waitForElement, waitForElements, waitForImages } from '@ta-x-utilities';
import { template } from '@ta-x-helpers';
import templatedTabs from '@ta-x-views/templates/tab-link.html';
import html from './emojis.html';

const apply = async (containers: HTMLElement[], emojiContent: Element): Promise<void> => {
  for (let i = 0; i < containers.length; i++) {
    const container = containers[i];
    const trueAchievementsContent = emojiContent.querySelector('#ta-x-tabs-trueachievements');
    let insertAtCursorElement: string = null;

    await waitForImages(container);

    ([...container.querySelectorAll('.smileydropdown span')] as HTMLElement[]).forEach((smiley) => {
      if (!insertAtCursorElement) {
        insertAtCursorElement = extractBetween("'", smiley.onclick.toString());
      }

      trueAchievementsContent.appendChild(smiley);
    });

    ([...container.querySelectorAll('.smileydropdown')] as HTMLElement[]).forEach((smiley) =>
      smiley.parentElement.remove()
    );

    const quickReplyEmojiToolbar = await waitForElement('.toolbar .formatbuttons:last-child', container);
    emojiContent = template(emojiContent, { emojis: { id: insertAtCursorElement } });
    quickReplyEmojiToolbar.appendChild(emojiContent);

    const firstTab = await waitForElement(`.${Constants.Styles.Components.Tab.tabLink}:first-child`, container);

    pubSub.publish('tabs:set', firstTab);
  }
};

const buildEmojis = (): Element => {
  const groupedEmojis = decompress(emojiJson as unknown as Compressed).reduce(
    (accumulator, emoji) => {
      const category = accumulator.get(emoji.group) || [];
      category.push(emoji);

      accumulator.set(emoji.group, category);

      return accumulator;
    },
    new Map([['TrueAchievements', []]])
  );

  const parsedDocument = new DOMParser().parseFromString(html, 'text/html');
  const parsedTemplateDocument = new DOMParser().parseFromString(templatedTabs, 'text/html');

  const emojiButton = parsedDocument.querySelector(`.${Constants.Styles.Emojis.featureJs}`);
  const emojiTabs = emojiButton.querySelector(`.${Constants.Styles.Components.Tab.tabLinkContainer}`);

  Array.from(groupedEmojis.entries()).forEach((emojiGroup: [string, unknown[]]) => {
    const tabLink = (
      parsedTemplateDocument.querySelector(`#${Constants.Templates.Components.Tab.tabLink}`) as HTMLTemplateElement
    ).content.firstElementChild.cloneNode(true);

    const tabId = emojiGroup[0].replace(/[^A-Z0-9]/gi, '').toLowerCase();
    const templatedTabLink = template(tabLink as HTMLElement, {
      tab: { link: emojiGroup[0], id: tabId }
    });
    emojiTabs.appendChild(templatedTabLink);

    const tabContent = (
      parsedTemplateDocument.querySelector(`#${Constants.Templates.Components.Tab.tabContent}`) as HTMLTemplateElement
    ).content.firstElementChild.cloneNode(true);

    let emojiHtml = '';
    emojiGroup[1].forEach((emoji: { char: string; name: string; codes: string }) => {
      emojiHtml += `<span onclick="InsertAtCursor('{emojis.id}','${emoji.char}', 'ta-x-emoji-dropdown'); return false;" title='${emoji.name}'>${emoji.char}</span>`;
    });

    const templatedTabContent = template(tabContent as HTMLElement, {
      tab: { content: emojiHtml, link: emojiGroup[0], id: tabId }
    });

    emojiTabs.parentNode.append(templatedTabContent);
  });

  return emojiButton;
};

export default async (): Promise<void> => {
  if (!emojis.enabled) {
    return;
  }
  const elementSelectors = [
    '#aeb_txtQuickReply',
    '#aeb_aebMessageBody',
    '#aeb_aebMessage',
    '#aeb_txtAddSubComment',
    '#aeb_aebComment'
  ];
  const replyContainer = await waitForElement(elementSelectors.join(', '));

  if (!replyContainer) {
    return;
  }

  const emojiContent = buildEmojis();

  allConcurrently(
    'Emojis - Apply',
    elementSelectors.map((selector: string) => ({
      name: `emojis-${selector}`,
      task: async () => {
        const containers = await waitForElements(selector);

        if (!containers || containers.length === 0) {
          return;
        }

        await apply(containers, emojiContent);
      }
    })),
    elementSelectors.length
  );
};
