import { IPublicModelPluginContext } from '@alilc/lowcode-types';
import TitleSetter from '@alilc/lowcode-setter-title';
import BehaviorSetter from './setters/behavior-setter';

// 保存功能示例
const CustomSetterSamplePlugin = (ctx: IPublicModelPluginContext) => {
  return {
    async init() {
      const { setters } = ctx;

      setters.registerSetter('TitleSetter', TitleSetter);
      setters.registerSetter('BehaviorSetter', BehaviorSetter);
    },
  };
}
CustomSetterSamplePlugin.pluginName = 'CustomSetterSamplePlugin';
export default CustomSetterSamplePlugin;
