import { Constant } from '@/constant'
import { ActionType, ProgressModal } from '@/context/progress'
import { UserTaskDealType } from '@/pages/progress/type'
import { CommonParamType, DicType } from '@/types/common'
import { filterDicList } from '@/utils/utils'
import { QuestionCircleOutlined } from '@ant-design/icons'
import { Button, Checkbox, CheckboxOptionType, Col, Collapse, Form, Input, InputNumber, Row, Select, Switch, Tooltip } from 'antd'
import { FormInstance } from 'antd/es/form/hooks/useForm'
import { DefaultOptionType } from 'antd/lib/select'
import { useContext, useEffect, useState } from 'react'
import { useIntl } from 'umi'
import BaseInfo from '../BaseInfo'
import ExecuteListening from '../ProcessListen/ExecuteListening'
import SameForm from '../BaseInfo/SameForm'
import styles from '../index.less'
import NoticeInfo from './NoticeInfo'
import StatusPreview from '../BaseInfo/StatusPreview'
import { CheckboxValueType } from 'antd/lib/checkbox/Group'
const { Panel } = Collapse;
const { Option } = Select

type Props = {
  form: FormInstance<any>,
  executeForm: FormInstance<any>,
  noticeForm: FormInstance<any>,
  closeSettingFieldsModal: (e: boolean) => void,
  curElement: CommonParamType,
  closeDealPersonModal: (show: boolean) => void,
  nodeApproveType: string,
  changeNodeApproveType: (e: string) => void,
  userTaskCondition: DefaultOptionType,
  changeCondition: (e: string, row: DefaultOptionType) => void,
  processorSetting: string,
  changeDealPersonType: (e: string) => void,
  closeSettingModal: (show: boolean) => void,
  eventType: string,
  changeProgressForm: (e: string) => void
}

function UserTask(props: Props) {
  const intl = useIntl()
  const { state, dispatch } = useContext(ProgressModal)
  const { dicList } = state
  const [nodeApproveTypeArr, setNodeApproveTypeArr] = useState<DicType[]>([])
  const [conditionArr, setConditionArr] = useState<DicType[]>([])
  const [settingList, setSettingList] = useState<DicType[]>([])
  const [allocationTypeArr, setAllocationTypeArr] = useState<DicType[]>([])
  const [superiorList, setSuperiorList] = useState<DicType[]>([])
  const [superiorDepartmentList, setSuperiorDepartmentList] = useState<DicType[]>([])
  const [emptySuperiorDepartmentList, setEmptySuperiorDepartmentList] = useState<DicType[]>([])
  const [noticeRecever, setNoticeRecever] = useState<DicType[]>([])
  useEffect(() => {
    if (state.dicList.length > 0) {
      setNodeApproveTypeArr(filterDicList(dicList, "node_approve_type"))
      setConditionArr(filterDicList(dicList, "complate_condition"))
      setSettingList(filterDicList(dicList, "processorSetting"))
      setAllocationTypeArr(filterDicList(dicList, "allocation_type"))
      setSuperiorList(filterDicList(dicList, "superior"))
      setSuperiorDepartmentList(filterDicList(dicList, "superiorDepartment"))
      setEmptySuperiorDepartmentList(filterDicList(dicList, "emptySuperiorDepartment"))
      setNoticeRecever(filterDicList(dicList, "notifyReceiver"))
    }
  }, [state.dicList])

  const commonDeleteAction = (setData: ActionType, row: CommonParamType, keyWord: string) => {
    dispatch({
      type: setData,
      payload: {
        ...state,
        [keyWord]: {
          checkedKeys: Array.isArray(state[keyWord].checkedKeys) ? state[keyWord].checkedKeys.filter((x: string | number) => x !== row.key) : state[keyWord].checkedKeys.checked.filter((x: string | number) => x !== row.key),
          checkedRowInfo: state[keyWord].checkedRowInfo.filter((x: { key: string | number; }) => x.key !== row.key)
        }
      }
    })
  }

  const clearBtn = (e: CommonParamType, row: CommonParamType) => {
    const activePane = row.label.split(":")[0]
    if (activePane === Constant.UserTaskDealPersonTab[0].name) {
      commonDeleteAction(ActionType.changeCheckedDepartmentList, row, 'checkedDepartInfo')
    } else if (activePane === Constant.UserTaskDealPersonTab[1].name) {
      commonDeleteAction(ActionType.changeCheckedAuthInfo, row, 'checkedAuthInfo')
    } else if (activePane === Constant.UserTaskDealPersonTab[2].name) {
      commonDeleteAction(ActionType.changeCheckedPersonInfo, row, 'checkedPersonInfo')
    }
    dispatch({
      type: ActionType.changeCheckedAllList,
      payload: {
        ...state,
        checkedAllList: state.checkedAllList.filter(x => x.key !== row.key),
      }
    })
  }

  const clearBtnRule = (e: CommonParamType, row: CommonParamType) => {
    dispatch({
      type: ActionType.changeCheckedRule,
      payload: {
        ...state,
        checkedRuleInfo: {
          checkedKeys: Array.isArray(state.checkedRuleInfo.checkedKeys) ? state.checkedRuleInfo.checkedKeys.filter((x: string | number) => x !== row.key) : state.checkedRuleInfo.checkedKeys.checked.filter((x: string | number) => x !== row.key),
          checkedRowInfo: state.checkedRuleInfo.checkedRowInfo.filter((x: { key: string | number; }) => x.key !== row.key)
        }
      }
    })
  }

  const changeDealType = (e: string) => {
    props.changeNodeApproveType(e)
    props.form.setFieldsValue({
      allocationType: ''
    })
    if (e === UserTaskDealType.SINGLE) { // 单人审批
      props.form.setFieldsValue({
        assignee: "${" + props.curElement.id + "User}"
      })
    }
    if (e === UserTaskDealType.SERIAL) { // 多人串行
      props.form.setFieldsValue({
        assignee: "${" + props.curElement.id + "User}",
        collection: "${" + props.curElement.id + "List}",
        variable: "" + props.curElement.id + "User",
      })
    }
    if (e === UserTaskDealType.PARALLEL) { // 多人并行
      props.form.setFieldsValue({
        assignee: "${" + props.curElement.id + "User}",
        collection: "${" + props.curElement.id + "List}",
        variable: "" + props.curElement.id + "User",
      })
    }
  }

  const changeFormButton = (e: string[]) => {
    dispatch({ type: ActionType.changeFormButtonList, payload: { ...state, formButtonList: e } })
  }

  const showAlloctionType = () => {
    const nodeApproveType = props.form.getFieldValue("nodeApproveType")
    const processorSetting = props.form.getFieldValue("processorSetting")
    if (nodeApproveType && processorSetting && nodeApproveType === UserTaskDealType.PARALLEL && processorSetting == '1') {
      return allocationTypeArr.filter(x => x.constantValue === 'submit')
    }
    return allocationTypeArr
  }

  const changeButtonNotice = (e: boolean | React.ChangeEvent<HTMLInputElement> | CheckboxValueType[], row: DicType, str: string) => {
    const list = state.filedActionArr.map(item => {
      if (item.value === row.value) {
        return {
          ...item,
          [str]: e
        }
      }
      return item
    })
    dispatch({ type: ActionType.changeFiledActionArr, payload: { ...state, filedActionArr: list } })
  }

  const renderFormButtonCallBack = () => {
    if (state.formButtonList.length > 0 && state.filedActionArr.length > 0) {
      let list: any[] = []
      state.formButtonList.forEach(item => {
        const indexArr = state.filedActionArr.filter(x => x.constantValue === item)
        if (indexArr.length > 0) {
          list.push(indexArr[0])
        }
      })
      // const list = state.formButtonList.map(item => {
      //   return state.filedActionArr.filter(x => x.constantValue === item)[0]
      // })
      if (list.length > 0) {
        const dom = list.map(item => (
          <div key={item.id}>
            <Form.Item valuePropName="checked" style={{ marginTop: '12px' }} name={`${item.value}NcFlag`} label="开启通知">
              <Switch onChange={(e) => changeButtonNotice(e, item, `${item.value}NcFlag`)} />
            </Form.Item>
            {
              item[`${item.value}NcFlag`] ? (
                <>
                  <Form.Item style={{ marginTop: '12px' }} name={`${item.value}TemplateCode`} label="邮件模板">
                    <Select options={state.noticeTempArr} onChange={(e) => changeButtonNotice(e, item, `${item.value}TemplateCode`)} />
                  </Form.Item>
                  <Form.Item style={{ marginTop: '12px' }} name={`${item.value}Receiver`} label="收件人">
                    <Checkbox.Group onChange={(e) => changeButtonNotice(e, item, `${item.value}Receiver`)} options={noticeRecever as (string | number | CheckboxOptionType)[]} />
                  </Form.Item>
                  {
                    item[`${item.value}Receiver`]?.includes("otherReceiver") ? (
                      <Form.Item rules={[{ type: 'email' }]} style={{ marginTop: '12px' }} name={`${item.value}OtherReceiverList`} label="通知邮箱">
                        <Input onChange={(e) => changeButtonNotice(e, item, `${item.value}OtherReceiverList`)} />
                      </Form.Item>
                    ) : null
                  }
                </>
              ) : null
            }
            <Form.Item style={{ marginTop: '12px' }} name={`${item.value}CallbackUrl`} label={`${item.label}回调接口`}>
              <Input />
            </Form.Item>
          </div>
        ))
        return dom
      }
    }
    return null
  }

  return (
    <Collapse defaultActiveKey={['1', '2', '3', '4', '5', '6', '7', '8', '9']} className={styles.list}>
      <Panel header={intl.formatMessage({ id: 'component.customPanel.info' })} key="1">
        <BaseInfo eventType={props.eventType} />
      </Panel>
      <Panel header={intl.formatMessage({ id: 'component.customPanel.progress' })} key="2">
        <SameForm eventType={props.eventType} closeSettingFieldsModal={(e) => props.closeSettingFieldsModal(e)} changeProgressForm={(e) => props.changeProgressForm(e)} />
      </Panel>
      <Panel header={intl.formatMessage({ id: 'component.customPanel.status' })} key="9">
        <StatusPreview eventType={props.eventType} />
      </Panel>
      <Panel header={intl.formatMessage({ id: 'component.customPanel.auth' })} key="3">
        <div className={styles.list_item}>
          <div className={styles.list_item_content}>
            <Form.Item name="formButton" label={intl.formatMessage({ id: 'component.customPanel.auth.progress' })}>
              <Select onChange={changeFormButton} options={state.filedActionArr} allowClear mode="multiple" optionLabelProp="label" placeholder={intl.formatMessage({ id: 'component.customPanel.auth.progress.placeholder' })} />
            </Form.Item>
            {renderFormButtonCallBack()}
          </div>
        </div>
      </Panel>
      <Panel header={intl.formatMessage({ id: 'component.customPanel.action' })} key="4">
        <div className={styles.list_item}>
          <div className={styles.list_item_content}>
            <Form.Item name="nodeApproveType" label={intl.formatMessage({ id: 'component.customPanel.multi.strategy' })} rules={[{ required: true }]}>
              <Select options={nodeApproveTypeArr} onChange={changeDealType} optionLabelProp="label" placeholder={intl.formatMessage({ id: 'component.customPanel.multi.strategy.placeholder' })} />
            </Form.Item>
            <Form.Item style={{ display: 'none' }} name="assignee" label={intl.formatMessage({ id: 'component.customPanel.deal.assignee', defaultMessage: '受让人' })} rules={[{ required: true }]}>
              <Input placeholder={intl.formatMessage({ id: 'component.customPanel.deal.assignee.placeholder', defaultMessage: '请填写受让人' })} />
            </Form.Item>
            {
              props.nodeApproveType === UserTaskDealType.PARALLEL ? (
                <>
                  <Form.Item style={{ marginTop: '12px' }} name="condition" label={intl.formatMessage({ id: 'component.customPanel.multi.condition', defaultMessage: '完成条件' })}>
                    <Select options={conditionArr} onChange={(e, row) => props.changeCondition(e, row as DefaultOptionType)} optionLabelProp="label" placeholder={intl.formatMessage({ id: 'component.customPanel.multi.condition.placeholder', defaultMessage: '请填写完成条件' })} />
                  </Form.Item>
                  {
                    props.userTaskCondition.key === "custom" ? (
                      <Row>
                        <Col span={21}>
                          <Form.Item style={{ marginTop: '12px' }} name="customCondition" label={intl.formatMessage({ id: 'component.customPanel.multi.expression', defaultMessage: '自定义条件表达式' })}>
                            <InputNumber min={0} max={100} placeholder={intl.formatMessage({ id: 'component.customPanel.multi.expression.placeholder', defaultMessage: '请填写自定义条件表达式' })} />
                          </Form.Item>
                        </Col>
                        <Col offset={1} span={2} className={styles.condition_item}>
                          <Tooltip placement="bottomRight" title={Constant.ProcessSequenceFlow}>
                            <QuestionCircleOutlined className={styles.condition_icon} />
                          </Tooltip>
                        </Col>
                      </Row>
                    ) : null
                  }
                  <Form.Item style={{ display: 'none' }} name="collection" label={intl.formatMessage({ id: 'component.customPanel.multi.collection', defaultMessage: '收集' })}>
                    <Input disabled placeholder={intl.formatMessage({ id: 'component.customPanel.multi.collection.placeholder', defaultMessage: '请填写收集' })} />
                  </Form.Item>
                  <Form.Item style={{ display: 'none' }} name="variable" label={intl.formatMessage({ id: 'component.customPanel.multi.var', defaultMessage: '元素变量' })}>
                    <Input disabled placeholder={intl.formatMessage({ id: 'component.customPanel.multi.var.placeholder', defaultMessage: '请填写元素变量' })} />
                  </Form.Item>
                </>
              ) : null
            }
            <Form.Item style={{ display: 'none' }} name="assignee" label={intl.formatMessage({ id: 'component.customPanel.deal.assignee', defaultMessage: '受让人' })} rules={[{ required: true }]}>
              <Input placeholder={intl.formatMessage({ id: 'component.customPanel.deal.assignee.placeholder', defaultMessage: '请填写受让人' })} />
            </Form.Item>
          </div>
        </div>
      </Panel>
      <Panel header={intl.formatMessage({ id: 'component.customPanel.deal' })} key="5">
        <div className={styles.list_item}>
          <div className={styles.list_item_content}>
            <Form.Item name="processorSetting" label={intl.formatMessage({ id: 'component.customPanel.deal.strategy' })} rules={[{ required: true }]}>
              <Select options={settingList} onChange={(e) => props.changeDealPersonType(e)} optionLabelProp="label" placeholder={intl.formatMessage({ id: 'component.customPanel.deal.strategy.placeholder' })} />
            </Form.Item>
            {
              props.processorSetting == "0" ? (
                <>
                  <Form.Item style={{ marginTop: '12px' }} name="nodeCandidate" label={intl.formatMessage({ id: 'component.customPanel.deal', defaultMessage: '处理人' })} rules={[{ required: true }]}>
                    <Select onDeselect={clearBtn} open={false} onClick={() => props.closeDealPersonModal(true)} mode="multiple" optionLabelProp="label" placeholder={intl.formatMessage({ id: 'component.customPanel.deal.placeholder', defaultMessage: '请选择处理人' })}>
                      {
                        state.checkedAllList && state.checkedAllList.length > 0 && state.checkedAllList.map(item => (
                          <Option key={item.key} label={item.title} value={item.title}>{item.title}</Option>
                        ))
                      }
                    </Select>
                  </Form.Item>
                  <Form.Item style={{ display: 'none' }} name="nodeCandidateKey" label={intl.formatMessage({ id: 'component.customPanel.deal', defaultMessage: '处理人' })} rules={[{ required: true }]}>
                    <Select onDeselect={clearBtn} open={false} onClick={() => props.closeDealPersonModal(true)} mode="multiple" optionLabelProp="label" placeholder={intl.formatMessage({ id: 'component.customPanel.deal.placeholder', defaultMessage: '请选择处理人' })}>
                    </Select>
                  </Form.Item>
                </>
              ) : null
            }
            {
              props.processorSetting == "1" ? (
                <>
                  <Form.Item style={{ marginTop: '12px' }} name="allocationType" label={intl.formatMessage({ id: 'component.customPanel.rule.allocationType' })} rules={[{ required: true }]}>
                    <Select options={showAlloctionType()} optionLabelProp="label" placeholder={intl.formatMessage({ id: 'component.customPanel.rule.allocationType' })} />
                  </Form.Item>
                  <Form.Item style={{ marginTop: '12px' }} name="rule" label={intl.formatMessage({ id: 'component.customPanel.rule', defaultMessage: '规则' })} rules={[{ required: true }]}>
                    <Select onDeselect={clearBtnRule} open={false} onClick={() => props.closeSettingModal(true)} mode="multiple" optionLabelProp="label" placeholder={intl.formatMessage({ id: 'component.customPanel.deal.placeholder', defaultMessage: '请选择规则' })}>
                      {
                        state.checkedRuleInfo && state.checkedRuleInfo.checkedRowInfo.length > 0 && state.checkedRuleInfo.checkedRowInfo.map(item => (
                          <Option key={item.key} label={item.title} value={item.title}>{item.title}</Option>
                        ))
                      }
                    </Select>
                  </Form.Item>
                  <Form.Item style={{ display: 'none' }} name="ruleKey" label={intl.formatMessage({ id: 'component.customPanel.rule', defaultMessage: '规则' })} rules={[{ required: true }]}>
                    <Select onDeselect={clearBtnRule} open={false} onClick={() => props.closeSettingModal(true)} mode="multiple" optionLabelProp="label" placeholder={intl.formatMessage({ id: 'component.customPanel.deal.placeholder', defaultMessage: '请选择规则' })}>
                    </Select>
                  </Form.Item>
                  <Form.Item className="inlineItem" style={{ marginTop: '12px' }} label={intl.formatMessage({ id: 'component.customPanel.rule.ruleParam' })}>
                    <Form.Item name="ruleParam" noStyle>
                      <Input.TextArea placeholder={intl.formatMessage({ id: 'component.customPanel.rule.ruleParam.placeholder' })} disabled />
                    </Form.Item>
                    <Button
                      onClick={() => {
                        props.executeForm.setFieldsValue({
                          executeScript: props.form.getFieldValue('ruleParam')
                        })
                        dispatch({
                          type: ActionType.changeTextareaInfo, payload: {
                            ...state, textareaInfo: {
                              outFieldsName: 'ruleParam',
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
            {
              props.processorSetting == "2" ? (
                <>
                  <Form.Item style={{ marginTop: '12px' }} name="superior" label={intl.formatMessage({ id: 'component.customPanel.deal.superior' })} rules={[{ required: true }]}>
                    <Select options={superiorList} optionLabelProp="label" placeholder={intl.formatMessage({ id: 'component.customPanel.deal.superior.placeholder' })} />
                  </Form.Item>
                </>
              ) : null
            }
            {
              props.processorSetting == "3" ? (
                <>
                  <Form.Item style={{ marginTop: '12px' }} name="superiorDepartment" label={intl.formatMessage({ id: 'component.customPanel.deal.superiorDepartment' })} rules={[{ required: true }]}>
                    <Select options={superiorDepartmentList} optionLabelProp="label" placeholder={intl.formatMessage({ id: 'component.customPanel.deal.superiorDepartment.placeholder' })} />
                  </Form.Item>
                  <Form.Item style={{ marginTop: '12px' }} name="emptySuperiorDepartment" label={intl.formatMessage({ id: 'component.customPanel.deal.emptySuperiorDepartment' })} rules={[{ required: true }]}>
                    <Select options={emptySuperiorDepartmentList} optionLabelProp="label" placeholder={intl.formatMessage({ id: 'component.customPanel.deal.emptySuperiorDepartment.placeholder' })} />
                  </Form.Item>
                </>
              ) : null
            }
          </div>
        </div>
      </Panel>
      <Panel header={intl.formatMessage({ id: 'component.customPanel.notice' })} key="6">
        <NoticeInfo form={props.form} noticeForm={props.noticeForm} />
      </Panel>
      <Panel header={intl.formatMessage({ id: 'component.customPanel.executeListening' })} key="7">
        <ExecuteListening
          executeForm={props.executeForm}
          form={props.form}
        />
      </Panel>
    </Collapse>
  )
}

export default UserTask