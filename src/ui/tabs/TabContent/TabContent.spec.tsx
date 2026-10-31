import { elementOf, mountInPage, renderElement } from '@ta-x-test';
import { act } from 'preact/test-utils';

import styles from '../styles';

import { TabContent } from './TabContent';

describe('ui/tabs/TabContent', () => {
  test('renders the tab panel with its class and id, holding its children', () => {
    const content = renderElement(
      <TabContent id="flags">
        <span>🏁</span>
      </TabContent>
    );

    expect(content.tagName).toBe('DIV');
    expect(content.id).toBe('ta-x-tabs-flags');
    expect(content.getAttribute('role')).toBe('tabpanel');
    // Named by its tab
    expect(content.getAttribute('aria-labelledby')).toBe('ta-x-tab-flags');
    expect(content).toHaveExactClasses([styles.tabsContent]);
    expect(content.innerHTML).toBe('<span>🏁</span>');
  });

  test("puts its group's id in its own, and in its tab's, when given one", () => {
    const content = renderElement(<TabContent id="flags" tabGroupId="group-7" />);

    expect(content.id).toBe('ta-x-tabs-group-7-flags');
    expect(content.getAttribute('aria-labelledby')).toBe('ta-x-tab-group-7-flags');
  });

  // A view no tab shows (the settings menu's changelog) is a region of its own, named
  test('is a named region, not a tab panel, when given a label', () => {
    const content = renderElement(<TabContent id="changelog" label="Changelog and credits" />);

    expect(content.getAttribute('role')).toBe('region');
    expect(content.getAttribute('aria-label')).toBe('Changelog and credits');
    expect(content.hasAttribute('aria-labelledby')).toBe(false);
  });

  test('is shown when asked, and hidden by default', () => {
    expect(renderElement(<TabContent id="xbox-achievements" visible />).hasAttribute('data-tab-visible')).toBe(true);
    expect(renderElement(<TabContent id="controller" />).hasAttribute('data-tab-visible')).toBe(false);
  });

  describe('lazy', () => {
    // A lazy panel, shown or not, that can be shown and hidden again
    const mountPanel = (visible: boolean, children: () => string) => {
      const { root } = mountInPage(
        <TabContent id="flags" visible={visible} lazy>
          {children}
        </TabContent>
      );
      const show = (shown: boolean): void => {
        void act(() =>
          root.render(
            <TabContent id="flags" visible={shown} lazy>
              {children}
            </TabContent>
          )
        );
      };
      return { panel: elementOf(root), show };
    };

    test('builds nothing, not even its children function, until it is shown', () => {
      const children = vi.fn(() => '🏁');
      const { panel } = mountPanel(false, children);

      expect(panel.textContent).toBe('');
      expect(children).not.toHaveBeenCalled();
    });

    test('builds its children once shown, and keeps them once hidden again', () => {
      const { panel, show } = mountPanel(false, () => '🏁');

      show(true);
      expect(panel.textContent).toBe('🏁');

      show(false);
      expect(panel.textContent).toBe('🏁');
    });

    test('builds its children at once when it starts shown', () => {
      expect(mountPanel(true, () => '🏁').panel.textContent).toBe('🏁');
    });
  });
});
