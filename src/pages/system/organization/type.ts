export type OrgList = {
  organizationCode?: string,
  name?: string,
  organizationTypeEnumVal?: string,
  leaderName?: string,
  parentOrganizationName?: string,
  tenantName?: string,
  businessId?: string,
  organizationId?: string
}

export type TenantList = { // 租户列表
  chName: string,
  tenantId: string,
  [key: string]: any
}

export type UserListType = { // 用户列表
  userId: string,
  fullName: string,
  [key: string]: any
}

export type SaveParams = { // 保存的入参
  organizationCode: string,
  name: string,
  organizationTypeEnumVal: string,
  leader?: string,
  parentOrganizationId?: string,
  organizationId?: string,
  description?: string,
  tenantId: string
}