import { ActionType, ProgressModal } from "@/context/progress"
import { setDeadlineData, setUrgeNoticeTimeData } from "@/pages/progress/editor/common"
import { Form, FormInstance, InputNumber, Modal, Switch } from "antd"
import { useContext, useEffect, useState } from "react"
import { useIntl } from "umi"
import styles from './index.less'

type Props = {
  form: FormInstance<any>,
  noticeForm: FormInstance<any>,
}

function NoticeModal(props: Props) {
  const { state, dispatch } = useContext(ProgressModal)
  const intl = useIntl()
  const [checkedKeys, setCheckedKeys] = useState(false)

  useEffect(() => {
    if (state.noticeModalInfo.visible) {
      if (props.noticeForm.getFieldsValue(['moreAction']).moreAction) {
        setCheckedKeys(true)
      } else {
        setCheckedKeys(false)
        props.noticeForm.setFieldsValue({
          intervalDay: null,
          intervalHour: null,
          intervalMinute: null,
          // intervalSecond: null,
          noticeCount: null
        })
      }
    }
  }, [state.noticeModalInfo.visible])

  const sureModal = () => {
    if (state.noticeModalInfo.fieldsName === 'deadline') { // 处理完成时限
      const { words, relative } = setDeadlineData(props.noticeForm.getFieldsValue())
      props.form.setFieldsValue({
        deadline: words,
        deadlineKey: JSON.stringify(relative)
      })
      dispatch({ type: ActionType.changeDealTime, payload: { ...state, deadline: words } })
    }
    if (state.noticeModalInfo.fieldsName === 'urgeNoticeTime' || state.noticeModalInfo.fieldsName === 'overtimeNoticeTime') {
      const { str, formObj } = setUrgeNoticeTimeData(props.noticeForm.getFieldsValue(), state.noticeModalInfo.fieldsName)
      props.form.setFieldsValue({
        [state.noticeModalInfo.fieldsName]: str,
        [`${state.noticeModalInfo.fieldsName}Key`]: JSON.stringify(formObj)
      })
    }
    dispatch({ type: ActionType.changeNoticeModalInfo, payload: { ...state, noticeModalInfo: { ...state.noticeModalInfo, visible: false } } })
  }
  const cancelModal = () => {
    dispatch({ type: ActionType.changeNoticeModalInfo, payload: { ...state, noticeModalInfo: { ...state.noticeModalInfo, visible: false } } })
  }
  return (
    <Modal
      title={state.noticeModalInfo.title}
      visible={state.noticeModalInfo.visible}
      className={styles["notice-modal"]}
      onOk={sureModal}
      onCancel={cancelModal}
      okText={intl.formatMessage({ id: 'pages.ok', defaultMessage: '确认' })}
      cancelText={intl.formatMessage({ id: 'pages.cancel', defaultMessage: '取消' })}
      forceRender
    >
      <Form form={props.noticeForm} autoComplete="off">
        <div className={styles.box}>
          <Form.Item label={intl.formatMessage({ id: 'component.customPanel.modal.notice.relativeDay.label' })}>
            <Form.Item name="relativeDay" noStyle>
              <InputNumber min={0} />
            </Form.Item>
            <span style={{ margin: '0 5px' }}>{intl.formatMessage({ id: 'component.customPanel.modal.notice.relativeDay' })}</span>
          </Form.Item>
          <Form.Item>
            <Form.Item name="relativeHour" noStyle>
              <InputNumber min={0} max={23} />
            </Form.Item>
            <span style={{ margin: '0 5px' }}>{intl.formatMessage({ id: 'component.customPanel.modal.notice.relativeHour' })}</span>
          </Form.Item>
          <Form.Item>
            <Form.Item name="relativeMinute" noStyle>
              <InputNumber min={0} max={59} />
            </Form.Item>
            <span style={{ margin: '0 5px' }}>{intl.formatMessage({ id: 'component.customPanel.modal.notice.relativeMinute' })}</span>
          </Form.Item>
          {/* <Form.Item>
            <Form.Item name="relativeSecond" noStyle>
              <InputNumber min={0} max={59} />
            </Form.Item>
            <span style={{ margin: '0 5px' }}>{intl.formatMessage({ id: 'component.customPanel.modal.notice.relativeSecond' })}</span>
          </Form.Item> */}
        </div>
        {
          state.noticeModalInfo.fieldsName === 'deadline' ? null : (
            <>
              <Form.Item valuePropName="checked" name="moreAction" label={intl.formatMessage({ id: 'component.customPanel.modal.notice.mutipleExecutions' })}>
                <Switch onChange={(e) => setCheckedKeys(e)} />
              </Form.Item>
              {
                checkedKeys ? (
                  <>
                    <div className={styles.box}>
                      <Form.Item label={intl.formatMessage({ id: 'component.customPanel.modal.notice.intervalDay.label' })}>
                        <Form.Item name="intervalDay" noStyle>
                          <InputNumber min={0} />
                        </Form.Item>
                        <span style={{ margin: '0 5px' }}>{intl.formatMessage({ id: 'component.customPanel.modal.notice.relativeDay' })}</span>
                      </Form.Item>
                      <Form.Item>
                        <Form.Item name="intervalHour" noStyle>
                          <InputNumber min={0} max={23} />
                        </Form.Item>
                        <span style={{ margin: '0 5px' }}>{intl.formatMessage({ id: 'component.customPanel.modal.notice.relativeHour' })}</span>
                      </Form.Item>
                      <Form.Item>
                        <Form.Item name="intervalMinute" noStyle>
                          <InputNumber min={0} max={59} />
                        </Form.Item>
                        <span style={{ margin: '0 5px' }}>{intl.formatMessage({ id: 'component.customPanel.modal.notice.relativeMinute' })}</span>
                      </Form.Item>
                      {/* <Form.Item>
                        <Form.Item name="intervalSecond" noStyle>
                          <InputNumber min={0} max={59} />
                        </Form.Item>
                        <span style={{ margin: '0 5px' }}>{intl.formatMessage({ id: 'component.customPanel.modal.notice.relativeSecond' })}</span>
                      </Form.Item> */}
                    </div>
                    <Form.Item name="noticeCount" label={intl.formatMessage({ id: 'component.customPanel.modal.notice.count.label' })} className={styles.changeLabel}>
                      <InputNumber defaultValue={1} min={0} />
                    </Form.Item>
                  </>
                ) : null
              }
            </>
          )
        }
      </Form>
    </Modal>
  )
}

export default NoticeModal