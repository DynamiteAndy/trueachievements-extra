import { faMoon } from '@fortawesome/free-solid-svg-icons/faMoon';

import { FontAwesomeIcon } from '../FontAwesomeIcon';

interface MoonProps {
  class?: string;
}

export const Moon = ({ class: classes }: MoonProps) => <FontAwesomeIcon icon={faMoon} class={classes} />;
