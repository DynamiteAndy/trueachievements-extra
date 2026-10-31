import { faPencil } from '@fortawesome/free-solid-svg-icons/faPencil';

import { FontAwesomeIcon } from '../FontAwesomeIcon';

interface PencilProps {
  class?: string;
}

export const Pencil = ({ class: classes }: PencilProps) => <FontAwesomeIcon icon={faPencil} class={classes} />;
