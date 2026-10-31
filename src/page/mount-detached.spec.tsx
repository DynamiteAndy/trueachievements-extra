import { find } from '@ta-x-test';
import { createPortal } from 'preact';

import { mountDetached } from './mount-detached';

describe('mountDetached', () => {
  // A controller adding a label into the site's element, as hideRow's adds its toggle into a row's cell
  const Controller = ({ target, text }: { target: HTMLElement; text: string }) =>
    createPortal(<span class="label">{text}</span>, target);

  const setup = (): HTMLElement => {
    document.body.innerHTML = '<div id="site"></div>';
    return find('#site');
  };

  test('should render without adding anything to the page but what it portals', () => {
    const site = setup();

    mountDetached(<Controller target={site} text="one" />);

    expect(document.body.children).toHaveLength(1);
    expect(find('.label', site).textContent).toBe('one');
  });

  test('should re-render in place with new props', () => {
    const site = setup();
    const root = mountDetached(<Controller target={site} text="one" />);
    const label = find('.label', site);

    root.render(<Controller target={site} text="two" />);

    expect(find('.label', site)).toBe(label);
    expect(label.textContent).toBe('two');
  });

  test('should remove what it rendered when unmounted', () => {
    const site = setup();
    const root = mountDetached(<Controller target={site} text="one" />);

    root.unmount();

    expect(site.children).toHaveLength(0);
  });
});
