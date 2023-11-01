
import { contextProps } from "@/pages/designer/template/pc/common";
import { mockId } from "@/pages/designer/utils";

export default function ProcessHistory({ children, props, id }: any) {

  return {
    componentName: "ProcessHistory",
    title: "流程历史",
    id,
    props: {
      ...contextProps,
      ...props,
    },
    children
  }
};
