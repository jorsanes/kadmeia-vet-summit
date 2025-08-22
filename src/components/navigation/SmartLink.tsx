import * as React from "react";
import { Link as RouterLink, useInRouterContext } from "react-router-dom";

type Props = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  href?: string;
  to?: string;
};

export function SmartLink({ href, to, ...rest }: Props) {
  const inRouter = useInRouterContext();
  const url = to ?? href ?? "";
  const isInternal =
    url.startsWith("/") && !url.startsWith("//") && !url.startsWith("/http");

  if (inRouter && isInternal) {
    return <RouterLink to={url} {...(rest as any)} />;
  }
  return <a href={url} {...rest} />;
}