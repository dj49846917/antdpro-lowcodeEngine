import { Constant } from "@/constant"
import { TreeDataNode } from "@/pages/progress/type"
import authApi from "@/services/custom/appInfo/auth"
import { CommonParamType } from "@/types/common"
import { getAppId, parseTreeData, treeToFlat } from "@/utils/utils"
import { Spin, Tree } from "antd"
import { useContext, useEffect, useState } from "react"
import { useIntl } from "umi"
import { ActionType, AuthModel } from "./context"
import './index.less'
import { SourceAllListType } from "./type"

type Props = {
  refreshFlag: number
}

export function parseTreeData3<T extends { children: T[], child: T[] }>(data: T[], obj: { key: string; title: string }): TreeDataNode[] {
  return data.map(menu => {
    let title = ""
    try {
      title = JSON.parse(menu[obj.title])[localStorage.getItem(Constant.LANG_STORAGE) as string]
    } catch (error) {
      title = menu[obj.title]
    }
    return {
      ...menu,
      key: menu[obj.key],
      value: menu[obj.key],
      title,
      children: (menu.children || menu.child) && parseTreeData3((menu.children || menu.child), obj)
    }
  })
}

function SourceAuth(props: Props) {
  const intl = useIntl()
  const { state, dispatch } = useContext(AuthModel)
  const [loading, setLoading] = useState(false)
  const [contentTitle, setContentTitle] = useState("")
  const [list, setList] = useState<SourceAllListType[]>([])
  const [parseList, setParseList] = useState<SourceAllListType[]>([])
  const [checkedKeys, setCheckedKeys] = useState<React.Key[]>([])
  const [authName, setAuthName] = useState<string[]>()

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
    const result = await authApi.getMenuSourceList(params);
    setLoading(false)
    if (result && result.success) {
      if (result.data.length > 0) {
        const parseData = parseTreeData3(result.data, {
          key: 'menuId',
          title: 'menuName'
        })
        setList(parseData as SourceAllListType[])
        getSaveParams(parseData)
        dispatch({ type: ActionType.changeSourceAllList, payload: { ...state, sourceAllList: parseData } })
      }
    }
  }

  const getSaveParams = (parseData: TreeDataNode[]) => {
    const obj = {}
    const flatArr = treeToFlat(JSON.parse(JSON.stringify(parseData)), []) as SourceAllListType[]
    setParseList(flatArr)
    const checkedArr: string[] = []
    flatArr.forEach((item: SourceAllListType) => {
      if (item.menuAuth) {
        setAuthName(item.menuAuth)
        checkedArr.push(item.key as string)
        obj[item.key as string] = item.menuAuth
      }
    })
    setCheckedKeys(checkedArr)
    dispatch({ type: ActionType.changeSaveParams, payload: { ...state, saveParams: obj } })
  }

  const onSelect = (selectedKeysValue: React.Key[], info: any) => {
    dispatch({ type: ActionType.changeSelectedKeysSource, payload: { ...state, selectedKeysSource: selectedKeysValue as string[] } })
    setContentTitle(info.node.title)
    initSourceList(selectedKeysValue[0] as string)
  };

  // 选中的列
  const checkedItem = (checkedKeysValue: React.Key[], info: CommonParamType) => {
    const checkedArr: string[] = []
    const obj = {}
    const newList = parseList.map(item => {
      return {
        ...item,
        menuAuth: null
      }
    })
    newList.forEach((item: CommonParamType) => {
      checkedKeysValue.forEach(it => {
        if (item.key === it) {
          item.menuAuth = authName || ["access"]
        }
      })
    })
    newList.forEach((item: CommonParamType) => {
      if (item.menuAuth) {
        checkedArr.push(item.key as string)
        obj[item.key as string] = item.menuAuth
      }
    })
    dispatch({ type: ActionType.changeSaveParams, payload: { ...state, saveParams: obj } })
    setCheckedKeys(checkedKeysValue)
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
          state.sourceAllList.length > 0 ? (
            <Tree
              checkable
              defaultExpandAll
              selectable={false}
              className='tree'
              treeData={list as any[]}
              onCheck={checkedItem}
              checkedKeys={checkedKeys}
            // titleRender={(nodeData) => treeNodeTitle(nodeData as SourceAllListType)}
            />
          ) : null
        }
      </div>
    </Spin>
  )
}

export default SourceAuth
