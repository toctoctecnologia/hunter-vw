// Compatibility shim for next/image -> standard img
import React from 'react';

interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  fill?: boolean;
  priority?: boolean;
  quality?: number;
  placeholder?: string;
  blurDataURL?: string;
  unoptimized?: boolean;
}

const Image = React.forwardRef<HTMLImageElement, ImageProps>(
  ({ fill, priority, quality, placeholder, blurDataURL, unoptimized, ...props }, ref) => {
    const style: React.CSSProperties = fill
      ? { position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', ...props.style }
      : props.style || {};

    return <img ref={ref} {...props} style={style} loading={priority ? 'eager' : 'lazy'} />;
  }
);

Image.displayName = 'Image';

export default Image;
