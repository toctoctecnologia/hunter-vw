import * as React from 'react';

const MOBILE_BREAKPOINT = 768;
const DEBOUNCE_MS = 150;

type ViewportMode = 'mobile' | 'web';

const getMode = () => (window.innerWidth <= MOBILE_BREAKPOINT ? 'mobile' : 'web');

export function useViewportMode(): ViewportMode {
  const [mode, setMode] = React.useState<ViewportMode>(() => {
    if (typeof window === 'undefined') {
      return 'web';
    }
    return getMode();
  });

  React.useEffect(() => {
    if (typeof window === 'undefined') return undefined;

    const widthQuery = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT}px)`);
    const orientationQuery = window.matchMedia('(orientation: portrait)');

    let timeoutId: number | undefined;

    const handleChange = () => {
      if (timeoutId) {
        window.clearTimeout(timeoutId);
      }
      timeoutId = window.setTimeout(() => {
        setMode(getMode());
      }, DEBOUNCE_MS);
    };

    widthQuery.addEventListener('change', handleChange);
    orientationQuery.addEventListener('change', handleChange);
    window.addEventListener('resize', handleChange);

    handleChange();

    return () => {
      if (timeoutId) {
        window.clearTimeout(timeoutId);
      }
      widthQuery.removeEventListener('change', handleChange);
      orientationQuery.removeEventListener('change', handleChange);
      window.removeEventListener('resize', handleChange);
    };
  }, []);

  return mode;
}
