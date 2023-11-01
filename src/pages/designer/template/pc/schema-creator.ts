import ProcessForm from "@/pages/designer/template/pc/process-form";
import { uniqueId } from "@/pages/designer/utils";

import TableListSchema from "@/pages/designer/template/pc/table-list";
import { defaultComponentProps } from "@/pages/designer/template/pc/common";
import type { CreatorProps, SchemaCreatorProps } from "../types";
import { injectProcessSchemaOfPageId } from "../app/schema-creator";


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
    appPageId,
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
      ...defaultComponentProps,
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
    0: async () => {
      if (appPageId) {
        /** 创建关联的app流程页面 */
        injectProcessSchemaOfPageId(appPageId, {
          ...creatorProps,
          packages: [],
          components: []
        });
      }
      await (ProcessForm as any).create(creatorProps);
    },
    //模型列表，同时生成新增页面
    2: async () => (TableListSchema as any).create(creatorProps),
    //流程表单-标签表格
    3: async () => { }
  }
  return templates[pageType]
}
