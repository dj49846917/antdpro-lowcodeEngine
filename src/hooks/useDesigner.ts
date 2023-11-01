import { useEffect, useRef } from "react";
import { init, plugins } from "@alilc/lowcode-engine";
import { createFetchHandler } from "@alilc/lowcode-datasource-fetch-handler";
import type { AssetsType } from "@/services/schemaApi";
import { TerminalType } from "@/types/common";
import type { IPublicTypeEngineOptions } from "@alilc/lowcode-types";
import { getDefaultAppHelper } from "@/utils/utils";

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


export const initEditor = (dom: HTMLDivElement, terminalType: TerminalType, assets: AssetsType) => {
  // simulatorUrl 在当 engine-core.js 同一个父路径下时是不需要配置的！！！
  // 这里因为用的是 alifd cdn，在不同 npm 包，engine-core.js 和 react-simulator-renderer.js 是不同路径
  // simulatorUrl: [
  //   // 'https://alifd.alicdn.com/npm/@alilc/lowcode-react-simulator-renderer@latest/dist/css/react-simulator-renderer.css',
  //   // 'https://alifd.alicdn.com/npm/@alilc/lowcode-react-simulator-renderer@latest/dist/js/react-simulator-renderer.js'
  //   'https://alifd.alicdn.com/npm/@alilc/lowcode-react-simulator-renderer@1.0.18/dist/css/react-simulator-renderer.css',
  //   'https://alifd.alicdn.com/npm/@alilc/lowcode-react-simulator-renderer@1.0.18/dist/js/react-simulator-renderer.js'
  // ],
  let engineOptions: IPublicTypeEngineOptions;
  if (terminalType === TerminalType.App) {
    engineOptions = {
      enableCondition: true,
      enableCanvasLock: true,
      // 默认绑定变量
      supportVariableGlobally: true,
      device: "mobile",
      requestHandlersMap: {
        fetch: createFetchHandler({
          headers: {
            'Content-Type': 'application/json',
            "Authorization": localStorage.getItem('loginToken')
          }
        })
      },
      appHelper: getDefaultAppHelper(TerminalType.App, {
        pageConfig: {
          pageId: assets.pageId,
          processPageId: assets.pcPageId,
        },
        _isDttApp: false
      })
    }

  } else {
    engineOptions = {
      enableCondition: true,
      enableCanvasLock: true,
      // 默认绑定变量
      supportVariableGlobally: true,
      appHelper: getDefaultAppHelper(TerminalType.Pc, {})
    }
  }
  init(dom, engineOptions, preference);
}
export const useDesigner = ({ pageId, rootSchema, packages, assets, terminalType }: any, registerPlugins: (params: any) => Promise<any>) => {

  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current || !pageId) return
    registerPlugins({ rootSchema, packages, assets, terminalType }).then(() => initEditor(ref.current!, terminalType, assets)).catch();
    return () => {
      if ((plugins as any).destroy) {
        // plugins api文档中没有destroy方法 源码中有，
        (plugins as any).destroy();
      } else {
        plugins.getAll().forEach(v => plugins.delete(v.pluginName))
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageId, rootSchema])

  return ref
}
