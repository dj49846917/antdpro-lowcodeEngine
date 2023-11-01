import { IPublicModelPluginContext } from '@alilc/lowcode-types';
import { Button } from '@alifd/next';
import schemaApi from "@/services/schemaApi";
import { resetSchema, saveSchema } from '@/components/Designer/utils';
import { schemaParser } from "@/pages/designer/print/SchemaParser";

// 保存功能
const SavePlugin = (ctx: IPublicModelPluginContext, options: any) => {
  return {
    async init() {
      const { skeleton, hotkey, config, project } = ctx;
      const scenarioName = config.get('scenarioName');
      const printId = config.get('printId');
      const save = options?.saveSchema || saveSchema
      const recoverPrintTemplate = options?.recoverPrintTemplate

      skeleton.add({
        name: 'save',
        area: 'topArea',
        type: 'Widget',
        props: {
          align: 'right',
        },
        content: (
          <Button onClick={() => save(scenarioName, printId)}>
            保存
          </Button>
        ),
      });
      skeleton.add({
        name: 'resetSchema',
        area: 'topArea',
        type: 'Widget',
        props: {
          align: 'right',
        },
        content: (
          <Button onClick={() => resetSchema(scenarioName)}>
            {scenarioName === "print" ? "重置打印模版" : "重置页面"}
          </Button>
        ),
      });
      if (recoverPrintTemplate) {
        skeleton.add({
          name: 'recoverPrintTemplate',
          area: 'topArea',
          type: 'Widget',
          props: {
            align: 'right',
          },
          content: (
            <Button onClick={async () => {
              const res = await schemaParser(true);
              project.openDocument(res?.schema?.componentsTree?.[0]);
            }}>
              恢复默认打印模版
            </Button>
          ),
        });
      }

      hotkey.bind('command+s', (e) => {
        e.preventDefault();
        schemaApi.saveSchema(scenarioName);
      });
    },
  };
}
SavePlugin.pluginName = 'SavePlugin';
SavePlugin.meta = {
  dependencies: ['EditorInitPlugin'],
  preferenceDeclaration: {
    properties: [
      {
        key: 'saveSchema',
        type: 'function',
        description: '用于保存schema',
      },
      {
        key: 'recoverPrintTemplate',
        type: 'boolean',
        description: '还原打印模版',
      },
      {
        key: 'isPrint',
        type: 'boolean',
        description: '是否打印模式',
      },
    ],
  }
};
export default SavePlugin;
