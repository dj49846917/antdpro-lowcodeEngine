import { ActionType, ProgressModal } from '@/context/progress';
import { EventType } from '@/pages/progress/type';
import { DicType } from '@/types/common';
import { filterDicList } from '@/utils/utils';
import { Form, Select, Switch } from 'antd'
import { memo, useContext, useEffect, useState } from 'react';
import { useIntl } from 'umi'
import styles from '../index.less'

type Iprops = {
  eventType: string
}

function StatusPreview(props: Iprops) {
  const { state, dispatch } = useContext(ProgressModal)
  const [callbackStatusArr, setCallbackStatusArr] = useState<DicType[]>([])
  const intl = useIntl()

  useEffect(() => {
    if (state.dicList.length > 0) {
      setCallbackStatusArr(filterDicList(state.dicList, "wf_status"))
    }
  }, [state.dicList])

  const renderStatus = () => {
    console.log("callbackStatusArr", callbackStatusArr);
    if (state.isStatus) {
      if (props.eventType === EventType.USERTASK) {
        return (
          <>
            <Form.Item name="passStatus" label={intl.formatMessage({ id: 'component.customPanel.status.passStatus' })}>
              <Select options={callbackStatusArr} allowClear placeholder={intl.formatMessage({ id: 'component.customPanel.status.passStatus.placeholder' })} />
            </Form.Item>
            <Form.Item name="rejectStatus" label={intl.formatMessage({ id: 'component.customPanel.status.rejectStatus' })}>
              <Select options={callbackStatusArr} allowClear placeholder={intl.formatMessage({ id: 'component.customPanel.status.rejectStatus.placeholder' })} />
            </Form.Item>
          </>
        )
      }
      return (
        <Form.Item name="callbackStatus" label={intl.formatMessage({ id: 'component.customPanel.status.callbackStatus' })}>
          <Select options={callbackStatusArr} allowClear placeholder={intl.formatMessage({ id: 'component.customPanel.status.callbackStatus.placeholder' })} />
        </Form.Item>
      )
    }
    return null
  }

  return (
    <div className={styles.list_item}>
      <div className={styles.list_item_content}>
        <Form.Item valuePropName="checked" name="callbackFlag" label={intl.formatMessage({ id: 'component.customPanel.status.callbackFlag' })}>
          <Switch onChange={(e) => dispatch({ type: ActionType.changeIsStatus, payload: { ...state, isStatus: e } })} />
        </Form.Item>
        {renderStatus()}
      </div>
    </div>
  )
}

export default memo(StatusPreview)