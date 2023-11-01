import RuleGroupModalList from "@/components/RuleGroupModalList"
import { Constant } from "@/constant"
import { ActionType, ProgressModal } from "@/context/progress"
import { ActiveTreeType, DealPersonType, UserTaskTreeInfoType, UserTaskTreeRowType } from "@/pages/progress/type"
import { CheckInfo } from "@/types/common"
import { Modal } from "antd"
import { useContext } from "react"
import { useIntl } from "umi"

function ProcessSetting(props: DealPersonType) {
  const intl = useIntl()
  const { state, dispatch } = useContext(ProgressModal)

  const checkRules = (checkedKeysValue: ActiveTreeType, event: CheckInfo) => {
    dispatch({
      type: ActionType.changeCheckedRule,
      payload: {
        ...state,
        checkedRuleInfo: {
          checkedKeys: checkedKeysValue,
          checkedRowInfo: event.checkedNodes as any
        }
      }
    })
  }

  const deleteItem = (row: UserTaskTreeRowType) => {
    dispatch({
      type: ActionType.changeCheckedRule,
      payload: {
        ...state,
        checkedRuleInfo: {
          checkedKeys: Array.isArray(state.checkedRuleInfo.checkedKeys) ? state.checkedRuleInfo.checkedKeys.filter((x: string | number) => x !== row.key) : state.checkedRuleInfo.checkedKeys.checked.filter((x: string | number) => x !== row.key),
          checkedRowInfo: state.checkedRuleInfo.checkedRowInfo.filter((x: { key: string | number; }) => x.key !== row.key)
        }
      }
    })
  }

  const moveItem = (row: UserTaskTreeRowType, type: "up" | "done") => { // 移动规则
    const arr: UserTaskTreeRowType[] = JSON.parse(JSON.stringify(state.checkedRuleInfo.checkedRowInfo))
    const arr2: ActiveTreeType = JSON.parse(JSON.stringify(state.checkedRuleInfo.checkedKeys))
    if (type === 'up') {
      arr.forEach((item: UserTaskTreeRowType, index: number) => {
        if (row.key === item.key) {
          let temp = arr[index - 1];
          arr[index - 1] = arr[index];
          arr[index] = temp;
        }
      })
      if (!Array.isArray(arr2)) {
        arr2.checked.forEach((item, index) => {
          if (row.key === item) {
            let temp = arr2.checked[index - 1];
            arr2.checked[index - 1] = arr2.checked[index];
            arr2.checked[index] = temp;
          }
        })
      }
    }
    if (type === 'done') {
      arr.forEach((item: UserTaskTreeRowType, index: number) => {
        if (row.key === item.key) {
          if (arr.length > index + 1) {
            let temp = arr[index + 1];
            arr[index + 1] = arr[index];
            arr[index] = temp;
          }
        }
      })
      if (!Array.isArray(arr2)) {
        arr2.checked.forEach((item, index) => {
          if (row.key === item) {
            if (arr2.checked.length > index + 1) {
              let temp = arr2.checked[index + 1];
              arr2.checked[index + 1] = arr2.checked[index];
              arr2.checked[index] = temp;
            }

          }
        })
      }
    }
    dispatch({
      type: ActionType.changeCheckedRule,
      payload: {
        ...state,
        checkedRuleInfo: {
          checkedKeys: arr2,
          checkedRowInfo: arr
        }
      }
    })
  }

  const deleteAll = () => {
    dispatch({
      type: ActionType.changeCheckedRule,
      payload: { ...state, checkedRuleInfo: { checkedKeys: [], checkedRowInfo: [] } }
    })
  }
  const sureModal = () => {
    localStorage.setItem(Constant.USER_TASK_RULE, JSON.stringify(state.checkedRuleInfo))
    props.closeModal(false)
  }

  const cancelModal = () => {
    const originInfo: UserTaskTreeInfoType = JSON.parse(localStorage.getItem(Constant.USER_TASK_RULE) as string)
    dispatch({
      type: ActionType.changeCheckedRule,
      payload: { ...state, checkedRuleInfo: { checkedKeys: originInfo.checkedKeys, checkedRowInfo: originInfo.checkedRowInfo } }
    })
    props.closeModal(false)
  }
  return (
    <Modal
      title={intl.formatMessage({ id: 'component.customPanel.modal.rule.title', defaultMessage: '按规则设置' })}
      visible={props.visible}
      className="usertask-modal"
      onOk={sureModal}
      onCancel={cancelModal}
      okText={intl.formatMessage({ id: 'pages.ok', defaultMessage: '确认' })}
      cancelText={intl.formatMessage({ id: 'pages.cancel', defaultMessage: '取消' })}
    >
      <RuleGroupModalList
        checkRules={(checkedKeysValue, event) => checkRules(checkedKeysValue, event)}
        checkedRuleInfo={state.checkedRuleInfo}
        treeData={state.ruleList}
        deleteAll={() => deleteAll()}
        moveItem={(row: UserTaskTreeRowType, type: "up" | "done") => moveItem(row, type)}
        deleteItem={(row: UserTaskTreeRowType) => deleteItem(row)}
      />
    </Modal>
  )
}

export default ProcessSetting