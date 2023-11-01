import { history } from 'umi'
import { stringify } from 'querystring';
import type { RcFile } from 'antd/lib/upload';
import { message } from 'antd';
import {
  CommonParamType,
  DicType,
  TerminalType
} from '@/types/common';
import type { IntlShape } from 'react-intl';
import { Constant } from '@/constant';
import type {
  TreeDataNode,
  UserTaskTreeRowType
} from '@/pages/progress/type';
import schemaApi from "@/services/schemaApi";
import {
  assetBundle,
  AssetLevel,
  AssetLoader
} from "@alilc/lowcode-utils";
import type { IRendererAppHelper } from '@alilc/lowcode-renderer-core/es/types';
import { systemParams } from '@/services/custom/appInfo/apiService';
import { Drequest } from './request';
import { createFetchHandler } from '@alilc/lowcode-datasource-fetch-handler';

const commonPackages = [
  "moment",
  "lodash",
  // "iconfont-icons",
  "@alifd/next",
  // "@alilc/lowcode-materials",
  "@alifd/fusion-ui",
]

export const loadComps = async (libraryAsset: []) => {
  if (!Array.isArray(libraryAsset)) return Promise.resolve()
  assetBundle(libraryAsset, AssetLevel.Library);
  const assetLoader = new AssetLoader();
  return assetLoader.load(libraryAsset)
}

export const loadAssets = () => {
  const libraryAsset: any = [];
  return schemaApi.getAssets()
    .then(({ packages }) => {
      packages?.forEach(({ package: _package, urls, renderUrls }: any) => {
        if (commonPackages.includes(_package)) return
        if (renderUrls) {
          libraryAsset.push(renderUrls);
        } else if (urls) {
          libraryAsset.push(urls);
        }
      });
      return loadComps(libraryAsset)
    })
}

export function getUrlParms(name: string) { // 获取地址栏后面的参数
  const reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
  const r = window.location.search.substring(1).match(reg);
  if (r != null)
    return decodeURI(r[2]);
  return '';
}

// 底部分页展示
export function showTotal(total: number, pageSize: number, current: number, component: IntlShape) { // 展示总数
  const totalPage = Math.ceil(total / pageSize);
  return `${component.formatMessage({ id: "pages.table.pagenation.desc", defaultMessage: "总共" })}
        ${total}
        ${component.formatMessage({ id: "pages.table.pagenation.desc2", defaultMessage: "条数据,第" })}
        ${current}/${totalPage}
        ${component.formatMessage({ id: "pages.table.pagenation.desc3", defaultMessage: "页" })}
    `
}

// 跳回登录携带之前的地址
export function RedirectPlace() {
  const { query = {}, search, pathname } = history.location;
  const { redirect } = query;
  deleteAllStorage()
  // return
  if (window.location.pathname !== '/user/login' && !redirect) {
    history.replace({
      pathname: '/user/login',
      search: stringify({
        redirect: pathname + search,
      }),
    });
  }
}



export const getToken = (): string => (localStorage.getItem(Constant.LOGIN_TOKEN_STORAGE) || '') as string;

// 不同标签下值会不同，所以使用sessionStorage保存
export const setAppId = (appid: string): void => sessionStorage.setItem(Constant.APPID_STORAGE, appid);
export const getAppId = (): string => (sessionStorage.getItem(Constant.APPID_STORAGE) || localStorage.getItem(Constant.APPID_STORAGE)) as string;
export const getAppIdOfbusiness = (): string => {
  try {
    return getAppId() || JSON.parse(localStorage.getItem(`appInfo-${localStorage.getItem("currentPath")}`) as string)?.appId;
  } catch (error) {
    return '';
  }
};

export const getWebUserInfo = () => JSON.parse(localStorage.getItem(Constant.USER_STORAGE) as string);

// 不同标签下值会不同，所以使用sessionStorage保存
export function setAppInfo(appInfo: Record<string, any>): void {
  if (!appInfo) return;
  sessionStorage.setItem(Constant.APPINFO_STORAGE, JSON.stringify(appInfo))
}
export function getAppInfo(): { appId: string, terminalType: TerminalType, appName: string, devWhiteList?: string } | undefined {
  let appInfo;
  const appInfoStorage = sessionStorage.getItem(Constant.APPINFO_STORAGE);
  if (appInfoStorage) {
    try {
      appInfo = JSON.parse(sessionStorage.getItem(Constant.APPINFO_STORAGE)!)
    } catch (error) {
      console.log(error);
    }
  }
  return appInfo;
}
export function removeAppInfo(): void {
  sessionStorage.removeItem(Constant.APPINFO_STORAGE);
}
export const getUserId = (): string => localStorage.getItem(Constant.USER_INFO_STORAGE) as string;

export const getLocale = (): string => localStorage.getItem("umi_locale") || 'zh-CN' as string;

/** 当前用户是否是超级管理员 */
export const isSuperAdmin = (): boolean => {
  const currentUserId = getUserId();
  const devWhiteList = getAppInfo()?.devWhiteList?.split(",");
  return devWhiteList ? devWhiteList.includes(currentUserId) : false;
};
// 上传图片的格式控制
export function beforeUpload(file: RcFile) {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  if (!isJpgOrPng) {
    message.error('上传格式仅支持JPG或PNG');
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error('图片大小必须低于2m');
  }
  return isJpgOrPng && isLt2M;
}

// 统一的参数封装
export function commonParams(params?: CommonParamType) {
  const operator = localStorage.getItem(Constant.USER_INFO_STORAGE)
  return {
    "data": {
      ...params,
    },
    operator,
    source: "PC",
    traceId: "",
    version: "1",
    appId: getAppIdOfbusiness(),
    lang: transLang()
  }
}

// 统一的参数封装
export function commonParams2(params: string | number | any) {
  const operator = localStorage.getItem(Constant.USER_INFO_STORAGE)
  return {
    "data": params,
    operator,
    source: "PC",
    traceId: "",
    version: "1",
    appId: getAppIdOfbusiness(),
    lang: transLang()
  }
}

// 统一的参数封装
export function commonParams3(params: string | number | any, pageIndex: number, pageSize: number = 10) {
  const operator = localStorage.getItem(Constant.USER_INFO_STORAGE)
  return {
    "data": params,
    operator,
    source: "PC",
    traceId: "",
    version: "1",
    appId: getAppIdOfbusiness(),
    lang: transLang(),
    page: pageIndex,
    size: pageSize
  }
}

// 统一的参数封装
export function commonParams2NoAppId(params: string | number) {
  const operator = localStorage.getItem(Constant.USER_INFO_STORAGE)
  return {
    "data": params,
    operator,
    source: "PC",
    traceId: "",
    version: "1",
    lang: transLang()
  }
}

// 统一的参数封装
export function commonParamsNoAppId(params?: CommonParamType) {
  const operator = localStorage.getItem(Constant.USER_INFO_STORAGE)
  return {
    "data": {
      ...params,
    },
    operator,
    source: "PC",
    traceId: "",
    version: "1",
    lang: transLang()
  }
}

// 清除缓存
export function deleteAllStorage() {
  localStorage.clear()
  localStorage.setItem("umi_locale", "zh-CN")
  localStorage.setItem(Constant.LANG_STORAGE, "zh-CN")
}

// 导出xml
export function exportProgressXml(obj: CommonParamType, type: string) {
  obj.saveXML({ format: true }).then((result: { xml: any; }) => {
    const { xml } = result;
    download(type, xml);
  }).catch((err: any) => {
    console.log("err", err)
  })

}

// 下载xml/svg
//  @param  type  类型  svg / xml
//  @param  data  数据
//  @param  name  文件名称
export function download(type: string, data: string | number | boolean, name?: string) {
  let dataTrack = '';
  const a = document.createElement('a');

  switch (type) {
    case 'xml':
      dataTrack = 'bpmn';
      break;
    case 'svg':
      dataTrack = 'svg';
      break;
    default:
      break;
  }

  a.setAttribute('href', `data:application/bpmn20-xml;charset=UTF-8,${encodeURIComponent(data)}`);
  a.setAttribute('target', '_blank');
  a.setAttribute('dataTrack', `diagram:download-${dataTrack}`);
  a.setAttribute('download', name || `diagram.${dataTrack}`);

  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};

// 判断是否为空对象
export function isEmptyObject(obj: CommonParamType) {
  return Object.getOwnPropertyNames(obj).length === 0
}

// 过滤数据字典
export function filterDicList(dataSource: DicType[], parentId: string) {
  return dataSource.filter(x => x.parentId === parentId)
}

// 根据数据字典constantKey返回对应的constantValue
export function ConstantKeyToContentValue(dataSource: DicType[], contentkey: string) {
  const arr = dataSource.filter(x => x.constantKey == contentkey)
  if (arr.length > 0) {
    return arr[0].constantValue
  }
  return ''
}

// 根据数据字典constantValue返回对应的constantKey
export function ConstantValueToContentKey(dataSource: DicType[], contentValue: string) {
  const arr = dataSource.filter(x => x.constantValue == contentValue)
  if (arr.length > 0) {
    return arr[0].constantKey
  }
  return ''
}

// 语言映射
export enum LangType {
  CHINESE = "zh-CN",
  ENGLISH = "en-US"
}


export const getLocaleLanguage = () => {
  const lang1 = localStorage.getItem(Constant.LANG_STORAGE)
  if (lang1) {
    return lang1
  }
  return LangType.CHINESE
}

export const initLanguage = () => {
  localStorage.setItem(Constant.LANG_STORAGE, getLocaleLanguage());
}

export const getTextToLanguage = (text?: string): string | undefined => {
  if (!text) return undefined;
  try {
    const textLanguage = JSON.parse(text);
    const localeLanguage = getLocaleLanguage();
    return textLanguage[localeLanguage] || textLanguage['zh-CN']
  } catch (error) {

  }
  return text;
}

export function parseTreeData<T extends { children: T[], child: T[] }>(data: T[], obj: { key: string; title: string }): TreeDataNode[] {
  return data.map(menu => {
    return {
      ...menu,
      key: menu[obj.key],
      value: menu[obj.key],
      title: menu[obj.title],
      children: (menu.children || menu.child) && parseTreeData((menu.children || menu.child), obj)
    }
  })
}

export function parseTreeData2<T extends { children: T[], child: T[] }>(data: T[], obj: { pageAuth: any; pageAuthOption: any; key: string; title: string }): any[] {
  return data.map(menu => {
    return {
      // ...menu,
      pageAuth: menu[obj.pageAuth],
      pageAuthOption: menu[obj.pageAuthOption],
      key: menu[obj.key],
      value: menu[obj.key],
      title: menu[obj.title],
      children: menu.child && parseTreeData2(menu.child, obj)
    }
  })
}

export function parseTreeData3<T extends { children: T[], child: T[] }>(data: T[], obj: { key: string; title: string }, activePane: string): TreeDataNode[] {
  return data.map(menu => {
    return {
      ...menu,
      key: `${activePane}-${menu[obj.key]}`,
      value: `${activePane}-${menu[obj.key]}`,
      title: `${activePane}:${menu[obj.title]}`,
      children: (menu.children || menu.child) && parseTreeData3((menu.children || menu.child), obj, activePane)
    }
  })
}

// 判断对象数组中是否含有某个值
export function indexOfObjectArray(arr: any[], val: string | number, keyWord: string) {

  return arr.some((it) => {
    if (it[keyWord] === val) {
      return true
    }
    return false
  })
}

export function uniqueFunc(arr: UserTaskTreeRowType[], key: string) {
  const res = new Map();
  return arr.filter((item) => !res.has(item[key]) && res.set(item[key], 1));
}

// 语言映射
export function transLang() {
  if (!localStorage.getItem(Constant.LANG_STORAGE)) {
    return 'zh-CN'
  }
  return localStorage.getItem(Constant.LANG_STORAGE)
}

// 扁平化tree数据
/**
 *
 * @param treeList 数据源
 * @param flatList 扁平化之后的数据
 * @returns
 */
export function treeToFlat(treeList: TreeDataNode[], flatList: TreeDataNode[]) {
  // flatList.length > 9999 是考虑底线保护原则，出于极限保护的目的设置的，可不设或按需设置。
  if (flatList.length > 9999) {
    return
  }
  treeList.map(e => {
    // 递归：有条件的自己调用自己，条件是 e.children.length 为真
    if (e.children && e.children.length) {
      treeToFlat(e.children, flatList)
      e.children = []
    }
    flatList.push(e)
  })
  // console.log('扁平化后：', flatList)
  return flatList
}

// tree去扁平化
export function flatToTree(treeList: any[], flatList: any[]) {
  flatList.map(e => {
    // 以 e.pid===null,作为判断是不是根节点的依据，或者直接写死根节点（如果确定的话），
    // 具体以什么作为判断根节点的依据，得看数据的设计规则，通常是判断层级或是否代表根节点的标记
    if (e.key === null) {
      // 避免出现重复数据
      const index = treeList.findIndex(sub => sub.key === e.key)
      if (index === -1) {
        treeList.push(e)
      }
    }

    flatList.map(e2 => {
      if (e2.key === e.key) {
        // 避免出现重复数据
        const index = e.children.findIndex((sub: { key: any; }) => sub.key === e2.key)
        if (index === -1) {
          e.children.push(e2)
        }
      }
    })
  })
  return treeList
}

/**
 * 格式化秒
 * @param int  value 总秒数
 * @return string result 格式化后的字符串
 */
export function formatSeconds(value: number) {
  let theTime = Math.floor(value);// 需要转换的时间秒
  let theTime1 = 0;// 分
  let theTime2 = 0;// 小时
  let theTime3 = 0;// 天
  if (theTime >= 60) {
    theTime1 = Math.floor(theTime / 60);
    theTime = Math.floor(theTime % 60);
    if (theTime1 >= 60) {
      theTime2 = Math.floor(theTime1 / 60);
      theTime1 = Math.floor(theTime1 % 60);
      if (theTime2 >= 24) {
        //大于24小时
        theTime3 = Math.floor(theTime2 / 24);
        theTime2 = Math.floor(theTime2 % 24);
      }
    }
  }
  let result = '';
  const obj: { day: number; hour: number; minute: number; second: number } = {
    day: 0,
    hour: 0,
    minute: 0,
    second: 0
  };
  if (theTime > 0) {
    result = "" + Math.floor(theTime) + "秒";
    obj.second = Math.floor(theTime)
  }
  if (theTime1 > 0) {
    result = "" + Math.floor(theTime1) + "分" + result;
    obj.minute = Math.floor(theTime1)
  }
  if (theTime2 > 0) {
    result = "" + Math.floor(theTime2) + "小时" + result;
    obj.hour = Math.floor(theTime2)
  }
  if (theTime3 > 0) {
    result = "" + Math.floor(theTime3) + "天" + result;
    obj.day = Math.floor(theTime3)
  }
  return {
    str: result,
    object: obj
  };
}

export const getBaseUrl = () => {
  return localStorage.getItem('baseUrl') ? localStorage.getItem('baseUrl') : Constant.baseUrl
}

export function getQueries(key?: string) {
  const params = new URLSearchParams(window.location.search);
  return key ? params.get(key) : Object.fromEntries(params);
}


export function getDefaultAppHelper(terminalType: TerminalType, params?: any): IRendererAppHelper {

  const initConstants = terminalType === TerminalType.App ? {
    appId: getAppId(),
    userId: getUserId(),
    language: getLocaleLanguage(),
    systemParams: systemParams(),
    userInfo: getWebUserInfo(),
  } : {
    systemParams: systemParams(),
  };
  return {
    requestHandlersMap: {
      fetch: createFetchHandler(),
    },
    history: history as any,
    constants: {
      ...initConstants,
      ...params
    },
    utils: {
      getQueries,
      fetch: Drequest
    }
  }
}

