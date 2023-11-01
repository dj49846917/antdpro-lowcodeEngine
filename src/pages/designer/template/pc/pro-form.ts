import { contextProps } from "@/pages/designer/template/pc/common";

export default function ProFormSchema({ children, props, id }: any) {

  return {
    componentName: "ProForm",
    title: "高级表单",
    id,
    props: {
      ...contextProps,
      columns: 3,
      operations: ProFormSchema.footer,
      ...props,
    },
    children
  }
};

ProFormSchema.footer = [
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
