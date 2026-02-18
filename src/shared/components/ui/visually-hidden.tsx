import * as React from 'react';

import { cn } from '@/shared/lib/utils';

interface VisuallyHiddenProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
}

/**
 * VisuallyHidden component that hides content visually but keeps it accessible for screen readers.
 * Useful for adding accessible labels without affecting the visual design.
 */
export function VisuallyHidden({ children, className, ...props }: VisuallyHiddenProps) {
  return (
    <span
      className={cn(
        'absolute w-px h-px p-0 -m-px overflow-hidden whitespace-nowrap border-0',
        '[clip:rect(0,0,0,0)]',
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}
