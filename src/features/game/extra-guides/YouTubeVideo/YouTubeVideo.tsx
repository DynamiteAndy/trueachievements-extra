import { useRef, useState } from 'preact/hooks';

// The site's image proxy, which its own lazy videos load their thumbnails through (so YouTube isn't reached until the
// video is played)
const imageProxy = 'https://ip.trueachievements.com/remote/';

interface YouTubeVideoProps {
  // The YouTube video's id
  id: string;
}

// A YouTube video as the site shows one in its posts (its lazyYT plugin, which achievement pages don't load): the
// video's thumbnail with YouTube's play button, swapped for the player once clicked. The play button is a real button
// (not a submit: the site's form wraps the page), so the keyboard starts the video too, its click reaching the
// thumbnail. Started from the focused button, focus moves on to the player that replaces it, rather than dropping to
// the page
export const YouTubeVideo = ({ id }: YouTubeVideoProps) => {
  const [playing, setPlaying] = useState(false);
  const focusPlayerRef = useRef(false);

  return (
    <div
      class={`lazyYT lazyYT-container${playing ? ' lazyYT-video-loaded' : ''}`}
      style={{ paddingBottom: '56.25%' }}
      data-youtube-id={id}
    >
      {playing ? (
        <iframe
          ref={(player) => {
            if (player && focusPlayerRef.current) {
              focusPlayerRef.current = false;
              player.focus({ preventScroll: true });
            }
          }}
          src={`https://www.youtube.com/embed/${id}?rel=0&autoplay=1`}
          title="YouTube video player"
          frameBorder="0"
          allowFullScreen
        />
      ) : (
        <div
          class="ytp-thumbnail lazyYT-image-loaded"
          onClick={(event) => {
            focusPlayerRef.current = event.currentTarget.contains(document.activeElement);
            setPlaying(true);
          }}
        >
          <button type="button" class="ytp-large-play-button ytp-button" aria-live="assertive" aria-label="Play video">
            <svg viewBox="0 0 68 48">
              <path
                fill="#1f1f1e"
                fill-opacity=".9"
                d="M.7 37.6s.6 4.7 2.7 6.8c2.5 2.7 6 2.6 7.5 2.9 5.4.5 23 .7 23 .7s14.4 0 23.9-.7c1.3-.2 4.2-.2 6.8-3 2-2 2.7-6.7 2.7-6.7s.7-5.5.7-11v-5.2c0-5.5-.7-11-.7-11s-.7-4.7-2.7-6.8C62 .9 59 .8 57.8.6 48.3 0 34 0 34 0S19.7 0 10.2.7C8.9.8 6 .9 3.4 3.6c-2 2-2.7 6.8-2.7 6.8S0 14.8 0 19.8v8.4c.1 4.9.7 9.4.7 9.4z"
                class="ytp-large-play-button-bg"
              />
              <path fill="#fff" d="m27 13.7 18.3 9.6L27 32.8V13.7z" />
            </svg>
          </button>
          <img
            src={`${imageProxy}${encodeURIComponent(`img.youtube.com/vi/${id}/hqdefault.jpg`)}?width=640`}
            alt={`${document.title} video`}
            height="480"
            width="640"
            fetchPriority="high"
            style={{ zIndex: -1, width: '100%', height: 'auto' }}
          />
        </div>
      )}
    </div>
  );
};
