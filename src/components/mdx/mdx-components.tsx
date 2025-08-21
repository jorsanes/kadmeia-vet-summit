import * as React from "react";
import SmartImage from "./SmartImage";

export const mdxComponents = {
  img: (props: any) => <SmartImage {...props} />,
  a: (props: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a {...props} target={props.target ?? "_blank"} rel="noopener noreferrer" />
  ),
};

export default mdxComponents;