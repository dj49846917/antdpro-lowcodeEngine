import Creator, {
  commonComponents,
  contextProps,
  ProFormComponent
} from "@/pages/designer/template/pc/common";
import CardSchema from "@/pages/designer/template/pc/card";
import {
  mockId,
  nextId,
  uuid
} from "@/pages/designer/utils";
import { omit } from "lodash";
import ProFormSchema from "@/pages/designer/template/pc/pro-form";
import schemaApi from "@/services/schemaApi";
import type { CreatorProps } from "@/pages/designer/template/types";
import PageSchema from "@/pages/designer/template/pc/page";

interface TableListSchemaProps {
  props: {
    columns?: { dataIndex: string, title: string, [key: string]: any };
  };
  children?: any;
  id: string;
}

export default function TableListSchema({
  props,
  children,
  id
}: TableListSchemaProps) {
  return {
    id,
    "componentName": "LceTableList",
    "props": {
      ...contextProps,
      "filter": true,
      "size": "medium",
      "dataSource": [],
      "settingButtons": true,
      ...props
    },
    children
  }
}

TableListSchema.create = async ({
  rootSchema,
  docId,
  seqId,
  dataTable,
  childPageId,
  childRootSchema,
  packages,
  pageName,
  fields,
  components,
}: CreatorProps) => {
  const card = rootSchema?.children?.[0] || {};
  const tableList = card?.children?.[0] || {};
  rootSchema.children = [
    CardSchema({
      props: {
        ...card.props,
        title: pageName
      },
      id: nextId(docId, seqId),
      children: [
        TableListSchema({
          props: {
            ...tableList.props,
            ...dataTable,
            columns: fields?.map(field => {
              return Creator.createColumn(omit(field, ['required']), nextId(docId, seqId), { components });
            }),
            actionBarButtons: {
              ...tableList.props?.actionBarButtons,
              dataSource: tableList.props?.actionBarButtons?.dataSource ? tableList.props?.actionBarButtons?.dataSource?.reduce(
                (buf: any, button: any) => {
                  if (button.actionType === 'create') {
                    button.page = childPageId
                  }
                  buf.push({ ...button })
                  return buf
                }, []) : createButton(childPageId)
            },
            actionColumnButtons: {
              ...tableList.props?.actionBarButtons,
              dataSource: tableList.props?.actionColumnButtons?.dataSource ? tableList.props?.actionColumnButtons?.dataSource?.reduce(
                (buf: any, button: any) => {
                  if ([
                    'detail',
                    'edit'
                  ].includes(button.actionType)) {
                    button.page = childPageId
                  }
                  buf.push({ ...button })
                  return buf
                }, []) : editViewButtons(childPageId)
            }
          },
          id: nextId(docId, seqId),
          children: [
            {
              "componentName": "Filter",
              "id": nextId(docId, seqId),
              "props": {
                "labelAlign": "left",
                "labelCol": {
                  "fixedSpan": 6
                },
                "cols": 3,
                "operations": [
                  {
                    "action": "submit",
                    "content": "查询",
                    "type": "primary",
                    "hint": "icon-chaxunicon1",
                    "size": 14
                  },
                  {
                    "content": "重置",
                    "action": "reset",
                    "type": "secondary",
                    "hint": "icon-zhongzhi2",
                    "size": 14
                  }
                ]
              },
              "children": [
                {
                  "componentName": "FormInput",
                  "id": nextId(docId, seqId),
                  "props": {
                    "formItemProps": {
                      "primaryKey": mockId(),
                      "label": "表单项",
                      "size": "medium",
                      "device": "desktop",
                      "fullWidth": true
                    },
                    "placeholder": "请输入"
                  },
                },
              ]
            }
          ]
        })
      ]
    })
  ];

  const formCard = childRootSchema?.children?.[0] || {};
  const form = formCard?.children?.[0] || {};

  const formCardSchema = [
    CardSchema({
      props: { ...formCard.props },
      id: nextId(docId, seqId),
      children: [
        ProFormSchema({
          props: {
            ...form.props,
            ...dataTable,
          },
          children: Creator.createFormItems(fields, docId, seqId, { components }),
          id: nextId(docId, seqId),
        })
      ]
    })
  ]
  let pageSchema: any = childRootSchema;
  if (!childRootSchema) {
    pageSchema = PageSchema({
      id: nextId(docId, seqId),
      children: formCardSchema
    })
  } else {
    childRootSchema.children = formCardSchema;
  }

  components.push(ProFormComponent);
  return schemaApi.saveSchema({
    packages,
    schema: {
      version: "1.0.0",
      componentsTree: [pageSchema],
      componentsMap: [
        ...components,
        ...commonComponents
      ]
    },
    pageId: childPageId?.value
  })
}

function createButton(page: any) {
  return [
    {
      "actionType": "create",
      "children": "新增",
      "id": uuid(),
      page,
      "type": "primary"
    }
  ]
}

function editViewButtons(page: any) {
  return [
    {
      "actionType": "edit",
      "children": "编辑",
      "id": uuid(),
      page,
      "type": "normal"
    },
    {
      "actionType": "detail",
      "children": "详情",
      "id": uuid(),
      page,
      "type": "normal"
    },
    {
      "actionType": "del",
      "children": "删除",
      "id": uuid(),
      "type": "normal"
    }
  ]
}
