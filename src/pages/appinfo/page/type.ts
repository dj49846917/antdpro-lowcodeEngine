export type ListParamsType<T> = { // 查询列表参数
    data: T,
    operator: string | null,
    page: number,
    size: number,
    source: string,
    traceId: string,
    version: string,
    appId?: string,
    lang: string
}

export type ListSearchType = { // 列表参数
    pageName?: string,
    pageType?: number | undefined,
    appId: string | null
}

export type CopyAppType = {
    pageId: string,
    pageName: string,
    dataSourceId?: string,
    tableName?: string
}

export interface DataType {
    tempId?: string
    key?: React.Key;
    pageId?: string;
    createDate?: string;
    pageName?: string;
    createUser?: string;
    terminalType?: 0 | 1 | 2;
    pageType?: number;
    activeFlag?: number;
    appId?: string
}

export interface addFormInfoType {
    pageName: string;
    pageType: string;
    datasourceId: string;
    tableName: string;
    dataList?: any[];
    dataByIdList?: any[];
}

export type TemplateListType = {
    tempDesc: string,
    tempId: string,
    tempName: string,
    [key: string]: any
}