import { Constant } from "@/constant";
import { Drequest } from "@/utils/request";
import { commonParams, getAppId } from "@/utils/utils";

export type PublishedAppType = {
  deployId?: string;
  env?: string;
  deployVersion: string;
  deployPath: string;
  createUser?: string;
  createDate?: string;
  modifiedUser?: string;
  modifiedDate?: string;
}

const publishApi = {
  getList: (params = {current: 1, size: 10}): Promise<API.Result<API.PageData<PublishedAppType[]>>> => {
    return Drequest.post(`${Constant.API.MDM}appDeploy/page`, {
      data: {
        ...commonParams(),
        data: getAppId(),
        page: params?.current,
        size: params?.size,
      }
    })
  },
  getEnvs: (): Promise<API.Result<PublishedAppType[]>> => {
    return Drequest.post(`${Constant.API.MDM}env/list`, {
      data: {
        ...commonParams(),
        data: {},
      }
    })
  },
  publishApp: (params: PublishedAppType): Promise<API.Result<boolean>> => {
    return Drequest.post(`${Constant.API.MDM}appDeploy/deploy`, {
      data: {
        ...commonParams(),
        data: { appId: getAppId(), ...params }
      }
    })
  },
  publishEnvApp: (params: PublishedAppType): Promise<API.Result<boolean>> => {
    return Drequest.post(`${Constant.API.MDM}appDeploy/deployOtherEnvironment`, {
      data: {
        ...commonParams(),
        data: { envId: params.env }
      }
    })
  },
  deleteApp: (id: string) => {
    return Drequest.post(`${Constant.API.MDM}appDeploy/delete`, {
      data: {
        ...commonParams(),
        data: id
      }
    })
  }
}

export default publishApi
