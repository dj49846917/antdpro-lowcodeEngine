import { IPublicModelPluginContext } from '@alilc/lowcode-types';
import './index.scss';
import Logo from '@/plugins/logo';

// 示例 Logo widget
const LogoPlugin = (ctx: IPublicModelPluginContext) => {
  return {
    async init() {
      const { skeleton, config } = ctx;
      // 注册 logo widget
      skeleton.add({
        area: 'topArea',
        type: 'Widget',
        name: 'logo',
        content: Logo,
        props: {
          align: 'left',
        },
      });
    },
  };
}
LogoPlugin.pluginName = 'LogoPlugin';
LogoPlugin.meta = {
  dependencies: ['EditorInitPlugin'],
};
export default LogoPlugin;
