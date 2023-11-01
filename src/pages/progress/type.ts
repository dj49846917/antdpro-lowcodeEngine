import { CommonModalType, CommonParamType, DicType } from "@/types/common";
import { DataNode } from "antd/lib/tree";
import { Key } from "rc-tree/lib/interface";
import React, { ReactNode } from "react";

export enum ActiveKeyType {
  edit = 1,
  disabled = 2,
  hidden = 3
}

export interface UserFormType { // 用户节点字段操作权限
  itemId: string,
  itemKey: string,
  itemName: string,
  edit: boolean,
  hidden: boolean,
  required: boolean,
  disabled: boolean,
  activeKey: ActiveKeyType,
  [key: string]: any
}

export type UserTaskFieldType = { // 用户节点字段操作权限查询列表
  itemType: number
  pageId: string
}

export type SaveParamsType = { // 保存
  fileContent: string,
  fileKey: string,
  fileName: string,
  appId: string,
  id?: string,
  status?: number,
  tenantId?: string
}

export type UserTaskProgressType = { // 数据字典
  parentId: string[]
}

export enum EventType { // 流程编辑器的节点类型
  "STARTEVENT" = "bpmn:StartEvent", // 开始节点
  "SEQUENCEFLOW" = "bpmn:SequenceFlow", // 连线
  "USERTASK" = "bpmn:UserTask", // 用户任务
  "PARALLELGATEWAY" = "bpmn:ParallelGateway", // 网关
  "PROCESS" = "bpmn:Process", // 根节点
  "ENDEVENT" = "bpmn:EndEvent", // 结束节点
}


export type UserTaskAuthParamsType = { // 用户节点的角色列表传入参数
  appId?: string,
  roleType?: number,
  tenantId?: string
}

export type UserTaskPersonByDepartParamsType = { // 用户节点的人员列表传入参数
  email?: string,
  fullName?: string,
  organizationId?: React.Key,
  organizationIdList?: React.Key[],
  roleIdList?: string[],
  userStatus?: number
}

export type UserTaskPosByDepartParamsType = { // 用户节点的岗位列表传入参数
  email?: string,
  fullName?: string,
  organizationId?: React.Key,
  organizationIdList?: React.Key[],
  roleIdList?: string[],
  userStatus?: number
}

export type UserTaskAuthResponseType = { // 用户节点的角色列表返回参数
  appId?: string,
  roleType?: number,
  tenantId?: string
}

export type UserTaskTreeRowType = {
  key: string | number,
  title: string,
  activePane: string,
  activePaneKey?: string
}

export type progressDetailInfo = {
  bindWfDTO: CommonParamType,
  wfFileVo: CommonParamType
}

export type ActiveTreeType = Key[] | { checked: Key[]; halfChecked: Key[]; }

export type UserTaskTreeInfoType = { // 点击checkbox用户节点部门选中的信息
  checkedKeys: ActiveTreeType,
  checkedRowInfo: UserTaskTreeRowType[]
}

// 用户节点处理类型
export enum UserTaskDealType {
  SINGLE = 'single',             // 单人审批
  PARALLEL = "parallel",          // 多人并行
  SERIAL = "serial",              // 多人串行
  RANDOM = "random",              // 多人任意
}

// export type NodeCandidateType = {
//   [key in NodeCandidateKey]: string[]
// }

export type NodeRuleType = {
  ruleId: string,
  order: number
}

export type NodeCandidateType = {
  org?: string[],
  role?: string[],
  user?: string[],
  position?: string[],
  processorSetting: number,
  ruleParam?: string,
  rule?: NodeRuleType[],
  allocationType?: string,
  superior?: string,
  superiorDepartment?: string,
  emptySuperiorDepartment?: string
}

export type SaveNodeInfo = {
  nodeId: string,
  nodeName?: string,
  pageId: string,
  pageAuth: {
    nodeUserType: string,
    customCondition?: string,
    condition?: string,
    noticeInfo?: {
      noticeType?: string[],
      pendingNoticeFlag?: boolean,
      deadline?: string,
      pendingNoticeUser?: string[],
      urgeNoticeFlag?: boolean,
      urgeNoticeTime?: string,
      urgeNoticeUser?: string[],
      overtimeFlag?: boolean,
      overtimeFinishFlag?: boolean,
      overtimeNoticeTime?: string,
      overtimeNoticeUser?: string[]
    },
    formField?: {
      [key: string]: {
        edit: boolean,
        hidden: boolean,
        required: boolean,
        disabled: boolean
      }
    },
    formButton?: string[],
    formButtonUrl?: CommonParamType,
    nodeCandidate?: NodeCandidateType,
    processCallBackTypeDTO?: {
      type: string,
      url: string,
      dateSourceId: string
    }
  }
}

// 流程编辑器保存接口入参
export type ProgressSaveType = {
  fileSaveDto: SaveParamsType,
  bindWfDTO: {
    pageId: string,
    workFlowId: string,
    workFlowName: string,
    tenantId?: string,
    nodes: SaveNodeInfo[]
  }
}

// 流程编辑器的节点信息
export type ProgressNodeInfo = {
  id: string,
  name?: string,
  nodeType: EventType,
  pageId?: string,
  userForm?: any[]
}

export type XmlElementInfo = {
  id: string,
  name?: string,
  type: EventType,
}

export type DealPersonCallBack = {
  checkedAllList: UserTaskTreeRowType[],
  checkedDepartInfo: UserTaskTreeInfoType,
  checkedAuthInfo: UserTaskTreeInfoType,
  checkedPersonInfo: UserTaskTreeInfoType,
  checkedPosInfo: UserTaskTreeInfoType,
  selectedKeysPerson: React.Key[],
  selectedKeysPos: React.Key[],
}

export interface DealPersonType extends CommonModalType { // 处理人弹窗类型
  closeModal: (show: boolean) => void
}

export type parseDealPersonInit = {
  org: string[],
  role: string[],
  user: string[],
  position: string[]
}

export type UserTaskRuleListParamsType = { // 用户节点规则列表入参
  appId: string,
  ruleType: number
}

export interface TreeDataNode extends DataNode {
  value?: string,
  childdren?: any
}

export type SaveRoleMemberType = { // 点击成员管理抽屉的保存入参
  resourceIds?: string,
  roleId: string,
  userIds: string
}

export type ExecuteListeningType = { // 执行监听每项的类型
  primary_key: number,
  executeEventType: 'begin' | 'end',
  executeListeningType: 'java' | 'expression' | 'delegation_expression' | 'script',
  executeContent: string,
  executeParam: ExecuteParamsType[],
  executeScrpitType?: 'online' | 'cite',
  executeScrpitContent?: string,
  active: boolean
}

export type ExecuteParamsItemType = {
  active: boolean,
  primary_key: number,
  executeParamsName: string,
  executeParamsType: string,
  executeParamsValue: string,
  executeScrpitContent?: string
}

export type ExecuteParamsType = {
  primary_key: number,
  active: boolean,
  executeParamsName: string,
  executeParamsType: string,
  executeParamsValue: string
}

export type ExecuteXmlParamsType = {
  event: 'start' | 'end',
  listenerType: 'classListener' | 'expressionListener' | 'delegateExpressionListener' | 'scriptListener',
  scriptFormat?: string,
  scriptType?: 'inlineScript' | 'externalScript',
  value?: string,
  resource?: string,
  class?: string,
  expression?: string,
  delegateExpression?: string,
  fields: ExecuteXmlParamsFieldsType[]
}

export type ExecuteXmlParamsFieldsType = {
  name: string,
  fieldType: string,
  expression?: string,
  string?: string
}

export type ListenDicType = {
  executeEventTypeArr: DicType[],
  executeListeningTypeArr: DicType[],
  executeParamsTypeArr: DicType[],
  executeScriptTypeArr: DicType[]
}

export type BpmnElementApi = {
  modeling: CommonParamType,
  elementFactory: CommonParamType,
  moddle: CommonParamType,
  bpmnFactory: CommonParamType
}

export type UserTaskNoticeModalInfo = {
  visible: boolean,
  title: string,
  fieldsName: string
}

export type UserTaskNoticeModalItem = {
  relativeDay?: number,
  relativeHour?: number,
  relativeMinute?: number,
  // relativeSecond?: number,
  moreAction?: boolean,
  intervalDay?: number,
  intervalHour?: number,
  intervalMinute?: number,
  // intervalSecond?: number,
  noticeCount?: number
}

export type UserTaskNoticeModalParams = {
  relativeTime?: number,
  moreAction?: boolean,
  intervalTime?: number,
  noticeCount?: number
}
export type TextAreaModalInfo = {
  visible: boolean,
  outFieldsName: string,
  modalFieldsName: string
}

export type NodeNameItemType = {
  id: number | string,
  languageName?: string,
  languageCode?: string,
  value?: string,
}

export type LangListType = {
  [key: string]: {
    text: string,
    status: string
  }
}

export type AddProcessParamsType = {
  fileName: string,
  id?: string,
}

export interface CopyProcessParamsType extends AddProcessParamsType {
  fileKey?: string,
  tenantId?: string
}