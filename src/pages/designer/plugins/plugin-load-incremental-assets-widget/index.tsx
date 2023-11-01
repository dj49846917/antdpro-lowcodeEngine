import type { IPublicModelPluginContext } from '@alilc/lowcode-types';
import { Button } from '@alifd/next';
import { loadLatestMaterials, loadMobileLatestMaterials } from '@/components/Designer/utils';
import { getQueries } from '@/utils/utils';

const LoadIncrementalAssetsWidgetPlugin = (ctx: IPublicModelPluginContext, options: { isMobile?: boolean } = {}) => {
  return {
    async init() {
      const { skeleton } = ctx;
      const { isMobile } = options

      skeleton.add({
        name: 'loadAssetsSample',
        area: 'topArea',
        type: 'Widget',
        props: {
          align: 'right',
          width: 80,
        },
        content: (
          <div>
            <Button onClick={() => {
              if (isMobile) {
                loadMobileLatestMaterials();
              } else {
                loadLatestMaterials(false);
              }
            }}>
              加载最新组件库
            </Button>
            {
              getQueries("isBeta") && !isMobile &&
              <Button style={{ marginLeft: 20 }} onClick={() => loadLatestMaterials(true)}>
                加载测试版本
              </Button>
            }
          </div>

        ),
      });
    },
  };
}
LoadIncrementalAssetsWidgetPlugin.pluginName = 'LoadIncrementalAssetsWidgetPlugin';
LoadIncrementalAssetsWidgetPlugin.meta = {
  preferenceDeclaration: {
    title: '加载最新组件',
    properties: [
      {
        key: 'isMobile',
        type: 'boolean',
        description: '是否是手机端',
      },
    ],
  },
}

export default LoadIncrementalAssetsWidgetPlugin;
