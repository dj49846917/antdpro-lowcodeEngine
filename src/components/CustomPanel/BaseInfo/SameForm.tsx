import { ProgressModal } from '@/context/progress';
import { EventType } from '@/pages/progress/type';
import { Button, Form, Select } from 'antd'
import { useContext } from 'react';
import { useIntl } from 'umi'
import styles from '../index.less'

const { Option } = Select;
type Iprops = {
  eventType: string,
  closeSettingFieldsModal: (e: boolean) => void,
  changeProgressForm?: (e: string) => void
}

function SameForm(props: Iprops) {
  const { state } = useContext(ProgressModal)
  const intl = useIntl()

  return (
    <div className={styles.list_item}>
      <div className={styles.list_item_content}>
        <Form.Item name="progressForm" label={intl.formatMessage({ id: 'component.customPanel.progress.form', defaultMessage: '选择表单' })} rules={[{ required: true }]}>
          <Select
            showSearch
            optionFilterProp="pageName"
            onChange={(e) => { props.changeProgressForm && props.changeProgressForm(e) }}
            placeholder={intl.formatMessage({ id: 'component.customPanel.progress.form.placeholder', defaultMessage: '请选择表单' })}
            filterOption={(input, option) => (option?.children ?? '' as any).toLowerCase().includes(input.toLowerCase())}
          >
            {state.startFormList.length > 0 && state.startFormList.map(item => (
              <Option value={item.pageId} key={item.pageId} label={item.pageId}>{item.pageName}</Option>
            ))}
          </Select>
        </Form.Item>
        {
          props.eventType === EventType.USERTASK ? (
            <>
              <div className={styles.auth}>{intl.formatMessage({ id: 'component.customPanel.auth.field', defaultMessage: '字段操作权限' })}</div>
              <Button className={styles.authBtn} onClick={() => props.closeSettingFieldsModal(true)}>{intl.formatMessage({ id: 'component.customPanel.auth.field.btn', defaultMessage: '设置字段操作权限' })}</Button>
            </>
          ) : null
        }
      </div>
    </div>
  )
}

export default SameForm