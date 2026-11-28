import styles from '../styles';

interface WalkthroughEditor {
  name: string;
  href: string;
  // e.g. Owner, Editor, Contributor
  role: string;
  // Some walkthroughs' gamer links are rel="nofollow"
  rel: string | null;
}

// One gamer from the walkthrough's "Gamers Involved" list: their avatar, then each role they have
export interface WalkthroughEditorRow {
  avatar: {
    src: string;
    alt: string;
    // Linked to the gamer on most walkthroughs, but not on some (e.g. single-page ones)
    link: {
      href: string;
      // The site marks most avatar links "iml", but not all
      iml: boolean;
    } | null;
  } | null;
  editors: WalkthroughEditor[];
}

interface WalkthroughEditorsProps {
  rows: WalkthroughEditorRow[];
}

const Avatar = ({ src, alt }: { src: string; alt: string }) => (
  <img src={src} alt={alt} title={alt} class="smallicon" width={32} height={32} />
);

export const WalkthroughEditors = ({ rows }: WalkthroughEditorsProps) => (
  <div class={styles.showOwnerProgressEditorWrapper}>
    {rows.map(({ avatar, editors }, index) => (
      <div key={index} class={styles.showOwnerProgressEditorRow}>
        {avatar &&
          (avatar.link ? (
            <a href={avatar.link.href} class={avatar.link.iml ? 'iml' : undefined}>
              <Avatar {...avatar} />
            </a>
          ) : (
            <Avatar {...avatar} />
          ))}
        {editors.map(({ name, href, role, rel }) => (
          <div key={href + role} class={styles.showOwnerProgressEditor}>
            <a href={href} rel={rel ?? undefined}>
              {name}
            </a>{' '}
            ({role})
          </div>
        ))}
      </div>
    ))}
  </div>
);
