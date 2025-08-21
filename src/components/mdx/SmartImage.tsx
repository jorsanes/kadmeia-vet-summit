import * as React from "react";

type Props = React.ImgHTMLAttributes<HTMLImageElement>;

export function SmartImage({ loading = "lazy", decoding = "async", ...props }: Props) {
  return <img loading={loading} decoding={decoding} {...props} />;
}

export default SmartImage;