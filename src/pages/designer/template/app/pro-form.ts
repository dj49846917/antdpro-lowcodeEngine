import { nextId } from "../../utils";
import { CreatorProps } from "../types";
import Creator from "./common";

export default function ProForm({ children, props, id }: any) {
  return {
    componentName: "ProForm",
    title: "高级表单",
    id,
    props: {
      footer: ProForm.footer,
      ...props,
    },
    children
  }
};

ProForm.footer = [
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


ProForm.create = async ({
  rootSchema,
  docId,
  seqId,
  dataTable,
  fields,
  pageName,
}: CreatorProps) => {
  const formItems = Creator.createFormItems(fields, docId, seqId);
  const processForm = ProForm({
    props: {
      ...dataTable
    },
    id: nextId(docId, seqId),
    children: formItems,
  });
  rootSchema.children = [processForm];
  return true
}
