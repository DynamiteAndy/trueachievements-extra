import { faFaceSmile } from '@fortawesome/free-regular-svg-icons/faFaceSmile';

import { FontAwesomeIcon } from '../FontAwesomeIcon';

interface SmileProps {
  class?: string;
}

export const Smile = ({ class: classes }: SmileProps) => <FontAwesomeIcon icon={faFaceSmile} class={classes} />;
