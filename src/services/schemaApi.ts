import { Constant } from "@/constant";
import { Drequest } from "@/utils/request";
import {
  commonParams,
  getAppId,
  getQueries
} from "@/utils/utils";
import type {
  IPublicTypeAssetsJson,
  IPublicTypePackage,
  IPublicTypeProjectSchema
} from "@alilc/lowcode-types";
import { systemParams } from "./custom/appInfo/apiService";
import { history } from "@@/core/history";

// const defaultSchema = {
//   "componentName": "Page",
//   "id": "node_dockcviv8fo1",
//   "props": {
//     "ref": "outerView",
//     "style": {
//       "height": "100%"
//     }
//   },
// }

export type AssetsType = {
  packages: IPublicTypePackage[];
  schema: IPublicTypeProjectSchema;
  pageStructure?: any;
  pcPageId?: string;
  pageId?: string;
  components?: any[];
  tableName?: string;
  childPageId?: string;
  pageType?: string;
  pageTempId?: string;
  childTableList?: any;
}

const schemaApi = {
  getAssets: (isBeta?: boolean): Promise<IPublicTypeAssetsJson> => {
    return Drequest.post(`${Constant.API.OSS}file/downloadCompatibleFile`, {
      data: {
        ...systemParams(),
        data: `common/materials/assets-private${isBeta || getQueries('isBeta') ? '-beta' : ''}.json`,
      }
    }).then(res => {
      return res
    }).catch(err => console.log("getAssets>>>", err))
  },
  getMobileAssets: (): Promise<IPublicTypeAssetsJson> => {
    return Drequest.post(`${Constant.API.OSS}file/downloadCompatibleFile`, {
      data: {
        "data": "common/materials/assets-mobile.json",
        ...systemParams(),
      }
    }).then(res => {
      return res
    }).catch(err => console.log("getMobileAssets>>>", err))
  },
  getSchema: (id: string = getQueries('pageId') as string, init?: boolean): Promise<AssetsType> => {
    return Drequest.post(!!getQueries('isTemplate') ? `${Constant.API.MDM}pageTemplate/getSchema` : `${Constant.API.MDM}page/getSchema`, {
      data: {
        ...commonParams(),
        data: { id, init },
      }
    }).then(res => {
      return res?.data || {}
    }).catch(err => console.log("getSchema>>>", err))
  },
  saveSchema: (params: AssetsType) => {
    const isMapping = !!getQueries("mapping");
    return Drequest.post(!!getQueries("isTemplate") ? `${Constant.API.MDM}pageTemplate/saveSchema` : `${Constant.API.MDM}page/saveSchema`, {
      data: {
        ...commonParams(),
        data: {
          autoAppPage: isMapping,
          ...params,
          pageId: params.pageId || getQueries('pageId')
        }
      }
    }).then(res => {
      if (res.success) {
        if (isMapping) {
          history.replace(`/designer/mobile?pageId=${res.data}`)
        }
      }
      return res
    })
  },
  saveBlock: (params: any) => {
    return Drequest.post(`${Constant.API.BUSINESS}crud/post`, {
      data: {
        ...commonParams(),
        "data": {
          "@lc_datasource": "888",
          "@camel": true,
          "Lc_biz_component": {
            "appId": getAppId(),
            ...params
          },
          "tag": "Lc_biz_component"
        },
      }
    })
  },
  listBlock: () => {
    return Drequest.post(`${Constant.API.BUSINESS}crud/page`, {
      data: {
        ...commonParams(),
        data: {
          "@lc_datasource": "888",
          "@camel": true,
          "[]": {
            "Lc_biz_component": {
              "appId": getAppId(),
              // "@column": "id,componentName,title,screenshot,schema"
            }
          },
        },
        "page": 1,
        "size": 99,
      }
    }).then(res => res.data?.list)
  },
  tenantBlock: () => {
    return Drequest.post(`${Constant.API.BUSINESS}crud/page`, {
      data: {
        ...commonParams(),
        data: {
          "@lc_datasource": "888",
          "@camel": true,
          "@enableLang": true,
          "[]": {
            "LC_tenant": {
              "@column": "tenantCode,tenantName,tenantDescription,endDateActive,startDateActive,activeFlag,businessId",
              "@order": "modifiedDate-"
            }
          }
        },
        "page": 1,
      }
    }).then(res => res.data?.list)
  },
  delBlock: (id: string) => {
    return Drequest.post(`${Constant.API.BUSINESS}crud/delete`, {
      data: {
        ...commonParams(),
        data: {
          "@lc_datasource": "888",
          "@camel": true,
          "Lc_biz_component": {
            "BUSINESS_ID": id,
          },
          "tag": " TEST_TABLE_NAME"
        },
        "page": 1,
        "size": 99,
      }
    }).then(res => res.data?.list)
  },
  getPrintTemplate: (data?: any) => {
    return Drequest.post(`${Constant.API.BUSINESS}crud/get`, {
      data: {
        ...commonParams(),
        data: {
          "@lc_datasource": '888',
          "@camel": true,
          "@enableLang": true,
          "LC_PAGE_PRINT_TEMPLATE": {
            ...data,
            "@order": "modifiedDate-"
          },
        },
      }
    }).then(res => {
      return res.success ? res.data?.LC_PAGE_PRINT_TEMPLATE : undefined;
    }).catch(err => console.log(err))
  },
  savePrintTemplate: (data?: any) => {
    return Drequest.post(`${Constant.API.BUSINESS}crud/post`, {
      data: {
        ...commonParams(),
        data: {
          "@lc_datasource": '888',
          "@camel": true,
          "@enableLang": true,
          "LC_PAGE_PRINT_TEMPLATE": {
            ...data,
            "@order": "modifiedDate-"
          },
          "tag": "LC_PAGE_PRINT_TEMPLATE"
        },
      }
    }).then(res => {
      return res
    }).catch(err => console.log(err))
  }
}

export default schemaApi;
