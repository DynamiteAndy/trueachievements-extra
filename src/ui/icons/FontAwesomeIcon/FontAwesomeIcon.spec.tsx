import { renderElement } from '@ta-x-test';

import type { IconDefinition } from '@fortawesome/free-solid-svg-icons';

import { FontAwesomeIcon } from './FontAwesomeIcon';

describe('FontAwesomeIcon', () => {
  const icon: IconDefinition = { prefix: 'fas', iconName: 'sun', icon: [384, 512, [], 'f185', 'M0 0h10v10z'] };

  const render = (definition: IconDefinition, className?: string): SVGSVGElement => {
    return renderElement<SVGSVGElement>(<FontAwesomeIcon icon={definition} class={className} />);
  };

  test('should render the definition as a currentColor svg sized by its width and height', () => {
    const svg = render(icon, 'one two');
    const paths = svg.querySelectorAll('path');

    expect(svg.tagName.toLowerCase()).toBe('svg');
    expect(svg.getAttribute('class')).toBe('one two');
    expect(svg.getAttribute('viewBox')).toBe('0 0 384 512');
    expect(svg.getAttribute('aria-hidden')).toBe('true');
    expect(paths).toHaveLength(1);
    expect(paths[0].getAttribute('fill')).toBe('currentColor');
    expect(paths[0].getAttribute('d')).toBe('M0 0h10v10z');
  });

  test('should render no class attribute when given none', () => {
    expect(render(icon).hasAttribute('class')).toBe(false);
  });

  test('should render a path for each part of a multi-path definition', () => {
    const svg = render({ ...icon, icon: [512, 512, [], 'f185', ['M1 1z', 'M2 2z']] });

    expect([...svg.querySelectorAll('path')].map((path) => path.getAttribute('d'))).toEqual(['M1 1z', 'M2 2z']);
  });
});
