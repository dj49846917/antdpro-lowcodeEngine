import { DataNode } from "antd/lib/tree"
import PageAuth from "./PageAuth"

export type SourceAuthListType = { // 资源权限列表返回数据
  roleId: string,
  chName: string,
  chDescription?: string,
  [key: string]: any
}

export type AuthOptionType = {
  label: string,
  value: string,
  type: number
}

export type SourceAllListType = {
  children?: SourceAllListType[],
  menuAuth?: string[],
  menuAuthOption?: AuthOptionType[],
  pageAuth?: string[],
  pageAuthOption?: AuthOptionType[]
  title?: string,
  key?: string
}

export type ActionAuthType = {
  label?: string,
  value: string,
  menuId: string
}

export interface PageAuthListType extends DataNode {
  pageAuth: null | string[],
  pageAuthOption: null | AuthOptionType[],
  label: string,
  value: string,
  children: PageAuthListType[]
} 