import { faFaceSmile } from '@fortawesome/free-regular-svg-icons/faFaceSmile';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons/faChevronDown';
import { faCode } from '@fortawesome/free-solid-svg-icons/faCode';
import { faEye } from '@fortawesome/free-solid-svg-icons/faEye';
import { faEyeSlash } from '@fortawesome/free-solid-svg-icons/faEyeSlash';
import { faMoon } from '@fortawesome/free-solid-svg-icons/faMoon';
import { faPencil } from '@fortawesome/free-solid-svg-icons/faPencil';
import { faPlus } from '@fortawesome/free-solid-svg-icons/faPlus';
import { faSpinner } from '@fortawesome/free-solid-svg-icons/faSpinner';
import { faSun } from '@fortawesome/free-solid-svg-icons/faSun';
import { faWrench } from '@fortawesome/free-solid-svg-icons/faWrench';
import { faXmark } from '@fortawesome/free-solid-svg-icons/faXmark';
import { find, renderElement } from '@ta-x-test';

import type { IconDefinition } from '@fortawesome/free-solid-svg-icons';
import type { ComponentType } from 'preact';

import { ChevronDown, Close, Code, Hide, Loader, Moon, Pencil, Plus, Show, Smile, Sun, Wrench } from '.';

// Every Font Awesome wrapper, in one table: which icon each draws (its definition's path) and the classes it's given.
// How the svg is drawn is FontAwesomeIcon's own spec. Code takes no class, so it's drawn with none
describe('ui/icons', () => {
  test.each<{ name: string; Icon: ComponentType<{ class?: string }>; icon: IconDefinition; classes?: string }>([
    { name: 'ChevronDown', Icon: ChevronDown, icon: faChevronDown, classes: 'one two' },
    { name: 'Close', Icon: Close, icon: faXmark, classes: 'one two' },
    { name: 'Code', Icon: Code, icon: faCode },
    { name: 'Hide', Icon: Hide, icon: faEyeSlash, classes: 'one two' },
    { name: 'Loader', Icon: Loader, icon: faSpinner, classes: 'one two' },
    { name: 'Moon', Icon: Moon, icon: faMoon, classes: 'one two' },
    { name: 'Pencil', Icon: Pencil, icon: faPencil, classes: 'one two' },
    { name: 'Plus', Icon: Plus, icon: faPlus, classes: 'one two' },
    { name: 'Show', Icon: Show, icon: faEye, classes: 'one two' },
    { name: 'Smile', Icon: Smile, icon: faFaceSmile, classes: 'one two' },
    { name: 'Sun', Icon: Sun, icon: faSun, classes: 'one two' },
    { name: 'Wrench', Icon: Wrench, icon: faWrench, classes: 'one two' }
  ])('$name should render its icon with the classes given', ({ Icon, icon, classes }) => {
    const svg = renderElement<SVGSVGElement>(<Icon class={classes} />);

    expect(svg.getAttribute('class')).toBe(classes ?? null);
    expect(find('path', svg).getAttribute('d')).toBe(icon.icon[4]);
  });
});
