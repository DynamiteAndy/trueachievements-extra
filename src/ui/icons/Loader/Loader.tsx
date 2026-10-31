import { faSpinner } from '@fortawesome/free-solid-svg-icons/faSpinner';

import { FontAwesomeIcon } from '../FontAwesomeIcon';

interface LoaderProps {
  class?: string;
}

export const Loader = ({ class: classes }: LoaderProps) => <FontAwesomeIcon icon={faSpinner} class={classes} />;
