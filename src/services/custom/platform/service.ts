import { Constant } from '@/constant';
import { SaveActionType } from '@/pages/platform/datasource/erModel/type';
import { CommonResponseType } from '@/types/common';
import { Drequest } from '@/utils/request';
import {
  commonParams,
  getAppId,
  getUserId
} from "@/utils/utils";

const url = (isPlatform: boolean) => {
  return isPlatform ? `${Constant.API.MDM}datasource` : `${Constant.API.MDM}datasource/app`
}

export interface DataSourceData {
  name: string;
  description: string;
  driver: string;
  ip: string;
  database: string;
  port: string;
  password: string;
  username: string;
  type: string;
  tenantDatasourceId: string;
  tenantTable: string;
  tenantField: string;
}

export interface TableListData {
  [x: string]: any;

  id: string;
  columns: any[];
  comments: string;
  namespace: string;
  tableName: string;
  createDate: string;
  updateDate: string;
  label?: string,
  value?: string,
  tableKey?: string,
  datasourceId?: string,
}

export interface DriverOption {
  driverId: string,
  driverName: string,
}

export interface TenantTable {
  columns: any[],
  tableName: string,
}

export interface DatasourceDataRes {
  createDate: string;
  createUser: string;
  datasourceDesc: string;
  datasourceDriverId: string;
  datasourceDriverName: string;
  datasourceHost: string;
  datasourceId: string;
  datasourceName: string;
  datasourcePort: string;
  datasourcePwd: string;
  datasourceTenantList: null
  datasourceUser: string;
  isMultiTenant: string;
  schema: string;
}

export type TableFieldType = {
  id: string;
  fieldName: string;
  fieldType: string;
  fieldLength: string;
  fieldDesc: string;
  decimals: string;
  default: string;
  notNull: string;
  unique: string;
  actions: string;
}

export type getTenantTableFieldListType = {
  datasourceId: string,
  tableName: string
}

const datasourceApi = {
  getDrivers: (): Promise<API.Result<DriverOption[]>> => {
    return Drequest.post(`${Constant.API.MDM}datasource/getDatasourceDrivers`, {});
  },
  deleteDatabase(id: string): Promise<API.Result<any>> {
    return Drequest.post(`${Constant.API.MDM}datasource/delete`, {
      data: {
        "data": id,
        "operator": getUserId(),
        "source": "PC",
        "traceId": "",
        "version": "1"
      }
    })
  },
  getTenantList: (): Promise<API.Result<DatasourceDataRes[]>> => {
    return Drequest.post(`${Constant.API.MDM}datasource/getNormalDatasource`, {
      data: commonParams()
    })
  },
  getTenantTableList: (id: string): Promise<API.Result<TenantTable[]>> => {
    return Drequest.post(`${Constant.API.MDM}datasource/getTables`, {
      data: commonParams({
        datasourceId: id,
      })
    })
  },
  getTenantTableFieldList: (options: getTenantTableFieldListType): Promise<API.Result<TenantTable>> => {
    return Drequest.post(`${Constant.API.MDM}table/info`, {
      data: commonParams(options)
    })
  },
  getDatabaseList: (appId?: string): Promise<API.Result<DatasourceDataRes[]>> => {
    return Drequest.post(`${url(!appId)}/getAllDatasource`, {
      data: {
        "data": {
          appId
        },
        "operator": getUserId(),
        "source": "PC",
        "traceId": "",
        "version": "1"
      }
    })
  },
  getDatabaseDetail: (params: any): Promise<{ success: boolean; data?: DataSourceData }> => {
    return Drequest.post(`${Constant.API.MDM}datasource/getDatasourceById`, {
      data: {
        "data": params,
        "operator": getUserId(),
        "source": "PC",
        "traceId": "",
        "version": "1"
      }
    }).then(res => {
      if (!res.success) {
        return {
          success: false,
        };
      }
      return {
        success: true,
        data: {
          name: res.data.datasourceName,
          datasourceId: res.data.datasourceId,
          description: res.data.datasourceDesc,
          driver: res.data.datasourceDriverId,
          ip: res.data.datasourceHost,
          database: res.data.schema,
          port: res.data.datasourcePort,
          password: res.data.datasourcePwd,
          username: res.data.datasourceUser,
          type: res.data.isMultiTenant + '',
          ...res.data.datasourceTenantList?.[0]
        } as DataSourceData
      }
    })
  },
  createDataSource: (params: DataSourceData): Promise<API.Result<boolean>> => {
    const req = {
      "datasourceName": params.name,
      "datasourceDesc": params.description,
      "datasourceDriverId": params.driver,
      "schema": params.database,
      "datasourceHost": params.ip,
      "datasourcePort": params.port,
      "datasourceUser": params.username,
      "datasourcePwd": Buffer.from(params.password).toString('base64'),
      "isMultiTenant": params.type,
      "datasourceTenantList": params.type === '1' ? [
        {
          "tenantDatasourceId": params.tenantDatasourceId,
          "tenantTable": params.tenantTable,
          "tenantField": params.tenantField
        }
      ] : null
    }
    return Drequest.post(`${Constant.API.MDM}datasource/saveDatasource`, {
      data: {
        ...commonParams(),
        "data": req,
      }
    })
  },
  modelBindsDataSource: (dataSourceId: string) => {
    return Drequest.post(`${Constant.API.MDM}datasource/app/bind`, {
      data: {
        ...commonParams(),
        data: {
          "appId": getAppId(),
          "datasourceId": dataSourceId
        }
      }
    })
  },
  modelUnBindsDataSource: (dataSourceId: string) => {
    return Drequest.post(`${Constant.API.MDM}datasource/app/unbind`, {
      data: {
        ...commonParams(),
        data: {
          "appId": getAppId(),
          "datasourceId": dataSourceId
        }
      }
    })
  },
  getTableList: (params: API.PageParams & { id?: string; tableName?: string; comments?: string; } = {
    current: 1,
    pageSize: 10
  }): Promise<API.Result<API.PageData<TableListData[]>>> => {
    return Drequest.post(`${Constant.API.MDM}table/page`, {
      data: {
        ...commonParams(),
        data: {
          "datasourceId": params.id,
          "tableName": params?.tableName,
          "comments": params?.comments
        },
        "page": params.current,
        "size": params.pageSize,
      }
    })
  },
  createTable: (params: {
    name: string;
    description: string;
    columns: TableFieldType[];
    dataSourceId: string;
  }) => {
    const req = {
      tableName: params.name,
      comments: params.description,
      datasourceId: params.dataSourceId,
      columns: params.columns.map(column => {
        return {
          "columnName": column.fieldName,
          "comments": column.fieldDesc,
          "precisions": column.fieldLength,
          "jdbcType": column.fieldType,
          "uniques": column.unique,
          "scales": column.decimals,
          "defaultValue": column.default,
          "notNull": column.notNull,
        }
      })
    }
    return Drequest.post(`${Constant.API.MDM}datasource/createTable`, {
      data: {
        ...commonParams(),
        "data": req,
      }
    })
  },
  deleteTable: (id: string) => {
    return Drequest.post(`${Constant.API.MDM}table/delete`, {
      data: {
        ...commonParams(),
        "data": id,
      }
    })
  },
  getDetailInfo: (options: { datasourceId: string, tableName: string }): Promise<CommonResponseType> => {
    return Drequest(`${Constant.API.MDM}table/erTree`, {
      method: 'POST',
      body: JSON.stringify(commonParams(options)),
    });
  },
  getErDetailChild: (options: { datasourceId: string }): Promise<CommonResponseType> => {
    return Drequest(`${Constant.API.MDM}datasource/getTables`, {
      method: 'POST',
      body: JSON.stringify(commonParams(options)),
    });
  },
  getTableDetailInfo: (options: { datasourceId: string, tableName: string }): Promise<CommonResponseType> => {
    return Drequest(`${Constant.API.MDM}table/info`, {
      method: 'POST',
      body: JSON.stringify(commonParams(options)),
    });
  },
  saveErModel: (options: SaveActionType): Promise<CommonResponseType> => {
    return Drequest(`${Constant.API.MDM}table/saveEr`, {
      method: 'POST',
      body: JSON.stringify(commonParams(options)),
    });
  },
}

export default datasourceApi
