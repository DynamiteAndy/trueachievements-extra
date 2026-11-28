import { clickOnEnterOrSpace } from '../../click-on-enter-or-space';
import { noJump } from '../../link-action';

interface ListSettingItemProps {
  value: string;
  onRemove: () => void;
}

// One value in a list setting, with a link that removes it. A screen reader can list links on their own, so the link's
// name says which value it removes
export const ListSettingItem = ({ value, onRemove }: ListSettingItemProps) => (
  <li>
    <div>
      <p>{value}</p>
      <a
        href="#"
        role="button"
        aria-label={`Remove ${value}`}
        onKeyDown={clickOnEnterOrSpace}
        onClick={noJump(onRemove)}
      >
        Remove
      </a>
    </div>
  </li>
);
