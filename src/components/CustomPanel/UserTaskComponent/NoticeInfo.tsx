import { ActionType, ProgressModal } from '@/context/progress'
import { parseInitNoticeModalInfo } from '@/pages/progress/editor/common'
import { DicType } from '@/types/common'
import { filterDicList } from '@/utils/utils'
import { Button, Checkbox, CheckboxOptionType, Form, FormInstance, Input, Switch } from 'antd'
import { useContext, useEffect, useState } from 'react'
import { useIntl } from 'umi'
import styles from '../index.less'

type Props = {
  form: FormInstance<any>,
  noticeForm: FormInstance<any>,
}



function NoticeInfo(props: Props) {
  const intl = useIntl()
  const { state, dispatch } = useContext(ProgressModal)
  const { dicList } = state
  const [noticeUserArr, setNoticeUserArr] = useState<DicType[]>([])
  const [noticeTypeArr, setNoticeTypeArr] = useState<DicType[]>([])
  useEffect(() => {
    if (state.dicList.length > 0) {
      setNoticeUserArr(filterDicList(dicList, "notice_user"))
      setNoticeTypeArr(filterDicList(dicList, "notice_type"))
    }
  }, [state.dicList])

  const changeValue = (e: boolean, name: string, fields: string[]) => {
    dispatch({ type: ActionType['change' + name.slice(0, 1).toUpperCase() + name.slice(1)], payload: { ...state, [name]: e } })
    const obj = {}
    fields.forEach(item => {
      obj[item] = ''
    })
    props.form.setFieldsValue(obj)
  }

  // 点击设置按钮
  const setNoticeInfo = (title: string, fieldsName: string, showKey: string) => {
    dispatch({
      type: ActionType.changeNoticeModalInfo,
      payload: {
        ...state,
        noticeModalInfo: {
          title,
          visible: true,
          fieldsName,
        }
      }
    })
    parseInitNoticeModalInfo(props.form.getFieldValue(showKey), props.noticeForm)
  }

  return (
    <>
      <div className={styles.list_item}>
        <div className={styles.list_item_content}>
          <Form.Item name="noticeType" label={intl.formatMessage({ id: 'component.customPanel.notice.type' })}>
            <Checkbox.Group options={noticeTypeArr as (string | number | CheckboxOptionType)[]} />
          </Form.Item>
          <Form.Item className="inlineItem" style={{ marginTop: '12px' }} label={intl.formatMessage({ id: 'component.customPanel.deal.dealtime' })}>
            <Form.Item name="deadline" noStyle>
              <Input placeholder={intl.formatMessage({ id: 'component.customPanel.deal.dealtime.placeholder' })} disabled />
            </Form.Item>
            <Button
              onClick={() => setNoticeInfo(
                intl.formatMessage({ id: 'component.customPanel.modal.notice.title' }), 'deadline', 'deadlineKey'
              )}
            >{intl.formatMessage({ id: 'app.settings.security.set' })}</Button>
          </Form.Item>
          <Form.Item style={{ marginTop: '12px', display: 'none' }} name="deadlineKey" label={intl.formatMessage({ id: 'component.customPanel.deal.dealtime' })}>
            <Input disabled />
          </Form.Item>
          <Form.Item valuePropName="checked" style={{ marginTop: '12px' }} name="pendingNoticeFlag" label={intl.formatMessage({ id: 'component.customPanel.notice.agentReminder' })}>
            <Switch onChange={(e) => changeValue(e, 'pendingNoticeFlag', ['pendingNoticeUser'])} />
          </Form.Item>
          {
            state.pendingNoticeFlag ? (
              <Form.Item style={{ marginTop: '12px' }} name="pendingNoticeUser" label={intl.formatMessage({ id: 'component.customPanel.notice.toDoReminderObj' })}>
                <Checkbox.Group options={noticeUserArr as (string | number | CheckboxOptionType)[]} />
              </Form.Item>
            ) : null
          }
          {
            state.deadline ? (
              <>
                <Form.Item valuePropName="checked" style={{ marginTop: '12px' }} name="urgeNoticeFlag" label={intl.formatMessage({ id: 'component.customPanel.notice.reminder' })}>
                  <Switch onChange={(e) => changeValue(e, 'urgeNoticeFlag', ['urgeNoticeTime', 'urgeNoticeUser'])} />
                </Form.Item>
                {
                  state.urgeNoticeFlag ? (
                    <>
                      <Form.Item className="inlineItem" style={{ marginTop: '12px' }} label={intl.formatMessage({ id: 'component.customPanel.notice.reminderTime' })}>
                        <Form.Item name="urgeNoticeTime" noStyle>
                          <Input placeholder={intl.formatMessage({ id: 'component.customPanel.deal.urgeNoticeTime.placeholder' })} disabled />
                        </Form.Item>
                        <Button
                          onClick={() => setNoticeInfo(
                            intl.formatMessage({ id: 'component.customPanel.modal.warning.title' }), 'urgeNoticeTime', 'urgeNoticeTimeKey'
                          )}
                        >{intl.formatMessage({ id: 'app.settings.security.set' })}</Button>
                      </Form.Item>
                      <Form.Item style={{ marginTop: '12px', display: 'none' }} name="urgeNoticeTimeKey" label={intl.formatMessage({ id: 'component.customPanel.deal.dealtime' })}>
                        <Input disabled />
                      </Form.Item>
                      <Form.Item style={{ marginTop: '12px' }} name="urgeNoticeUser" label={intl.formatMessage({ id: 'component.customPanel.notice.reminderObj' })}>
                        <Checkbox.Group options={noticeUserArr as (string | number | CheckboxOptionType)[]} />
                      </Form.Item>
                    </>
                  ) : null
                }
                <Form.Item valuePropName="checked" style={{ marginTop: '12px' }} name="overtimeFlag" label={intl.formatMessage({ id: 'component.customPanel.notice.timeoutSettint' })}>
                  <Switch onChange={(e) => changeValue(e, 'overtimeFlag', ['overtimeFinishFlag', 'overtimeNoticeTime', 'overtimeNoticeUser'])} />
                </Form.Item>
                {
                  state.overtimeFlag ? (
                    <>
                      <Form.Item valuePropName="checked" style={{ marginTop: '12px' }} name="overtimeFinishFlag" label={intl.formatMessage({ id: 'component.customPanel.notice.timeoutAutoComplete' })}>
                        <Switch />
                      </Form.Item>
                      <Form.Item className="inlineItem" style={{ marginTop: '12px' }} label={intl.formatMessage({ id: 'component.customPanel.notice.timeoutWariningTime' })}>
                        <Form.Item name="overtimeNoticeTime" noStyle>
                          <Input placeholder={intl.formatMessage({ id: 'component.customPanel.deal.overtimeNoticeTime.placeholder' })} disabled />
                        </Form.Item>
                        <Button
                          onClick={() => setNoticeInfo(
                            intl.formatMessage({ id: 'component.customPanel.modal.timeout.title' }), 'overtimeNoticeTime', 'overtimeNoticeTimeKey'
                          )}
                        >{intl.formatMessage({ id: 'app.settings.security.set' })}</Button>
                      </Form.Item>
                      <Form.Item style={{ marginTop: '12px', display: 'none' }} name="overtimeNoticeTimeKey" label={intl.formatMessage({ id: 'component.customPanel.deal.dealtime' })}>
                        <Input disabled />
                      </Form.Item>
                      <Form.Item style={{ marginTop: '12px' }} name="overtimeNoticeUser" label={intl.formatMessage({ id: 'component.customPanel.notice.timeoutObj' })}>
                        <Checkbox.Group options={noticeUserArr as (string | number | CheckboxOptionType)[]} />
                      </Form.Item>
                    </>
                  ) : null
                }
              </>
            ) : null
          }
        </div>
      </div>
    </>
  )
}

export default NoticeInfo