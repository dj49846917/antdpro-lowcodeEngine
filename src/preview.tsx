import ReactDOM from 'react-dom';
import {
  useEffect,
  useState
} from 'react';
import type { AssetsType } from "@/services/schemaApi";
import schemaApi from "@/services/schemaApi";
import { buildComponents } from "@alilc/lowcode-utils";
import { injectComponents } from "@alilc/lowcode-plugin-inject";
import ReactRenderer from "@alilc/lowcode-react-renderer";
import type {
  IPublicTypeNodeSchema,
  IPublicTypeRootSchema
} from "@alilc/lowcode-types";
import type { IRendererProps } from "@alilc/lowcode-renderer-core/lib/types";
import { Loading } from "@alifd/next";
import {
  getDefaultAppHelper,
  getLocaleLanguage,
  getUrlParms,
  loadComps
} from "@/utils/utils";
import cls from "classnames";
import "./global.less";
import { TerminalType } from './types/common';

const SamplePreview = (props: { pageId?: string; menuId?: string }) => {
  const { menuId } = props;
  const pageId = props?.pageId || getUrlParms('pageId');
  const [data, setData] = useState<{ schema: IPublicTypeRootSchema | IPublicTypeNodeSchema, components: IRendererProps['components'], processPageId?: string }>();
  const scenarioName = getUrlParms('scenarioName');
  const isPc = scenarioName === 'pc';
  const terminalType: TerminalType = scenarioName === 'pc' ? TerminalType.Pc : TerminalType.App;
  const init = async function (assets: AssetsType) {
    if (!assets) {
      return;
    }
    const projectSchema = assets.schema || {};
    const packages = assets.packages || [];
    const { componentsMap: componentsMapArray, componentsTree } = projectSchema;
    const componentsMap: any = {};
    componentsMapArray.forEach((component: any) => {
      componentsMap[component.componentName] = component;
    });
    const schema = componentsTree[0];

    const libraryMap = {};
    const libraryAsset: any = [];
    packages.forEach(({ package: _package, library, urls, renderUrls }: any) => {
      libraryMap[_package] = library;
      if (renderUrls) {
        libraryAsset.push(renderUrls);
      } else if (urls) {
        libraryAsset.push(urls);
      }
    });

    await loadComps(libraryAsset);

    // @ts-ignore
    const components = await injectComponents(buildComponents(libraryMap, componentsMap));

    setData({
      schema,
      components,
      processPageId: assets.pcPageId,
    });
  };

  useEffect(() => {
    schemaApi.getSchema(pageId).then(res => {
      init(res);
    });
    return () => {
      setData(undefined);
    }
  }, [pageId, menuId])

  return (
    <Loading
      visible={!data}
      fullScreen
      color="#009a44"
    >
      <div className={cls("lowcode-plugin-sample-preview", { "mobile-container": !isPc })}>
        <ReactRenderer
          className={cls("lowcode-plugin-sample-preview-content", { "mobile-content": !isPc })}
          schema={data?.schema}
          components={data?.components}
          locale={getLocaleLanguage()}
          appHelper={getDefaultAppHelper(terminalType, {
            pageConfig: {
              pageId,
              processPageId: data?.processPageId
            }
          })}
          thisRequiredInJSE={false}
        />
      </div>
    </Loading>
  );
};

export default SamplePreview;

ReactDOM.render(<SamplePreview />, document.getElementById('ice-container'));
