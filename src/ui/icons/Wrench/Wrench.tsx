import { faWrench } from '@fortawesome/free-solid-svg-icons/faWrench';

import { FontAwesomeIcon } from '../FontAwesomeIcon';

interface WrenchProps {
  class?: string;
}

export const Wrench = ({ class: classes }: WrenchProps) => <FontAwesomeIcon icon={faWrench} class={classes} />;
