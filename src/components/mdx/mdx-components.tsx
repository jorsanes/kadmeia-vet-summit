import * as React from "react";
import { SmartImage } from "./";
import { SmartLink } from "@/components/navigation/SmartLink";

export const mdxComponents = {
  img: (props: any) => <SmartImage {...props} />,
  a: (props: any) => <SmartLink {...props} />,
};

export default mdxComponents;