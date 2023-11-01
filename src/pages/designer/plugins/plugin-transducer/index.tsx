import { IPublicModelPluginContext } from "@alilc/lowcode-types";
import { IPublicTypeFieldConfig, IPublicTypeTransformedComponentMetadata } from "@alilc/lowcode-types/lib/shell/type";

const TransducerPlugin = (ctx: IPublicModelPluginContext) => {
  return {
    async init() {
      ctx.material.registerMetadataTransducer((metadata: IPublicTypeTransformedComponentMetadata) => {
        if (metadata.componentName === "FDFixedPoint") {
          if (!metadata.configure?.props?.find(prop => prop.name === "left")) {
            metadata.configure?.props?.push({
              name: 'left',
              title: '距离页面左侧距离',
              setter: 'NumberSetter',
            },{
              name: 'top',
              title: '距离页面上侧距离',
              setter: 'NumberSetter',
            })
          }
        }

        return {
          ...metadata,
          // configure: {
          //   ...configure,
          //   combined,
          // },
        };
      }, 1, "layout-fixed-point-position")
    },
  };
};
TransducerPlugin.pluginName = 'TransducerPlugin';
export default TransducerPlugin;


