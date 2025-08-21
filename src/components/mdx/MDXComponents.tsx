import * as React from 'react';

export const Img: React.FC<React.ImgHTMLAttributes<HTMLImageElement>> = (props) => {
  const { loading, decoding, ...rest } = props;
  return <img loading={loading ?? 'lazy'} decoding={decoding ?? 'async'} {...rest} />;
};

export const A: React.FC<React.AnchorHTMLAttributes<HTMLAnchorElement>> = (props) => {
  const isExternal = typeof props.href === 'string' && /^https?:\/\//.test(props.href);
  const rel = props.rel ?? (isExternal ? 'noopener noreferrer' : undefined);
  const target = props.target ?? (isExternal ? '_blank' : undefined);
  return <a {...props} rel={rel} target={target} />;
};

export const Pre: React.FC<React.HTMLAttributes<HTMLPreElement>> = (props) => (
  <pre tabIndex={0} {...props} />
);

const components = {
  img: Img,
  a: A,
  pre: Pre,
};

export default components;