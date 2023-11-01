import { CommonParamType, DicType } from "@/types/common";
import { DataNode } from "antd/lib/tree";
import React from "react";

type Action = {
  type: ActionType,
  payload: stateType
}

export enum ActionType {
  changeDicList = "setDicList",                                             // 数据字典
  changeSelectedKeysSource = "setSelectedKeysSource",                       // 切换角色列表选中的值
  changeSourceAuthList = "setSourceAuthList",                               // 角色列表
  changeSourceAllList = "setSourceAllList",                                 // 赋值资源列表
  changeSaveParams = "setSaveParams",                                       // 保存时的数据组装
  changePageAuthList = "setPageAuthList",                                   // 赋值页面资源列表
  changePageAuthSaveParams = 'setPageAuthSaveParams',                       // 保存时页面权限数据封装
}

type stateType = {
  dicList: DicType[],                                                       // 数据字典
  selectedKeysSource: string[],                                             // 角色列表选中的值
  sourceAuthList: DataNode[],                                               // 角色列表
  sourceAllList: DataNode[],                                                // 资源列表
  saveParams: CommonParamType,                                              // 保存时的数据组装
  pageAuthList: DataNode[],                                                 // 页面权限列表
  pageAuthSaveParams: CommonParamType,                                      // 页面权限保存的数据封装
}

export const initialState: stateType = {
  dicList: [],
  selectedKeysSource: [],
  sourceAuthList: [],
  sourceAllList: [],
  saveParams: {},
  pageAuthList: [],
  pageAuthSaveParams: {},
}

type AuthModelProps = {
  state: stateType,
  dispatch: React.Dispatch<Action>
}

export const AuthModel = React.createContext<AuthModelProps>({
  dispatch: () => { },
  state: initialState
});

export const reducer = (state: stateType, action: Action) => {
  switch (action.type) {
    case ActionType.changeDicList:
      return { ...state, dicList: action.payload.dicList }
    case ActionType.changeSelectedKeysSource:
      return { ...state, selectedKeysSource: action.payload.selectedKeysSource }
    case ActionType.changeSourceAuthList:
      return { ...state, sourceAuthList: action.payload.sourceAuthList }
    case ActionType.changeSourceAllList:
      return { ...state, sourceAllList: action.payload.sourceAllList }
    case ActionType.changeSaveParams:
      return { ...state, saveParams: action.payload.saveParams }
    case ActionType.changePageAuthList:
      return { ...state, pageAuthList: action.payload.pageAuthList }
    case ActionType.changePageAuthSaveParams:
      return { ...state, pageAuthSaveParams: action.payload.pageAuthSaveParams }
  }
}