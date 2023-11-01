import { Constant } from '@/constant';
import { CopyProcessParamsType, parseDealPersonInit, ProgressSaveType, SaveParamsType, UserTaskAuthParamsType, UserTaskFieldType, UserTaskPersonByDepartParamsType, UserTaskPosByDepartParamsType, UserTaskProgressType, UserTaskRuleListParamsType } from '@/pages/progress/type';
import { CommonParamType, CommonResponseType, ProgressDataType, ProgressDetailType } from '@/types/common';
import { Drequest } from '@/utils/request';
import { commonParams, commonParams2, commonParams2NoAppId, commonParams3 } from '@/utils/utils';

type FormListType = { // 流程编辑器开始节点查询表单
  appId: string | null,
  datasourceId?: string,
  pageDesc?: string,
  pageId?: string,
  pageName?: string,
  pageType: string,
  tableName?: string
}


// 查询列表
export async function getList(options?: { [key: string]: any }) {
  return Drequest(`${Constant.API.WORKFLOW}find`, {
    method: 'POST',
    body: JSON.stringify(options),
  });
}

// 删除
export async function deleteProgressItem(options?: { [key: string]: any }) {
  return Drequest(`${Constant.API.WORKFLOW}delete`, {
    method: 'POST',
    body: JSON.stringify(options),
  });
}

// 发布
export async function publishProgressItem(options?: { [key: string]: any }) {
  return Drequest(`${Constant.API.WORKFLOW}deployment`, {
    method: 'POST',
    body: JSON.stringify(options),
  });
}

// 取消发布
export async function cancelPublishProgressItem(options?: { [key: string]: any }) {
  return Drequest(`${Constant.API.WORKFLOW}cancelDeployment`, {
    method: 'POST',
    body: JSON.stringify(options),
  });
}

// 编辑器更新
export async function update(options?: { [key: string]: any }) {
  return Drequest(`${Constant.API.WORKFLOW}update`, {
    method: 'POST',
    body: JSON.stringify(options),
  });
}

const progressApi = {
  getListDetail: (options: ProgressDetailType): Promise<CommonResponseType> => {
    return Drequest(`${Constant.API.BUSINESS}workflow/file/detail`, {
      method: 'POST',
      body: JSON.stringify(options),
    });
  },
  // 查询流程表单
  getFormList: (options: FormListType): Promise<CommonResponseType> => {
    return Drequest(`${Constant.API.MDM}page/list`, {
      method: 'POST',
      body: JSON.stringify(commonParams(options)),
    });
  },
  // 保存文件
  save: (options: ProgressSaveType): Promise<CommonResponseType> => {
    return Drequest(`${Constant.API.BUSINESS}workflow/file/save`, {
      method: 'POST',
      body: JSON.stringify(commonParams(options)),
    });
  },
  update: (options: ProgressSaveType): Promise<CommonResponseType> => {
    return Drequest(`${Constant.API.BUSINESS}workflow/file/update`, {
      method: 'POST',
      body: JSON.stringify(commonParams(options)),
    });
  },
  // 获取语言列表
  getLangList: (): Promise<CommonResponseType> => {
    return Drequest(`${Constant.API.MDM}lang/list`, {
      method: 'POST',
      body: JSON.stringify(commonParams2NoAppId("")),
    });
  },
  // 获取用户节点字段操作权限列表
  getPageItemList: (options: UserTaskFieldType): Promise<CommonResponseType> => {
    return Drequest(`${Constant.API.MDM}page/getPageItemList`, {
      method: 'POST',
      body: JSON.stringify(commonParams(options)),
    });
  },
  // 查询数据字典
  getDicList: (options: UserTaskProgressType): Promise<CommonResponseType> => {
    return Drequest(`${Constant.API.WORKFLOW}constant/find`, {
      method: 'POST',
      body: JSON.stringify(commonParams(options)),
    });
  },
  // 查询租户信息
  getTenantUserInfo: (): Promise<CommonResponseType> => {
    return Drequest(`${Constant.API.LC_AUTH}tenant/list`, {
      method: 'POST',
      body: JSON.stringify(commonParams({})),
    });
  },
  // 查询用户节点的部门信息
  getUserTaskDepartment: (): Promise<CommonResponseType> => {
    return Drequest(`${Constant.API.LC_AUTH}organization/tree`, {
      method: 'POST',
      body: JSON.stringify(commonParams2("")),
    });
  },
  // 查询用户节点的角色信息
  getUserTaskAuth: (options: UserTaskAuthParamsType): Promise<CommonResponseType> => {
    return Drequest(`${Constant.API.LC_AUTH}role/list`, {
      method: 'POST',
      body: JSON.stringify(commonParams(options)),
    });
  },
  // 查询用户节点的人员信息
  getUserTaskPersonByDepartment: (options: UserTaskPersonByDepartParamsType): Promise<CommonResponseType> => {
    return Drequest(`${Constant.API.LC_AUTH}user/listByRoleAndOrg`, {
      method: 'POST',
      body: JSON.stringify(commonParams(options)),
    });
  },
  // 查询用户节点的所有人员信息
  getAllUserTaskPerson: (): Promise<CommonResponseType> => {
    return Drequest(`${Constant.API.LC_AUTH}user/list`, {
      method: 'POST',
      body: JSON.stringify(commonParams({})),
    });
  },
  // 查询用户节点的人员信息
  getMemberPage: (roleId: string): Promise<CommonResponseType> => {
    return Drequest(`${Constant.API.LC_AUTH}user/listByAppRole`, {
      method: 'POST',
      body: JSON.stringify({
        ...commonParams(),
        data: roleId
      }),
    });
  },
  // 查询用户节点的所有岗位信息
  getAllUserTaskPos: (): Promise<CommonResponseType> => {
    return Drequest(`${Constant.API.LC_AUTH}position/list`, {
      method: 'POST',
      body: JSON.stringify(commonParams({})),
    });
  },
  // 查询用户节点的岗位信息
  getUserTaskPosByDepartment: (options: UserTaskPosByDepartParamsType): Promise<CommonResponseType> => {
    return Drequest(`${Constant.API.LC_AUTH}position/tree`, {
      method: 'POST',
      body: JSON.stringify(commonParams(options)),
    });
  },
  // 查询详情
  processDetails: (options: ProgressDetailType): Promise<CommonResponseType> => {
    return Drequest(`${Constant.API.BUSINESS}workflow/wf/processDetails`, {
      method: 'POST',
      body: JSON.stringify(options),
    });
  },
  // 根据id转换用户、角色、组织、部门名称
  transName: (options: parseDealPersonInit): Promise<CommonResponseType> => {
    return Drequest(`${Constant.API.LC_AUTH}user/transName`, {
      method: 'POST',
      body: JSON.stringify(commonParams(options)),
    });
  },
  // 检查文件名是否存在
  checkFileName: (options: { fileName: string, id?: string }): Promise<CommonResponseType> => {
    return Drequest(`${Constant.API.WORKFLOW}checkFileName`, {
      method: 'POST',
      body: JSON.stringify(commonParams(options)),
    });
  },
  // 复制流程
  workflowCopy: (options: CopyProcessParamsType): Promise<CommonResponseType> => {
    return Drequest(`${Constant.API.BUSINESS}workflow/file/copy`, {
      method: 'POST',
      body: JSON.stringify(commonParams(options)),
    });
  },
  // 获取用户节点规则列表
  getRuleList: (options: UserTaskRuleListParamsType): Promise<CommonResponseType> => {
    return Drequest(`${Constant.API.RULE}rule/list`, {
      method: 'POST',
      body: JSON.stringify(commonParams(options)),
    });
  },
  // 
  getNoticeTemp: (options: CommonParamType): Promise<CommonResponseType> => {
    return Drequest(`${Constant.API.BUSINESS}crud/page`, {
      method: 'POST',
      body: JSON.stringify(commonParams3(options, 1, 100)),
    });
  },
}
export default progressApi
