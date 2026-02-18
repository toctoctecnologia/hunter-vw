import type { CSSProperties } from 'react';

import type { PropertyLogoOverlayState } from '@/features/imoveis/state/imovelLocalStore';

export function shouldRenderLogoOverlay(
  state?: PropertyLogoOverlayState | null,
): state is PropertyLogoOverlayState {
  return Boolean(state?.enabled && state?.src);
}

export function getLogoOverlayStyles(state: PropertyLogoOverlayState): CSSProperties {
  const clampedSize = Math.max(0, state.sizePct);
  const clampedOpacity = Math.max(0, Math.min(100, state.opacity));
  const clampedMargin = Math.max(0, state.margin);

  const style: CSSProperties = {
    position: 'absolute',
    width: `${clampedSize}%`,
    opacity: clampedOpacity / 100,
    pointerEvents: 'none',
  };

  const marginValue = `${clampedMargin}%`;

  if (state.position.includes('top')) {
    style.top = marginValue;
  } else {
    style.bottom = marginValue;
  }

  if (state.position.includes('left')) {
    style.left = marginValue;
  } else {
    style.right = marginValue;
  }

  return style;
}
