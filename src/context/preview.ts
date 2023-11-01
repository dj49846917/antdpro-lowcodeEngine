import { createContext } from "react";

interface PreviewCtxProps {
  params?: any;
  methods?: any;
}

export const PreviewCtx = createContext<PreviewCtxProps>({});
