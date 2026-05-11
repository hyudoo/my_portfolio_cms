export const polyfillTailwindGap = () => {
  if (typeof window === 'undefined') return;

  function supportsFlexGap(): boolean {
    const flex = document.createElement('div');
    flex.style.display = 'flex';
    flex.style.flexDirection = 'column';
    flex.style.rowGap = '1px';

    flex.appendChild(document.createElement('div'));
    flex.appendChild(document.createElement('div'));

    document.body.appendChild(flex);
    const isSupported = flex.scrollHeight === 1;
    document.body.removeChild(flex);
    return isSupported;
  }

  if (supportsFlexGap()) return;

  const spacingMap: Record<string, string> = {
    '0': '0rem',
    px: '1px',
    '0.5': '0.125rem',
    '1': '0.25rem',
    '1.5': '0.375rem',
    '2': '0.5rem',
    '2.5': '0.625rem',
    '3': '0.75rem',
    '3.5': '0.875rem',
    '4': '1rem',
    '5': '1.25rem',
    '6': '1.5rem',
    '7': '1.75rem',
    '8': '2rem',
    '9': '2.25rem',
    '10': '2.5rem',
    '11': '2.75rem',
    '12': '3rem',
    '14': '3.5rem',
    '16': '4rem',
    '20': '5rem',
    '24': '6rem',
    '28': '7rem',
    '32': '8rem',
    '36': '9rem',
    '40': '10rem',
    '44': '11rem',
    '48': '12rem',
    '52': '13rem',
    '56': '14rem',
    '60': '15rem',
    '64': '16rem',
    '72': '18rem',
    '80': '20rem',
    '96': '24rem',
  };

  const elements = document.querySelectorAll<HTMLElement>("[class*='gap']");

  elements.forEach((el) => {
    const classList = Array.from(el.classList);
    const children = el.children;
    if (children.length <= 1) return;

    const style = getComputedStyle(el);
    const isRowDirection = style.flexDirection === 'row';

    classList.forEach((cls) => {
      const match = cls.match(/^gap(?:-(x|y))?-([\w.]+)$/);
      if (!match) return;

      const [, axis, key] = match;
      const gapValue = spacingMap[key];
      if (!gapValue) return;

      Array.from(children).forEach((child, i) => {
        const element = child as HTMLElement;
        if (i === children.length - 1) return;

        if (!axis) {
          if (isRowDirection) {
            element.style.marginRight = gapValue;
          } else {
            element.style.marginBottom = gapValue;
          }
        } else if (axis === 'x') {
          element.style.marginRight = gapValue;
        } else if (axis === 'y') {
          element.style.marginBottom = gapValue;
        }
      });
    });
  });
};
