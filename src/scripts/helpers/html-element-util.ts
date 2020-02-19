export const classListContains = (element: HTMLElement, classes: string|string[]): boolean => {
  const classArray = Array.isArray(classes) ? classes : [classes];

  for (let i = 0; i < classArray.length; i++) {
    if (element.classList.contains(classArray[i])) {
      return true;
    }
  }

  return false;
}