import { contextProps } from "@/pages/designer/template/pc/common";
import { mockId } from "@/pages/designer/utils";

export function ChildForm({ children }: any) {
  const htmlId = mockId();
  return {
    "componentName": "ChildForm",
    "title": "子表单",
    "props": {
      "columns": 3,
      htmlId,
      "mode": "independent",
      "anchorItemProps": {
        htmlId,
        "label": "Tab1"
      },
      "cardProps": {
        "titleStyleBool": true,
        "hasDivider": false,
        htmlId,
        "title": "标题",
        "loading": false,
        "bodyPadding": "",
        "isFillContainer": true
      },
      "labelAlign": "left",
      "labelCol": {
        "fixedSpan": 6
      }
    },
    children
  }
}

export default function AnchorFormSchema({ children, props, id }: any) {

  return {
    componentName: "AnchorForm",
    title: "电梯表单",
    id,
    props: {
      ...contextProps,
      "showAnchor": false,
      operations: AnchorFormSchema.footer,
      "anchorProps": {
        "hasAffix": false,
        "direction": "hoz"
      },
      ...props,
    },
    children
  }
};

AnchorFormSchema.footer = [
  {
    "content": "提交",
    "action": "submit",
    "type": "primary"
  },
  {
    "content": "取消",
    "action": "cancel",
    "type": "normal"
  }
]
