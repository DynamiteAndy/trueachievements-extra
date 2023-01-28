import emojiJson from 'emoji.json';
import { pubSub } from '@ta-x-components';
import { Constants, emojis } from '@ta-x-globals';
import { waitForElement } from '@ta-x-utilities';
import { template } from '@ta-x-helpers';
import templatedTabs from '@ta-x-views/templates/tab-link.html';
import html from './emojis.html';

const applyBody = async(replyContainer: HTMLElement): Promise<void> => {
  const groupedEmojis = emojiJson.reduce((accumulator, emoji) => {
    const category = accumulator.get(emoji.group) || [];
    category.push(emoji);
    
    accumulator.set(emoji.group, category);

    return accumulator;
  }, new Map([['TrueAchievements', []]]));

  // const filteredEmojis = [ '263A FE0F', '263A', '2639', '2620', '2763', '2764',
  //   '1F5E3', '1F3FB', '1F3FC', '1F3FD', '1F3FE', '1F3FF', '1F573', '1F54A', '1F577',
  //   '1F578', '1F3F5', '2618', '1F336', '1F37D', '1F310', '1F3F3', '26A0', '2622',
  //   '2623', '1F5E8', '1F5EF', '1F441', '26F7', '1F43F', '1F576', '1F6CD', '26D1',
  //   '1F39A', '1F399', '1F39B', '260E'];

  const parsedDocument = new DOMParser().parseFromString(html, 'text/html');
  const parsedTemplateDocument = new DOMParser().parseFromString(templatedTabs, 'text/html');

  const emojiButton = parsedDocument.querySelector(`.${Constants.Styles.Emojis.featureJs}`);
  const emojiTabs = emojiButton.querySelector(`.${Constants.Styles.Components.Tab.tabLinkContainer}`);

  Array.from(groupedEmojis.entries()).forEach((emojiGroup: [string, unknown[]]) => {
    const tabLink = (parsedTemplateDocument.querySelector(`#${Constants.Templates.Components.Tab.tabLink}`) as HTMLTemplateElement)
    .content.firstElementChild.cloneNode(true);

    const tabId = emojiGroup[0].replace(/[^A-Z0-9]/ig, '').toLowerCase();
    const templatedTabLink = template(tabLink as HTMLElement, { tab: { link: emojiGroup[0], id: tabId }});
    emojiTabs.appendChild(templatedTabLink);

    const tabContent = (parsedTemplateDocument.querySelector(`#${Constants.Templates.Components.Tab.tabContent}`) as HTMLTemplateElement)
    .content.firstElementChild.cloneNode(true);

    let emojiHtml = '';
    emojiGroup[1].forEach((emoji: { char: string, name: string, codes: string }) => {
      // if (filteredEmojis.includes(emoji.codes)) return;
      emojiHtml += `<a href='#' data-emoji-code='${emoji.codes}' onclick="InsertAtCursor('txtQuickReply','${emoji.char}', 'ta-x-emoji-dropdown'); return false;" title='${emoji.name}'>${emoji.char}</a>`;
    });

    const templatedTabContent = template(tabContent as HTMLElement, { tab: { content: emojiHtml, link: emojiGroup[0], id: tabId }});

    emojiTabs.parentNode.append(templatedTabContent);
  });

  const trueAchievementsContent = emojiButton.querySelector('#ta-x-tabs-trueachievements');
  ([...replyContainer.querySelectorAll('.smileydropdown a')] as HTMLElement[]).forEach(smiley => trueAchievementsContent.appendChild(smiley));
  ([...replyContainer.querySelectorAll('.smileydropdown')] as HTMLElement[]).forEach(smiley => smiley.parentElement.remove());

  const quickReplyEmojiToolbar = await waitForElement('.toolbar .formatbuttons:last-child', replyContainer);
  quickReplyEmojiToolbar.appendChild(emojiButton);

  const firstTab = await waitForElement(`.${Constants.Styles.Components.Tab.tabLink}:first-child`, replyContainer);

  pubSub.publish('tabs:set', firstTab);
};

export default async(): Promise<void> => {
  if (!emojis.enabled) return;
  const replyContainer = await waitForElement('#aeb_txtQuickReply, #aeb_aebMessageBody');

  if (!replyContainer) return;

  await applyBody(replyContainer);
};
