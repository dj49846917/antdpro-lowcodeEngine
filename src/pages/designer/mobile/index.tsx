import {
  useEffect,
  useRef,
  useState
} from "react";

import './index.less';

import Designer from "@/components/Designer";
import type { AssetsType } from "@/services/schemaApi";
import schemaApi from "@/services/schemaApi";

import { history } from "umi";
import { getAssets } from "@/components/Designer/utils";
import { updateCompsVersion } from "@/components/Designer/plugin";

import SchemaCreator from "@/pages/designer/template/app/schema-creator";
import SchemaTransForm from "@/pages/designer/template/app/schema-transform";
import { TerminalType } from "@/types/common";
import ProcessForm from "@/pages/designer/template/app/process-form";

const MobileDesigner = (props: UmiPageProps) => {
  const query: { pageId: string, name?: string, init?: boolean, isTemplate?: boolean, mapping?: boolean } = props.location.query as any;
  const { pageId, name, init: _isCreate, isTemplate, mapping } = query;
  const [doc, setDoc] = useState(undefined)
  const packagesRef = useRef(undefined);
  const assetsRef = useRef<AssetsType>();
  const pageName = name || pageId;
  const init = async () => {
    if (!pageId) {
      return
    }
    const isCreate = !!_isCreate;
    const isMapping = !!mapping;
    const isTmpl = !!isTemplate;
    const assets = await getAssets(TerminalType.App) || {};
    const res = await schemaApi.getSchema(pageId, isCreate)
    assetsRef.current = {
      ...res,
      ...assets as any,
      pageId,
    };
    const {
      schema,
      packages,
      childPageSchema,
      datasourceId,
    } = res as any;
    const rootSchema = schema?.componentsTree?.[0];
    const childRootSchema = childPageSchema?.schema?.componentsTree?.[0];
    packagesRef.current = isCreate ? assets.packages : packages;

    if (!isCreate && !isTmpl) {
      if (isMapping) {
        packagesRef.current = assets.packages as any;
        SchemaTransForm(res);
      }
      updateCompsVersion(assets as any, packages);
      setDoc(rootSchema)
      return
    }

    if (datasourceId && rootSchema) {
      if (isCreate) {
        const creator = SchemaCreator({
          ...res,
          pageName,
          rootSchema,
          childRootSchema,
          packages: packagesRef.current
        } as any);
        await creator?.();
      }
    }

    history.replace(isTmpl ? `/designer/mobile?pageId=${pageId}&isTemplate=1` : `/designer/mobile?pageId=${pageId}`)
    setDoc(rootSchema)
  }
  useEffect(() => {
    init()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    doc ? <Designer
      rootSchema={doc}
      packages={packagesRef.current}
      assets={assetsRef.current!}
      terminalType={TerminalType.App}
      pageId={pageId}
    /> : null
  )
}


export default MobileDesigner

