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
