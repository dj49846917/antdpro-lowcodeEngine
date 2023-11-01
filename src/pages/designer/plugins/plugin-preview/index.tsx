import { IPublicModelPluginContext } from '@alilc/lowcode-types';
import { Button } from '@alifd/next';
import schemaApi from "@/services/schemaApi";
import { preview } from "@/components/Designer/utils";

// 保存功能示例
const PreviewPlugin = (ctx: IPublicModelPluginContext) => {
  return {
    async init() {
      const { skeleton, config } = ctx;
      const doPreview = async () => {
        const scenarioName = config.get('scenarioName');
        const printId = config.get('printId');
        await preview(scenarioName, "mobile", printId);
      };
      skeleton.add({
        name: 'preview',
        area: 'topArea',
        type: 'Widget',
        props: {
          align: 'right',
        },
        content: (
          <Button type="primary" onClick={() => doPreview()}>
            预览
          </Button>
        ),
      });
    },
  };
}
PreviewPlugin.pluginName = 'PreviewPlugin';
PreviewPlugin.meta = {
  dependencies: ['EditorInitPlugin'],
};
export default PreviewPlugin;
