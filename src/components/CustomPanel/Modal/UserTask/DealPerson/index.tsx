import { Constant } from "@/constant";
import { ActionType, ProgressModal } from "@/context/progress";
import { ActiveTreeType, DealPersonType, UserTaskTreeRowType } from "@/pages/progress/type";
import { apiRequest } from "@/services/custom/appInfo/apiService";
import progressApi from "@/services/custom/appInfo/progress";
import { CheckInfo, CommonParamType } from "@/types/common";
import { indexOfObjectArray, parseTreeData, uniqueFunc } from "@/utils/utils";
import { CloseOutlined } from "@ant-design/icons";
import { Card, Modal, Tabs } from "antd";
import Tree from "antd/lib/tree";
import React, { useContext, useEffect, useState } from "react";
import { useIntl } from "umi";
import '../index.less';

const { TabPane } = Tabs;
/**
 *  
 * @param arr           整合的数组对象  
 * @param dataSource    部门、角色、人员选中的数据源
 */
function commonPushArr(arr: UserTaskTreeRowType[], dataSource: UserTaskTreeRowType[]) {
  if (dataSource.length > 0) {
    dataSource.forEach(item => {
      arr.push(item)
    })
  }
}
function DealPerson(props: DealPersonType) {
  const intl = useIntl()
  const [activeTab, setActiveTab] = useState(Constant.UserTaskDealPersonTab[0].name)
  // const [checkedAllList, setCheckedAllList] = useState<UserTaskTreeRowType[]>([])
  const [selectedKeysPerson, setSelectedKeysPerson] = useState<React.Key[]>([]);   // 人员的部门选中的值
  const [selectedKeysPos, setSelectedKeyPos] = useState<React.Key[]>([]);   // 人员的部门选中的值
  const { state, dispatch } = useContext(ProgressModal)

  useEffect(() => {
    const arr: UserTaskTreeRowType[] = []
    commonPushArr(arr, state.checkedDepartInfo.checkedRowInfo)
    commonPushArr(arr, state.checkedAuthInfo.checkedRowInfo)
    commonPushArr(arr, state.checkedPersonInfo.checkedRowInfo)
    // commonPushArr(arr, state.checkedPosInfo.checkedRowInfo)
    const newArr = uniqueFunc(arr, "key")
    let newArr2: UserTaskTreeRowType[] = []
    if (newArr.length > 0) {
      newArr2 = newArr.map((item: UserTaskTreeRowType) => {
        const splitArr = `${item.activePane}:${item.title}`.split(':')
        return {
          ...item,
          title: `${splitArr[0]}:${splitArr[splitArr.length - 1]}`
        }
      })
    }
    dispatch({ type: ActionType.changeCheckedAllList, payload: { ...state, checkedAllList: newArr2 } })
    // }, [state.checkedDepartInfo.checkedKeys, state.checkedAuthInfo.checkedKeys, state.checkedPersonInfo.checkedKeys, state.checkedPosInfo.checkedKeys])
  }, [state.checkedDepartInfo.checkedKeys, state.checkedAuthInfo.checkedKeys, state.checkedPersonInfo.checkedKeys])

  // 切换tab
  const changeTabs = (key: string) => {
    setActiveTab(key)
  }
  // 封装复选框选中的值
  const getcheckedRowInfo = (dataSource: UserTaskTreeRowType[], event: CheckInfo) => {
    const arr = dataSource
    if (arr.length === 0) {
      arr.push({
        key: event.node.key,
        title: `${activeTab}: ${event.node.title}`,
        activePane: activeTab
      })
    } else {
      arr.forEach((item, index) => {
        if (item.key === event.node.key) {
          if (!event.checked) {
            arr.splice(index, 1)
          }
        } else {
          // 判断event.node.key是否在arr中存在
          const result = indexOfObjectArray(arr, event.node.key, 'key')
          if (!result) {
            if (event.checked) {
              arr.push({
                key: event.node.key,
                title: `${activeTab}: ${event.node.title}`,
                activePane: activeTab
              })
            }
          }
        }
      })
    }
    return arr
  }

  /**
   * 
   * @param rowInfo                checked列的信息
   * @param event                  checked的事件信息
   * @param setDataName            重新赋值的函数名称(部门setCheckedDepartInfo、角色、人员、岗位)
   * @param checkedKeysValue       checked的key的数组值 
   */
  const commonChecked = (rowInfo: UserTaskTreeRowType[], event: CheckInfo, setDataName: ActionType, checkedKeysValue: ActiveTreeType, keyWord: string) => {
    const result = getcheckedRowInfo(rowInfo, event)
    dispatch({
      type: setDataName,
      payload: {
        ...state,
        [keyWord]: {
          checkedKeys: checkedKeysValue,
          checkedRowInfo: result
        }
      }
    })
  }
  // 复选框选中
  const onCheck = (type: string, checkedKeysValue: ActiveTreeType, event: CheckInfo) => {
    switch (type) {
      case Constant.UserTaskDealPersonTab[0].name:
        commonChecked(state.checkedDepartInfo.checkedRowInfo, event, ActionType.changeCheckedDepartmentList, checkedKeysValue, 'checkedDepartInfo')
        break;
      case Constant.UserTaskDealPersonTab[1].name:
        commonChecked(state.checkedAuthInfo.checkedRowInfo, event, ActionType.changeCheckedAuthInfo, checkedKeysValue, 'checkedAuthInfo')
        break;
      case Constant.UserTaskDealPersonTab[2].name:
        commonChecked(state.checkedPersonInfo.checkedRowInfo, event, ActionType.changeCheckedPersonInfo, checkedKeysValue, 'checkedPersonInfo')
        break;
      default:
        commonChecked(state.checkedDepartInfo.checkedRowInfo, event, ActionType.changeCheckedDepartmentList, checkedKeysValue, 'checkedDepartInfo')
        // commonChecked(state.checkedPosInfo.checkedRowInfo, event, ActionType.changeCheckedPosInfo, checkedKeysValue, 'checkedPosInfo')
        break;
    }
  };
  // 部门select选中
  const onSelect = async (selectedKeysValue: React.Key[], type: string) => {
    if (type === Constant.UserTaskDealPersonTab[2].name) { // 人员
      setSelectedKeysPerson(selectedKeysValue)
      const params = {
        // organizationIdList: ["10001"]
        organizationIdList: selectedKeysValue
      }
      let result;
      if (state.dealApiInfo.authType === 1) {
        result = await apiRequest(state.dealApiInfo.queryOrgUserApi, params)
      } else {
        result = await progressApi.getUserTaskPersonByDepartment(params)
      }
      if (result && result.success) {
        if (result.data && result.data.length > 0) {
          const parseData = parseTreeData(result.data, {
            key: 'userId',
            title: 'fullName'
          })
          dispatch({
            type: ActionType.changeUserTaskPersonList,
            payload: { ...state, personList: parseData }
          })
        } else {
          dispatch({
            type: ActionType.changeUserTaskPersonList,
            payload: { ...state, personList: [] }
          })
        }
      }
    }
    // if (type === Constant.UserTaskDealPersonTab[3].name) { // 岗位
    //   setSelectedKeyPos(selectedKeysValue)
    //   const params = {
    //     organizationId: selectedKeysValue[0]
    //   }
    //   let result;
    //   if (state.dealApiInfo.authType === 1) {
    //     result = await apiRequest(state.dealApiInfo.queryOrgPosApi, params)
    //   } else {
    //     result = await progressApi.getUserTaskPosByDepartment(params)
    //   }
    //   console.log("result2211", result)
    //   if (result && result.success) {
    //     if (result.data && result.data.length > 0) {
    //       const parseData = parseTreeData(result.data, {
    //         key: 'positionId',
    //         title: 'positionName'
    //       })
    //       dispatch({
    //         type: ActionType.changeUserTaskPosList,
    //         payload: { ...state, posList: parseData }
    //       })
    //     } else {
    //       dispatch({
    //         type: ActionType.changeUserTaskPosList,
    //         payload: { ...state, posList: [] }
    //       })
    //     }
    //   }
    // }
  };

  const commonDeleteAction = (setData: ActionType, row: UserTaskTreeRowType, keyWord: string) => {
    dispatch({
      type: setData,
      payload: {
        ...state,
        [keyWord]: {
          checkedKeys: Array.isArray(state[keyWord].checkedKeys) ? state[keyWord].checkedKeys.filter((x: string | number) => x !== row.key) : state[keyWord].checkedKeys.checked.filter((x: string | number) => x !== row.key),
          checkedRowInfo: state[keyWord].checkedRowInfo.filter((x: { key: string | number; }) => x.key !== row.key)
        }
      }
    })
  }

  // 删除操作
  const deleteItem = (row: UserTaskTreeRowType) => {
    switch (row.activePane) {
      case Constant.UserTaskDealPersonTab[0].name: // 部门
        commonDeleteAction(ActionType.changeCheckedDepartmentList, row, 'checkedDepartInfo')
        break;
      case Constant.UserTaskDealPersonTab[1].name: // 角色
        commonDeleteAction(ActionType.changeCheckedAuthInfo, row, 'checkedAuthInfo')
        break;
      case Constant.UserTaskDealPersonTab[2].name: // 人员
        commonDeleteAction(ActionType.changeCheckedPersonInfo, row, 'checkedPersonInfo')
        break;
      default:
        // case Constant.UserTaskDealPersonTab[3].name: // 岗位
        //   commonDeleteAction(ActionType.changeCheckedPosInfo, row, 'checkedPosInfo')
        commonDeleteAction(ActionType.changeCheckedDepartmentList, row, 'checkedDepartInfo')
        break;
    }
  }

  const deleteAll = () => {
    dispatch({
      type: ActionType.changeCheckedDepartmentList,
      payload: { ...state, checkedDepartInfo: { checkedKeys: [], checkedRowInfo: [] } }
    })
    dispatch({
      type: ActionType.changeCheckedAuthInfo,
      payload: { ...state, checkedAuthInfo: { checkedKeys: [], checkedRowInfo: [] } }
    })
    dispatch({
      type: ActionType.changeCheckedPersonInfo,
      payload: { ...state, checkedPersonInfo: { checkedKeys: [], checkedRowInfo: [] } }
    })
    // dispatch({
    //   type: ActionType.changeCheckedPosInfo,
    //   payload: { ...state, checkedPosInfo: { checkedKeys: [], checkedRowInfo: [] } }
    // })
    dispatch({
      type: ActionType.changeCheckedAllList,
      payload: { ...state, checkedAllList: [] }
    })
  }

  // 点击取消
  const cancelModal = () => {
    const originInfo = JSON.parse(localStorage.getItem(Constant.USER_TASK_PERSON) as string)
    dispatch({
      type: ActionType.changeCheckedDepartmentList,
      payload: { ...state, checkedDepartInfo: originInfo.checkedDepartInfo }
    })
    dispatch({
      type: ActionType.changeCheckedAuthInfo,
      payload: { ...state, checkedAuthInfo: originInfo.checkedAuthInfo }
    })
    dispatch({
      type: ActionType.changeCheckedPersonInfo,
      payload: { ...state, checkedPersonInfo: originInfo.checkedPersonInfo }
    })
    // dispatch({
    //   type: ActionType.changeCheckedPosInfo,
    //   payload: { ...state, checkedPosInfo: originInfo.checkedPosInfo }
    // })
    dispatch({
      type: ActionType.changeCheckedAllList,
      payload: { ...state, checkedAllList: originInfo.checkedAllList }
    })
    props.closeModal(false)
  }

  const sureModal = () => {
    localStorage.setItem(Constant.USER_TASK_PERSON, JSON.stringify({
      checkedAllList: state.checkedAllList,
      checkedDepartInfo: state.checkedDepartInfo,
      checkedAuthInfo: state.checkedAuthInfo,
      checkedPersonInfo: state.checkedPersonInfo,
      // checkedPosInfo: state.checkedPosInfo
    }))
    props.closeModal(false)
  }

  return (
    <Modal
      title={intl.formatMessage({ id: 'component.customPanel.deal' })}
      visible={props.visible}
      className="usertask-modal"
      onOk={sureModal}
      onCancel={cancelModal}
      okText={intl.formatMessage({ id: 'pages.ok', defaultMessage: '确认' })}
      cancelText={intl.formatMessage({ id: 'pages.cancel', defaultMessage: '取消' })}
    >
      <div className="main">
        <Tabs className="menu" onChange={changeTabs} type="card" activeKey={activeTab}>
          <TabPane tab={Constant.UserTaskDealPersonTab[0].name} key={Constant.UserTaskDealPersonTab[0].name}>
            <Tree
              defaultExpandAll
              checkable
              selectable={false}
              checkStrictly
              onCheck={(selected, e) => onCheck(Constant.UserTaskDealPersonTab[0].name, selected, e)}
              checkedKeys={state.checkedDepartInfo.checkedKeys}
              treeData={state.departmentList}
            />
          </TabPane>
          <TabPane tab={Constant.UserTaskDealPersonTab[1].name} key={Constant.UserTaskDealPersonTab[1].name}>
            <Tree
              checkable
              defaultExpandAll
              selectable={false}
              checkStrictly
              onCheck={(selected, e) => onCheck(Constant.UserTaskDealPersonTab[1].name, selected, e)}
              checkedKeys={state.checkedAuthInfo.checkedKeys}
              treeData={state.authList}
            />
          </TabPane>
          <TabPane className="person" tab={Constant.UserTaskDealPersonTab[2].name} key={Constant.UserTaskDealPersonTab[2].name}>
            <Tree
              className="depart"
              checkStrictly
              defaultExpandAll
              onSelect={(selectedKeysValue) => onSelect(selectedKeysValue, Constant.UserTaskDealPersonTab[2].name)}
              selectedKeys={selectedKeysPerson}
              treeData={state.departmentList}
            />
            <div className="right">
              {state.personList.length > 0 ? (
                <Tree
                  defaultExpandAll
                  selectable={false}
                  checkable
                  onCheck={(selected, e) => onCheck(Constant.UserTaskDealPersonTab[2].name, selected, e)}
                  checkedKeys={state.checkedPersonInfo.checkedKeys}
                  treeData={state.personList}
                />
              ) : (
                <div className="empty">暂无数据</div>
              )}
            </div>
          </TabPane>
          {/* <TabPane className="person" tab={Constant.UserTaskDealPersonTab[3].name} key={Constant.UserTaskDealPersonTab[3].name}>
            <Tree
              defaultExpandAll
              className="depart"
              onSelect={(selectedKeysValue) => onSelect(selectedKeysValue, Constant.UserTaskDealPersonTab[3].name)}
              selectedKeys={selectedKeysPos}
              treeData={state.departmentList}
            />
            <div className="right">
              {state.posList.length > 0 ? (
                <Tree
                  defaultExpandAll
                  selectable={false}
                  checkable
                  checkStrictly
                  onCheck={(selected, e) => onCheck(Constant.UserTaskDealPersonTab[3].name, selected, e)}
                  checkedKeys={state.checkedPosInfo.checkedKeys}
                  treeData={state.posList}
                />
              ) : (
                <div className="empty">暂无数据</div>
              )}
            </div>
          </TabPane> */}
        </Tabs>
        {/* <div className="right">333</div> */}
        <Card size="small" title="已选项" extra={<span onClick={deleteAll} className="header-exta">清空</span>} className="right">
          {
            state.checkedAllList.length > 0 ? (
              <div className="choose">
                {
                  state.checkedAllList.map(item => (
                    <div className="choose-item" key={item.key}>
                      <span>{item.title}</span>
                      <CloseOutlined className="icon" onClick={() => deleteItem(item)} />
                    </div>
                  ))
                }
              </div>
            ) : <div className="empty">暂无数据</div>
          }
        </Card>
      </div>
    </Modal>
  )
}

export default DealPerson