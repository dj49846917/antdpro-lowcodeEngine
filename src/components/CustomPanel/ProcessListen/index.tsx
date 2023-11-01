import { ActionType, ProgressModal } from '@/context/progress'
import { ExecuteListeningType, ExecuteParamsItemType, ListenDicType } from '@/pages/progress/type'
import { FormInstance, Input } from 'antd'
import { useContext } from 'react'
import LcIcon from '../../LcIcon'
import styles from './index.less'

interface Props {
  form: FormInstance<any>,
  dicList: ListenDicType
}

function ProcessListen(props: Props) {
  const { state, dispatch } = useContext(ProgressModal)
  const addListen = () => {
    const arr = JSON.parse(JSON.stringify(state.executeListeningList)) as ExecuteListeningType[]
    const obj: ExecuteListeningType = {
      primary_key: Date.now(),
      executeEventType: props.dicList.executeEventTypeArr[0].constantValue,
      executeListeningType: props.dicList.executeListeningTypeArr[0].constantValue,
      executeContent: "",
      executeParam: [],
      active: arr.length === 0 ? true : false
    }
    arr.push(obj)
    dispatch({
      type: ActionType.changeExecuteListeningList, payload: { ...state, executeListeningList: arr }
    })
    dispatch({
      type: ActionType.changeSelectListeningParams, payload: { ...state, selectListeningParamsRow: {} as ExecuteParamsItemType }
    })
    if (arr.length === 1) {
      dispatch({
        type: ActionType.changeSelectListening, payload: { ...state, selectListeningRow: arr[0] }
      })
      props.form.setFieldsValue({
        ...arr[0]
      })
    }
    props.form.setFieldsValue({ executeListening: JSON.stringify(arr) })
  }

  const deleteItem = () => {
    const list = state.executeListeningList.filter(item => item.primary_key !== state.selectListeningRow.primary_key)
    dispatch({
      type: ActionType.changeExecuteListeningList, payload: { ...state, executeListeningList: list }
    })
    dispatch({
      type: ActionType.changeSelectListening, payload: { ...state, selectListeningRow: {} as ExecuteListeningType }
    })
    dispatch({
      type: ActionType.changeSelectListeningParams, payload: { ...state, selectListeningParamsRow: {} as ExecuteParamsItemType }
    })
    props.form.setFieldsValue({ executeListening: JSON.stringify(list) })
  }

  const selectItem = (row: ExecuteListeningType) => {
    props.form.setFieldsValue({
      ...row
    })
    const arr = state.executeListeningList.map(item => {
      if (item.primary_key === row.primary_key) {
        return {
          ...item,
          active: true
        }
      }
      return {
        ...item,
        active: false
      }
    })
    dispatch({
      type: ActionType.changeExecuteListeningList, payload: { ...state, executeListeningList: arr }
    })
    let selectRow = JSON.parse(JSON.stringify(row)) as ExecuteListeningType;
    selectRow.active = true
    if (row.executeParam.length > 0) {
      selectRow.executeParam = selectRow.executeParam.map((item, index) => {
        if (index === 0) {
          return {
            ...item,
            active: true
          }
        }
        return {
          ...item,
          active: false
        }
      })
    }
    props.form.setFieldsValue({
      ...selectRow.executeParam[0]
    })
    dispatch({
      type: ActionType.changeSelectListening, payload: { ...state, selectListeningRow: selectRow }
    })
    dispatch({
      type: ActionType.changeSelectListeningParams, payload: { ...state, selectListeningParamsRow: selectRow.executeParam[0] }
    })
    props.form.setFieldsValue({ executeListening: JSON.stringify(arr) })
  }
  return (
    <div className={styles.process}>
      <div className={styles.btnGroup}>
        <LcIcon type="icon-a-X2x" name="btn" onClick={() => deleteItem()} />
        <LcIcon type="icon-a-2x" name="btn" onClick={() => addListen()} />
      </div>
      <ul className={styles.processList}>
        {
          state.executeListeningList.length > 0 && state.executeListeningList.map(item => (
            <li key={item.primary_key} className={item.active ? styles.active : null} onClick={() => selectItem(item)}>{`${item.executeEventType}: ${item.executeListeningType}`}</li>
          ))
        }
      </ul>
      <Input style={{ display: 'none' }} />
    </div>
  )
}

export default ProcessListen