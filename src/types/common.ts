import { BasicDataNode, DataNode, EventDataNode, Key } from 'rc-tree/lib/interface'
import React, { ReactNode } from "react";

export interface ListType<T> {
  dataSource: T[];
  pageIndex: number;
  pageSize: number;
  total: number;
}

// 应用类型
export enum TerminalType {
  All = 0,
  Pc = 1,
  App = 2,
}
export type RenderAction = (_: string, record: any) => ReactNode[];

export interface ProgressDataType { // 流程的列表类型
  id?: React.Key;
  fileKey?: string;
  createTime?: string;
  fileName?: string;
  createUser?: string;
  appType?: number;
  status?: number | string;
  version?: string;
  [key: string]: any
}

export interface TenantInfo {
  chName?: string,
  enName?: string,
  tenantId: string,
  [key: string]: any
}

export interface ProgressDetailType {
  data: number | string,
  operator: string,
  source: string,
  traceId: string,
  version: string
}

export interface CommonParamType {
  [key: string]: any
}

export interface RouteType {
  path: string,
  name: string,
  icon: string,
  uri: string
}

export interface CommonResponseType {
  code: number,
  data: any,
  message: string,
  success: boolean,
  timestamp: string,
  traceId: string,
  [key: string]: any
}

export type DicType = {   // 数据字典返回类型
  constantKey: string,
  constantValue: string,
  parentId: string,
  id: string,
  label?: string,
  value?: string,
  [key: string]: any
}

export interface CommonModalType { // 通用弹窗的类型
  visible: boolean,
  controller?: {
    [key: string]: any
  }
}

// 树形菜单的check操作的event类型
export interface CheckInfo<TreeDataType extends BasicDataNode = DataNode> {
  event: 'check';
  node: EventDataNode<TreeDataType>;
  checked: boolean;
  nativeEvent: MouseEvent;
  checkedNodes: TreeDataType[];
  checkedNodesPositions?: {
    node: TreeDataType;
    pos: string;
  }[];
  halfCheckedKeys?: Key[];
}
export type ApiConfig = {
  beforeFunction: string,
  postUri: string,
  postMethod: string,
  postParams: string | null,
  successFunction: string | null,
  appId: string,
  apiId: string,
  [key: string]: any
}
