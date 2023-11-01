import type { IPublicModelPluginContext } from '@alilc/lowcode-types';
import { injectAssets } from '@alilc/lowcode-plugin-inject';

const EditorInitPlugin = (ctx: IPublicModelPluginContext, options: any) => {
  return {
    async init() {
      const { material, project, config } = ctx;
      const scenarioName = options.scenarioName;
      const scenarioDisplayName = options.displayName || scenarioName;
      const { getAssets, getSchema, isPrint } = options.info || {};
      // 保存在config中用于引擎范围其他插件使用
      config.set('scenarioName', scenarioName);
      config.set('scenarioDisplayName', scenarioDisplayName);

      const assets = await getAssets();
      // 设置物料描述

      await material.setAssets(await injectAssets(assets));

      const schemaRes = await getSchema();
      if (isPrint) {
        config.set('printId', schemaRes?.businessId);
        const schema = schemaRes?.schema?.componentsTree?.[0];
        project.openDocument(schema);
        return
      }

      // 加载 schema
      project.openDocument(schemaRes);
    },
  };
}
EditorInitPlugin.pluginName = 'EditorInitPlugin';
EditorInitPlugin.meta = {
  preferenceDeclaration: {
    title: '保存插件配置',
    properties: [
      {
        key: 'scenarioName',
        type: 'string',
        description: '用于localstorage存储key',
      },
      {
        key: 'displayName',
        type: 'string',
        description: '用于显示的场景名',
      },
      {
        key: 'info',
        type: 'object',
        description: '用于扩展信息',
      }
    ],
  },
};
export default EditorInitPlugin;
