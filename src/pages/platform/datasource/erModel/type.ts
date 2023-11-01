export type ErModelList = {
  children?: ErModelList[],
  erId?: string,
  erName?: string,
  relationType?: number,
  tableName?: string,
  foreignKey?: {
    leftFieldName: string,
    rightFieldName: string,
  }
  [key: string]: any
}

export type TableDetailInfoType = {
  namespace?: string,
  tableName?: string,
  columns?: TableDetailItemInfoType[]
}

export type TableDetailItemInfoType = {
  columnName: string,
  [key: string]: any
}

export type ChildTableInfoType = {
  [key: string]: {
    label: string,
    value: string
  }
}

export type SaveActionType = {
  datasourceId: string,
  tableName: string,
  children: ErModelList[]
}