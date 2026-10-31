import { recordEvents } from '@ta-x-test';

// For the default status specs (achievements, challenges and DLC pages): the id of each status radio clicked from now
// until the test ends (each click is a post back on the site)
export const recordClickedRadios = (): string[] => recordEvents('click', (event) => (event.target as HTMLElement).id);
