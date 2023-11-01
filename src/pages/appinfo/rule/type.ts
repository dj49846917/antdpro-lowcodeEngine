import { CommonParamType } from "@/types/common"

export type RuleGroupData = { // 规则组返回数据
  ruleGroupId: string,
  ruleGroupName: string,
  ruleGroupDesc: string,
  activeFlag?: number,
  [key: string]: any
}

export type RuleData = { // 规则返回数据
  ruleType: string,
  ruleName: string,
  ruleDesc: string,
  ruleId: string,
  [key: string]: any
}

export type RuleListParam = { // 规则组选择的规则列表参数
  ruleGroupId?: string,
  ruleId: string,
  rulePriority: number
}

export type RuleGroupParams = { // 规则组新增入参
  appId: string,
  ruleGroupDesc?: string,
  ruleGroupId?: string,
  ruleGroupName: string,
  ruleList: RuleListParam[]
}

export type CarryoutGroupParams = {
  resultFactKey: string,
  ruleGroupId: string,
  ruleParams: CommonParamType
}

export type SaveParamsType = {
  roleId: string,
  menuAuthMap: CommonParamType,
  menuId?: string,
  menuName?: string,
  menuParentId?: string,
  pageId?: string,
  appId?: string
}

export type SavePageParamsType = {
  roleId: string,
  authJson: {
    [key: string]: string[]
  }
}

export type AddAndEditAuthBtnType = {
  menuId: string,
  label?: string,
  value: string
}