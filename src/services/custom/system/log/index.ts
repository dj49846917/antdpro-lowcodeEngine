import { Constant } from "@/constant";
import { ListParamsType } from "@/pages/appinfo/page/type";
import { LogData } from "@/pages/system/log/type";
import { CommonResponseType } from "@/types/common";
import { Drequest } from "@/utils/request";

const logApi = {
  // 获取日志列表
  getList: (options: ListParamsType<LogData>): Promise<CommonResponseType> => {
    return Drequest(`${Constant.API.MDM}baseSysLog/find`, {
      method: 'POST',
      body: JSON.stringify(options),
    });
  },
}

export default logApi