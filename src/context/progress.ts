import { DataSourceListTyope } from "@/pages/appinfo/page";
import { ExecuteListeningType, ExecuteParamsItemType, LangListType, progressDetailInfo, ProgressNodeInfo, TextAreaModalInfo, UserFormType, UserTaskNoticeModalInfo, UserTaskTreeInfoType, UserTaskTreeRowType } from "@/pages/progress/type";
import { CommonParamType, DicType } from "@/types/common";
import { DataNode } from "antd/lib/tree";
import React from "react";

export type ProcessAction = {
  type: ActionType,
  payload: ProcessStateType
}

export enum ActionType {
  changeFiledVisible = "setFiledVisible",                     // 修改用户节点的操作权限弹窗
  changeUserForm = "setUserForm",                             // 获取永和类型的操作权限列表数据
  changeDrawerVisible = "setDrawerVisible",                   // 修改右侧抽屉的显影
  changeCurElement = "setCurElement",                         // 获取编辑器对象
  changeUserTaskProgressList = "setUserTaskProgressList",     // 赋值用户节点流程操作设置下拉列表数据
  changeDealPersonVisivle = "setDealPersonVisivle",           // 修改用户节点的处理人弹窗
  changeUserTaskDepartmentList = "setUserTaskDepartmentList", // 赋值用户节点部门信息
  changeUserTaskAuthList = "setUserTaskAuthList",             // 赋值用户节点角色信息
  changeUserTaskPersonList = "setUserTaskPersonList",         // 赋值用户节点人员信息
  changeUserTaskPosList = "setUserTaskPosList",               // 赋值用户节点岗位信息
  changeCheckedAllList = "setCheckedAllList",                 // 赋值处理人信息的合并数组
  changeNodeList = "setNodeList",                             // 赋值流程节点
  changeCheckedDepartmentList = "setCheckedDepartmentList",   // 赋值选中的部门列表
  changeCheckedAuthInfo = "setCheckedAuthInfo",               // 赋值选中的角色列表
  changeCheckedPersonInfo = "setCheckedPersonList",           // 赋值选中的人员列表
  changeCheckedPosInfo = "setCheckedPosInfo",                 // 赋值选中的岗位列表
  changeDetailInfo = "setDetailInfo",                         // 赋值列表数据
  changeProgressForm = "setPageId",                           // 赋值pageId
  changeStartFormList = "setStartFormList",                   // 赋值开始节点表单列表
  changeRuleList = "setRuleList",                             // 赋值用户节点规则列表
  changeCheckedRule = "setCheckedRule",                       // 赋值选中的规则
  changeCallbackType = "setCallbackType",                     // 选择返回类型
  changeSourceList = "setSourceList",                         // 数据源列表
  changeDealApiInfo = "setDealApiInfo",                       // 获取应用对应的处理人api信息
  changeParseDepartmentList = "setParseDepartmentList",       // 扁平化部门列表
  changeAllPersonList = "setAllPersonList",                   // 用户节点所有人员列表
  changeAllPosList = 'setAllPosList',                         // 用户节点所有岗位
  changeExecuteListeningList = "setExecuteListeningList",     // 添加执行监听
  changeSelectListening = "setSelectListening",               // 选中的执行监听内容
  changeSelectListeningParams = 'setSelectListeningParams',   // 选中的执行监听参数内容
  changePendingNoticeFlag = 'setPendingNoticeFlag',           // 改变待办提醒
  changeUrgeNoticeFlag = 'setUrgeNoticeFlag',                 // 改变催办提醒
  changeOvertimeFlag = 'setOvertimeFlag',                     // 改变超时提醒
  changeNoticeModalInfo = 'setNoticeModalInfo',               // 处理完成时限弹窗
  changeTextareaInfo = 'setTextareaInfo',                     // 执行监听脚本弹窗
  changeDealTime = 'setDealTime',                             // 处理完成时限
  changeNameVisible = 'setNameVisible',                       // 节点名称弹窗
  changeLangInfo = 'setLangInfo',                             // 国际化数据
  changeExecuteListeningType = 'setExecuteListeningType',     // 脚本类型
  changeIsStatus = 'setIsStatus',                             // 是否回写状态
  changeFormButtonList = "setFormButtonList",                 // 更改formButton
  changeFiledActionArr = "setFiledActionArr",                 // 设置流程操作权限下拉列表
  changeExpressionVisible = "setExpressionVisible",           // 改变弹窗
  changeNoticeTempArr = "setNoticeTempArr",                   // 修改通知模板
  changeConditionRelationFlow = "setConditionRelationFlow"
}

export type ProcessStateType = {
  nodeList: ProgressNodeInfo[],                           // 节点信息
  filedVisible: boolean,                                  // 用户类型的字段操作设置弹窗
  userForm: UserFormType[],                               // 用户类型的字段操作设置查询列表数据
  drawerVisible: boolean,                                 // 右侧抽屉的展示
  curElement: CommonParamType,                            // 点击选中的节点
  dicList: DicType[],                                     // 用户节点流程操作设置下拉列表数据
  dealPersonVisivle: boolean,                             // 用户节点处理人弹窗
  departmentList: DataNode[],                             // 用户节点的部门列表
  parseDepartmentList: DataNode[],                        // 扁平化后的用户节点部门列表
  authList: DataNode[],                                   // 用户节点的角色列表
  personList: DataNode[],                                 // 用户节点的人员列表
  allPersonList: DataNode[],                              // 用户节点的所有人员列表
  posList: DataNode[],                                    // 用户节点的岗位列表
  allPosList: DataNode[],                                 // 用户节点所有岗位列表
  checkedAllList: UserTaskTreeRowType[],                  // 用户节点的处理人合并后的数组
  checkedDepartInfo: UserTaskTreeInfoType,                // 用户节点选中的部门列表
  checkedAuthInfo: UserTaskTreeInfoType,                  // 用户节点选中的角色列表
  checkedPersonInfo: UserTaskTreeInfoType,                // 用户节点选中的人员列表
  checkedPosInfo: UserTaskTreeInfoType,                   // 用户节点选中的岗位列表
  detailInfo: progressDetailInfo,                         // 详情数据
  progressForm: string,                                   // 开始绑定表单的值
  startFormList: any[],                                   // 开始节点查询表单的列表
  ruleList: DataNode[],                                   // 规则列表
  checkedRuleInfo: UserTaskTreeInfoType,                  // 选中的规则
  activeCallbackKey: string,                              // 返回类型
  sourceList: DataSourceListTyope[],                      // 数据源列表
  dealApiInfo: CommonParamType,                           // 获取应用对应的处理人api信息
  executeListeningList: ExecuteListeningType[],           // 执行监听的数据源
  selectListeningRow: ExecuteListeningType,               // 选中的执行监听数据源
  selectListeningParamsRow: ExecuteParamsItemType,        // 选中的执行监听参数数据源
  pendingNoticeFlag: boolean,                             // 待办提醒
  urgeNoticeFlag: boolean,                                // 催办提醒
  overtimeFlag: boolean,                                  // 超时提醒
  noticeModalInfo: UserTaskNoticeModalInfo,               // 处理完成时限弹窗信息
  textareaInfo: TextAreaModalInfo,                        // 执行监听脚本弹窗
  deadline: string,                                       // 处理完成时限的值
  nameVisible: boolean,                                   // 节点信息弹窗
  langInfo: LangListType,                                 // 国际化语言数据
  executeListeningType: string,                           // 脚本类型
  isStatus: boolean,                                      // 是否回写状态
  formButtonList: string[],                               // 流程操作权限
  filedActionArr: DicType[],                              // 流程操作权限下拉列表
  expressionVisible: boolean,                             // 表达式弹窗
  noticeTempArr: DicType[],                               // 通知模板
  conditionRelationFlow: string,                              // 条件关系
}

export const initialState: ProcessStateType = {
  nodeList: [],
  filedVisible: false,
  userForm: [],
  drawerVisible: false,
  curElement: {},
  dicList: [],
  dealPersonVisivle: false,
  departmentList: [],
  authList: [],
  personList: [],
  posList: [],
  checkedAllList: [],
  checkedDepartInfo: { checkedKeys: [], checkedRowInfo: [] },
  checkedAuthInfo: { checkedKeys: [], checkedRowInfo: [] },
  checkedPersonInfo: { checkedKeys: [], checkedRowInfo: [] },
  checkedPosInfo: { checkedKeys: [], checkedRowInfo: [] },
  checkedRuleInfo: { checkedKeys: [], checkedRowInfo: [] },
  detailInfo: {
    bindWfDTO: {},
    wfFileVo: {}
  },
  progressForm: '',
  startFormList: [],
  ruleList: [],
  activeCallbackKey: "",
  sourceList: [],
  dealApiInfo: {},
  parseDepartmentList: [],
  allPersonList: [],
  allPosList: [],
  executeListeningList: [],
  selectListeningRow: {} as ExecuteListeningType,
  selectListeningParamsRow: {} as ExecuteParamsItemType,
  pendingNoticeFlag: false,
  urgeNoticeFlag: false,
  overtimeFlag: false,
  noticeModalInfo: {
    visible: false,
    title: '',
    fieldsName: ''
  },
  textareaInfo: {
    visible: false,
    outFieldsName: '',
    modalFieldsName: '',
  },
  deadline: '',
  nameVisible: false,
  langInfo: {},
  executeListeningType: '',
  isStatus: false,
  formButtonList: [],
  filedActionArr: [],
  expressionVisible: false,
  noticeTempArr: [],
  conditionRelationFlow: ""
}

type ProgressModalProps = {
  state: ProcessStateType,
  dispatch: React.Dispatch<ProcessAction>
}

export const ProgressModal = React.createContext<ProgressModalProps>({
  dispatch: () => { },
  state: initialState
});

export const reducer = (state: ProcessStateType, action: ProcessAction) => {
  switch (action.type) {
    case ActionType.changeFiledVisible:
      return { ...state, filedVisible: action.payload.filedVisible }
    case ActionType.changeUserForm:
      return { ...state, userForm: action.payload.userForm }
    case ActionType.changeDrawerVisible:
      return { ...state, drawerVisible: action.payload.drawerVisible }
    case ActionType.changeUserTaskProgressList:
      return { ...state, dicList: action.payload.dicList }
    case ActionType.changeDealPersonVisivle:
      return { ...state, dealPersonVisivle: action.payload.dealPersonVisivle }
    case ActionType.changeUserTaskDepartmentList:
      return { ...state, departmentList: action.payload.departmentList }
    case ActionType.changeUserTaskAuthList:
      return { ...state, authList: action.payload.authList }
    case ActionType.changeUserTaskPersonList:
      return { ...state, personList: action.payload.personList }
    case ActionType.changeUserTaskPosList:
      return { ...state, posList: action.payload.posList }
    case ActionType.changeCurElement:
      return { ...state, curElement: action.payload.curElement }
    case ActionType.changeNodeList:
      return { ...state, nodeList: action.payload.nodeList }
    case ActionType.changeCheckedAllList:
      return { ...state, checkedAllList: action.payload.checkedAllList }
    case ActionType.changeCheckedDepartmentList:
      return { ...state, checkedDepartInfo: action.payload.checkedDepartInfo }
    case ActionType.changeCheckedAuthInfo:
      return { ...state, checkedAuthInfo: action.payload.checkedAuthInfo }
    case ActionType.changeCheckedPersonInfo:
      return { ...state, checkedPersonInfo: action.payload.checkedPersonInfo }
    case ActionType.changeCheckedPosInfo:
      return { ...state, checkedPosInfo: action.payload.checkedPosInfo }
    case ActionType.changeDetailInfo:
      return { ...state, detailInfo: action.payload.detailInfo }
    case ActionType.changeProgressForm:
      return { ...state, progressForm: action.payload.progressForm }
    case ActionType.changeStartFormList:
      return { ...state, startFormList: action.payload.startFormList }
    case ActionType.changeRuleList:
      return { ...state, ruleList: action.payload.ruleList }
    case ActionType.changeCheckedRule:
      return { ...state, checkedRuleInfo: action.payload.checkedRuleInfo }
    case ActionType.changeCallbackType:
      return { ...state, activeCallbackKey: action.payload.activeCallbackKey }
    case ActionType.changeSourceList:
      return { ...state, sourceList: action.payload.sourceList }
    case ActionType.changeDealApiInfo:
      return { ...state, dealApiInfo: action.payload.dealApiInfo }
    case ActionType.changeParseDepartmentList:
      return { ...state, parseDepartmentList: action.payload.parseDepartmentList }
    case ActionType.changeAllPersonList:
      return { ...state, allPersonList: action.payload.allPersonList }
    case ActionType.changeAllPosList:
      return { ...state, allPosList: action.payload.allPosList }
    case ActionType.changeExecuteListeningList:
      return { ...state, executeListeningList: action.payload.executeListeningList }
    case ActionType.changeSelectListening:
      return { ...state, selectListeningRow: action.payload.selectListeningRow }
    case ActionType.changeSelectListeningParams:
      return { ...state, selectListeningParamsRow: action.payload.selectListeningParamsRow }
    case ActionType.changePendingNoticeFlag:
      return { ...state, pendingNoticeFlag: action.payload.pendingNoticeFlag }
    case ActionType.changeUrgeNoticeFlag:
      return { ...state, urgeNoticeFlag: action.payload.urgeNoticeFlag }
    case ActionType.changeOvertimeFlag:
      return { ...state, overtimeFlag: action.payload.overtimeFlag }
    case ActionType.changeNoticeModalInfo:
      return { ...state, noticeModalInfo: action.payload.noticeModalInfo }
    case ActionType.changeTextareaInfo:
      return { ...state, textareaInfo: action.payload.textareaInfo }
    case ActionType.changeDealTime:
      return { ...state, deadline: action.payload.deadline }
    case ActionType.changeNameVisible:
      return { ...state, nameVisible: action.payload.nameVisible }
    case ActionType.changeLangInfo:
      return { ...state, langInfo: action.payload.langInfo }
    case ActionType.changeExecuteListeningType:
      return { ...state, executeListeningType: action.payload.executeListeningType }
    case ActionType.changeIsStatus:
      return { ...state, isStatus: action.payload.isStatus }
    case ActionType.changeFormButtonList:
      return { ...state, formButtonList: action.payload.formButtonList }
    case ActionType.changeFiledActionArr:
      return { ...state, filedActionArr: action.payload.filedActionArr }
    case ActionType.changeExpressionVisible:
      return { ...state, expressionVisible: action.payload.expressionVisible }
    case ActionType.changeNoticeTempArr:
      return { ...state, noticeTempArr: action.payload.noticeTempArr }
    case ActionType.changeConditionRelationFlow:
      return { ...state, conditionRelationFlow: action.payload.conditionRelationFlow }
    default:
      return { ...state, filedVisible: action.payload.filedVisible }
  }
}