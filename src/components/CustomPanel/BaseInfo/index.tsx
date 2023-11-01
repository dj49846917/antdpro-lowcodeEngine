import { useIntl } from "umi";
import { Button, Form, Input } from "antd"
import styles from '../index.less';
import { EventType } from "@/pages/progress/type";
import { useContext } from "react";
import { ActionType, ProgressModal } from "@/context/progress";


type Iprops = {
  eventType: string
}

function BaseInfo({ eventType }: Iprops) {
  const intl = useIntl();
  const { state, dispatch } = useContext(ProgressModal)

  const openNodesName = () => {
    dispatch({ type: ActionType.changeNameVisible, payload: { ...state, nameVisible: true } })
  }

  return (
    <div className={styles.list_item}>
      <div className={styles.list_item_content}>
        <Form.Item name="id" label={intl.formatMessage({ id: 'component.customPanel.info.id', defaultMessage: '节点Id' })} rules={[{ required: true }]}>
          <Input placeholder={intl.formatMessage({ id: 'component.customPanel.info.id.placeholder', defaultMessage: '请输入节点Id' })} />
        </Form.Item>
        <Form.Item
          className="inlineItem"
          style={{ display: eventType !== EventType.SEQUENCEFLOW ? 'block' : 'none', marginTop: '12px' }}
          label={intl.formatMessage({ id: 'component.customPanel.info.name', defaultMessage: '节点名称' })}
          required
        // rules={[{ required: eventType !== EventType.SEQUENCEFLOW ? true : false, message: intl.formatMessage({ id: 'component.customPanel.info.name.placeholder' }) }]}
        >
          <Form.Item name="name" noStyle rules={[{ required: eventType !== EventType.SEQUENCEFLOW ? true : false, message: intl.formatMessage({ id: 'component.customPanel.info.name.placeholder' }) }]}>
            <Input placeholder={intl.formatMessage({ id: 'component.customPanel.info.name.placeholder' })} disabled />
          </Form.Item>
          <Button
            onClick={() => openNodesName()}
          >{intl.formatMessage({ id: 'app.settings.security.set' })}</Button>
        </Form.Item>
        <Form.Item
          style={{ display: 'none' }}
          name="nameKey"
          label={intl.formatMessage({ id: 'component.customPanel.info.name', defaultMessage: '节点名称' })}
        >
          <Input />
        </Form.Item>
      </div>
    </div>
  )
}

export default BaseInfo