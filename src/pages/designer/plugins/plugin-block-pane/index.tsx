import { IPublicModelPluginContext } from '@alilc/lowcode-types';
import BlockPane from "@/pages/designer/plugins/plugin-block-pane/pane";
import { IconFont } from "@/components/LcIcon";

export const BizBlockPanelPlugin = (ctx: IPublicModelPluginContext) => {
  return {
    // 插件名，注册环境下唯一
    name: 'BizBlockPanelPlugin',
    // 依赖的插件（插件名数组）
    dep: [],
    // 插件对外暴露的数据和方法
    exports() {
      return {
        data: '你可以把插件的数据这样对外暴露',
        func: () => {
          console.log('方法也是一样');
        },
      }
    },
    async init() {
      const { skeleton } = ctx;
      // 注册区块面板
      skeleton.add({
        area: 'leftArea',
        type: 'PanelDock',
        name: 'bizBlockPanel',
        content: BlockPane,
        contentProps: {},
        props: {
          icon: <IconFont
            type="icon-qukuai"
            style={{ fontSize: "20px" }}
          />,
          description: '区块面板',
        },
      });
    },
  };
}

BizBlockPanelPlugin.pluginName = 'BizBlockPanelPlugin';

