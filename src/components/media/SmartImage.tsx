import React from 'react';

type Props = {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  priority?: boolean; // true => eager
  caption?: string;
  rounded?: boolean;
};

export default function SmartImage({ src, alt, className, width, height, priority, caption, rounded }: Props) {
  const loading = priority ? 'eager' : 'lazy';
  const decoding = priority ? 'sync' : 'async';
  const cn = `${rounded ? 'rounded-2xl' : ''} ${className ?? ''}`.trim();
  return (
    <figure className="not-prose">
      <img
        src={src}
        alt={alt}
        loading={loading as any}
        decoding={decoding as any}
        width={width}
        height={height}
        className={cn}
      />
      {caption && <figcaption className="mt-2 text-xs text-muted-foreground">{caption}</figcaption>}
    </figure>
  );
}