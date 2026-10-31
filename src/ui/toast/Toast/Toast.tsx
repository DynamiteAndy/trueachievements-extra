import { classNames } from '@ta-x-lib';
import { useEffect, useState } from 'preact/hooks';

import type { ComponentChildren } from 'preact';

import styles from '../styles';
import { toastMessage } from '../toast-message';

type ToastType = 'info' | 'success' | 'warning' | 'danger';

export interface ToastMessage {
  text: ComponentChildren;
  type: ToastType;
  timeoutMs?: number;
}

// Matches the site's .fade transition
export const FADE_MS = 300;
export const DEFAULT_TIMEOUT_MS = 3000;

type Phase = 'entering' | 'visible' | 'leaving';

// Renders the site's own jQuery toast markup (jq-toast-*) so it picks up the site's toast styling, and
// animates with the site's fade / fade-in classes. A new message replaces the current one, as $.toast does. It shows
// each message set on the toastMessage signal (showToast): fades it in, waits, fades it out and removes it. It stays while
// the pointer is over it or the focus is in it (a link in it can be reached and read), and waits its full time again
// once let go.
export const Toast = () => {
  // Reading the signal re-renders this component whenever a new message is set
  const latest = toastMessage.value;
  const [message, setMessage] = useState<ToastMessage | null>(null);
  const [phase, setPhase] = useState<Phase>('entering');
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const held = hovered || focused;

  useEffect(() => {
    if (!latest) {
      return undefined;
    }

    let frame: number;

    setMessage(latest);
    setPhase('entering');

    // Two frames so the browser paints the faded-out state before fade-in starts the transition.
    frame = requestAnimationFrame(() => {
      frame = requestAnimationFrame(() => setPhase('visible'));
    });

    // A newer message (or unmounting) stops this one's frames
    return () => cancelAnimationFrame(frame);
  }, [latest]);

  // The message leaves after its time, unless held; held while fading out, it comes back
  useEffect(() => {
    if (!message) {
      return undefined;
    }
    if (held) {
      setPhase((current) => (current === 'leaving' ? 'visible' : current));
      return undefined;
    }

    const timers: ReturnType<typeof setTimeout>[] = [];
    timers.push(
      setTimeout(() => {
        setPhase('leaving');
        timers.push(setTimeout(() => setMessage(null), FADE_MS));
      }, message.timeoutMs ?? DEFAULT_TIMEOUT_MS)
    );

    // A newer message, a hold or unmounting stops the timers; a newer message or letting go starts them again
    return () => timers.forEach(clearTimeout);
  }, [message, held]);

  return (
    <div
      class={`jq-toast-wrap bottom-right ${styles.toast}`}
      role="status"
      aria-live="polite"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocusIn={() => setFocused(true)}
      onFocusOut={({ currentTarget, relatedTarget }) =>
        setFocused(relatedTarget instanceof Node && currentTarget.contains(relatedTarget))
      }
    >
      {message && (
        <div class={classNames('jq-toast-single', `style-${message.type}`, 'fade', phase === 'visible' && 'fade-in')}>
          <h2 class="jq-toast-heading">{message.text}</h2>
        </div>
      )}
    </div>
  );
};
