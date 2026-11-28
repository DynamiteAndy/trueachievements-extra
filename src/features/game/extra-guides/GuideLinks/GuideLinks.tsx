import { AskForm, clickOnEnterOrSpace, Close, EditableHeader, linkAction, Pencil, Plus } from '@ta-x-ui';
import { useLayoutEffect, useRef, useState } from 'preact/hooks';

import type { ComponentChildren } from 'preact';

import styles from '../styles';

// One of a game's guide pages on a guide site, and whether its guides have been read
export interface GuideLink {
  url: string;
  // How many guides were read from it, or null if they haven't been yet
  guides: number | null;
  importing: boolean;
  // Still importing after a while, so the row says where to look
  slow?: boolean;
}

export interface GuideLinksProps {
  // The guide site's name, e.g. PlaystationTrophies
  site: string;
  links: GuideLink[];
  // Whether a game can link several pages (a collection split across games); otherwise adding replaces the link
  multiple: boolean;
  // What the tab is for, shown above the linked pages
  summary: ComponentChildren;
  askInformation: ComponentChildren;
  // The field's label
  askLabel: string;
  // Called with what was typed; false if it isn't one of the site's guide pages
  onAdd: (url: string) => boolean;
  onRemove: (url: string) => void;
  onImport: (url: string) => void;
}

// The page's path on the guide site, e.g. metal-gear-solid-2-hd/guide/
const shortUrl = (url: string): string => new URL(url).pathname.replace(/^\/game\//, '');

// A guide site's linked pages for this game, each with its guides' status, and a field (behind +) to add another
export const GuideLinks = ({
  site,
  links,
  multiple,
  summary,
  askInformation,
  askLabel,
  onAdd,
  onRemove,
  onImport
}: GuideLinksProps) => {
  const [adding, setAdding] = useState(false);
  const showForm = links.length === 0 || adding;
  const panelRef = useRef<HTMLDivElement>(null);
  // The row just removed, so the focus can go to what's there now (it went with the row's ×)
  const removedAtRef = useRef<number | null>(null);

  useLayoutEffect(() => {
    if (removedAtRef.current === null || !panelRef.current) {
      return;
    }

    const removes = [...panelRef.current.querySelectorAll<HTMLElement>(`.${styles.guideLinksList} [data-remove]`)];
    const next =
      removes[Math.min(removedAtRef.current, removes.length - 1)] ??
      panelRef.current.querySelector<HTMLElement>('[role="button"], input[type="text"]');
    removedAtRef.current = null;
    next?.focus();
  }, [links]);

  // The form clears its field once a page is added (true)
  const add = (url: string): boolean => {
    if (url === '' || !onAdd(url)) {
      return false;
    }

    setAdding(false);
    return true;
  };

  return (
    <div ref={panelRef} class={styles.guideLinks}>
      {links.length !== 0 && (
        <>
          <p>{summary}</p>
          <EditableHeader
            label="Linked guide pages"
            icon={multiple ? <Plus /> : <Pencil />}
            actionTitle={multiple ? `Add a ${site} guide page` : `Change the ${site} guide page`}
            onAction={showForm ? undefined : () => setAdding(true)}
          />
          <ul class={styles.guideLinksList}>
            {links.map(({ url, guides, importing, slow }, index) => (
              <li key={url}>
                <a href={url} target="_blank" rel="noopener noreferrer">
                  {shortUrl(url)}
                </a>
                {/* Read out as it changes (Importing…, then the guides), and focused once Import goes from under it */}
                <span aria-live="polite" tabIndex={-1}>
                  {importing ? (
                    'Importing…'
                  ) : guides === null ? (
                    <a
                      href="#"
                      role="button"
                      onClick={(event) => {
                        const status = event.currentTarget.parentElement;
                        linkAction(() => onImport(url))(event);
                        status?.focus();
                      }}
                      onKeyDown={clickOnEnterOrSpace}
                    >
                      Import
                    </a>
                  ) : guides === 1 ? (
                    '1 guide'
                  ) : (
                    `${guides} guides`
                  )}
                </span>
                <a
                  href="#"
                  role="button"
                  title="Remove"
                  aria-label={`Remove ${shortUrl(url)}`}
                  data-remove=""
                  // Its own handler, not linkAction: a callback passed to it that sets a ref trips lint's react(refs)
                  onClick={(event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    removedAtRef.current = index;
                    onRemove(url);
                  }}
                  onKeyDown={clickOnEnterOrSpace}
                >
                  <Close />
                </a>
                {importing && slow && (
                  <p class={`${styles.guideLinksSlow} small`}>
                    This is taking a while: check the guide tab, or open the guide page yourself and close that tab.
                  </p>
                )}
              </li>
            ))}
          </ul>
          {links.some(({ importing }) => importing) && (
            <p class="small">
              {site} doesn't let me fetch its guides, so I'm reading them from the guide page in a new tab. If it
              doesn't finish, switch to that tab: {site} may want you to confirm you're not a bot.
            </p>
          )}
        </>
      )}
      {showForm && (
        <AskForm
          // Once there are links the summary above says what the tab is for, so adding another needs no more text
          info={links.length === 0 ? askInformation : undefined}
          label={askLabel}
          buttonText={links.length === 0 ? 'Save' : multiple ? 'Add' : 'Change'}
          onSubmit={add}
          // Opened by + or the pencil, it can be closed again without adding; the first link's form, shown while
          // there are none, has nothing to go back to
          onCancel={adding ? () => setAdding(false) : undefined}
        />
      )}
    </div>
  );
};
