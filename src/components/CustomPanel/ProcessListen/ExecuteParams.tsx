import { ActionType, ProgressModal } from '@/context/progress'
import { ExecuteListeningType, ExecuteParamsItemType, ExecuteParamsType, ListenDicType } from '@/pages/progress/type'
import { FormInstance, Input } from 'antd'
import { useContext } from 'react'
import LcIcon from '../../LcIcon'
import styles from './index.less'

interface Props {
  form: FormInstance<any>
}

function ExecuteParams(props: Props) {
  const { state, dispatch } = useContext(ProgressModal)

  const addListen = () => {
    const arr = JSON.parse(JSON.stringify(state.executeListeningList)) as ExecuteListeningType[]
    const row = JSON.parse(JSON.stringify(state.selectListeningRow)) as ExecuteListeningType
    const obj: ExecuteParamsType = {
      active: row.executeParam.length === 0 ? true : false,
      primary_key: Date.now(),
      executeParamsName: '',
      executeParamsType: '',
      executeParamsValue: ''
    }
    row.executeParam.push(obj)
    const newList = arr.map(item => {
      if (item.primary_key === row.primary_key) {
        return row
      }
      return item
    })
    dispatch({
      type: ActionType.changeExecuteListeningList, payload: { ...state, executeListeningList: newList }
    })
    dispatch({
      type: ActionType.changeSelectListening, payload: { ...state, selectListeningRow: row }
    })
    if (row.executeParam.length === 1) {
      dispatch({
        type: ActionType.changeSelectListeningParams, payload: { ...state, selectListeningParamsRow: row.executeParam[0] }
      })
      props.form.setFieldsValue({
        ...row.executeParam[0]
      })
    }
    props.form.setFieldsValue({ executeListening: JSON.stringify(newList) })
  }

  const deleteItem = () => {
    const list = state.selectListeningRow.executeParam.filter(item => item.primary_key !== state.selectListeningParamsRow.primary_key)
    const row = JSON.parse(JSON.stringify(state.selectListeningRow)) as ExecuteListeningType
    row.executeParam = list
    const dataSource = state.executeListeningList.map(item => {
      if (item.primary_key === row.primary_key) {
        return row
      }
      return item
    })
    dispatch({
      type: ActionType.changeExecuteListeningList, payload: { ...state, executeListeningList: dataSource }
    })
    dispatch({
      type: ActionType.changeSelectListening, payload: { ...state, selectListeningRow: row }
    })
    dispatch({
      type: ActionType.changeSelectListeningParams, payload: { ...state, selectListeningParamsRow: {} as ExecuteParamsItemType }
    })
    props.form.setFieldsValue({ executeListening: JSON.stringify(dataSource) })
  }

  const selectItem = (row: ExecuteParamsType) => {
    row.active = true
    const newRow = JSON.parse(JSON.stringify(state.selectListeningRow)) as ExecuteListeningType
    props.form.setFieldsValue({
      ...row,
    })
    const arr = state.selectListeningRow.executeParam.map(item => {
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
    newRow.executeParam = arr
    const newList = state.executeListeningList.map(item => {
      if (item.primary_key === newRow.primary_key) {
        return newRow
      }
      return item
    })
    dispatch({
      type: ActionType.changeExecuteListeningList, payload: { ...state, executeListeningList: newList }
    })
    dispatch({
      type: ActionType.changeSelectListening, payload: { ...state, selectListeningRow: newRow }
    })
    dispatch({
      type: ActionType.changeSelectListeningParams, payload: { ...state, selectListeningParamsRow: row }
    })
  }
  return (
    <div className={styles.process}>
      <div className={styles.btnGroup}>
        <LcIcon type="icon-a-X2x" name="btn" onClick={() => deleteItem()} />
        <LcIcon type="icon-a-2x" name="btn" onClick={() => addListen()} />
      </div>
      <ul className={styles.processList}>
        {
          state.selectListeningRow.executeParam && state.selectListeningRow.executeParam.length > 0 && state.selectListeningRow.executeParam.map((item, index) => (
            <li key={item.primary_key} className={item.active ? styles.active : null} onClick={() => selectItem(item)}>{`${index}: ${item.executeParamsName}`}</li>
          ))
        }
      </ul>
      <Input style={{ display: 'none' }} />
    </div>
  )
}

export default ExecuteParams