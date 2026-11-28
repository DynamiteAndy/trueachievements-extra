import { faChevronDown } from '@fortawesome/free-solid-svg-icons/faChevronDown';

import { FontAwesomeIcon } from '../FontAwesomeIcon';

interface ChevronDownProps {
  class?: string;
}

export const ChevronDown = ({ class: classes }: ChevronDownProps) => (
  <FontAwesomeIcon icon={faChevronDown} class={classes} />
);
