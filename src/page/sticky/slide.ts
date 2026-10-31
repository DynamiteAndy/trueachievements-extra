// How far a transform moves its element down, in px: a matrix (as computed), a translateY in px or in % of `height`
const movedDown = (transform: string, height: number): number => {
  const matrix = transform.match(/^matrix\(([^)]+)\)$/);
  if (matrix) {
    return parseFloat(matrix[1].split(',')[5]) || 0;
  }

  const translate = transform.match(/^translateY\((-?[\d.]+)(px|%)\)$/);
  if (!translate) {
    return 0;
  }

  const value = parseFloat(translate[1]);
  return translate[2] === '%' ? (value / 100) * height : value;
};

// How far an element's slide (its show / hide transform) has moved it, where the slide is now, mid-way too
export const slid = (element: HTMLElement | null): number =>
  element ? movedDown(getComputedStyle(element).transform, element.offsetHeight) : 0;

// The inline transition each element had before atOnce took it away, until it's put back. Kept per element, as atOnce
// can run twice in a frame, when the second would otherwise take its own `none` for the element's
const transitionsAway = new WeakMap<HTMLElement, { value: string; priority: string }>();

// An element's next change made at once, without its slide's transition (back a frame later, as it was)
export const atOnce = (element: HTMLElement): void => {
  if (!transitionsAway.has(element)) {
    transitionsAway.set(element, {
      value: element.style.getPropertyValue('transition'),
      priority: element.style.getPropertyPriority('transition')
    });
  }
  element.style.setProperty('transition', 'none');
  requestAnimationFrame(() => {
    const before = transitionsAway.get(element);
    if (!before) {
      return;
    }

    transitionsAway.delete(element);
    if (before.value) {
      element.style.setProperty('transition', before.value, before.priority);
    } else {
      element.style.removeProperty('transition');
    }
  });
};

// The header's show / hide slide while it runs: Chrome's transition on its transform
export const headerSlide = (header: HTMLElement): Animation | undefined =>
  header
    .getAnimations?.()
    .find((animation) => 'transitionProperty' in animation && animation.transitionProperty === 'transform');

// A stuck element slides as the header does, by the header's own slide, copied: the same moves, timing and start, so
// the browser runs both as one, mid-way too. A transition of its own would fall out of step whenever it started at
// another time or place (sticking as the header hides, or the header turning round mid-slide). Its own transition is
// off while stuck (sticky-under-header.scss). Returns the copy
export const copyHeaderSlide = (element: HTMLElement, header: HTMLElement, slide: Animation): Animation | undefined => {
  const effect = slide.effect as KeyframeEffect | null;

  if (!effect?.getKeyframes) {
    return undefined;
  }

  const { duration, delay, easing } = effect.getTiming();
  const copy = element.animate(
    effect.getKeyframes().map(({ offset, easing: keyframeEasing, transform }) => ({
      offset,
      easing: keyframeEasing,
      transform: `translateY(${movedDown(String(transform), header.offsetHeight)}px)`
    })),
    { duration, delay, easing }
  );
  // A slide just begun has no start time yet (copied as none, the copy would stand still). Both then start on the next
  // frame; set again once the header's has, to be sure
  const startWithSlide = (): void => {
    if (slide.startTime !== null) {
      copy.startTime = slide.startTime;
    }
  };
  startWithSlide();
  slide.ready.then(startWithSlide, () => undefined);

  return copy;
};
