import { Constant } from "@/constant";
import { ListParamsType } from "@/pages/appinfo/page/type";
import { AddAndEditParamsType, RoleListParamsType } from "@/pages/appinfo/setup/role/type";
import { SaveRoleMemberType } from "@/pages/progress/type";
import { CommonResponseType } from "@/types/common";
import { Drequest } from "@/utils/request";
import { commonParams, commonParams2, commonParams2NoAppId, commonParamsNoAppId } from "@/utils/utils";

const roleApi = {
  // 获取接口配置
  getApiConfig: (): Promise<CommonResponseType> => {
    return Drequest.post(`${Constant.API.MDM}api/appAuthApi`, {
      data: { ...commonParams(), data: undefined }
    });
  },
  // 获取角色列表
  getRoleList: (options: ListParamsType<RoleListParamsType>): Promise<CommonResponseType> => {
    return Drequest(`${Constant.API.LC_AUTH}role/page`, {
      method: 'POST',
      body: JSON.stringify(options),
    });
  },
  // 获取权限树列表
  getAuthTree: (options: ListParamsType<RoleListParamsType>): Promise<CommonResponseType> => {
    return Drequest(`${Constant.API.LC_AUTH}resource/queryRoleTreeList`, {
      method: 'POST',
      body: JSON.stringify(options),
    });
  },
  // 保存权限树列表
  saveAuthTree: (options: ListParamsType<RoleListParamsType>): Promise<CommonResponseType> => {
    return Drequest(`${Constant.API.LC_AUTH}role/addRoleResourceList`, {
      method: 'POST',
      body: JSON.stringify(options),
    });
  },
  // 获取角色列表
  addAndEditRole: (options: AddAndEditParamsType, config?: boolean): Promise<CommonResponseType> => {
    return Drequest(`${Constant.API.LC_AUTH}role/save`, {
      method: 'POST',
      body: config ? JSON.stringify(commonParamsNoAppId(options)) : JSON.stringify(commonParams(options)),
    });
  },
  // 删除角色列表
  deleteRole: (options: string, config?: boolean): Promise<CommonResponseType> => {
    return Drequest(`${Constant.API.LC_AUTH}role/delete`, {
      method: 'POST',
      body: config ? JSON.stringify(commonParams2NoAppId(options)) : JSON.stringify(commonParams2(options)),
    });
  },
  // 查询所有用户列表
  userList: (options: {}): Promise<CommonResponseType> => {
    return Drequest(`${Constant.API.LC_AUTH}user/list`, {
      method: 'POST',
      body: JSON.stringify(commonParams(options)),
    });
  },
  // 保存用户
  saveRoleMember: (options: SaveRoleMemberType): Promise<CommonResponseType> => {
    return Drequest(`${Constant.API.LC_AUTH}role/addRoleUser`, {
      method: 'POST',
      body: JSON.stringify(commonParams(options)),
    });
  },
}

export default roleApi
