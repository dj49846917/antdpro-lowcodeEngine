import Preview from "@/components/Preview";
import { PreviewCtx } from "@/context/preview";
import React, { useMemo } from "react";

export const PreviewProvider: React.FC<React.PropsWithChildren<{
  pageId: string;
  modalParams: { params?: any; methods?: any; }
}>> = ({
  pageId,
  modalParams
}) => {

  const ctxValue = useMemo(() => modalParams, [modalParams]);

  return (
    <PreviewCtx.Provider value={ctxValue}>
      <Preview pageId={pageId}/>
    </PreviewCtx.Provider>
  )
};
