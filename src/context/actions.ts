import { ActionPayload } from "@/hooks/useActionReducer";
import React from "react";

export interface ActionCtxProps {
  dispatch?: (payload: ActionPayload) => void,
  handleVisible?: (visible: boolean) => void,
  loadData?: () => void;
  handleDelete?: (id: string) => Promise<any>;
  handleView?: (id: string) => Promise<any>;
}

export const ActionCtx = React.createContext<ActionCtxProps>({});
