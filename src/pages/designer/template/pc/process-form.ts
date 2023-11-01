import Creator, { contextProps } from "@/pages/designer/template/pc/common";
import AnchorFormSchema, { ChildForm } from "@/pages/designer/template/pc/anchor-form";
import { nextId } from "@/pages/designer/utils";
import CardSchema from "@/pages/designer/template/pc/card";
import type { CreatorProps } from "@/pages/designer/template/types";

export const ProcessGraph = {
  "componentName": "FlowProcess",
  "title": "流程图",
  "props": {
    "api": {
      "failFunction": "",
      "apiName": "BDH查询流程节点接口",
      "postUri": "/fssc-business/workflow/wf/processDetails",
      "modifiedUser": "965653423602507776",
      "supCors": 1,
      "apiDesc": "",
      "waitTimeout": 100000,
      "postHeader": "",
      "postParams": "",
      "postMethod": "POST",
      "countFunction": "",
      "appId": "006520697139097600",
      "successFunction": "",
      "modifiedDate": "2022-10-24 15:16:33",
      "createUser": "1013871486221131776",
      "apiId": "1580471220656840705",
      "beforeFunction": "function(params, systemParams) {\r\n  console.log(systemParams);\r\n  return {\r\n    \"data\": {\r\n      processId: systemParams.processId,\r\n      pageId: systemParams.pageId\r\n    },\r\n    \"lang\": systemParams.lang,\r\n    \"operator\": systemParams.operator,\r\n    \"appId\": systemParams.appId\r\n  }\r\n}",
      "createDate": "2022-10-13 16:11:17"
    },
  }
}

export const ProcessHistory = {
  "componentName": "LceTimeline",
  "title": "流程历史",
  "props": {
    "history": {
      "type": "JSExpression",
      "value": "this.history"
    },
    "constants": {
      "type": "JSExpression",
      "value": "this.constants"
    },
    "$this": {
      "type": "JSExpression",
      "value": "this"
    },
    "api": {
      "failFunction": "",
      "apiName": "BDH查询流程历史接口",
      "postUri": "/fssc-business/workflow/wf/history",
      "modifiedUser": "965653423602507776",
      "supCors": 1,
      "apiDesc": "",
      "waitTimeout": 100000,
      "postHeader": "",
      "postParams": "",
      "postMethod": "POST",
      "countFunction": "",
      "appId": "006520697139097600",
      "successFunction": "",
      "modifiedDate": "2022-10-24 15:16:25",
      "createUser": "1013871486221131776",
      "apiId": "1580732425598312449",
      "beforeFunction": "/**\r\n params: 请求参数 \r\n systemParams: 系统参数 \r\n*/ \r\n function(params, systemParams) {\r\n   return {\r\n     \"data\": {\r\n       businessId: systemParams.businessId,\r\n       pageId: systemParams.pageId\r\n     },\r\n     \"lang\": systemParams.lang,\r\n     \"operator\": systemParams.operator,\r\n     \"appId\": systemParams.appId,\r\n     \"source\": \"PC\",\r\n     \"traceId\": \"\",\r\n     \"version\": \"1\"\r\n   }\r\n }",
      "createDate": "2022-10-14 09:29:14"
    }
  },
}

export const ProcessActionBar = {
  "componentName": "LceActionBar",
  "id": "node_ocliwvsvjop3",
  "props": {
    "layout": "bottom",
    "columnGap": 10,
    "align": "flex-end"
  },
  "docId": "docliwvsvjo",
  "hidden": false,
  "title": "",
  "isLocked": false,
  "condition": true,
  "conditionGroup": "",
  "children": [
    {
      "componentName": "LceAction",
      "id": "node_ocliwvsvjop4",
      "props": {
        "name": "同意",
        "actionType": "agree"
      },
      "docId": "docliwvsvjo",
      "hidden": false,
      "title": "",
      "isLocked": false,
      "condition": true,
      "conditionGroup": ""
    },
    {
      "componentName": "LceAction",
      "id": "node_ocliwvsvjop5",
      "props": {
        "name": "拒绝",
        "actionType": "reject"
      },
      "docId": "docliwvsvjo",
      "hidden": false,
      "title": "",
      "isLocked": false,
      "condition": true,
      "conditionGroup": ""
    },
    {
      "componentName": "LceAction",
      "id": "node_ocliwvsvjop6",
      "props": {
        "name": "转办",
        "actionType": "transfer"
      },
      "docId": "docliwvsvjo",
      "hidden": false,
      "title": "",
      "isLocked": false,
      "condition": true,
      "conditionGroup": ""
    },
    {
      "componentName": "LceAction",
      "id": "node_ocliwvsvjop7",
      "props": {
        "name": "沟通",
        "actionType": "communicate"
      },
      "docId": "docliwvsvjo",
      "hidden": false,
      "title": "",
      "isLocked": false,
      "condition": true,
      "conditionGroup": ""
    },
    {
      "componentName": "LceAction",
      "id": "node_ocliwvsvjop8",
      "props": {
        "name": "加签",
        "actionType": "completeAndSign"
      },
      "docId": "docliwvsvjo",
      "hidden": false,
      "title": "",
      "isLocked": false,
      "condition": true,
      "conditionGroup": ""
    },
    {
      "componentName": "LceAction",
      "id": "node_ocliwvsvjop9",
      "props": {
        "name": "知会",
        "actionType": "inform"
      },
      "docId": "docliwvsvjo",
      "hidden": false,
      "title": "",
      "isLocked": false,
      "condition": true,
      "conditionGroup": ""
    },
    {
      "componentName": "LceAction",
      "id": "node_ocliwvsvjopa",
      "props": {
        "name": "发起流程",
        "actionType": "launchWf"
      },
      "docId": "docliwvsvjo",
      "hidden": false,
      "title": "",
      "isLocked": false,
      "condition": true,
      "conditionGroup": ""
    },
    {
      "componentName": "LceAction",
      "id": "node_ocliwvsvjopb",
      "props": {
        "name": "退回上一节点",
        "actionType": "returnToPreNode"
      },
      "docId": "docliwvsvjo",
      "hidden": false,
      "title": "",
      "isLocked": false,
      "condition": true,
      "conditionGroup": ""
    },
    {
      "componentName": "LceAction",
      "id": "node_ocliwvsvjopc",
      "props": {
        "name": "退回指定节点",
        "actionType": "returnToTheSpecifiedNode"
      },
      "docId": "docliwvsvjo",
      "hidden": false,
      "title": "",
      "isLocked": false,
      "condition": true,
      "conditionGroup": ""
    },
    {
      "componentName": "LceAction",
      "id": "node_ocliwvsvjopd",
      "props": {
        "name": "补签",
        "actionType": "signBeforeMe"
      },
      "docId": "docliwvsvjo",
      "hidden": false,
      "title": "",
      "isLocked": false,
      "condition": true,
      "conditionGroup": ""
    },
    {
      "componentName": "LceAction",
      "id": "node_ocliwvsvjope",
      "props": {
        "name": "暂存",
        "actionType": "temporaryStorage"
      },
      "docId": "docliwvsvjo",
      "hidden": false,
      "title": "",
      "isLocked": false,
      "condition": true,
      "conditionGroup": ""
    },
    {
      "componentName": "LceAction",
      "id": "node_ocliwvsvjopf",
      "props": {
        "name": "催办",
        "actionType": "urge"
      },
      "docId": "docliwvsvjo",
      "hidden": false,
      "title": "",
      "isLocked": false,
      "condition": true,
      "conditionGroup": ""
    },
    {
      "componentName": "LceAction",
      "id": "node_ocliwvsvjopg",
      "props": {
        "name": "撤回",
        "actionType": "withdraw"
      },
      "docId": "docliwvsvjo",
      "hidden": false,
      "title": "",
      "isLocked": false,
      "condition": true,
      "conditionGroup": ""
    },
    {
      "componentName": "LceAction",
      "id": "node_ocliwvsvjoph",
      "props": {
        "name": "自定义",
        "actionType": "custom"
      },
      "docId": "docliwvsvjo",
      "hidden": false,
      "title": "",
      "isLocked": false,
      "condition": true,
      "conditionGroup": ""
    },
    {
      "componentName": "LceAction",
      "id": "node_ocliwvsvjopi",
      "props": {
        "name": "自定义1",
        "actionType": "custom1"
      },
      "docId": "docliwvsvjo",
      "hidden": false,
      "title": "",
      "isLocked": false,
      "condition": true,
      "conditionGroup": ""
    },
    {
      "componentName": "LceAction",
      "id": "node_ocliwvsvjopj",
      "props": {
        "name": "自定义2",
        "actionType": "custom2"
      },
      "docId": "docliwvsvjo",
      "hidden": false,
      "title": "",
      "isLocked": false,
      "condition": true,
      "conditionGroup": ""
    },
    {
      "componentName": "LceAction",
      "id": "node_ocliwvsvjopk",
      "props": {
        "name": "自定义3",
        "actionType": "custom3"
      },
      "docId": "docliwvsvjo",
      "hidden": false,
      "title": "",
      "isLocked": false,
      "condition": true,
      "conditionGroup": ""
    },
    {
      "componentName": "LceAction",
      "id": "node_ocliwvsvjopl",
      "props": {
        "name": "自定义4",
        "actionType": "custom4"
      },
      "docId": "docliwvsvjo",
      "hidden": false,
      "title": "",
      "isLocked": false,
      "condition": true,
      "conditionGroup": ""
    },
    {
      "componentName": "LceAction",
      "id": "node_ocliwvsvjopm",
      "props": {
        "name": "自定义5",
        "actionType": "custom5"
      },
      "docId": "docliwvsvjo",
      "hidden": false,
      "title": "",
      "isLocked": false,
      "condition": true,
      "conditionGroup": ""
    },
    {
      "componentName": "LceAction",
      "id": "node_ocliwvsvjopn",
      "props": {
        "name": "自定义6",
        "actionType": "custom6"
      },
      "docId": "docliwvsvjo",
      "hidden": false,
      "title": "",
      "isLocked": false,
      "condition": true,
      "conditionGroup": ""
    },
    {
      "componentName": "LceAction",
      "id": "node_ocliwvsvjopo",
      "props": {
        "name": "自定义7",
        "actionType": "custom7"
      },
      "docId": "docliwvsvjo",
      "hidden": false,
      "title": "",
      "isLocked": false,
      "condition": true,
      "conditionGroup": ""
    },
    {
      "componentName": "LceAction",
      "id": "node_ocliwvsvjopp",
      "props": {
        "name": "自定义8",
        "actionType": "custom8"
      },
      "docId": "docliwvsvjo",
      "hidden": false,
      "title": "",
      "isLocked": false,
      "condition": true,
      "conditionGroup": ""
    },
    {
      "componentName": "LceAction",
      "id": "node_ocliwvsvjopq",
      "props": {
        "name": "自定义9",
        "actionType": "custom9"
      },
      "docId": "docliwvsvjo",
      "hidden": false,
      "title": "",
      "isLocked": false,
      "condition": true,
      "conditionGroup": ""
    },
    {
      "componentName": "LceAction",
      "id": "node_ocliwvsvjopr",
      "props": {
        "name": "自定义10",
        "actionType": "custom10"
      },
      "docId": "docliwvsvjo",
      "hidden": false,
      "title": "",
      "isLocked": false,
      "condition": true,
      "conditionGroup": ""
    }
  ]
}
export default function ProcessForm({
  props,
  children,
  id
}: any): any {
  return {
    "componentName": "LceProcessForm",
    "props": {
      ...contextProps,
      "camelCase": false,
      ...props
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
  const anchorForm = AnchorFormSchema({
    id: nextId(docId, seqId),
    props: {
      ...dataTable,
      operations: null
    },
    children: [ChildForm({ children: formItems })]
  });
  const processForm = ProcessForm({
    props: {
      ...dataTable
    },
    id: nextId(docId, seqId),
    children: [
      CardSchema({
        props: {
          title: pageName,
        },
        children: [anchorForm],
        id: nextId(docId, seqId)
      }),
      CardSchema({
        props: {
          title: ProcessGraph.title,
        },
        children: [ProcessGraph],
        id: nextId(docId, seqId)
      }),
      CardSchema({
        props: {
          title: ProcessHistory.title,
        },
        children: [ProcessHistory],
        id: nextId(docId, seqId)
      }),
      ProcessActionBar
    ]
  });
  rootSchema.children = [processForm];

  return true
}
