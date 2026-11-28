// The walkthrough statuses the preview's side column covers, as the manage walkthrough page writes them (its
// `#txtStatus`). A published walkthrough's is read from its public page; the others from its preview
const previewStatuses = ['In progress', 'Ready for review', 'Ready for publish', 'Published'] as const;

type PreviewStatus = (typeof previewStatuses)[number];

export const isPreviewStatus = (status: string): status is PreviewStatus =>
  (previewStatuses as readonly string[]).includes(status);

const quoted = previewStatuses.map((status) => `"${status}"`);
// The statuses as the panels' text names them: each quoted, the last after "and"
export const previewStatusesText = `${quoted.slice(0, -1).join(', ')} and ${quoted.at(-1)}`;
