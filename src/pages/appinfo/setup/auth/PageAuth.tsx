import { Constant } from "@/constant"
import { TreeDataNode } from "@/pages/progress/type"
import authApi from "@/services/custom/appInfo/auth"
import { getAppId, parseTreeData, parseTreeData2, treeToFlat } from "@/utils/utils"
import { Checkbox, Spin, Tree } from "antd"
import { CheckboxValueType } from "antd/lib/checkbox/Group"
import { useContext, useEffect, useState } from "react"
import { useIntl } from "umi"
import { ActionType, AuthModel } from "./context"
import './index.less'
import { PageAuthListType, SourceAllListType } from "./type"

type Props = {
  refreshFlag: number
}

const setPageAuthCheckedInfo = (data: PageAuthListType[], value: CheckboxValueType[], row: SourceAllListType): any[] => {
  return data.map(item => {
    return {
      ...item,
      pageAuth: (item.value === row.key) ? value : item.pageAuth,
      children: item.children && (item.value !== row.key) && setPageAuthCheckedInfo(item.children, value, row)
    }
  })
}

function PageAuth(props: Props) {
  const intl = useIntl()
  const { state, dispatch } = useContext(AuthModel)
  const [loading, setLoading] = useState(false)
  const [contentTitle, setContentTitle] = useState("")
  const [list, setList] = useState<PageAuthListType[]>([])

  useEffect(() => {
    initSourceAuthList()
  }, [props.refreshFlag])

  // 当点击页权限时的初始化接口


  // 查询资源角色列表
  const initSourceAuthList = async () => {
    const params = {
      appId: getAppId()
    }
    setLoading(true)
    const result = await authApi.getSourceAuthList(params)
    setLoading(false)
    if (result && result.success) {
      if (result.data.length > 0) {
        const parseData = parseTreeData(result.data, {
          key: 'roleId',
          title: 'chName'
        })
        if (state.selectedKeysSource.length > 0) {
          parseData.forEach(item => {
            if (item.key === state.selectedKeysSource[0]) {
              setContentTitle(item.title as string)
              dispatch({ type: ActionType.changeSelectedKeysSource, payload: { ...state, selectedKeysSource: [item.key as string] } })
              initSourceList(item.key as string)
            }
          })
        } else {
          setContentTitle(parseData[0].title as string)
          dispatch({ type: ActionType.changeSourceAuthList, payload: { ...state, sourceAuthList: parseData } })
          dispatch({ type: ActionType.changeSelectedKeysSource, payload: { ...state, selectedKeysSource: [parseData[0].key as string] } })
          initSourceList(parseData[0].key as string)
        }
      }
    }
  }

  const initSourceList = async (roleId: string) => {
    const params = {
      appId: getAppId(),
      roleId,
    }
    setLoading(true)
    const result = await authApi.getPageSourceList(params)
    setLoading(false)
    if (result && result.success) {
      if (result.data.length > 0) {
        const parseData = parseTreeData2(result.data, {
          key: 'value',
          title: 'label',
          pageAuth: 'pageAuth',
          pageAuthOption: 'pageAuthOption'
        })
        setList(parseData as PageAuthListType[])
        getSaveParams(parseData)
        dispatch({ type: ActionType.changePageAuthList, payload: { ...state, pageAuthList: parseData } })
      }
    }
  }

  const getSaveParams = (parseData: TreeDataNode[]) => {
    const flatArr = treeToFlat(JSON.parse(JSON.stringify(parseData)), []) as SourceAllListType
    const obj = {}
    if (Array.isArray(flatArr) && flatArr.length > 0) {
      flatArr.forEach(item => {
        if (item.pageAuth) {
          obj[item.key] = item.pageAuth
        }
      })
    }
    dispatch({ type: ActionType.changePageAuthSaveParams, payload: { ...state, pageAuthSaveParams: obj } })
  }

  const onSelect = (selectedKeysValue: React.Key[], info: any) => {
    dispatch({ type: ActionType.changeSelectedKeysSource, payload: { ...state, selectedKeysSource: selectedKeysValue as string[] } })
    setContentTitle(info.node.title)
    initSourceList(selectedKeysValue[0] as string)
  };

  const changeListItem = (checkedValue: CheckboxValueType[], row: SourceAllListType) => {
    const result = setPageAuthCheckedInfo(list, checkedValue, row)
    setList(result)
    getSaveParams(result)
  }

  const treeNodeTitle = (data: SourceAllListType) => {
    return (
      <div className="d-tree-item">
        <div className="d-tree-item-title">
          {data.title}
          <div></div>
        </div>
        <div className="d-tree-item-action">
          <Checkbox.Group
            className="d-tree-item-group"
            options={data.pageAuthOption?.filter(x => x.type === 0)}
            // defaultValue={data.pageAuth}
            value={data.pageAuth}
            onChange={(e) => changeListItem(e, data)}
          >
          </Checkbox.Group>
        </div>
      </div>
    )
  }

  return (
    <Spin spinning={loading}>
      <div className='menu margin'>
        <div className='header'>{intl.formatMessage({ id: "pages.app.auth.menu.sourceAuth.title" })}</div>
        <Tree
          className='tree'
          onSelect={onSelect}
          selectedKeys={state.selectedKeysSource}
          treeData={state.sourceAuthList}
        />
      </div>
      <div className='menu-content'>
        <div className='header'>{contentTitle}</div>
        {
          state.pageAuthList.length > 0 ? (
            <Tree
              defaultExpandAll
              selectable={false}
              className='tree'
              treeData={list}
              titleRender={(nodeData) => treeNodeTitle(nodeData as SourceAllListType)}
            />
          ) : null
        }
      </div>
    </Spin>
  )
}

export default PageAuth
