import { Constant } from "@/constant";
import { ActionAuthType } from "@/pages/appinfo/setup/auth/type";
import { SavePageParamsType, SaveParamsType } from "@/pages/appinfo/rule/type";
import { CommonResponseType } from "@/types/common";
import { Drequest } from "@/utils/request";
import { commonParams } from "@/utils/utils";

const authApi = {
  // 查询资源权限列表
  getSourceAuthList: (options: { appId: string }): Promise<CommonResponseType> => {
    return Drequest(`${Constant.API.LC_AUTH}role/list`, {
      method: 'POST',
      body: JSON.stringify(commonParams(options)),
    });
  },
  // 查询菜单资源列表
  getMenuSourceList: (options: { appId: string, roleId: string }): Promise<CommonResponseType> => {
    return Drequest(`${Constant.API.MDM}appMenu/treeWithAuth`, {
      method: 'POST',
      body: JSON.stringify(commonParams(options)),
    });
  },
  // 查询页面资源列表
  getPageSourceList: (options: { appId: string, roleId: string }): Promise<CommonResponseType> => {
    return Drequest(`${Constant.API.MDM}page/treeWithAuth`, {
      method: 'POST',
      body: JSON.stringify(commonParams(options)),
    });
  },
  // 查询选中角色的资源列表
  getChosedSourceList: (options: { appId: string, roleId: string | number }): Promise<CommonResponseType> => {
    return Drequest(`${Constant.API.MDM}appMenu/queryByRole`, {
      method: 'POST',
      body: JSON.stringify(commonParams(options)),
    });
  },
  // 保存资源权限
  saveSource: (options: SaveParamsType): Promise<CommonResponseType> => {
    return Drequest(`${Constant.API.MDM}appMenu/roleAuth`, {
      method: 'POST',
      body: JSON.stringify(commonParams(options)),
    });
  },
  // 保存资源权限
  savePageSource: (options: SavePageParamsType): Promise<CommonResponseType> => {
    return Drequest(`${Constant.API.MDM}page/saveAuth`, {
      method: 'POST',
      body: JSON.stringify(commonParams(options)),
    });
  },
  // 新增权限菜单
  addAuthBtn: (options: ActionAuthType): Promise<CommonResponseType> => {
    return Drequest(`${Constant.API.MDM}appMenu/saveMenuAuthOpt`, {
      method: 'POST',
      body: JSON.stringify(commonParams(options)),
    });
  },
  // 删除权限菜单
  deleteAuthBtn: (options: ActionAuthType): Promise<CommonResponseType> => {
    return Drequest(`${Constant.API.MDM}appMenu/deleteMenuAuthOpt`, {
      method: 'POST',
      body: JSON.stringify(commonParams(options)),
    });
  },
}

export default authApi
