import { Constant } from '@/constant';
import { CommonResponseType } from '@/types/common';
import { Drequest } from '@/utils/request';
import { commonParams, commonParams2 } from '@/utils/utils';

export async function getList(options?: { [key: string]: any }) {
  return Drequest(`${Constant.API.MDM}application/list`, {
    method: 'POST',
    body: JSON.stringify(options),
  });
}

export async function createApplication(options?: { [key: string]: any }) { // 创建应用
  return Drequest(`${Constant.API.BUSINESS}application/create`, {
    method: 'POST',
    body: JSON.stringify(options),
  });
}

const appApi = {
  deleteApplication: (options: { id: string }): Promise<CommonResponseType> => {
    return Drequest(`${Constant.API.BUSINESS}application/delete`, {
      method: 'POST',
      body: JSON.stringify(commonParams(options)),
    })
  },
  getPageAuth: (options: string): Promise<CommonResponseType> => {
    return Drequest(`${Constant.API.MDM}application/pageResourceMap`, {
      method: 'POST',
      body: JSON.stringify(commonParams2(options)),
    })
  },
}
export default appApi