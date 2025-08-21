import React from 'react';
import { cn } from '@/lib/utils';

interface SmartImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  /** Si true: eager + fetchPriority=high */
  priority?: boolean;
  /** Hint de layout responsive (mejora LCP/CLS) */
  sizes?: string;
  className?: string;
}

const SmartImage: React.FC<SmartImageProps> = ({
  src,
  alt,
  width,
  height,
  priority = false,
  sizes = "100vw",
  className,
  ...props
}) => {
  return (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      loading={priority ? 'eager' : 'lazy'}
      decoding={priority ? 'sync' : 'async'}
      sizes={sizes}
      className={cn(className)}
      {...props}
    />
  );
};

export default SmartImage;
