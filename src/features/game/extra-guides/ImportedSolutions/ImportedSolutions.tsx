import { mount, type MountedRoot } from '@ta-x-page';
import { useLayoutEffect, useRef } from 'preact/hooks';

import { AchievementGuideSolution } from '../AchievementGuideSolution';

import type { ShownGuide } from '../guide-site-links';
import type { GuideSite } from '../guide-sites';

type ImportedSolution = { site: GuideSite; guide: ShownGuide };

interface ImportedSolutionsProps {
  // The guides to show, in the guide sites' order
  solutions: ImportedSolution[];
}

// The site's solutions heading and list, as it lays them out (#oSolutions), for an achievement that has none yet
const SolutionsList = ({ title }: { title: string }) => (
  <>
    <h2 id="oSolutions" class="block topmargin">
      How to unlock the {title} achievement
    </h2>
    <ul class="posts" />
  </>
);

// Where the site puts its solutions, after the first of these it finds: #divDynLb; the video player on older pages;
// failing both, the achievement's buttons
const solutionsAfter = ['main #divDynLb', 'main .nn_player_w', 'main .ach-buttons'];

// Adds the site's solutions heading and list where the site puts them, for an achievement that has none yet
const addSolutionsList = (title: string): MountedRoot | null => {
  const after = solutionsAfter.map((selector) => document.querySelector(selector)).find(Boolean);

  return after?.parentElement
    ? mount(<SolutionsList title={title} />, after.parentElement, after.nextElementSibling)
    : null;
};

const listIn = (root: MountedRoot): Element | null =>
  root.nodes.find((node): node is Element => node instanceof Element && node.matches('ul.posts')) ?? null;

// A controller for the site's own solutions list on an achievement page: it puts the imported guides at the top, in the
// guide sites' order, and takes them away again. Where the achievement had no solutions it adds the site's heading and
// list for them, and removes both once the last guide goes. It renders nothing where it's mounted
export const ImportedSolutions = ({ solutions }: ImportedSolutionsProps) => {
  // Our guides at the top of the list, and the heading and list we added
  const guidesRef = useRef<MountedRoot | null>(null);
  const addedListRef = useRef<MountedRoot | null>(null);

  const remove = (): void => {
    guidesRef.current?.unmount();
    guidesRef.current = null;
    addedListRef.current?.unmount();
    addedListRef.current = null;
  };

  useLayoutEffect(() => {
    if (solutions.length === 0) {
      remove();
      return;
    }

    if (!guidesRef.current) {
      const existing = document.querySelector('ul.posts');
      addedListRef.current = existing ? null : addSolutionsList(solutions[0].guide.guide.title);
      const list = existing ?? (addedListRef.current && listIn(addedListRef.current));
      if (!list) {
        return;
      }

      guidesRef.current = mount(null, list, list.firstChild);
    }

    guidesRef.current.render(
      <>
        {solutions.map(({ site, guide }) => (
          <AchievementGuideSolution
            key={site.id}
            name={site.guide.name}
            icon={site.guide.icon}
            href={guide.guide.href}
            info={site.guide.info}
            guide={guide.guide.guide}
          />
        ))}
      </>
    );
  }, [solutions]);
  useLayoutEffect(() => remove, []);

  return null;
};
