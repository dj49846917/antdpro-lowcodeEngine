import { ActionType, ProgressModal } from '@/context/progress'
import { ExecuteListeningType, ExecuteParamsItemType, ListenDicType } from '@/pages/progress/type'
import { filterDicList } from '@/utils/utils'
import { Button, Form, FormInstance, Input, Select } from 'antd'
import { useContext, useEffect, useState } from 'react'
import { useIntl } from 'umi'
import styles from '../index.less'
import ProcessListen from '.'
import ExecuteParams from './ExecuteParams'
import { executeChangeListenRow } from '@/pages/progress/editor/common'

type Props = {
  form: FormInstance<any>,
  executeForm: FormInstance<any>,
}

function ExecuteListening(props: Props) {
  const intl = useIntl()
  const { state, dispatch } = useContext(ProgressModal)
  const { dicList } = state
  const [listeningDicType, setListeningDicType] = useState<ListenDicType>({
    executeEventTypeArr: [],
    executeListeningTypeArr: [],
    executeParamsTypeArr: [],
    executeScriptTypeArr: []
  })
  // const [executeListeningType, setExecuteListeningType] = useState("")

  useEffect(() => {
    if (state.dicList.length > 0) {
      setListeningDicType({
        executeEventTypeArr: filterDicList(dicList, "task_event_type"),
        executeListeningTypeArr: filterDicList(dicList, "execute_listening_type"),
        executeParamsTypeArr: filterDicList(dicList, "execute_params_type"),
        executeScriptTypeArr: filterDicList(dicList, "script_type"),
      })
    }
  }, [state.dicList])

  const changeListeningRow = (e: string, key: string) => {
    controllFields(e, key)
    if (key === "executeListeningType") {
      dispatch({ type: ActionType.changeExecuteListeningType, payload: { ...state, executeListeningType: e } })
    }
    executeChangeListenRow(e, key, state, dispatch, props)
  }

  const changeListeningParamsRow = (e: string, key: string) => {
    controllFields(e, key)
    const paramsRow = JSON.parse(JSON.stringify(state.selectListeningParamsRow)) as ExecuteParamsItemType
    const row = JSON.parse(JSON.stringify(state.selectListeningRow)) as ExecuteListeningType
    const dataSource = JSON.parse(JSON.stringify(state.executeListeningList)) as ExecuteListeningType[]
    if (paramsRow.primary_key) {
      paramsRow[key] = e
      const list = row.executeParam.map(item => {
        if (item.primary_key === paramsRow.primary_key) {
          return {
            ...paramsRow
          }
        }
        return item
      })
      row.executeParam = list
    }
    const newDataSource = dataSource.map(item => {
      if (item.primary_key === row.primary_key) {
        return {
          ...row
        }
      }
      return item
    })
    props.form.setFieldsValue({ executeListening: JSON.stringify(newDataSource) })
    dispatch({
      type: ActionType.changeSelectListening, payload: { ...state, selectListeningRow: row }
    })
    dispatch({
      type: ActionType.changeExecuteListeningList, payload: { ...state, executeListeningList: newDataSource }
    })
    dispatch({
      type: ActionType.changeSelectListeningParams, payload: { ...state, selectListeningParamsRow: paramsRow }
    })
  }

  const controllFields = (e: string, key: string) => {
    // 字段参数-类型
    if (key === 'executeParamsType') {
      props.form.setFieldsValue({
        executeParamsValue: ''
      })
    }
    // 执行监听-java类
    if (key === 'executeListeningType') {
      dispatch({ type: ActionType.changeExecuteListeningType, payload: { ...state, executeListeningType: e } })
      // setExecuteListeningType(e)
      props.form.setFieldsValue({
        executeContent: ''
      })
    }
  }

  // 根据监听类型展示不同的title
  const renderScriptTitle = () => {
    switch (state.executeListeningType) {
      case 'java':
        return intl.formatMessage({ id: 'component.customPanel.executeListening.content.java' })
      case 'expression':
        return intl.formatMessage({ id: 'component.customPanel.executeListening.content.expression' })
      case 'delegation_expression':
        return intl.formatMessage({ id: 'component.customPanel.executeListening.content.delegation_expression' })
      case 'script':
        return intl.formatMessage({ id: 'component.customPanel.executeListening.content.script' })
      default:
        return intl.formatMessage({ id: 'component.customPanel.executeListening.content.java' })
    }
  }
  return (
    <div className={styles.list_item}>
      <div className={styles.list_item_content}>
        <Form.Item className="form-items" name="executeListening" label={intl.formatMessage({ id: 'component.customPanel.executeListening' })}>
          <ProcessListen
            form={props.form}
            dicList={listeningDicType}
          />
        </Form.Item>
        {
          state.selectListeningRow.primary_key ? (
            <>
              <Form.Item name="executeEventType" label={intl.formatMessage({ id: 'component.customPanel.executeListening.eventType' })}>
                <Select onChange={(e) => changeListeningRow(e, 'executeEventType')} options={listeningDicType.executeEventTypeArr} optionLabelProp="label" placeholder={intl.formatMessage({ id: 'component.customPanel.executeListening.eventType.placeholder' })} />
              </Form.Item>
              <Form.Item name="executeListeningType" label={intl.formatMessage({ id: 'component.customPanel.executeListening.listeningType' })}>
                <Select onChange={(e) => changeListeningRow(e, 'executeListeningType')} options={listeningDicType.executeListeningTypeArr} optionLabelProp="label" placeholder={intl.formatMessage({ id: 'component.customPanel.executeListening.listeningType.placeholder' })} />
              </Form.Item>
              <Form.Item name="executeContent" label={renderScriptTitle()} rules={[{ required: true }]}>
                <Input onChange={(e) => changeListeningRow(e.target.value, 'executeContent')} />
              </Form.Item>
              {
                state.executeListeningType === 'script' ? (
                  <>
                    <Form.Item name="executeScrpitType" label={intl.formatMessage({ id: 'component.customPanel.executeListening.content.script.type' })}>
                      <Select onChange={(e) => changeListeningRow(e, 'executeScrpitType')} options={listeningDicType.executeScriptTypeArr} optionLabelProp="label" placeholder={intl.formatMessage({ id: 'component.customPanel.executeListening.content.script.type.placeholder' })} />
                    </Form.Item>
                    <Form.Item className="inlineItem" style={{ marginTop: '12px' }} label={intl.formatMessage({ id: 'component.customPanel.executeListening.content.script.content' })}>
                      <Form.Item name="executeScrpitContent" noStyle rules={[{ required: true, message: intl.formatMessage({ id: 'component.customPanel.executeListening.content.script.placeholder' }) }]}>
                        <Input.TextArea placeholder={intl.formatMessage({ id: 'component.customPanel.executeListening.content.script.placeholder' })} disabled />
                      </Form.Item>
                      <Button
                        onClick={() => {
                          props.executeForm.setFieldsValue({
                            executeScript: props.form.getFieldValue('executeScrpitContent')
                          })
                          dispatch({
                            type: ActionType.changeTextareaInfo, payload: {
                              ...state, textareaInfo: {
                                outFieldsName: 'executeScrpitContent',
                                modalFieldsName: 'executeScript',
                                visible: true
                              }
                            }
                          })
                        }}
                      >{intl.formatMessage({ id: 'app.settings.security.set' })}</Button>
                    </Form.Item>
                  </>
                ) : null
              }
              <Form.Item className="form-items" name="executeParam" label={intl.formatMessage({ id: 'component.customPanel.executeListening.param' })}>
                <ExecuteParams
                  form={props.form}
                />
              </Form.Item>
              {
                state.selectListeningParamsRow?.primary_key ? (
                  <>
                    <Form.Item name="executeParamsName" label={intl.formatMessage({ id: 'component.customPanel.executeListening.executeParamsName' })} rules={[{ required: true }]}>
                      <Input onChange={(e) => changeListeningParamsRow(e.target.value, 'executeParamsName')} placeholder={intl.formatMessage({ id: 'component.customPanel.executeListening.executeParamsName.placeholder' })} />
                    </Form.Item>
                    <Form.Item name="executeParamsType" label={intl.formatMessage({ id: 'component.customPanel.executeListening.executeParamsType' })}>
                      <Select onChange={(e) => changeListeningParamsRow(e, 'executeParamsType')} options={listeningDicType.executeParamsTypeArr} optionLabelProp="label" placeholder={intl.formatMessage({ id: 'component.customPanel.executeListening.executeParamsType.placeholder' })} />
                    </Form.Item>
                    <Form.Item name="executeParamsValue" label={intl.formatMessage({ id: 'component.customPanel.executeListening.executeParamsValue' })} rules={[{ required: true }]}>
                      <Input onChange={(e) => changeListeningParamsRow(e.target.value, 'executeParamsValue')} placeholder={intl.formatMessage({ id: 'component.customPanel.executeListening.executeParamsValue.placeholder' })} />
                    </Form.Item>
                  </>
                ) : null
              }
            </>
          ) : null
        }
      </div>
    </div>
  )
}

export default ExecuteListening