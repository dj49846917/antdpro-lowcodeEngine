import { Constant } from "@/constant";
import { ListParamsType } from "@/pages/appinfo/page/type";
import { OrgList, SaveParams } from "@/pages/system/organization/type";
import { CommonResponseType } from "@/types/common";
import { Drequest } from "@/utils/request";
import { commonParams, commonParams2 } from "@/utils/utils";

const orgApi = {
  // 获取列表
  getList: (options: ListParamsType<OrgList>): Promise<CommonResponseType> => {
    return Drequest(`${Constant.API.LC_AUTH}organization/treePage`, {
      method: 'POST',
      body: JSON.stringify(options),
    });
  },
  // 获取租户列表
  getTenantList: (): Promise<CommonResponseType> => {
    return Drequest(`${Constant.API.LC_AUTH}tenant/list`, {
      method: 'POST',
      body: JSON.stringify(commonParams({})),
      // body: JSON.stringify(options),
    });
  },
  // 新增、编辑保存
  addAndEditList: (options: SaveParams): Promise<CommonResponseType> => {
    return Drequest(`${Constant.API.LC_AUTH}organization/save`, {
      method: 'POST',
      body: JSON.stringify(commonParams(options)),
    });
  },
  //获取列表详情
  getDetail: (options: string): Promise<CommonResponseType> => {
    return Drequest(`${Constant.API.LC_AUTH}organization/detail`, {
      method: 'POST',
      body: JSON.stringify(commonParams2(options)),
    });
  },
  //删除组织
  deleteOrgItem: (options: string): Promise<CommonResponseType> => {
    return Drequest(`${Constant.API.LC_AUTH}organization/delete`, {
      method: 'POST',
      body: JSON.stringify(commonParams2(options)),
    });
  },
}

export default orgApi