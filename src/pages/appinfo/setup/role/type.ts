export type RoleListType = { // 列表返回
  chName: string,
  chDescription?: string
  enName: string,
  enDescription?: string,
  roleId: string
}

export type AddAndEditParamsType = { // 新增或修改角色
  roleId?: string,
  appId?: string,
  chDescription?: string,
  chName: string,
  roleType: number
}

export type MemberListType = { // 成员列表
  fullName: string,
  email: string,
  userId: string,
  key: string,
  title: string,
  [key: string]: any
}

export type RoleListParamsType = {
  appId?: string,
  roleType?: number
}

export type AuthTreeParamsType = {
  resourceIdList?: any,
  resourceType?: string,
  roleId?: string
}