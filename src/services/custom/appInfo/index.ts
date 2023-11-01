import { Constant } from '@/constant';
import type { CopyAppType, ListParamsType, ListSearchType } from '@/pages/appinfo/page/type';
import type { CommonResponseType } from '@/types/common';
import { Drequest } from '@/utils/request';
import { commonParams, commonParams2, getAppId } from '@/utils/utils';

// export async function getDataSourceList(options?: { [key: string]: any }) { // 获取所有数据源列表
//   return Drequest(`${Constant.API.MDM}datasource/app/getAllDatasource`, {
//     method: 'POST',
//     body: JSON.stringify(options),
//   });
// }

export async function getDataSourceListById(options?: Record<string, any>) { // 数据源id获取数据表列表
  return Drequest(`${Constant.API.MDM}datasource/getTables`, {
    method: 'POST',
    body: JSON.stringify(options),
  });
}

export async function createApplication(options?: Record<string, any>) { // 创建应用
  return Drequest(`${Constant.API.MDM}page/save`, {
    method: 'POST',
    body: JSON.stringify(options),
  });
}

export async function deleteApplication(options?: Record<string, any>) { // 删除应用
  return Drequest(`${Constant.API.MDM}page/delete`, {
    method: 'POST',
    body: JSON.stringify(options),
  });
}

const pageApi = {
  getList: (options: ListParamsType<ListSearchType>, isTemplate?: boolean, isAppInit?: boolean): Promise<CommonResponseType> => {
    if (isTemplate || isAppInit) {
      return Drequest(`${Constant.API.MDM}pageTemplate/page`, {
        method: 'POST',
        body: JSON.stringify(options),
      });
    }
    return Drequest(`${Constant.API.BUSINESS}page/page`, {
      method: 'POST',
      body: JSON.stringify(options),
    });
  },
  copyApp: (options: CopyAppType, isPlatform?: boolean): Promise<CommonResponseType> => {
    return Drequest(`${Constant.API.MDM}page/copy`, {
      method: 'POST',
      body: JSON.stringify({ ...commonParams(options), appId: isPlatform ? 0 : getAppId() }),
    });
  },
  getTemplateList: (options: string): Promise<CommonResponseType> => {
    return Drequest(`${Constant.API.MDM}pageTemplate/list`, {
      method: 'POST',
      body: JSON.stringify(commonParams2(options)),
    });
  },
  getDataSourceList: (options: { appId: string }): Promise<CommonResponseType> => {
    return Drequest(`${Constant.API.MDM}datasource/app/getAllDatasource`, {
      method: 'POST',
      body: JSON.stringify(commonParams(options)),
    });
  },
  getGroupInfo: (options: { appId: string }): Promise<CommonResponseType> => {
    return Drequest(`${Constant.API.MDM}pageGroup/list`, {
      method: 'POST',
      body: JSON.stringify(commonParams(options)),
    });
  },
  revertVersionSave: (options: { deployId: string, pageId: string }): Promise<CommonResponseType> => {
    return Drequest(`${Constant.API.MDM}appDeploy/rollbackPage`, {
      method: 'POST',
      body: JSON.stringify(commonParams(options)),
    });
  },
  addTemplate: (options: { tempName: string, tempDesc: string }): Promise<CommonResponseType> => {
    return Drequest(`${Constant.API.MDM}pageTemplate/save`, {
      method: 'POST',
      body: JSON.stringify(commonParams(options)),
    });
  },
  deleteTemplate: (options: string): Promise<CommonResponseType> => {
    return Drequest(`${Constant.API.MDM}pageTemplate/delete`, {
      method: 'POST',
      body: JSON.stringify(commonParams2(options)),
    });
  },
  assignUsers: (options: { userId: string, pageIdList: string[] }): Promise<CommonResponseType> => {
    return Drequest(`${Constant.API.MDM}page/turn`, {
      method: 'POST',
      body: JSON.stringify(commonParams(options)),
    });
  },
  // 添加版本
  addVersion: (options: { userId: string, pageIdList: string[] }): Promise<CommonResponseType> => {
    return Drequest(`${Constant.API.MDM}crud/get`, {
      method: 'POST',
      body: JSON.stringify(commonParams(options)),
    });
  },
}
export default pageApi
