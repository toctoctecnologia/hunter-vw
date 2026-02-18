import * as React from 'react';
import { Button, type ButtonProps } from './button';
import { cn } from '@/lib/utils';

export interface PrimaryButtonProps extends ButtonProps {}

/**
 * Convenience wrapper for the app's primary action button.
 */
export const PrimaryButton = React.forwardRef<HTMLButtonElement, PrimaryButtonProps>(
  ({ className, children, ...props }, ref) => (
    <Button
      ref={ref}
      className={cn(
        'btn-primary w-full h-10 px-4 font-medium transition-colors flex items-center justify-center gap-2',
        className
      )}
      {...props}
    >
      {children}
    </Button>
  )
);
PrimaryButton.displayName = 'PrimaryButton';

export default PrimaryButton;
