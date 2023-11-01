import type { IPublicModelPluginContext, IPublicTypePackage } from "@alilc/lowcode-types";
import { Button } from '@alifd/next';
import UndoRedoPlugin from '@alilc/lowcode-plugin-undo-redo';
import ZhEnPlugin from '@alilc/lowcode-plugin-zh-en';
import SchemaPlugin from '@alilc/lowcode-plugin-schema';
import CodeEditor from "@alilc/lowcode-plugin-code-editor";
import ManualPlugin from "@alilc/lowcode-plugin-manual";
import Inject, { injectAssets } from '@alilc/lowcode-plugin-inject';
import { preview, resetSchema, saveSchema, } from '@/components/Designer/utils';
import defaultSchema from './schema.json';
import defaultAPPSchema from './schema-app.json';
import type { AssetsType } from "@/services/schemaApi";
import { BizBlockPanelPlugin } from "@/pages/designer/plugins/plugin-block-pane";
import type { IPublicTypeRootSchema } from "@alilc/lowcode-types/lib/shell/type";
import { plugins } from "@alilc/lowcode-engine";
import DefaultSettersRegistryPlugin from "@/pages/designer/plugins/plugin-default-setters-registry";
import LogoPlugin from "@/pages/designer/plugins/plugin-logo";
import ComponentPanelPlugin from "@/pages/designer/plugins/plugin-component-panel";
import SimulatorResizerPlugin from "@/pages/designer/plugins/plugin-simulator-resizer";
import SaveBlockAction from "@/pages/designer/plugins/plugin-save-block";
import TransducerPlugin from "@/pages/designer/plugins/plugin-transducer";
import LoadIncrementalAssetsWidgetPlugin from "@/pages/designer/plugins/plugin-load-incremental-assets-widget";
import { TerminalType } from "@/types/common";
import EditorInitPlugin from "@/pages/designer/plugins/plugin-editor-init";
import schemaApi from "@/services/schemaApi";


import CodeEditorPlugin from "@alilc/lowcode-plugin-code-editor";
import InjectPlugin from '@alilc/lowcode-plugin-inject';
import SavePlugin from '@/pages/designer/plugins/plugin-save';
import PreviewPlugin from '@/pages/designer/plugins/plugin-preview';
import CustomSetterSamplePlugin from '@/pages/designer/plugins/plugin-custom-setter-sample';
import SetRefPropPlugin from '@alilc/lowcode-plugin-set-ref-prop';

interface RegisterPluginsConfig {
  assets: AssetsType; rootSchema?: IPublicTypeRootSchema, packages?: IPublicTypePackage[], terminalType: TerminalType
}

export function updateCompsVersion(assets: AssetsType, packages: IPublicTypePackage[]) {
  if (!packages) {
    return;
  }
  const versionObj = packages.reduce((versionMap, _package) => {
    versionMap[_package.package as string] = _package;
    return versionMap;
  }, {});
  assets.components?.map(component => {
    const lastVersion = component.npm?.version;
    const curPackage = versionObj[component.npm?.package as string];
    if (curPackage) {
      if (component.advancedUrls) {
        component.advancedUrls.default = component.advancedUrls.default.map((item: any) => {
          return item.replace(lastVersion, curPackage.version)
        });
      }
      if (component.urls) {
        component.urls.default = component.urls.default.replace(lastVersion, curPackage.version);
      }
      component.npm.version = curPackage.version;
      component.url = component.url.replace(lastVersion, curPackage.version);
    }
  });
  assets.packages = assets.packages.map((asset) => {
    if (versionObj[asset.package as string]) {
      return versionObj[asset.package as string];
    }
    return asset;
  });
}

async function registerPluginsApp(config: RegisterPluginsConfig) {
  console.log('registerPluginsApp', config);
  // const editorInit = (ctx: IPublicModelPluginContext) => {
  //   return {
  //     name: 'editor-init',
  //     async init() {
  //       const { material, project: _project, config: ctxConfig } = ctx;
  //       const injectedAssets = await injectAssets(config.assets);
  //       // 保存在config中用于引擎范围其他插件使用
  //       ctxConfig.set('scenarioName', "mobile");
  //       ctxConfig.set('scenarioDisplayName', "移动端");
  //       material.setAssets(injectedAssets);
  //       _project.openDocument(config.rootSchema || defaultSchema as any)
  //     },
  //   };
  // }
  // editorInit.pluginName = 'EditorInitPlugin';
  // await plugins.register(editorInit);
  await plugins.register(EditorInitPlugin, {
    scenarioName: 'mobile',
    displayName: '移动端',
    info: {
      getAssets: () => config.assets,
      getSchema: () => config.rootSchema || defaultAPPSchema,
    },
  });

  // 设置内置 setter 和事件绑定、插件绑定面板
  await plugins.register(DefaultSettersRegistryPlugin);

  await plugins.register(LogoPlugin);

  await plugins.register(ComponentPanelPlugin);

  await plugins.register(SchemaPlugin);

  await plugins.register(ManualPlugin);
  // 注册回退/前进
  await plugins.register(UndoRedoPlugin);

  // 注册中英文切换
  await plugins.register(ZhEnPlugin);

  await plugins.register(InjectPlugin);

  await plugins.register(SetRefPropPlugin);

  await plugins.register(SimulatorResizerPlugin, {
    device: 'phone',
    devices: [{ key: 'phone' }]
  });

  await plugins.register(LoadIncrementalAssetsWidgetPlugin, {
    isMobile: true
  });
  await plugins.register(CodeEditorPlugin);

  await plugins.register(SavePlugin);

  await plugins.register(PreviewPlugin);

  await plugins.register(CustomSetterSamplePlugin);
};

async function registerPluginsPC(config: RegisterPluginsConfig) {
  const {
    rootSchema,
    assets,
  } = config;
  await plugins.register(ManualPlugin);

  await plugins.register(Inject);

  await plugins.register(SchemaPlugin);

  await plugins.register(SimulatorResizerPlugin, {
    device: 'desktop',
    devices: [
      { key: 'desktop' },
      { key: 'tablet' },
      { key: 'phone' },
    ],
  });

  const editorInit = (ctx: IPublicModelPluginContext) => {
    return {
      name: 'editor-init',
      async init() {
        const { material, project: _project } = ctx;
        const injectedAssets = await injectAssets(assets);
        material.setAssets(injectedAssets);
        _project.openDocument(rootSchema || defaultSchema as any)
      },
    };
  }
  editorInit.pluginName = 'EditorInitPlugin';
  await plugins.register(editorInit);

  await plugins.register(LogoPlugin);

  await plugins.register(TransducerPlugin);

  await plugins.register(ComponentPanelPlugin);

  await plugins.register(BizBlockPanelPlugin);

  await plugins.register(SaveBlockAction);
  await plugins.register(SetRefPropPlugin);

  // 设置内置 setter 和事件绑定、插件绑定面板
  await plugins.register(DefaultSettersRegistryPlugin);

  // 注册回退/前进
  await plugins.register(UndoRedoPlugin);

  // 注册中英文切换
  await plugins.register(ZhEnPlugin);

  await plugins.register(LoadIncrementalAssetsWidgetPlugin, { isMobile: false });

  // 注册保存面板
  const saveSample = (ctx: IPublicModelPluginContext) => {
    return {
      name: 'saveSample',
      async init() {
        const { skeleton, hotkey } = ctx;

        skeleton.add({
          name: 'saveSample',
          area: 'topArea',
          type: 'Widget',
          props: {
            align: 'right',
          },
          content: (
            //@ts-ignore
            <Button
              onClick={() => {
                saveSchema('pc')
              }}
            >
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
            //@ts-ignore
            <Button onClick={() => resetSchema('pc')}>
              重置页面
            </Button>
          ),
        });
        hotkey.bind('command+s', (e: KeyboardEvent) => {
          e.preventDefault();
          saveSchema('pc')
        });
      },
    };
  }
  saveSample.pluginName = 'saveSample';
  await plugins.register(saveSample);

  CodeEditor.pluginName = 'CodeEditor';
  await plugins.register(CodeEditor);

  const previewSample = (ctx: IPublicModelPluginContext) => {
    return {
      name: 'previewSample',
      async init() {
        const { skeleton } = ctx;
        skeleton.add({
          name: 'previewSample',
          area: 'topArea',
          type: 'Widget',
          props: {
            align: 'right',
          },
          content: (
            // @ts-ignore
            <Button
              type="primary"
              onClick={() => preview('pc')}
            >
              预览
            </Button>
          ),
        });
      },
    };
  };
  previewSample.pluginName = 'previewSample';
  await plugins.register(previewSample);

}

export default async function registerPlugins(config: RegisterPluginsConfig) {
  return config.terminalType === TerminalType.App ? await registerPluginsApp(config) : await registerPluginsPC(config);
};
