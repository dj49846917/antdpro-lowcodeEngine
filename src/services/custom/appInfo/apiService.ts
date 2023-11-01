import { Constant } from "@/constant";
import { Drequest } from "@/utils/request";
import { commonParams, getAppId, transLang } from "@/utils/utils";
import { Message } from "@alifd/next"
type ApiSaveType = {
  "apiName": string,
  "postMethod": string,
  "supCors": number,
  "postUri": string,
  "beforeFunction"?: string,
  "countFunction"?: string,
  "failFunction"?: string,
  "postHeader"?: string,
  "postParams"?: string,
  "successFunction"?: string,
  "waitTimeout"?: number,
  "apiDesc"?: string,
  "apiId"?: string,
}

export type ApiType = {
  id: string;
  name: string;
  method: string;
  headers: string;
  uri: string;
  params: string;
  onSuccess: string;
  onError: string;
  shouldRequest: string;
  beforeRequest: string;
  timeout: number;
  isCors: boolean;
}
const format = (params: ApiSaveType) => {
  return {
    id: params.apiId,
    name: params.apiName,
    uri: params.postUri,
    headers: params.postHeader,
    params: params.postParams,
    method: params.postMethod,
    isCors: params.supCors,
    onSuccess: params.successFunction,
    onError: params.failFunction,
    beforeRequest: params.beforeFunction,
    shouldRequest: params.countFunction,
    timeout: params.waitTimeout,
  }
}
const apiService = {
  del: (id: string) => {
    return Drequest.post(`${Constant.API.MDM}api/delete`, {
      data: {
        ...commonParams(),
        data: id
      }
    })
  },
  getDetail: (id: string) => {
    return Drequest.post(`${Constant.API.MDM}api/detail`, {
      data: {
        ...commonParams(),
        data: id
      }
    }).then(res => res.success ? format(res.data) : {})
  },
  getApiList: () => {
    return Drequest.post(`${Constant.API.MDM}api/list`, {
      data: {
        ...commonParams(),
        data: {}
      }
    }).then(res => res?.success ? res.data : [])
  },
  getApiPageData: (params = { current: 1, size: 10, apiName: "" }) => {
    return Drequest.post(`${Constant.API.MDM}api/page`, {
      data: {
        ...commonParams(),
        "page": params?.current,
        "size": params?.size,
        data: { apiName: params?.apiName },
      }
    }).then(res => {
      if (res.success) {
        return {
          ...res.data,
          list: res.data.list.map((item: ApiSaveType) => (format(item)))
        }
      }
    })
  },
  save: (params: any) => {
    const req: ApiSaveType = {
      apiId: params.id,
      apiName: params.name,
      postUri: params.uri,
      postHeader: params.headers,
      postParams: params.params,
      postMethod: params.method,
      successFunction: params.onSuccess,
      failFunction: params.onError,
      beforeFunction: params.beforeRequest,
      countFunction: params.shouldRequest,
      waitTimeout: params.timeout,
      supCors: +params.isCors,
    }
    return Drequest.post(`${Constant.API.MDM}api/save`, {
      data: {
        ...commonParams(),
        data: req
      }
    })
  }
}

export const systemParams = () => ({
  "appId": getAppId(),
  "source": "PC",
  "traceId": "",
  "version": "1",
  operator: localStorage.getItem(Constant.USER_INFO_STORAGE),
  lang: transLang(),
})

const reg = /\/\*.*\*\//;
export const removeComments = (script: string) => {
  return script.replaceAll('\r', '').replaceAll('\n', '').replace(reg, '');
}
export const apiRequest = (request: any, dataParams?: any) => {
  const {
    postUri, postMethod, waitTimeout, postHeader,
    postParams, countFunction, beforeFunction, successFunction, failFunction
  } = request || {};

  const params = { ...dataParams, ...systemParams() }
  const isRequest = countFunction && new Function(`return ${removeComments(countFunction)}`);
  const before = beforeFunction && new Function(`return ${removeComments(beforeFunction)}`);
  const onSuccess = successFunction && new Function(`return ${successFunction}`);
  const onFail = failFunction && new Function(`return ${failFunction}`);

  let newParams = postParams;
  try {
    newParams = postParams && typeof postParams === 'string' ? JSON.parse(postParams) : postParams;
    newParams = typeof before === 'function' ? before?.()?.(newParams, params) : newParams;
    if (!request || typeof isRequest === 'function' && !isRequest()?.(newParams, params)) {
      return Promise.reject();
    }
  } catch (e) {
    Message.error("请求参数解析错误");
    return Promise.reject()
  }
  const url = postUri.startsWith('http') ? postUri : postUri.startsWith('/') ? `${postUri}` : `/${postUri}`;
  return Drequest(url, {
    method: postMethod,
    headers: postHeader ? JSON.parse(postHeader) : {},
    body: JSON.stringify(newParams || {}),
    timeout: waitTimeout,
  }).then(res => {
    if (res.success) {
      return typeof onSuccess === 'function' && onSuccess?.()?.(res) || res;
    }
    throw new Error(res)
  }).catch(err => {
    if (typeof onFail === 'function') {
      onFail?.()?.(err)
    }
  })
}

export default apiService
