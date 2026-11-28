import type { IconDefinition } from '@fortawesome/free-solid-svg-icons';

interface FontAwesomeIconProps {
  icon: IconDefinition;
  class?: string;
}

// Draws a Font Awesome Free icon definition as an inline currentColor svg
// Font Awesome Free by @fontawesome - https://fontawesome.com
// License - https://fontawesome.com/license/free (Icons: CC BY 4.0) Copyright Fonticons, Inc.
export const FontAwesomeIcon = ({ icon, class: classes }: FontAwesomeIconProps) => {
  const [width, height, , , pathData] = icon.icon;

  return (
    <svg class={classes} xmlns="http://www.w3.org/2000/svg" viewBox={`0 0 ${width} ${height}`} aria-hidden="true">
      {[pathData].flat().map((d) => (
        <path key={d} fill="currentColor" d={d} />
      ))}
    </svg>
  );
};
