import {
  nextId,
  uniqueId
} from "@/pages/designer/utils";
import { defaultAPPComponentProps } from "@/pages/designer/template/common";
import type {
  CreatorProps,
  SchemaCreatorProps
} from "../types";
import ProcessForm from "./process-form";
import schemaApi, { AssetsType } from "@/services/schemaApi";
import PageSchema from "./page";
import {
  ProcessHistoryComponent,
  ProFormComponent
} from "./common";
import PageListSchema from "./page-list";
import { getAssets } from "@/components/Designer/utils";
import { TerminalType } from "@/types/common";
import type { IPublicTypePackage } from "@alilc/lowcode-types";
import ProForm from "./pro-form";


export default function SchemaCreator(props: SchemaCreatorProps) {
  const {
    fields,
    datasourceId: database,
    tableName: tableModel,
    childPageId,
    rootSchema,
    childRootSchema,
    packages,
    pageType,
    pageName
  } = props;
  const docId = uniqueId('doc');
  const seqId = { seqId: 0 };
  const dataTable = {
    database,
    tableModel
  };

  const components = fields?.map(field => {
    return {
      ...defaultAPPComponentProps,
      exportName: field.formComponentName,
      componentName: field.formComponentName,
    }
  });

  const creatorProps: CreatorProps = {
    rootSchema,
    docId,
    seqId,
    dataTable,
    childPageId,
    childRootSchema,
    packages,
    fields,
    pageName,
    components,
  }
  const templates = {
    //普通页面
    1: async () => true,
    //流程表单
    0: async () => (ProcessForm as any).create(creatorProps),
    //模型列表，同时生成新增页面
    2: async () => (PageListSchema as any).create(creatorProps),
  }

  /** 确保page页面$this传参值正常赋值 */
  rootSchema.props = {
    $this: {
      "type": "JSExpression",
      "value": "this"
    },
    ...rootSchema.props,
  }
  return templates[pageType || 0]
}

export async function injectProcessSchemaOfPageId(pageId: string, props: CreatorProps) {
  const { docId, seqId, packages, components, fields } = props;

  const pageSchema: any = PageSchema({
    id: nextId(docId, seqId),
    children: [],
  })
  const _packages = packages?.length ? packages : (await getAssets(TerminalType.App)).packages as IPublicTypePackage[];
  const _components = components?.length ? components : fields?.map(field => {
    return {
      ...defaultAPPComponentProps,
      exportName: field.formComponentName,
      componentName: field.formComponentName,
    }
  });

  await ProcessForm.create({
    ...props,
    rootSchema: pageSchema,
  });

  return schemaApi.saveSchema({
    packages: _packages,
    schema: {
      version: "1.0.0",
      componentsTree: [pageSchema],
      componentsMap: [
        ..._components,
        ProFormComponent,
        ProcessHistoryComponent,
      ]
    },
    pageId: pageId
  })
}

export async function injectProFormSchemaOfPageId(pageId: string, props: CreatorProps) {
  const { docId, seqId, packages, components, fields } = props;

  const pageSchema: any = PageSchema({
    id: nextId(docId, seqId),
    children: [],
  })
  const _packages = packages?.length ? packages : (await getAssets(TerminalType.App)).packages as IPublicTypePackage[];
  const _components = components?.length ? components : fields?.map(field => {
    return {
      ...defaultAPPComponentProps,
      exportName: field.formComponentName,
      componentName: field.formComponentName,
    }
  });

  await ProForm.create({
    ...props,
    rootSchema: pageSchema,
  });

  return schemaApi.saveSchema({
    packages: _packages,
    schema: {
      version: "1.0.0",
      componentsTree: [pageSchema],
      componentsMap: [
        ..._components,
        ProFormComponent,
        ProcessHistoryComponent,
      ]
    },
    pageId: pageId
  })
}
