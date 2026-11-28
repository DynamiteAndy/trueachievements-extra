import { callAll } from '@ta-x-lib';
import { mount } from '@ta-x-page';
import { useLayoutEffect, useMemo, useRef } from 'preact/hooks';

import type { ComponentChildren } from 'preact';

import { cleanGuideHtml, isWebAddress } from '../guide-pages';
import styles from '../styles';
import { YouTubeVideo } from '../YouTubeVideo';

interface AchievementGuideSolutionProps {
  // The guide site's name and icon, as the solution's author
  name: string;
  icon: ComponentChildren;
  // The guide on the guide site, kept only where it's a web address (as a guide stored by an older version may not be)
  href: string;
  // e.g. This guide was imported from XboxAchievements.com
  info: string;
  // The guide's text as HTML, cleaned when it was read (links made absolute, anything that could run removed), and
  // again here, as a guide stored by an older version was cleaned less
  guide: string;
}

// A guide imported from a guide site, laid out like the site's own solutions (the gamer column, then the body)
export const AchievementGuideSolution = ({ name, icon, href, info, guide }: AchievementGuideSolutionProps) => {
  const body = useRef<HTMLDivElement>(null);
  const cleanedGuide = useMemo(() => cleanGuideHtml(guide, href), [guide, href]);

  // The guide's videos (the cleaner's lazyYT placeholders) play like the site's own
  useLayoutEffect(() => {
    const videos = [...(body.current?.querySelectorAll<HTMLElement>('div.lazyYT[data-youtube-id]') ?? [])].flatMap(
      (placeholder) => {
        if (!placeholder.parentNode) {
          return [];
        }

        const video = mount(
          <YouTubeVideo id={placeholder.dataset.youtubeId ?? ''} />,
          placeholder.parentNode,
          placeholder
        );
        placeholder.remove();
        return [video];
      }
    );

    return () => callAll(videos.map((video) => video.unmount));
  }, [cleanedGuide]);

  return (
    <li>
      <div class={`gamer ${styles.achievementGuideSolution}`}>
        {icon}
        <a href={isWebAddress(href) ? href : undefined} rel="nofollow" data-tlite="">
          {name}
        </a>
        <div class="info">{info}</div>
      </div>
      <article>
        {/* The guide site's own markup: it can't be written as JSX, so it's cleaned instead */}
        <div ref={body} class="body" dangerouslySetInnerHTML={{ __html: cleanedGuide }} />
      </article>
    </li>
  );
};
