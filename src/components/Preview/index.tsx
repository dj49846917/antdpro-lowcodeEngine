import {
  useContext,
  useEffect,
  useState
} from "react";
import type { AssetsType } from "@/services/schemaApi";
import schemaApi from "@/services/schemaApi";
import {
  AssetLoader,
  AssetLevel,
  assetBundle,
  buildComponents
} from "@alilc/lowcode-utils";
import { injectComponents } from "@alilc/lowcode-plugin-inject";
import ReactRenderer from "@alilc/lowcode-react-renderer";
import type {
  IPublicTypeNodeSchema,
  IPublicTypeRootSchema
} from "@alilc/lowcode-types";
import type { IRendererProps } from "@alilc/lowcode-renderer-core/lib/types";
import { Loading } from "@alifd/next"
import {
  getDefaultAppHelper,
  getLocaleLanguage
} from "@/utils/utils";
import { PreviewCtx } from "@/context/preview";
import { TerminalType } from "@/types/common";

const SamplePreview = ({ pageId, menuId }: { pageId?: string; menuId?: string }) => {
  const [data, setData] = useState<{ schema: IPublicTypeRootSchema | IPublicTypeNodeSchema, components: IRendererProps['components'] }>();

  const modalParams = useContext(PreviewCtx);
  const init = async function (assets: AssetsType) {
    if (!assets?.schema) {
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


    // @ts-ignore
    const vendors = [assetBundle(libraryAsset, AssetLevel.Library)];
    const assetLoader = new AssetLoader();
    await assetLoader.load(libraryAsset);
    // @ts-ignore
    const components = await injectComponents(buildComponents(libraryMap, componentsMap));

    setData({
      schema,
      components,
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
      style={{ display: 'block' }}
    >
      <div className="lowcode-plugin-sample-preview">
        <ReactRenderer
          className="lowcode-plugin-sample-preview-content"
          schema={data?.schema}
          components={data?.components}
          locale={getLocaleLanguage()}
          appHelper={getDefaultAppHelper(TerminalType.Pc, modalParams)}
          thisRequiredInJSE={false}
        />
      </div>
    </Loading>
  );
};

export default SamplePreview;
