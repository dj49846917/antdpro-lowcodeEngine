import { Constant } from '@/constant';
import { AppListType, StatisticsProcessType } from '@/pages/dashboard/type';
import { CommonResponseType } from '@/types/common';
import { Drequest } from '@/utils/request';
import { commonParams } from '@/utils/utils';

const dashboardApi = {
  getListDetail: (options: AppListType): Promise<CommonResponseType> => {
    return Drequest(`${Constant.API.MDM}application/list`, {
      method: 'POST',
      body: JSON.stringify(commonParams(options)),
    });
  },
  statisticsProcess: (options: StatisticsProcessType): Promise<CommonResponseType> => {
    return Drequest(`${Constant.API.WORKFLOW}wf/number`, {
      method: 'POST',
      body: JSON.stringify(commonParams(options)),
    })
  }
}
export default dashboardApi