import Designer from "@/components/Designer";
import { getQueries } from "@/utils/utils";
import schemaApi from "@/services/schemaApi";
import {
  useEffect,
  useRef,
  useState
} from "react";
import { history } from "umi";
import { getAssets } from "@/components/Designer/utils";
import { updateCompsVersion } from "@/components/Designer/plugin";

import SchemaCreator from "@/pages/designer/template/pc/schema-creator";
import { TerminalType } from "@/types/common";

const Index = ({ pageId: id }: { pageId: string }) => {
  const [doc, setDoc] = useState(undefined)
  const packagesRef = useRef(undefined);
  const assetsRef = useRef<any>(undefined);
  const pageId = getQueries("pageId") as string || id;
  const pageName = getQueries("name") as string || id;
  const init = async () => {
    if (!pageId) {
      return
    }
    const isCreate = !!getQueries("init");
    const isTmpl = !!getQueries("isTemplate");
    const assets = await getAssets(TerminalType.Pc) || {};
    assetsRef.current = assets;
    const res = await schemaApi.getSchema(pageId, isCreate)

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
    history.replace(isTmpl ? `/designer?pageId=${pageId}&isTemplate=1` : `/designer?pageId=${pageId}`)
    setDoc(rootSchema)
  }
  useEffect(() => {
    init()
  }, []);
  return (
    doc ? <Designer
      rootSchema={doc}
      packages={packagesRef.current}
      assets={assetsRef.current}
      terminalType={TerminalType.Pc}
      pageId={getQueries("pageId") as string || pageId}
    /> : null
  )
}


export default Index

