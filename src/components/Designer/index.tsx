import registerPlugins from './plugin';
import '@/components/Designer/index.scss';
import { useDesigner } from "@/hooks/useDesigner";
import type { IPublicTypePackage } from "@alilc/lowcode-types";
import type { AssetsType } from "@/services/schemaApi";
import type { TerminalType } from '@/types/common';
// import { configure, getSingletonMonaco } from '@alilc/lowcode-plugin-base-monaco-editor/es/monaco'
// import editorAppTypes from '!!raw-loader!./editor.app.d.ts';
// import editorPcTypes from '!!raw-loader!./editor.pc.d.ts';

// 保证 monaco editor 是单例
// configure({
//   singleton: true,
// })

const preference = new Map();
preference.set('DataSourcePane', {
  importPlugins: [],
  dataSourceTypes: [
    {
      type: 'fetch',
    },
    {
      type: 'jsonp',
    }
  ]
});


const Designer = (props: { terminalType: TerminalType, pageId: string, rootSchema?: any, packages?: IPublicTypePackage[]; assets: AssetsType }) => {
  const ref = useDesigner(props, registerPlugins)
  return <div id={"lce-container"} ref={ref} />
}

export default Designer
