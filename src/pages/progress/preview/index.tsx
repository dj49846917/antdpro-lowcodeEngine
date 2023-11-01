import { ProgressDetailType } from '@/types/common';
import { getUrlParms } from '@/utils/utils';

import { useLayoutEffect, useState } from 'react';
import progressApi from '@/services/custom/appInfo/progress';
import ProgressPreview from '@/components/ProgressPreview';
import { Constant } from '@/constant';

export default function Preview() {
  const [loading, setLoading] = useState(false) // 加载状态
  const [dataSource, setDataSource] = useState("")

  useLayoutEffect(() => {
    const id: string = getUrlParms("id")
    init(id)
  }, [])

  // 获取列表
  const init = async (id: string) => {
    const params: ProgressDetailType = {
      data: Number(id),
      operator: localStorage.getItem(Constant.USER_INFO_STORAGE) as string,
      "source": "PC",
      "traceId": "",
      "version": "1"
    }
    setLoading(true)
    const result = await progressApi.getListDetail(params)
    setLoading(false)
    if (result && result.data) {
      setDataSource(result.data.wfFileVo.fileContent)
    }
  }

  return (
    <ProgressPreview
      loading={loading}
      fileContent={dataSource}
      onClick={(e: any) => {

      }}
    />
    // <Spin spinning={loading}>
    //   <div id='canvas' style={{ height: "100vh" }}></div>
    // </Spin>
  )
}
