import { faPlus } from '@fortawesome/free-solid-svg-icons/faPlus';

import { FontAwesomeIcon } from '../FontAwesomeIcon';

interface PlusProps {
  class?: string;
}

export const Plus = ({ class: classes }: PlusProps) => <FontAwesomeIcon icon={faPlus} class={classes} />;
