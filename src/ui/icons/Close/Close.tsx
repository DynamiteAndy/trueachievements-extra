import { faXmark } from '@fortawesome/free-solid-svg-icons/faXmark';

import { FontAwesomeIcon } from '../FontAwesomeIcon';

interface CloseProps {
  class?: string;
}

export const Close = ({ class: classes }: CloseProps) => <FontAwesomeIcon icon={faXmark} class={classes} />;
