import emojiJson from 'emoji.json';
import { type Compressed, decompress } from 'compress-json';
import { pubSub } from '@ta-x-components';
import { miscellaneousImprovements } from '@ta-x-globals';
import { allConcurrently, waitForElement, waitForElements, waitForImages } from '@ta-x-utilities';
import { template } from '@ta-x-helpers';
import templatedTabs from '@ta-x-views/templates/tab-link.html';
import html from './emojis.html';
import styles from './styles';

let builtEmojis: Element = null;
const elementSelectors = [
  '#aeb_txtQuickReply',
  '#aeb_aebMessageBody',
  '#aeb_aebMessage',
  '#aeb_txtAddSubComment',
  '#aeb_aebComment'
];

const defaultSmileys = [
  { name: 'smile', code: '[smile]', width: 15, height: 15 },
  { name: 'laugh', code: '[laugh]', width: 15, height: 15 },
  { name: 'wink', code: '[wink]', width: 15, height: 15 },
  { name: 'redface', code: '[redface]', width: 15, height: 15 },
  { name: 'angry', code: '[angry]', width: 18, height: 16 },
  { name: 'cry', code: '[cry]', width: 15, height: 15 },
  { name: 'roll', code: '[roll]', width: 15, height: 15 },
  { name: 'shock', code: '[shock]', width: 15, height: 15 },
  { name: 'warning', code: '[warning]', width: 22, height: 19 },
  { name: 'clap', code: '[clap]', width: 30, height: 15 },
  { name: 'dance', code: '[dance]', width: 25, height: 29 },
  { name: 'music', code: '[music]', width: 32, height: 25 },
  { name: 'wave', code: '[wave]', width: 25, height: 15 },
  { name: 'sleep', code: '[sleep]', width: 45, height: 18 },
  { name: 'headspin', code: '[headspin]', width: 37, height: 23 },
  { name: 'facepalm', code: '[facepalm]', width: 22, height: 16 },
  { name: 'compute', code: '[compute]', width: 40, height: 20 },
  { name: 'toast', code: '[toast]', width: 57, height: 16 },
  { name: 'dive', code: '[dive]', width: 34, height: 33 },
  { name: 'rock', code: '[rock]', width: 29, height: 25 }
];

const defaultControllerButtons = [
  'A', 'B', 'X', 'Y', 'LB', 'RB', 'LT', 'RT',
  'up', 'down', 'left', 'right',
  'upleft', 'upright', 'downleft', 'downright',
  'LSu', 'LSd', 'LSl', 'LSr', 'LSul', 'LSur', 'LSdl', 'LSdr',
  'RSu', 'RSd', 'RSl', 'RSr', 'RSul', 'RSur', 'RSdl', 'RSdr',
  'dpad', 'LSc', 'RSc', 'LS', 'RS', 'back', 'start', 'guide'
].map((btn) => ({
  name: `cn_${btn}`,
  code: `[cn_${btn}]`,
  width: 18,
  height: 18
}));

const ensureDropdownButtonPanelToggle = (): void => {
  if (typeof window !== 'undefined' && typeof (window as any).DropdownButtonPanel_Toggle !== 'function') {
    const script = document.createElement('script');
    script.textContent = `
      function DropdownButtonPanel_Toggle(n) {
          var r = $(n), t = $(r.parent().children("div")[0]), u;
          if ($(t).css("display") == "none") {
              for (u = $(".dropdownbuttonpanel"),
              i = 0; i < u.length; i++)
                  $(u[i]).css("display") != "none" && $(u[i]).slideUp(100);
              t.css("top", r.position().top + r.height() + 11);
              t.css("left", r.position().left + 2);
              t.css("position", "absolute");
              t.slideDown(100)
          } else
              t.slideUp(100)
      }
    `;
    (document.head || document.documentElement).appendChild(script);
  }
};

const apply = async (containers: HTMLElement[]): Promise<void[]> =>
  await allConcurrently(
    'Emojis - Apply',
    containers.map((container: HTMLElement) => ({
      name: 'emojis-container',
      task: async (): Promise<void> => {
        const emojiButtonClone = builtEmojis.cloneNode(true) as Element;
        const trueAchievementsContent = emojiButtonClone.querySelector('#ta-x-tabs-trueachievements');
        const insertAtCursorElement = container.querySelector('textarea').id;;

        await waitForImages(container);

        const smileys = [...container.querySelectorAll('.smileydropdown span')] as HTMLElement[];
        if (smileys.length > 0) {
          smileys.forEach((smiley) => {
            trueAchievementsContent.appendChild(smiley);
          });
        } else {
          const defaultSmileysHtml = defaultSmileys
            .map(
              (s) =>
                `<span onclick="InsertAtCursor('${insertAtCursorElement}','${s.code}', 'smileydropdown'); return false;" tabindex="0"><img src="/images/smiley/${s.name}.gif" alt="${s.name}" width="${s.width}" height="${s.height}"></span>`
            )
            .join('');
          trueAchievementsContent.insertAdjacentHTML('beforeend', defaultSmileysHtml);
        }

        const smileyDropdowns = [...container.querySelectorAll('.smileydropdown')] as HTMLElement[];
        smileyDropdowns.forEach((smileyDropdown) => smileyDropdown.parentElement.remove());

        const quickReplyEmojiToolbar = await waitForElement('.toolbar .formatbuttons:last-child', container);
        const emojiContent = template(emojiButtonClone as HTMLElement, { emojis: { id: insertAtCursorElement } });
        quickReplyEmojiToolbar.appendChild(emojiContent);

        const firstTab = await waitForElement(`.${styles.jsTabsLink}:first-child`, container);
        pubSub.publish('tabs:set', firstTab);
      }
    }))
  );

const buildEmojis = (): void => {
  const emojiGroups = decompress(emojiJson as unknown as Compressed);
  const parsedDocument = new DOMParser().parseFromString(html, 'text/html');
  const parsedTemplateDocument = new DOMParser().parseFromString(templatedTabs, 'text/html');

  const emojiButton = parsedDocument.querySelector(`.${styles.jsEmojis}`);
  const emojiTabs = emojiButton.querySelector(`.${styles.jsTabsLinkContainer}`);

  emojiGroups.forEach(({ group, emojis }) => {
    const tabLink = (
      parsedTemplateDocument.querySelector(`#ta-x-template-tabs-link`) as HTMLTemplateElement
    ).content.firstElementChild.cloneNode(true);

    const tabId = group.replace(/[^A-Z0-9]/gi, '').toLowerCase();
    const templatedTabLink = template(tabLink as HTMLElement, {
      tab: { link: group, id: tabId }
    });
    emojiTabs.appendChild(templatedTabLink);

    const tabContent = (
      parsedTemplateDocument.querySelector(`#ta-x-template-tabs-content`) as HTMLTemplateElement
    ).content.firstElementChild.cloneNode(true);

    let emojiHtml = '';
    emojis.forEach((emoji: { char: string; name: string }) => {
      emojiHtml += `<span onclick="InsertAtCursor('{emojis.id}','${emoji.char}', '${styles.jsEmojiDropdown}'); return false;" title='${emoji.name}'>${emoji.char}</span>`;
    });

    const templatedTabContent = template(tabContent as HTMLElement, {
      tab: { content: emojiHtml, link: group, id: tabId }
    });

    emojiTabs.parentNode.append(templatedTabContent);
  });

  builtEmojis = emojiButton;
};

const listen = (): void => {
  const observer = new MutationObserver(async (mutations: MutationRecord[]) => {
    console.log('Emojis - MutationObserver triggered');
    for (const mutation of mutations) {
      if (mutation.type !== 'childList') {
        return;
      }

      if (!(mutation.target instanceof HTMLElement)) {
        return;
      }

      if (!mutation.addedNodes || mutation.addedNodes.length === 0) {
        return;
      }

      const matchingNodes = [...mutation.addedNodes].filter((node: Node) => {
        if (node.nodeType !== Node.ELEMENT_NODE) {
          return false;
        }

        const elementNode = node as HTMLElement;
        return (
          elementNode.matches(elementSelectors.join(', ')) || elementNode.querySelector(elementSelectors.join(', '))
        );
      }) as HTMLElement[];

      if (matchingNodes.length > 0) {
        if (!builtEmojis) {
          buildEmojis();
        }

        await apply(matchingNodes);
      }
    }
  });

  observer.observe(document.body, {
    attributes: false,
    childList: true,
    subtree: true
  });
};

export default async (): Promise<void> => {
  if (!miscellaneousImprovements.emojis) {
    return;
  }

  const replyContainers = await waitForElements(elementSelectors.join(', '));
  if (replyContainers?.length > 0) {
    buildEmojis();
    ensureDropdownButtonPanelToggle();
    await apply(replyContainers);
  }

  listen();
};
