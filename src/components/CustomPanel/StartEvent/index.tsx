import { ProgressModal } from '@/context/progress';
import { Collapse, FormInstance } from 'antd'
import { useContext } from 'react';
import { useIntl } from 'umi'
import BaseInfo from '../BaseInfo';
import ExecuteListening from '../ProcessListen/ExecuteListening';
import SameForm from '../BaseInfo/SameForm';
import styles from '../index.less'
import StatusPreview from '../BaseInfo/StatusPreview';

const { Panel } = Collapse;
type Iprops = {
  eventType: string,
  closeSettingFieldsModal: (e: boolean) => void,
  form: FormInstance<any>,
  executeForm: FormInstance<any>,
}

function StartEvent(props: Iprops) {
  const intl = useIntl()

  return (
    <Collapse defaultActiveKey={['1', '2', '3', '4']} className={styles.list}>
      <Panel header={intl.formatMessage({ id: 'component.customPanel.info' })} key="1">
        <BaseInfo eventType={props.eventType} />
      </Panel>
      <Panel header={intl.formatMessage({ id: 'component.customPanel.progress' })} key="2">
        <SameForm eventType={props.eventType} closeSettingFieldsModal={(e) => props.closeSettingFieldsModal(e)} />
      </Panel>
      <Panel header={intl.formatMessage({ id: 'component.customPanel.status' })} key="3">
        <StatusPreview eventType={props.eventType} />
      </Panel>
      <Panel header={intl.formatMessage({ id: 'component.customPanel.executeListening' })} key="4">
        <ExecuteListening
          executeForm={props.executeForm}
          form={props.form}
        />
      </Panel>
    </Collapse>
  )
}

export default StartEvent