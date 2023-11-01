import { Constant } from "@/constant";
import { Drequest } from "@/utils/request";
import { commonParams } from "@/utils/utils";

const dataDictApi = {
  query: (ids?: string[], parentIds?: string[]): Promise<API.Result<{ constantKey: string; constantValue: string; }[]>> => {
    return Drequest.post(`${Constant.API.WORKFLOW}constant/find`, {
      data: {
        ...commonParams(),
        "data": {
          "constantKey": ids,
          "parentId": parentIds
        },
      }
    })
  }
}

export default dataDictApi;
