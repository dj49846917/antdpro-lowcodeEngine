export type UserListData = {
  fullName?: string,
  employeeNo?: string,
  email?: string,
  orgName?: string,
  userId?: string,
  roleIdList?: string[],
  mobilePhone?: string,
  image?: string,
  createDate?: string,
  [key: string]: any
}

export type TableFormData = {
  email?: string,
  fullName?: string,
  organizationId?: string
}

export type AddAndEditUserType = { // 新增、编辑用户入参类型
  email: string,
  fullName: string,
  roleIdList: string[],
  userId?: string,
  mobilePhone?: string,
  image?: string,
}

export type EditAndResetPasswordType = { // 修改、重置密码入参
  oldPassword?: string,
  password?: string,
  userId: string
}