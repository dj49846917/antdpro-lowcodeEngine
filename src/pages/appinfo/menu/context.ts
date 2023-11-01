import React from "react";
import { ActionPayload } from "@/pages/appinfo/menu/interface";

interface MenuCtxProps {
  loadData: () => void;
  handleVisible: (visible: boolean) => void;
  dispatch: (payload?: any) => void;
}

export const MenuCtx = React.createContext<MenuCtxProps>({
  loadData: () => {
  },
  handleVisible: () => {
  },
  dispatch: () => {
  }
});

interface ModalCtxProps {
  state?: ActionPayload;
}

export const ModalCtx = React.createContext<ModalCtxProps>({});
export const PageIdCtx = React.createContext<string>('');

