import { faEyeSlash } from '@fortawesome/free-solid-svg-icons/faEyeSlash';

import { FontAwesomeIcon } from '../FontAwesomeIcon';

interface HideProps {
  class?: string;
}

export const Hide = ({ class: classes }: HideProps) => <FontAwesomeIcon icon={faEyeSlash} class={classes} />;
