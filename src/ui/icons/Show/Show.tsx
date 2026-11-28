import { faEye } from '@fortawesome/free-solid-svg-icons/faEye';

import { FontAwesomeIcon } from '../FontAwesomeIcon';

interface ShowProps {
  class?: string;
}

export const Show = ({ class: classes }: ShowProps) => <FontAwesomeIcon icon={faEye} class={classes} />;
