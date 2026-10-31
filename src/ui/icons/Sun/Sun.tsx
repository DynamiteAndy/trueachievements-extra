import { faSun } from '@fortawesome/free-solid-svg-icons/faSun';

import { FontAwesomeIcon } from '../FontAwesomeIcon';

interface SunProps {
  class?: string;
}

export const Sun = ({ class: classes }: SunProps) => <FontAwesomeIcon icon={faSun} class={classes} />;
