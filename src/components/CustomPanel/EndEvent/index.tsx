import { ActionType, ProgressModal } from '@/context/progress';
import { DicType } from '@/types/common';
import { Collapse, Form, FormInstance, Input, Select } from 'antd'
import { useContext, useEffect, useState } from 'react';
import { useIntl } from 'umi'
import styles from '../index.less'
import { filterDicList } from '@/utils/utils'
import BaseInfo from '../BaseInfo';
import SameForm from '../BaseInfo/SameForm';
import ExecuteListening from '../ProcessListen/ExecuteListening';
import StatusPreview from '../BaseInfo/StatusPreview';
const { Option } = Select;
const { Panel } = Collapse;
type IProps = {
  eventType: string,
  closeSettingFieldsModal: (e: boolean) => void,
  changeProgressForm?: (e: string) => void,
  form: FormInstance<any>,
  executeForm: FormInstance<any>,
}

function EndEvent(props: IProps) {
  const { state, dispatch } = useContext(ProgressModal)
  const intl = useIntl()
  const [typeList, setTypeList] = useState<DicType[]>([])
  useEffect(() => {
    if (state.dicList.length > 0) {
      setTypeList(filterDicList(state.dicList, "callback_type"))
    }
  }, [state.dicList])

  const changeCallbackKey = (val: string) => {
    dispatch({ type: ActionType.changeCallbackType, payload: { ...state, activeCallbackKey: val } })
  }

  return (
    <Collapse defaultActiveKey={['1', '2', '3', '4', '5']} className={styles.list}>
      <Panel header={intl.formatMessage({ id: 'component.customPanel.info', defaultMessage: '节点信息' })} key="1">
        <BaseInfo eventType={props.eventType} />
      </Panel>
      <Panel header={intl.formatMessage({ id: 'component.customPanel.progress' })} key="2">
        <SameForm
          eventType={props.eventType}
          closeSettingFieldsModal={(e) => props.closeSettingFieldsModal(e)}
        />
      </Panel>
      <Panel header={intl.formatMessage({ id: 'component.customPanel.status' })} key="5">
        <StatusPreview eventType={props.eventType} />
      </Panel>
      <Panel header={intl.formatMessage({ id: 'component.customPanel.callback' })} key="3">
        <div className={styles.list_item}>
          <div className={styles.list_item_content}>
            <Form.Item name="dataSourceType" label={intl.formatMessage({ id: 'component.customPanel.callback.type' })}>
              <Select onChange={changeCallbackKey} placeholder={intl.formatMessage({ id: 'component.customPanel.callback.type.placeholder' })}>
                {typeList.length > 0 && typeList.map(item => (
                  <Option key={item.id} label={item.constantKey} value={item.constantValue}>{item.constantKey}</Option>
                ))}
              </Select>
            </Form.Item>
            {
              state.activeCallbackKey === 'api' ? (
                <Form.Item name="dataSourceUrl" label={intl.formatMessage({ id: 'component.customPanel.callback.url' })} rules={[{ required: true }]}>
                  <Input placeholder={intl.formatMessage({ id: 'component.customPanel.callback.url.placeholder' })} />
                </Form.Item>
              ) : null
            }
            {
              state.activeCallbackKey === "datasource" ? (
                <Form.Item name="dateSourceId" label={intl.formatMessage({ id: 'component.customPanel.callback.type' })} rules={[{ required: true }]}>
                  <Select placeholder={intl.formatMessage({ id: 'component.customPanel.callback.type.placeholder' })}>
                    {state.sourceList.length > 0 && state.sourceList.map(item => (
                      <Option key={item.datasourceId} value={item.datasourceId}>{item.datasourceName}</Option>
                    ))}
                  </Select>
                </Form.Item>
              ) : null
            }
          </div>
        </div>
      </Panel>
      <Panel header={intl.formatMessage({ id: 'component.customPanel.executeListening' })} key="4">
        <ExecuteListening
          form={props.form}
          executeForm={props.executeForm}
        />
      </Panel>
    </Collapse>
  )
}

export default EndEvent