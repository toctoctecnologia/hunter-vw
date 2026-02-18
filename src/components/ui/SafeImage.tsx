import { useState } from 'react';
import { resolveFileUrl } from '@/utils/files';
import { cn } from '@/lib/utils';

interface SafeImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {}

export function SafeImage({ src, className, ...props }: SafeImageProps) {
  const [errored, setErrored] = useState(false);

  const resolvedSrc = errored
    ? '/placeholder.svg'
    : src
    ? resolveFileUrl(src)
    : '/placeholder.svg';

  return (
    <img
      {...props}
      src={resolvedSrc}
      className={cn('aspect-square h-full w-full', className)}
      onError={() => setErrored(true)}
    />
  );
}
