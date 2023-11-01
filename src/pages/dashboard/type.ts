export type AppListType = { // 查询我的应用列表入参
  appId?: string,
  datasourceId?: string,
  pageDesc?: string,
  pageId?: string,
  pageName?: string,
  pageType?: number,
  tableName?: string,
  createUser: string
}

export type StatisticsProcessType = { // 查询我的流程统计数字
  appId?: string,
  flag?: string,
  flowKey?: string,
  userId: string
}

export type StatisticsProcessNumber = { // 我的流程统计返回
  created: number,
  handled: number,
  notify: number,
  pending: number
}