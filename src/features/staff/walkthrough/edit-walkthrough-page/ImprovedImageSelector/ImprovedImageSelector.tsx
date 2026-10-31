import { addClasses, moveInto } from '@ta-x-page';
import { createPortal } from 'preact';
import { useLayoutEffect, useMemo, useRef } from 'preact/hooks';

import { ImageTitle } from '../ImageTitle';
import styles from '../styles';

// An image's name from its title, which the site writes as '<name>' uploaded by <gamer> <date>. The name can hold
// apostrophes of its own ("Boss's Lair"), so it runs to the quote before " uploaded by". Any other title is shown as it
// is
const imageName = (title: string): string => /^'(.*)' uploaded by /.exec(title)?.[1] ?? title;

const imageContainerId = 'oWalkthroughImageViewer';
// The id the site sometimes writes, with a leading space
const mistypedImageContainerId = ` ${imageContainerId}`;
// Through a function, as the React lint's immutability rule refuses assigning to a prop inside the component (the
// prop is the site's element, which is ours to change)
const setId = (element: HTMLElement, id: string): void => {
  element.id = id;
};

interface ImprovedImageSelectorProps {
  // The site's image selector popup (#oWalkthroughImageViewer, or the same with a leading space). The site opens it
  // (inline display: block) from the editor's Add Image button
  imageContainer: HTMLElement;
  // Its list of images
  imageViewer: HTMLElement;
  // Its Add images link
  imageLink: HTMLElement;
}

// A controller for the site's image selector: it renders a sticky header before the images, holding the site's
// walkthrough name and Add images link, a name under each image, and closes the selector on a click elsewhere or when
// the editor takes focus. Its id is corrected where the site wrote it with a leading space, for our styles. The site's
// elements it moves, and that id, go back as they were on unmount
export const ImprovedImageSelector = ({ imageContainer, imageViewer, imageLink }: ImprovedImageSelectorProps) => {
  const header = useRef<HTMLDivElement>(null);
  const imageAnchors = useMemo(() => [...imageViewer.querySelectorAll<HTMLElement>('.ivimage a')], [imageViewer]);

  useLayoutEffect(() => {
    if (imageContainer.id !== mistypedImageContainerId) {
      return undefined;
    }

    setId(imageContainer, imageContainerId);
    return () => setId(imageContainer, mistypedImageContainerId);
  }, [imageContainer]);

  useLayoutEffect(() => {
    // Only the site opens it, so only closing is ours
    const hide = () => {
      if (imageContainer.style.display === 'block') {
        imageContainer.style.display = 'none';
      }
    };
    const onClick = ({ target }: MouseEvent) => {
      // Not its own clicks, nor the editor's Add Image button opening it. Any element counts, an icon drawn in SVG too
      if (
        target instanceof Element &&
        !imageContainer.contains(target) &&
        !target.closest("[aria-label='Add Image']")
      ) {
        hide();
      }
    };
    // From the keyboard: Escape closes it and gives the focus back to Add Image, which opened it (its images are
    // links, so the focus may be in it); the focus going on past it to the page closes it too
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && imageContainer.style.display === 'block') {
        event.preventDefault();
        hide();
        document.querySelector<HTMLElement>("[aria-label='Add Image'] button, [aria-label='Add Image']")?.focus();
      }
    };
    const onFocusOut = ({ relatedTarget }: FocusEvent) => {
      if (relatedTarget instanceof Node && !imageContainer.contains(relatedTarget)) {
        hide();
      }
    };
    // A click in the editor goes to its iframe, so the page only sees its window lose focus
    const onBlur = () => {
      if (document.activeElement === document.querySelector('#txtWalkthrough_ifr')) {
        hide();
      }
    };

    const moved = [imageViewer.querySelector('.itemname, .noimages'), imageLink].filter((node) => node !== null);

    const giveClassBack = addClasses(imageContainer, styles.improvedImageSelector);
    const putBack = header.current ? moveInto(header.current, moved) : () => undefined;
    document.addEventListener('click', onClick);
    document.addEventListener('keydown', onKeyDown);
    imageContainer.addEventListener('focusout', onFocusOut);
    window.addEventListener('blur', onBlur);

    return () => {
      document.removeEventListener('click', onClick);
      document.removeEventListener('keydown', onKeyDown);
      imageContainer.removeEventListener('focusout', onFocusOut);
      window.removeEventListener('blur', onBlur);
      giveClassBack();
      putBack();
    };
  }, [imageContainer, imageViewer, imageLink]);

  return (
    <>
      <div ref={header} class={styles.improvedImageSelectorContainer} />
      {imageAnchors.map((anchor) =>
        createPortal(<ImageTitle title={imageName(anchor.querySelector('img')?.title ?? '')} />, anchor)
      )}
    </>
  );
};
