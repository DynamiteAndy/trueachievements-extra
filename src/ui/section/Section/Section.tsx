import { classNames } from '@ta-x-lib';

import type { ComponentChildren, HTMLAttributes } from 'preact';

// The colours the site gives its side column sections (each a class on the section)
type SectionColour = 'purple' | 'green' | 'orange' | 'blue' | 'navy' | 'red' | 'pink';

interface SectionProps extends Omit<HTMLAttributes<HTMLElement>, 'title' | 'class'> {
  class?: string;
  colour: SectionColour;
  title: ComponentChildren;
  children?: ComponentChildren;
}

// A side column section as the site renders its own (e.g. First Winners): its colour class, the title in a div, then
// the body in an article, so the site's CSS styles it in either theme. Any other attributes (the feature's classes,
// data-*) go on the section.
export const Section = ({ colour, title, class: classes, children, ...attributes }: SectionProps) => (
  <section class={classNames(colour, classes)} {...attributes}>
    <div>{title}</div>
    <article>{children}</article>
  </section>
);
