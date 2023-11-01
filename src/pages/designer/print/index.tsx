import {
  init,
  plugins
} from '@alilc/lowcode-engine';
import { createFetchHandler } from '@alilc/lowcode-datasource-fetch-handler'
import EditorInitPlugin from '../plugins/plugin-editor-init';
import UndoRedoPlugin from '@alilc/lowcode-plugin-undo-redo';
import ZhEnPlugin from '@alilc/lowcode-plugin-zh-en';
import SchemaPlugin from '@alilc/lowcode-plugin-schema';
import ManualPlugin from "@alilc/lowcode-plugin-manual";
import InjectPlugin from '@alilc/lowcode-plugin-inject';
import SimulatorResizerPlugin from '../plugins/plugin-simulator-resizer';
import ComponentPanelPlugin from '../plugins/plugin-component-panel';
import DefaultSettersRegistryPlugin from '../plugins/plugin-default-setters-registry';
import SavePlugin from '../plugins/plugin-save';
import SetRefPropPlugin from '@alilc/lowcode-plugin-set-ref-prop';
import LogoPlugin from '../plugins/plugin-logo';
import './index.less';
import {
  useEffect,
  useRef
} from "react";
import { getQueries } from "@/utils/utils";
import { schemaParser } from "@/pages/designer/print/SchemaParser";
import schemaApi from "@/services/schemaApi";
import { savePrintSchema } from "@/components/Designer/utils";
import CodeEditorPlugin from "@alilc/lowcode-plugin-code-editor";

async function registerPlugins() {

  await plugins.register(EditorInitPlugin, {
    scenarioName: 'print',
    displayName: '打印模版',
    info: {
      getAssets: schemaApi.getAssets,
      getSchema: schemaParser,
      isPrint: true
    },
  });

  // 设置内置 setter 和事件绑定、插件绑定面板
  await plugins.register(DefaultSettersRegistryPlugin);

  await plugins.register(LogoPlugin);

  await plugins.register(ComponentPanelPlugin);
  await plugins.register(CodeEditorPlugin);

  await plugins.register(SchemaPlugin);

  await plugins.register(ManualPlugin);
  // 注册回退/前进
  await plugins.register(UndoRedoPlugin);

  // 注册中英文切换
  await plugins.register(ZhEnPlugin);

  await plugins.register(InjectPlugin);

  await plugins.register(SetRefPropPlugin);

  await plugins.register(SimulatorResizerPlugin, {
    device: 'desktop',
    devices: [
      { key: 'desktop' },
      { key: 'tablet' },
    ],
  });

  await plugins.register(SavePlugin, {
    saveSchema: savePrintSchema,
    recoverPrintTemplate: true,
    isPrint: true,
  });
  // await plugins.register(PreviewPlugin);
}

const PrintDesigner = () => {
  const pageId = getQueries("pageId");
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!ref.current || !pageId) return
    registerPlugins().then(() => init(ref.current!, {
      locale: 'zh-CN',
      enableCondition: true,
      enableCanvasLock: true,
      // 默认绑定变量
      supportVariableGlobally: true,
      requestHandlersMap: {
        fetch: createFetchHandler()
      },
    })).catch();
    return () => {
      // plugins.destroy();
    }
  }, [pageId])
  return <div id="lce-container" ref={ref}/>
}

export default PrintDesigner
