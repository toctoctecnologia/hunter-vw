import { cn } from '@/shared/lib/utils';
import { PropsWithChildren } from 'react';

type TypographyH1Props = PropsWithChildren & React.ComponentProps<'h1'>;

export function TypographyH1({ children, className }: TypographyH1Props) {
  return (
    <h1 className={cn('scroll-m-20 text-center text-4xl font-extrabold tracking-tight text-balance', className)}>
      {children}
    </h1>
  );
}

type TypographyH2Props = PropsWithChildren & React.ComponentProps<'h2'>;

export function TypographyH2({ children, className }: TypographyH2Props) {
  return (
    <h2 className={cn('scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0', className)}>
      {children}
    </h2>
  );
}

type TypographyH3Props = PropsWithChildren & React.ComponentProps<'h3'>;

export function TypographyH3({ children, className }: TypographyH3Props) {
  return <h3 className={cn('scroll-m-20 text-2xl font-semibold tracking-tight', className)}>{children}</h3>;
}

type TypographyPProps = PropsWithChildren & React.ComponentProps<'p'>;

export function TypographyP({ children, className }: TypographyPProps) {
  return <p className={cn('leading-7 [&:not(:first-child)]:mt-6', className)}>{children}</p>;
}

type TypographySmallProps = PropsWithChildren & React.ComponentProps<'small'>;

export function TypographySmall({ children, className }: TypographySmallProps) {
  return <small className={cn('text-sm leading-none font-medium', className)}>{children}</small>;
}

type TypographyMutedProps = PropsWithChildren & React.ComponentProps<'p'>;

export function TypographyMuted({ children, className }: TypographyMutedProps) {
  return <p className={cn('text-muted-foreground text-sm', className)}>{children}</p>;
}
