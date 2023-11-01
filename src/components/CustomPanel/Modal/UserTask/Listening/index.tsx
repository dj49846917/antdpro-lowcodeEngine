import { ActionType, ProgressModal } from "@/context/progress"
import { executeChangeListenRow } from "@/pages/progress/editor/common"
import { Form, FormInstance, Input, Modal } from "antd"
import { useContext } from "react"
import { useIntl } from "umi"
import styles from './index.less'

type Props = {
  form: FormInstance<any>,
  executeForm: FormInstance<any>,
}

function ListeningModal(props: Props) {
  const intl = useIntl()
  const { state, dispatch } = useContext(ProgressModal)

  const sureModal = async () => {
    const result = await props.executeForm.validateFields()
    if (result) {
      props.form.setFieldsValue({
        [state.textareaInfo.outFieldsName]: result.executeScript
      })
      if (state.textareaInfo.outFieldsName === 'executeScrpitContent') {
        executeChangeListenRow(result.executeScript, 'executeScrpitContent', state, dispatch, props)
      }
    }
    dispatch({ type: ActionType.changeTextareaInfo, payload: { ...state, textareaInfo: { ...state.textareaInfo, visible: false } } })
  }

  const cancelModal = () => {
    dispatch({ type: ActionType.changeTextareaInfo, payload: { ...state, textareaInfo: { ...state.textareaInfo, visible: false } } })
  }

  const showTitle = () => {
    switch (state.textareaInfo.outFieldsName) {
      case "executeScrpitContent":
        return intl.formatMessage({ id: 'component.customPanel.modal.executeListening.scrpit' })
      case "ruleParam":
        return intl.formatMessage({ id: 'component.customPanel.modal.ruleParam.title' })
      default:
        return intl.formatMessage({ id: 'component.customPanel.modal.ruleParam.title' })
    }
  }

  const showFormItem = () => {
    switch (state.textareaInfo.outFieldsName) {
      case 'executeScrpitContent':
        return (
          <Form.Item name="executeScript" rules={[{ required: true, message: intl.formatMessage({ id: 'component.customPanel.executeListening.content.script.placeholder' }) }]} >
            <Input.TextArea showCount rows={20} placeholder={intl.formatMessage({ id: 'component.customPanel.executeListening.content.script.placeholder' })} />
          </Form.Item>
        )
      default:
        return (
          <Form.Item name="executeScript" >
            <Input.TextArea showCount rows={20} placeholder={intl.formatMessage({ id: 'component.customPanel.rule.ruleParam.placeholder' })} />
          </Form.Item>
        )
    }
  }

  return (
    <Modal
      title={showTitle()}
      visible={state.textareaInfo.visible}
      className={styles["listen-modal"]}
      // width="60vw"
      onOk={sureModal}
      onCancel={cancelModal}
      okText={intl.formatMessage({ id: 'pages.ok', defaultMessage: '确认' })}
      cancelText={intl.formatMessage({ id: 'pages.cancel', defaultMessage: '取消' })}
      forceRender
    >
      <Form form={props.executeForm} autoComplete="off">
        {showFormItem()}
      </Form>
    </Modal>
  )
}

export default ListeningModal