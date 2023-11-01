import Creator, { contextProps } from "@/pages/designer/template/pc/common";
import {
  nextId
} from "@/pages/designer/utils";
import type { CreatorProps } from "@/pages/designer/template/types";
import ProFormGroupSchema, { ProFormGroupItemSchema } from "./pro-form-group";
import ProcessHistorySchema from "./process-history";

export default function ProcessForm({
  props,
  children,
  id
}: any): any {
  return {
    "componentName": "ProcessForm",
    "props": {
      processButtons: [
        {
          "action": "submit",
          "title": "提交",
        },
        {
          "action": "save",
          "title": "保存"
        },
        {
          "action": "cancel",
          "title": "取消"
        }
      ],
      ...contextProps,
      ...props,
    },
    id,
    children
  }
}

ProcessForm.create = async ({
  rootSchema,
  docId,
  seqId,
  dataTable,
  fields,
  pageName,
}: CreatorProps) => {
  const formItems = Creator.createFormItems(fields, docId, seqId);
  const processForm = ProcessForm({
    props: {
      ...dataTable
    },
    id: nextId(docId, seqId),
    children: [
      ProFormGroupSchema({
        id: nextId(docId, seqId),
        props: {
          ...dataTable,
        },
        children: [
          ProFormGroupItemSchema({
            id: nextId(docId, seqId),
            props: {
              groupItemHeader: "流程表单",
            },
            children: formItems,
          })
        ]
      }),
      ProcessHistorySchema({
        id: nextId(docId, seqId),
        props: {},
      }),
    ]
  });
  rootSchema.children = [processForm];
  return true
}
