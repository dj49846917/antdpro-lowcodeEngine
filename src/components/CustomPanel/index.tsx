import { CloseOutlined } from "@ant-design/icons"
import { useIntl } from "umi";
import { Button, Collapse, Drawer, Form } from "antd"
import { useContext, useEffect, useState } from "react";
import { isEmptyObject } from "@/utils/utils";
import styles from './index.less';
import { CommonParamType, DicType } from "@/types/common";
import { Constant } from "@/constant";
import progressApi from "@/services/custom/appInfo/progress";
import UserTaskComponent from "./UserTaskComponent";
import { ActionType, ProgressModal } from "@/context/progress";
import { ActiveKeyType, BpmnElementApi, EventType, ExecuteListeningType, NodeNameItemType, UserFormType, UserTaskDealType, UserTaskFieldType, UserTaskTreeInfoType, UserTaskTreeRowType } from "@/pages/progress/type";
import StartEvent from "./StartEvent";
import SettingFields from "@/components/CustomPanel/Modal/UserTask/SettingFields";
import DealPerson from "@/components/CustomPanel/Modal/UserTask/DealPerson";
import SequenceFlow from "./SequenceFlow";
import { DefaultOptionType } from "antd/lib/select";
import ProcessSetting from "./Modal/UserTask/ProcessSetting";
import EndEvent from "./EndEvent";
import BaseInfo from "./BaseInfo";
import { createListenerObject, parseExecuteListening, parseExecuteListeningInit } from "@/utils/process";
import NoticeModal from "./Modal/UserTask/Notice";
import ListeningModal from "./Modal/UserTask/Listening";
import Nodename from "./Modal/Nodename";
import Expression from "./Modal/Expression";

const { Panel } = Collapse;
type EditorProps = {
  controller: CommonParamType
}

function CustomPanel(props: EditorProps) {
  const intl = useIntl();
  const [form] = Form.useForm()
  const [noticeForm] = Form.useForm()
  const [executeForm] = Form.useForm()
  const [expressionForm] = Form.useForm()
  const [eventType, setEventType] = useState("")
  const { state, dispatch } = useContext(ProgressModal)
  const [drawerVisible, setDrawVisible] = useState(false)
  const [curElement, setCurElement] = useState<CommonParamType>({})
  const [userForm, setUserForm] = useState<UserFormType[]>([])
  const [filedVisible, setFiledVisible] = useState(false)
  const [nodeApproveType, setNodeApproveType] = useState("")
  const [dealPersonVisivle, setDealPersonVisible] = useState(false)
  const [processSettingVisible, setProcessorSettingVisible] = useState(false)
  const [userTaskCondition, setUserTaskCondition] = useState<DefaultOptionType>({} as DefaultOptionType)
  const [processorSetting, setProcessorSetting] = useState("")
  const [nameDataSource, setNameDataSource] = useState<NodeNameItemType[]>([])

  useEffect(() => {
    const { controller } = props;
    if (!isEmptyObject(controller)) {
      controller.on('selection.changed', (e: { newSelection: string | any[]; }) => {
        if (e.newSelection.length > 0 && e.newSelection[0] !== curElement) {
          setDrawVisible(true)
          setCurElement(e.newSelection[0])
          form.resetFields();
          form.setFieldsValue({ id: e.newSelection[0].businessObject.id, name: e.newSelection[0].businessObject.name });
          // initForm(e.newSelection[0].type, e.newSelection[0])
        } else {
          setDrawVisible(false)
        }
      });
    }
  }, [props.controller])

  useEffect(() => {
    if (!isEmptyObject(curElement)) {
      // 判断点击的是那种类型
      setEventType(curElement.type)
      initForm(curElement.type, curElement)
    }
  }, [curElement])

  useEffect(() => {
    const arr: string[] = []
    const arr2: (string | number)[] = []
    if (state.checkedAllList.length > 0) {
      state.checkedAllList.forEach(item => {
        arr.push(item.title)
        arr2.push(item.key)
      })
      form.setFieldsValue({
        nodeCandidate: arr,
        nodeCandidateKey: arr2
      })
    } else {
      form.setFieldsValue({
        nodeCandidate: [],
        nodeCandidateKey: []
      })
    }
  }, [state.checkedAllList])

  useEffect(() => {
    const arr: string[] = []
    const arr2: (string | number)[] = []
    if (state.checkedRuleInfo.checkedRowInfo.length > 0) {
      state.checkedRuleInfo.checkedRowInfo.forEach(item => {
        arr.push(item.title)
        arr2.push(item.key)
      })
    }
    form.setFieldsValue({
      rule: arr,
      ruleKey: arr2
    })
  }, [state.checkedRuleInfo])

  const initForm = (type: string, currentRow: CommonParamType) => { // 初始化当前表单数据
    const ElementRegistry = props.controller.get("elementRegistry")
    const startNode = ElementRegistry.filter((x: { type: EventType; }) => x.type === EventType.STARTEVENT)
    const elementInfo = currentRow.businessObject
    form.setFieldsValue({
      name: elementInfo.name || "",
      nameKey: elementInfo.$attrs.nameKey || "",
      callbackStatus: elementInfo.$attrs.callbackStatus,
      passStatus: elementInfo.$attrs.passStatus,
      rejectStatus: elementInfo.$attrs.rejectStatus,
      callbackFlag: elementInfo.$attrs.callbackFlag
    })
    dispatch({ type: ActionType.changeIsStatus, payload: { ...state, isStatus: elementInfo.$attrs.callbackFlag || false } })
    setNameDataSource(JSON.parse(elementInfo.$attrs.nameKey || '[]'))
    // 初始化赋值执行监听
    parseInitExecuteListening(elementInfo.extensionElements)
    if (type === EventType.STARTEVENT || type === EventType.USERTASK || type === EventType.ENDEVENT) {
      form.setFieldsValue({
        progressForm: elementInfo.$attrs.progressForm || startNode[0].businessObject.$attrs.progressForm
      })
    }
    if (type === EventType.USERTASK) {
      setNodeApproveType(elementInfo.$attrs.nodeApproveType || '')
      setProcessorSetting(elementInfo.$attrs.processorSetting || '')
      if (elementInfo.$attrs.condition) {
        const conditionArr = state.dicList.filter(x => x.id === elementInfo.$attrs.condition)
        if (conditionArr[0]) {
          const obj = {
            key: conditionArr[0].id,
            label: conditionArr[0].constantKey,
            value: conditionArr[0].constantValue,
            title: conditionArr[0].constantKey
          }
          setUserTaskCondition(obj)
        }
      }
      dispatch({ type: ActionType.changeFormButtonList, payload: { ...state, formButtonList: elementInfo.$attrs.formButton || [] } })
      // 赋值
      if (elementInfo.$attrs?.formButton?.length > 0) {
        let obj = {}
        const arr: DicType[] = []
        state.filedActionArr.forEach(item => {
          obj = {
            ...obj,
            [`${item.value}CallbackUrl`]: "",
            [`${item.value}NcFlag`]: false,
            [`${item.value}TemplateCode`]: "",
            [`${item.value}Receiver`]: [],
            [`${item.value}OtherReceiverList`]: ""
          }
          elementInfo.$attrs.formButton.forEach((it: string) => {
            if (item.value === it) {
              obj = {
                ...obj,
                [`${it}CallbackUrl`]: elementInfo.$attrs.formButtonUrl?.[`${it}CallbackUrl`] || "",
                [`${it}NcFlag`]: elementInfo.$attrs.buttonNotificationInfo?.[`${it}NcFlag`] || false,
                [`${it}TemplateCode`]: elementInfo.$attrs.buttonNotificationInfo?.[`${it}TemplateCode`] || "",
                [`${it}Receiver`]: elementInfo.$attrs.buttonNotificationInfo?.[`${it}Receiver`] || [],
                [`${it}OtherReceiverList`]: elementInfo.$attrs.buttonNotificationInfo?.[`${it}OtherReceiverList`] || "",
              }
            }
          })
          arr.push({
            ...item,
            ...obj
          })
        })
        dispatch({ type: ActionType.changeFiledActionArr, payload: { ...state, filedActionArr: arr } })
        form.setFieldsValue({ ...obj })
      }
      form.setFieldsValue({
        formButton: elementInfo.$attrs.formButton || [],
        nodeApproveType: elementInfo.$attrs.nodeApproveType,
        processorSetting: elementInfo.$attrs.processorSetting,
        assignee: elementInfo.assignee || '',
        collection: elementInfo.$attrs.collection || '',
        variable: elementInfo.$attrs.variable || '',
        condition: elementInfo.$attrs.condition,
        customCondition: elementInfo.$attrs.customCondition,
        ruleParam: elementInfo.$attrs.ruleParam,
        allocationType: elementInfo.$attrs.allocationType,
        emptySuperiorDepartment: elementInfo.$attrs.emptySuperiorDepartment,
        superiorDepartment: elementInfo.$attrs.superiorDepartment,
        superior: elementInfo.$attrs.superior,
      })
      parseInitNotice(elementInfo)
      parseDealPersonInitInfo(elementInfo)
      if (elementInfo.$attrs.userForm) {
        setUserForm(elementInfo.$attrs.userForm)
        dispatch({ type: ActionType.changeUserForm, payload: { ...state, userForm: elementInfo.$attrs.userForm } })
      } else {
        if (form.getFieldValue('progressForm')) {
          getStartFormList(startNode[0].businessObject.$attrs.progressForm).then(result => {
            setUserForm(Array.isArray(result) ? result : [])
            dispatch({ type: ActionType.changeUserForm, payload: { ...state, userForm: Array.isArray(result) ? result : [] } })
          })
        } else {
          setUserForm([])
          dispatch({ type: ActionType.changeUserForm, payload: { ...state, userForm: [] } })
        }
      }
    }
    if (type === EventType.SEQUENCEFLOW) {
      form.setFieldsValue({
        expressions: elementInfo.conditionExpression?.body
      })

    }
    if (type === EventType.ENDEVENT) {
      form.setFieldsValue({
        dataSourceUrl: elementInfo.$attrs.dataSourceUrl || '',
        dateSourceId: elementInfo.$attrs.dateSourceId || '',
        dataSourceType: elementInfo.$attrs.dataSourceType || '',
      })
      dispatch({ type: ActionType.changeCallbackType, payload: { ...state, activeCallbackKey: elementInfo.$attrs.dataSourceType } })
    }
  }

  // 初始化组装执行监听数据
  const parseInitExecuteListening = (element: CommonParamType) => {
    const arr = parseExecuteListeningInit(element)
    dispatch({
      type: ActionType.changeExecuteListeningType, payload: { ...state, executeListeningType: arr.length > 0 ? arr[0].executeListeningType : '' }
    })
    dispatch({
      type: ActionType.changeSelectListening, payload: { ...state, selectListeningRow: arr[0] as ExecuteListeningType || {} }
    })
    dispatch({
      type: ActionType.changeExecuteListeningList, payload: { ...state, executeListeningList: arr as ExecuteListeningType[] }
    })
    dispatch({
      type: ActionType.changeSelectListeningParams, payload: { ...state, selectListeningParamsRow: (arr[0] as ExecuteListeningType)?.executeParam?.[0] || {} }
    })
    form.setFieldsValue({
      ...arr[0],
      ...arr[0]?.executeParam[0],
      executeListening: JSON.stringify(arr)
    })
  }

  // 初始化组装通知数据
  const parseInitNotice = (element: CommonParamType) => {
    const fieldsArr = ['noticeType', 'pendingNoticeFlag', 'pendingNoticeUser', 'urgeNoticeFlag', 'urgeNoticeUser', 'overtimeFlag', 'overtimeFinishFlag', 'overtimeNoticeUser', 'deadline', 'deadlineKey', 'urgeNoticeTimeKey', 'overtimeNoticeTimeKey', 'overtimeNoticeTime', 'urgeNoticeTime']
    const originData = element.$attrs
    const obj = {}
    fieldsArr.forEach(item => {
      obj[item] = originData[item]
    })
    form.setFieldsValue(obj)
    dispatch({ type: ActionType.changePendingNoticeFlag, payload: { ...state, pendingNoticeFlag: originData.pendingNoticeFlag || false } })
    dispatch({ type: ActionType.changeUrgeNoticeFlag, payload: { ...state, urgeNoticeFlag: originData.urgeNoticeFlag || false } })
    dispatch({ type: ActionType.changeDealTime, payload: { ...state, deadline: originData.deadline } })
    dispatch({ type: ActionType.changeOvertimeFlag, payload: { ...state, overtimeFlag: originData.overtimeFlag || false } })
  }

  // 组装初始化的dealPerson数据
  const parseDealPersonInitInfo = (element: CommonParamType) => {
    const originData = element.$attrs
    if (originData.nodeCandidate) {
      let departInfo: UserTaskTreeInfoType = { checkedKeys: [], checkedRowInfo: [] }
      let authInfo: UserTaskTreeInfoType = { checkedKeys: [], checkedRowInfo: [] }
      let personInfo: UserTaskTreeInfoType = { checkedKeys: [], checkedRowInfo: [] }
      // let posInfo: UserTaskTreeInfoType = { checkedKeys: [], checkedRowInfo: [] }
      let allInfo: UserTaskTreeRowType[] = []
      originData.nodeCandidate.forEach((item: string, index: number) => {
        const rowType = item.split(":")[0]
        const key = originData.nodeCandidateKey[index]
        if (rowType === Constant.UserTaskDealPersonTab[0].name) {
          state.parseDepartmentList.forEach((it: CommonParamType) => {
            it.activePane = Constant.UserTaskDealPersonTab[0].name
            if (it.key === key) {
              departInfo.checkedRowInfo.push(it as UserTaskTreeRowType)
              Array.isArray(departInfo.checkedKeys) ? departInfo.checkedKeys.push(key) : departInfo.checkedKeys.checked.push(key)
              allInfo.push({ activePane: Constant.UserTaskDealPersonTab[0].name, title: `${Constant.UserTaskDealPersonTab[0].name}:${it.title}`, key: it.key })
            }
          })
        }
        if (rowType === Constant.UserTaskDealPersonTab[1].name) {
          state.authList.forEach((it: CommonParamType) => {
            it.activePane = Constant.UserTaskDealPersonTab[1].name
            if (it.key === key) {
              authInfo.checkedRowInfo.push(it as UserTaskTreeRowType)
              Array.isArray(authInfo.checkedKeys) ? authInfo.checkedKeys.push(key) : authInfo.checkedKeys.checked.push(key)
              allInfo.push({ activePane: Constant.UserTaskDealPersonTab[1].name, title: `${Constant.UserTaskDealPersonTab[1].name}:${it.title}`, key: it.key })
            }
          })
        }
        if (rowType === Constant.UserTaskDealPersonTab[2].name) {
          state.allPersonList.forEach((it: CommonParamType) => {
            it.activePane = Constant.UserTaskDealPersonTab[2].name
            if (it.key === key) {
              personInfo.checkedRowInfo.push(it as UserTaskTreeRowType)
              Array.isArray(personInfo.checkedKeys) ? personInfo.checkedKeys.push(key) : personInfo.checkedKeys.checked.push(key)
              allInfo.push({ activePane: Constant.UserTaskDealPersonTab[2].name, title: `${Constant.UserTaskDealPersonTab[2].name}:${it.title}`, key: it.key })
            }
          })
        }
      })
      dispatch({
        type: ActionType.changeCheckedDepartmentList,
        payload: { ...state, checkedDepartInfo: departInfo }
      })
      dispatch({
        type: ActionType.changeCheckedAuthInfo,
        payload: { ...state, checkedAuthInfo: authInfo }
      })
      dispatch({
        type: ActionType.changeCheckedPersonInfo,
        payload: { ...state, checkedPersonInfo: personInfo }
      })
      dispatch({ type: ActionType.changeCheckedAllList, payload: { ...state, checkedAllList: allInfo } })
      localStorage.setItem(Constant.USER_TASK_PERSON, JSON.stringify({
        checkedAllList: allInfo,
        checkedDepartInfo: departInfo,
        checkedAuthInfo: authInfo,
        checkedPersonInfo: personInfo
      }))
    } else {
      dispatch({
        type: ActionType.changeCheckedDepartmentList,
        payload: { ...state, checkedDepartInfo: { checkedKeys: [], checkedRowInfo: [] } }
      })
      dispatch({
        type: ActionType.changeCheckedAuthInfo,
        payload: { ...state, checkedAuthInfo: { checkedKeys: [], checkedRowInfo: [] } }
      })
      dispatch({
        type: ActionType.changeCheckedPersonInfo,
        payload: { ...state, checkedPersonInfo: { checkedKeys: [], checkedRowInfo: [] } }
      })
      dispatch({
        type: ActionType.changeCheckedAllList,
        payload: { ...state, checkedAllList: [] }
      })
      localStorage.setItem(Constant.USER_TASK_PERSON, JSON.stringify({
        checkedAllList: [],
        checkedDepartInfo: { checkedKeys: [], checkedRowInfo: [] },
        checkedAuthInfo: { checkedKeys: [], checkedRowInfo: [] },
        checkedPersonInfo: { checkedKeys: [], checkedRowInfo: [] }
      }))
    }
    if (originData.ruleKey) {
      const arr: UserTaskTreeRowType[] = []
      if (originData.ruleKey.length > 0) {
        state.ruleList.forEach(item => {
          originData.ruleKey.forEach((it: string) => {
            if (item.key === it) {
              arr.push(item as UserTaskTreeRowType)
            }
          })
        })
      }
      dispatch({
        type: ActionType.changeCheckedRule,
        payload: {
          ...state,
          checkedRuleInfo: { checkedKeys: originData.ruleKey, checkedRowInfo: arr }
        }
      })
      localStorage.setItem(Constant.USER_TASK_RULE, JSON.stringify(state.checkedRuleInfo))
    } else {
      dispatch({
        type: ActionType.changeCheckedRule,
        payload: {
          ...state,
          checkedRuleInfo: { checkedKeys: [], checkedRowInfo: [] }
        }
      })
      localStorage.setItem(Constant.USER_TASK_RULE, JSON.stringify({
        checkedKeys: [],
        checkedRowInfo: []
      }))
    }
  }

  const getStartFormList = (id: string) => {
    return new Promise((resolve, reject) => {
      const params = {
        itemType: 0,
        pageId: id
      }
      progressApi.getPageItemList(params as UserTaskFieldType).then(result => {
        if (result && result.success) {
          const list = result.data.map((item: UserFormType) => {
            item = {
              ...item,
              edit: false,
              hidden: false,
              required: false,
              disabled: true,
              activeKey: ActiveKeyType.disabled
            }
            return item
          })
          resolve(list)
        } else {
          reject("接口请求错误")
        }
      })
    }).catch(err => err)
  }

  // 改变表单选择后查询表单权限
  const getUserForm = async (e: string) => {
    const result = await getStartFormList(e)
    setUserForm(Array.isArray(result) ? result : [])
    dispatch({ type: ActionType.changeUserForm, payload: { ...state, userForm: Array.isArray(result) ? result : [] } })
  }

  const cancelElement = () => { // 点击取消按钮
    initForm(curElement.type, curElement)
    setDrawVisible(false)
  }

  const saveListeners = (result: CommonParamType) => {
    if (result.executeListening) {
      const otherExtensions: any = [];
      const bpmnElementListeners: any = []
      // const bpmnElementListeners = curElement.businessObject?.extensionElements?.values?.filter((ex: CommonParamType) => ex.$type === `camunda:ExecutionListener`) ?? [];
      const listenInfo = JSON.parse(result.executeListening) as ExecuteListeningType[]
      const executeInfo = parseExecuteListening(listenInfo)
      executeInfo.forEach(item => {
        const listenerObject = createListenerObject(item, false, 'camunda');
        bpmnElementListeners.push(listenerObject)
        const newElExtensionElements = ((window as any).bpmnInstances as BpmnElementApi).moddle.create(`bpmn:ExtensionElements`, {
          values: otherExtensions.concat(bpmnElementListeners)
        });
        ((window as any).bpmnInstances as BpmnElementApi).modeling.updateProperties(curElement, {
          extensionElements: newElExtensionElements
        })
      })
    }
  }

  const filterUnuseFields = (params: CommonParamType) => {
    // 先判断字段中是否含有CallbackUrl,用来组装用户节点的formButtonUrl
    const primaryKeyArr = ["CallbackUrl", "NcFlag", "TemplateCode", "Receiver", "OtherReceiverList"]
    const formButtonUrl = {}
    const buttonNotificationInfo = {}
    const arr = ["executeContent", "executeEventType", "executeListening", "executeListeningType", "executeParam", "executeScrpitContent", "executeScrpitType", "executeParamsName", "executeParamsType", "executeParamsValue"];
    const newParam = JSON.parse(JSON.stringify(params))
    const formButtonUrlArr: string[] = []
    if (newParam.formButton && Array.isArray(newParam.formButton) && newParam.formButton.length > 0) {
      newParam.formButton.forEach((item: string) => {
        primaryKeyArr.forEach((it: string) => {
          formButtonUrlArr.push(`${item}${it}`)
        })
      })
    }
    let newArr: string[] = arr.concat(formButtonUrlArr)
    Object.keys(newParam).forEach((item) => {
      primaryKeyArr.forEach(str => {
        if (item.indexOf(str) > -1) {
          if (str === "CallbackUrl") {
            formButtonUrl[item] = newParam[item]
          } else {
            buttonNotificationInfo[item] = newParam[item]
          }
        }
      })
      newArr.forEach(it => {
        if (item === it) {
          delete newParam[item]
        }
      })
    });
    if (eventType === EventType.USERTASK) {
      newParam.formButtonUrl = formButtonUrl
      newParam.buttonNotificationInfo = buttonNotificationInfo
    }
    return newParam
  }

  const saveElement = () => { // 点击保存
    form.validateFields().then(result => {
      if (result) {
        const newParam = filterUnuseFields(result);
        ((window as any).bpmnInstances as BpmnElementApi).modeling.updateProperties(curElement, {
          ...newParam
        });
        if (result.executeListening) {
          saveListeners(result)
        }
        if (eventType === EventType.USERTASK) { // 用户节点
          let loopCharacteristics = ((window as any).bpmnInstances as BpmnElementApi).moddle.create("bpmn:MultiInstanceLoopCharacteristics");
          if (result.condition) {
            if (result.condition !== "custom") {
              let completionCondition = ((window as any).bpmnInstances as BpmnElementApi).bpmnFactory.create("bpmn:FormalExpression", {
                body: result.condition
              });
              loopCharacteristics.completionCondition = completionCondition
            } else {
              if (result.customCondition) {
                let completionCondition = ((window as any).bpmnInstances as BpmnElementApi).bpmnFactory.create("bpmn:FormalExpression", {
                  body: result.customCondition ? "${ nrOfCompletedInstances / nrOfInstances >= " + (result.customCondition / 100) + "}" : undefined
                });
                loopCharacteristics.completionCondition = completionCondition
              }
            }
          }
          if (result.nodeApproveType === UserTaskDealType.SINGLE) { // 单人审批
            ((window as any).bpmnInstances as BpmnElementApi).modeling.updateProperties(curElement, {
              ['camunda:assignee']: "${" + curElement.id + "User}",
              loopCharacteristics: undefined,
              collection: undefined,
              isSequential: undefined,
              elementVariable: undefined
            })
          }
          if (result.nodeApproveType === UserTaskDealType.SERIAL) { // 多人串行
            loopCharacteristics.$attrs['isSequential'] = true;
            loopCharacteristics.$attrs['camunda:collection'] = "${" + curElement.id + "List}";
            loopCharacteristics.$attrs['camunda:elementVariable'] = "" + curElement.id + "User";
            ((window as any).bpmnInstances as BpmnElementApi).modeling.updateProperties(curElement, {
              loopCharacteristics,
              ['camunda:assignee']: "${" + curElement.id + "User}"
            })
          }
          if (result.nodeApproveType === UserTaskDealType.PARALLEL) { // 多人并行
            // loopCharacteristics.$attrs['isSequential'] = false;
            loopCharacteristics.$attrs['camunda:collection'] = "${" + curElement.id + "List}";
            loopCharacteristics.$attrs['camunda:elementVariable'] = "" + curElement.id + "User";
            ((window as any).bpmnInstances as BpmnElementApi).modeling.updateProperties(curElement, {
              loopCharacteristics,
              ['camunda:assignee']: "${" + curElement.id + "User}"
            })
          }
          ((window as any).bpmnInstances as BpmnElementApi).modeling.updateProperties(curElement, {
            userForm,
          })
          if (result.executeListening) {
            saveListeners(result)
          }
          setUserForm([])
          dispatch({ type: ActionType.changeUserForm, payload: { ...state, userForm: [] } })
        }
        if (eventType === EventType.SEQUENCEFLOW) { // 连线
          if (result.expressions) {
            let conditionExpression = null
            conditionExpression = ((window as any).bpmnInstances as BpmnElementApi).moddle.create("bpmn:FormalExpression", {
              body: result.expressions,
            });
            ((window as any).bpmnInstances as BpmnElementApi).modeling.updateProperties(curElement, {
              conditionExpression,
            });
          }
        }
        setDrawVisible(false)
      }
    })
  }

  const renderContent = () => {
    switch (eventType) {
      case EventType.STARTEVENT:
        return <StartEvent executeForm={executeForm} form={form} eventType={eventType} closeSettingFieldsModal={(visible: boolean) => setFiledVisible(visible)} />
      case EventType.SEQUENCEFLOW:
        return <SequenceFlow form={form} eventType={eventType} executeForm={executeForm} expressionForm={expressionForm} />
      case EventType.USERTASK:
        return <UserTaskComponent
          executeForm={executeForm}
          noticeForm={noticeForm}
          eventType={eventType}
          curElement={curElement}
          form={form}
          nodeApproveType={nodeApproveType}
          closeSettingFieldsModal={(visible: boolean) => setFiledVisible(visible)}
          closeDealPersonModal={(visible: boolean) => setDealPersonVisible(visible)}
          closeSettingModal={(visible: boolean) => setProcessorSettingVisible(visible)}
          changeProgressForm={(e) => getUserForm(e)}
          changeNodeApproveType={(e: string) => setNodeApproveType(e)}
          userTaskCondition={userTaskCondition}
          processorSetting={processorSetting}
          changeDealPersonType={(code: string) => {
            form.setFieldsValue({ allocationType: '' })
            setProcessorSetting(code)
          }}
          changeCondition={
            (e: string, row: DefaultOptionType) => {
              form.setFieldsValue({ customCondition: null })
              setUserTaskCondition(row)
            }}
        />
      case EventType.ENDEVENT:
        return <EndEvent
          executeForm={executeForm}
          form={form}
          eventType={eventType}
          closeSettingFieldsModal={(visible: boolean) => setFiledVisible(visible)}
        // changeProgressForm={(e) => { }}
        />
      default:
        return <Collapse defaultActiveKey={['1']} className={styles.list}>
          <Panel header={intl.formatMessage({ id: 'component.customPanel.info', defaultMessage: '节点信息' })} key="1">
            <BaseInfo eventType={eventType} />
          </Panel>
        </Collapse>
    }
  }
  return (
    <>
      <Drawer
        destroyOnClose
        mask={false}
        width="20.83vw"
        className={styles.draw}
        title={intl.formatMessage({ id: 'component.customPanel.title', defaultMessage: '节点属性' })}
        extra={<CloseOutlined onClick={() => cancelElement()} />}
        closable={false}
        placement="right"
        onClose={() => {
          cancelElement()
        }}
        visible={drawerVisible}
        footer={
          <div className={styles.footerBtn}>
            <Button onClick={() => cancelElement()} style={{ "marginRight": "10px" }}>{intl.formatMessage({ id: 'pages.cancel', defaultMessage: '取消' })}</Button>
            <Button type="primary" onClick={() => saveElement()}>{intl.formatMessage({ id: 'pages.ok', defaultMessage: '确定' })}</Button>
          </div>
        }
      >
        <Form
          form={form}
          autoComplete="off"
          layout="vertical"
        >
          {renderContent()}
        </Form>
      </Drawer>
      <SettingFields
        controller={props.controller}
        visible={filedVisible}
        userForm={userForm}
        closeModal={(visible: boolean) => {
          setFiledVisible(visible)
        }}
        updateUserForm={(data: UserFormType[]) => {
          setUserForm(data)
          dispatch({ type: ActionType.changeUserForm, payload: { ...state, userForm: data } })
        }}
      />
      <DealPerson
        visible={dealPersonVisivle}
        closeModal={(show: boolean) => setDealPersonVisible(show)}
      />
      <ProcessSetting
        visible={processSettingVisible}
        closeModal={(show: boolean) => setProcessorSettingVisible(show)}
      />
      <NoticeModal form={form} noticeForm={noticeForm} />
      <ListeningModal form={form} executeForm={executeForm} />
      <Nodename form={form} dataSource={nameDataSource} changeDataSource={setNameDataSource} />
      <Expression form={form} expressionForm={expressionForm} userForm={userForm} />
    </>
  )
}

export default CustomPanel
