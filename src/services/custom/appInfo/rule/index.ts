import { Constant } from "@/constant";
import { ListParamsType } from "@/pages/appinfo/page/type";
import { CarryoutGroupParams, RuleData, RuleGroupParams } from "@/pages/appinfo/rule/type";
import { CommonResponseType } from "@/types/common";
import { Drequest } from "@/utils/request";
import { commonParams, commonParams2, commonParams3 } from "@/utils/utils";

const ruleApi = {
  // 获取规则组列表
  getRuleGroupList: (options: ListParamsType<{ appId: string }>): Promise<CommonResponseType> => {
    return Drequest(`${Constant.API.RULE}ruleGroup/page`, {
      method: 'POST',
      body: JSON.stringify(options),
    });
  },
  // 获取规则列表
  getRuleList: (options: ListParamsType<{ appId: string }>): Promise<CommonResponseType> => {
    return Drequest(`${Constant.API.RULE}rule/page`, {
      method: 'POST',
      body: JSON.stringify(options),
    });
  },
  // 新增规则
  addAndEditRule: (options: RuleData): Promise<CommonResponseType> => {
    return Drequest(`${Constant.API.RULE}rule/save`, {
      method: 'POST',
      body: JSON.stringify(commonParams(options)),
    });
  },
  // 新增规则组
  addAndEditRuleGroup: (options: RuleGroupParams): Promise<CommonResponseType> => {
    return Drequest(`${Constant.API.RULE}ruleGroup/saveAll`, {
      method: 'POST',
      body: JSON.stringify(commonParams(options)),
    });
  },
  // 根据ruleGroupid查询rule列表
  getRuleListByRuleGroupId: (options: string): Promise<CommonResponseType> => {
    return Drequest(`${Constant.API.RULE}rule/listByGroupId`, {
      method: 'POST',
      body: JSON.stringify(commonParams2(options)),
    });
  },
  // 根据ruleGroupid查询rule列表
  deleteGroupItem: (options: string): Promise<CommonResponseType> => {
    return Drequest(`${Constant.API.RULE}ruleGroup/delete`, {
      method: 'POST',
      body: JSON.stringify(commonParams2(options)),
    });
  },
  // 根据ruleid查询rule详情
  getDetailByRuleId: (ruleId: string, ruleType?: string): Promise<CommonResponseType> => {
    return Drequest(`${Constant.API.RULE}rule/getById`, {
      method: 'POST',
      body: JSON.stringify(commonParams2({ ruleId, ruleType })),
    });
  },
  // 根据ruleGroupid查询rule列表
  deleteRuleItem: (ruleId: string, ruleType?: string): Promise<CommonResponseType> => {
    return Drequest(`${Constant.API.RULE}rule/delete`, {
      method: 'POST',
      body: JSON.stringify(commonParams2({ ruleId, ruleType })),
    });
  },
  // 规则组启用
  activeGroup: (options: string): Promise<CommonResponseType> => {
    return Drequest(`${Constant.API.RULE}rule/active`, {
      method: 'POST',
      body: JSON.stringify(commonParams2(options)),
    });
  },
  // 规则组禁用
  disableGroup: (options: string): Promise<CommonResponseType> => {
    return Drequest(`${Constant.API.RULE}rule/disable`, {
      method: 'POST',
      body: JSON.stringify(commonParams2(options)),
    });
  },
  // 规则组执行
  carryoutGroup: (options: CarryoutGroupParams): Promise<CommonResponseType> => {
    return Drequest(`${Constant.API.RULE}rule/exec`, {
      method: 'POST',
      body: JSON.stringify(commonParams(options)),
    });
  },
  // 查询流水号规则
  getBusinessIdList: (options: {}, pageIndex: number): Promise<CommonResponseType> => {
    return Drequest(`${Constant.API.MDM}serialNumber/page`, {
      method: 'POST',
      body: JSON.stringify(commonParams3(options, pageIndex)),
    });
  },
}

export default ruleApi
