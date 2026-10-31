// Adds the `classes` a site element doesn't have yet, and returns how to give it back as it was: taking off only the
// ones added (a class the site had, such as a link's own `button`, stays), then dropping the class attribute if it had
// none and is left empty (no `class=""`). The put-back runs once
export const addClasses = (element: Element, ...classes: string[]): (() => void) => {
  const hadClass = element.hasAttribute('class');
  const added = [...new Set(classes)].filter((name) => !element.classList.contains(name));
  element.classList.add(...added);

  let givenBack = false;

  return () => {
    if (givenBack) {
      return;
    }

    givenBack = true;
    element.classList.remove(...added);
    if (!hadClass && element.classList.length === 0) {
      element.removeAttribute('class');
    }
  };
};
