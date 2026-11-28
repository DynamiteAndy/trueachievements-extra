import { walkthroughPagePreviewPath } from '../page-preview-path';

import type { AsideContentPreviewPage } from '../aside-content';

interface WalkthroughPageRowProps {
  page: AsideContentPreviewPage;
  selected?: boolean;
}

// A row of the site's page index; like the site, the page being viewed isn't a link
export const WalkthroughPageRow = ({ page, selected = false }: WalkthroughPageRowProps) => (
  <tr>
    <td class="pos">{page.index}</td>
    <td data-wp={page.id}>{selected ? page.title : <a href={walkthroughPagePreviewPath(page.id)}>{page.title}</a>}</td>
  </tr>
);
