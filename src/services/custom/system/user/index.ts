import { Constant } from "@/constant";
import { ListParamsType } from "@/pages/appinfo/page/type";
import { AddAndEditUserType, EditAndResetPasswordType, TableFormData } from "@/pages/system/user/type";
import { CommonResponseType } from "@/types/common";
import { Drequest } from "@/utils/request";
import { commonParams, commonParams2 } from "@/utils/utils";

const userApi = {
  // 获取列表
  getList: (options: ListParamsType<TableFormData>): Promise<CommonResponseType> => {
    return Drequest(`${Constant.API.LC_AUTH}user/page`, {
      method: 'POST',
      body: JSON.stringify(options),
    });
  },
  // 新增或编辑用户
  addAndEditUser: (options: AddAndEditUserType): Promise<CommonResponseType> => {
    return Drequest(`${Constant.API.LC_AUTH}user/save`, {
      method: 'POST',
      body: JSON.stringify(commonParams(options)),
    });
  },
  // 新增或编辑用户
  deleteUser: (options: string): Promise<CommonResponseType> => {
    return Drequest(`${Constant.API.LC_AUTH}user/delete`, {
      method: 'POST',
      body: JSON.stringify(commonParams2(options)),
    });
  },
  // 重置密码
  resetPsd: (options: EditAndResetPasswordType): Promise<CommonResponseType> => {
    return Drequest(`${Constant.API.LC_AUTH}user/revertPwd`, {
      method: 'POST',
      body: JSON.stringify(commonParams(options)),
    });
  },
  // 修改密码
  editPsd: (options: EditAndResetPasswordType): Promise<CommonResponseType> => {
    return Drequest(`${Constant.API.LC_AUTH}user/changePwd`, {
      method: 'POST',
      body: JSON.stringify(commonParams(options)),
    });
  },
}

export default userApi