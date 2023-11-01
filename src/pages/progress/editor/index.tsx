import { useRef, useEffect, useState, useReducer } from 'react';
import { Button, Form, Input, List, Modal, notification, Spin } from 'antd';
import classNames from 'classnames';
import styles from './index.less';
// 引入建模的依赖
import BpmnJSModeler from 'bpmn-js/lib/Modeler';
// 添加了右侧的属性面板  type: camunda
import propertiesPanelModule from 'bpmn-js-properties-panel';
import propertiesProviderModule from 'bpmn-js-properties-panel/lib/provider/camunda';
import camundaModdleDescriptor from '@/template/camundaModdleDescriptor';
import { ApiConfig, CommonParamType, DicType, ProgressDetailType } from '@/types/common';
import { exportProgressXml, formatSeconds, getAppId, getLocaleLanguage, getUrlParms, isEmptyObject, parseTreeData, treeToFlat } from '@/utils/utils';
import progressApi from '@/services/custom/appInfo/progress';

import customTranslate from '@/components/ProgressEditor/customTranslate/customTranslate';
import { useHistory, useIntl } from 'umi';
import { Constant } from '@/constant';
import CustomPanel from '@/components/CustomPanel'
import { ActionType, initialState, ProgressModal, reducer } from '@/context/progress';
import { ActiveKeyType, BpmnElementApi, EventType, LangListType, NodeCandidateType, NodeNameItemType, ProgressSaveType, SaveNodeInfo, TreeDataNode, UserFormType, UserTaskDealType, UserTaskNoticeModalItem, UserTaskNoticeModalParams } from '../type';
import pageApi from '@/services/custom/appInfo';
import roleApi from '@/services/custom/appInfo/role';
import { apiRequest } from '@/services/custom/appInfo/apiService';
import { DataNode } from 'antd/lib/tree';
import { parseLocales, revertLocales, setUrgeNoticeTimeData } from './common';

function Editor() {
  const intl = useIntl();
  const [loading, setLoading] = useState(false) // 加载状态
  const containerRef = useRef(null);
  const [bpmnjsModeler, setBpmnjsModeler] = useState<CommonParamType>({});
  const id: string | number = getUrlParms("id")
  const history = useHistory()
  const [exit, setExit] = useState(false)
  const [fileVisible, setFileVisible] = useState(false)
  const [addForm] = Form.useForm();
  const [state, dispatch] = useReducer(reducer, initialState)

  useEffect(() => {
    getDicArr()
    searchForm()
    getFormAllList()
    getAuthApi()
    getUserTaskRuleList()
    getLangList()
    getNoticeTemp()
  }, []);

  useEffect(() => {
    if (JSON.stringify(state.langInfo) !== '{}') {
      if (id) {
        init()
      } else {
        renderBpmn()
      }
    }
  }, [state.langInfo])

  // 规则
  useEffect(() => {
    if (!isEmptyObject(bpmnjsModeler)) {
      const ElementRegistry = bpmnjsModeler.get("elementRegistry")
      const modeling = bpmnjsModeler.get('modeling');
      const userTaskNode = ElementRegistry.filter((x: { type: EventType; }) => x.type === EventType.USERTASK)
      if (state.ruleList.length > 0) {
        userTaskNode.forEach((item: CommonParamType) => {
          state.detailInfo.bindWfDTO.nodes.forEach((it: CommonParamType) => {
            if (it.pageAuth?.nodeCandidate?.processorSetting == '1' && item.id === it.nodeId) { // 规则
              const arr: string[] = []
              const keyArr: (string | number)[] = []
              state.ruleList.forEach(str => {
                it.pageAuth?.nodeCandidate?.rule.forEach((s: { ruleId: string | number; }) => {
                  if (s.ruleId === str.key) {
                    arr.push(str.title as string)
                    keyArr.push(str.key)
                  }
                })
              })
              modeling.updateProperties(item, { ruleKey: keyArr, rule: arr })
            }
          })
        })
      }
      if (!isEmptyObject(state.dealApiInfo)) {
        let flag;
        if (state.dealApiInfo.authType === 1) { // 共享
          flag = state.allPersonList.length > 0 && state.departmentList.length > 0;
        }
        if (state.dealApiInfo.authType === 0) { // 低代码平台
          // flag = state.allPersonList.length > 0 && state.departmentList.length > 0 && state.allPosList.length > 0 && state.authList.length > 0
          flag = state.allPersonList.length > 0 && state.departmentList.length > 0 && state.authList.length > 0
        }
        if (flag) {
          const orgArr = treeToFlat(JSON.parse(JSON.stringify(state.departmentList)), [])
          dispatch({ type: ActionType.changeParseDepartmentList, payload: { ...state, parseDepartmentList: orgArr as DataNode[] } })
          userTaskNode.forEach((item: CommonParamType) => {
            let dealPersonObj: { nodeCandidate: string[], nodeCandidateKey: string[] } = {
              nodeCandidate: [],
              nodeCandidateKey: []
            }
            state.detailInfo.bindWfDTO.nodes.forEach((it: CommonParamType) => {
              if (it.pageAuth?.nodeCandidate?.processorSetting == '0' && item.id === it.nodeId) { // 处理人
                if (it.pageAuth?.nodeCandidate?.org?.length > 0) {
                  orgArr?.forEach((str: CommonParamType) => {
                    it.pageAuth?.nodeCandidate?.org.forEach((s: string) => {
                      if (str.businessId === s) {
                        dealPersonObj.nodeCandidateKey.push(s)
                        dealPersonObj.nodeCandidate.push(`${Constant.UserTaskDealPersonTab[0].name}:${str.title}`)
                      }
                    })
                  })
                }
                if (it.pageAuth.nodeCandidate?.role?.length > 0) {
                  state.authList?.forEach((str: CommonParamType) => {
                    it.pageAuth.nodeCandidate?.role.forEach((s: string) => {
                      if (str.roleId === s) {
                        dealPersonObj.nodeCandidateKey.push(s)
                        dealPersonObj.nodeCandidate.push(`${Constant.UserTaskDealPersonTab[1].name}:${str.title}`)
                      }
                    })
                  })
                }
                if (it.pageAuth.nodeCandidate?.user?.length > 0) {
                  state.allPersonList?.forEach((str: CommonParamType) => {
                    it.pageAuth.nodeCandidate?.user.forEach((s: string) => {
                      if (str.userId === s) {
                        dealPersonObj.nodeCandidateKey.push(s)
                        dealPersonObj.nodeCandidate.push(`${Constant.UserTaskDealPersonTab[2].name}:${str.title}`)
                      }
                    })
                  })
                }
                // if (it.pageAuth.nodeCandidate?.position?.length > 0) {
                //   state.allPosList?.forEach((str: CommonParamType) => {
                //     it.pageAuth.nodeCandidate?.position.forEach((s: string) => {
                //       if (str.positionId === s) {
                //         dealPersonObj.nodeCandidateKey.push(s)
                //         dealPersonObj.nodeCandidate.push(`${Constant.UserTaskDealPersonTab[3].name}:${str.title}`)
                //       }
                //     })
                //   })
                // }
                modeling.updateProperties(item, dealPersonObj)
              }
            })
          })
        }
      }
    }
  }, [state.ruleList, state.allPersonList, state.departmentList, state.authList, state.dealApiInfo, bpmnjsModeler])

  const getNoticeTemp = async () => {
    const params = {
      "@lc_datasource": "888",
      "@camel": true,
      "@enableLang": true,
      "[]": {
        "LC_EMAIL_TEMPLATE": {
          "tenantId": getUrlParms("tenantId") || "",
          "appId": getAppId() || JSON.parse(localStorage.getItem(`appInfo-${localStorage.getItem("currentPath")}`) as string).appId,
        }
      }
    }
    const result = await progressApi.getNoticeTemp(params)
    if (result && result.success) {
      const list = result.data.list.map((item: DicType) => {
        return {
          label: item.templateName,
          value: item.templateCode
        }
      })
      dispatch({ type: ActionType.changeNoticeTempArr, payload: { ...state, noticeTempArr: list } })
    }
  }

  // 查询api,如果返回的authType=0，则调开发平台自己的部门、组织、人员、角色接口，=1则调接口返回的api接口
  const getAuthApi = async () => {
    const result = await roleApi.getApiConfig()
    if (result && result.success) {
      dispatch({ type: ActionType.changeDealApiInfo, payload: { ...state, dealApiInfo: result.data } })
      if (result.data.authType === 0) { // 低代码平台
        getUserTaskDepartment()
        getUserTaskAuth()
        getShareAllUser()
        // getShareAllPos()
      } else { // 共享平台
        getUserTaskDepartment(result.data.orgListApi)
        getShareAllUser(result.data.userListApi)
        // getShareAllPos(result.data.positionListApi)
        getUserTaskAuth(result.data.queryRoleApi)
      }
    }
  }

  const getLangList = async () => {
    const result = await progressApi.getLangList()
    if (result && result.success) {
      const obj: LangListType = {}
      result.data.forEach((item: { languageCode: string; languageName: string; }) => {
        obj[item.languageCode] = {
          text: item.languageName,
          status: item.languageCode
        }
      })
      dispatch({ type: ActionType.changeLangInfo, payload: { ...state, langInfo: obj } })
    }
  }

  const getDicArr = async () => { // 查询数据字典
    const params = {
      parentId: ["notifyReceiver", "conditionalRelation", "emptySuperiorDepartment", "superiorDepartment", "superior", "wf_status", "notice_user", "notice_type", "wfbtncons", "node_approve_type", "node_status", "complate_condition", "processorSetting", "callback_type", "execute_event_type", "execute_listening_type", 'task_event_type', 'execute_params_type', 'script_type', 'allocation_type']
    }
    const result = await progressApi.getDicList(params)
    if (result && result.success) {
      const list = result.data.map((item: CommonParamType) => {
        return {
          ...item,
          label: item.constantKey,
          value: item.constantValue,
        }
      })
      const filedActionArrList = list.filter((x: { parentId: string; }) => x.parentId === "wfbtncons")
      dispatch({ type: ActionType.changeFiledActionArr, payload: { ...state, filedActionArr: filedActionArrList } })
      dispatch({ type: ActionType.changeUserTaskProgressList, payload: { ...state, dicList: list } })
    }
  }

  // 查询所有数据源
  const getFormAllList = async () => {
    const params = {
      appId: getAppId()
    }
    const result = await pageApi.getDataSourceList(params)
    if (result && result.success) {
      dispatch({ type: ActionType.changeSourceList, payload: { ...state, sourceList: result.data } })
    }
  }

  const searchForm = async () => {// 查询表单
    const params = {
      appId: getAppId(),
      pageType: "0"
    }
    const result = await progressApi.getFormList(params)
    if (result && result.success) {
      dispatch({ type: ActionType.changeStartFormList, payload: { ...state, startFormList: result.data } })
    }
  }

  // 获取所有用户
  const getShareAllUser = async (api?: ApiConfig) => {
    let result;
    if (api) {
      result = await apiRequest(api)
    } else {
      result = await progressApi.getAllUserTaskPerson()
    }
    const parseData = parseTreeData(result.data, {
      key: 'userId',
      title: 'fullName'
    })
    if (result && result.success) {
      dispatch({ type: ActionType.changeAllPersonList, payload: { ...state, allPersonList: parseData } })
    }
  }

  const getUserTaskDepartment = async (orgApi?: ApiConfig) => { // 获取用户节点的部门
    let result;
    let parseData: DataNode[] = [];
    if (orgApi) {
      result = await apiRequest(orgApi)
      if (result && result.success) {
        if (result.data && result.data) {
          parseData = parseTreeData(result.data.children, {
            key: 'businessId',
            title: 'organizationName'
          })
        }
      }
    } else {
      result = await progressApi.getUserTaskDepartment()
      if (result && result.success) {
        if (result.data && result.data.length > 0) {
          parseData = parseTreeData(result.data, {
            key: 'businessId',
            title: 'organizationName'
          })

        }
      }
    }
    dispatch({
      type: ActionType.changeUserTaskDepartmentList,
      payload: { ...state, departmentList: parseData as DataNode[] }
    })
  }

  const getUserTaskAuth = async (authApi?: ApiConfig) => { // 获取用户节点的角色
    let result;
    let parseData;
    if (authApi) {
      result = await apiRequest(authApi)
      if (result && result.success) {
        if (result.data && result.data) {
          parseData = parseTreeData(result.data, {
            key: 'roleId',
            title: 'chName'
          })
        }
      }
    } else {
      const params = {
        appId: getAppId()
      }
      result = await progressApi.getUserTaskAuth(params)
      if (result && result.success) {
        if (result.data && result.data.length > 0) {
          parseData = parseTreeData(result.data, {
            key: 'roleId',
            title: 'chName'
          })
        }
      }
    }
    dispatch({
      type: ActionType.changeUserTaskAuthList,
      payload: { ...state, authList: parseData as DataNode[] }
    })
  }

  const getUserTaskRuleList = async () => { // 获取用户节点的规则列表
    const params = {
      appId: getAppId(),
      ruleType: 1
    }
    const result = await progressApi.getRuleList(params)
    if (result && result.success) {
      if (result.data && result.data.length > 0) {
        const parseData = parseTreeData(result.data, {
          key: 'ruleId',
          title: 'ruleName'
        })
        dispatch({
          type: ActionType.changeRuleList,
          payload: { ...state, ruleList: parseData }
        })
      }
    }
  }

  // 获取列表
  const init = async () => {
    const params: ProgressDetailType = {
      data: Number(id),
      operator: localStorage.getItem(Constant.USER_INFO_STORAGE) as string,
      "source": "PC",
      "traceId": "",
      "version": "1"
    }
    setLoading(true)
    const result = await progressApi.getListDetail(params)
    dispatch({ type: ActionType.changeDetailInfo, payload: { ...state, detailInfo: result.data } })
    setLoading(false)
    if (result && result.data) {
      renderBpmn(result.data)
    }
  }

  // 渲染bpmn
  const renderBpmn = async (dataSource?: CommonParamType) => {
    const customTranslateModule = {
      translate: ['value', customTranslate],
    };
    let bpmnJSModeler = new BpmnJSModeler({
      additionalModules: [propertiesPanelModule, propertiesProviderModule, customTranslateModule, {
        zoomScroll: ["value", ''],
      }],
      container: containerRef.current,
      moddleExtensions: {
        camunda: camundaModdleDescriptor,
      },
    });
    // 判断是新增还是编辑
    if (dataSource?.wfFileVo.fileContent) {
      await bpmnJSModeler.importXML(dataSource?.wfFileVo.fileContent)
      setInitProperties(bpmnJSModeler, dataSource)
    } else {
      await bpmnJSModeler.createDiagram()
    }
    setBpmnjsModeler(bpmnJSModeler);
    ((window as any).bpmnInstances as BpmnElementApi) = {
      modeling: bpmnJSModeler.get('modeling'),
      elementFactory: bpmnJSModeler.get("elementRegistry"),
      moddle: bpmnJSModeler.get("moddle"),
      bpmnFactory: bpmnJSModeler.get("bpmnFactory")
    }
  }

  const setInitProperties = async (controller: CommonParamType, data: CommonParamType) => {
    const ElementRegistry = controller.get("elementRegistry")
    const modeling = controller.get('modeling');
    const nodesInfo = ElementRegistry.getAll();
    const localLang = getLocaleLanguage()
    let arr: string[] = []
    arr.push(data.bindWfDTO.pageId)
    const list = Array.from(new Set(arr)).map(item => {
      return progressApi.getPageItemList({
        itemType: 0,
        pageId: item
      }).then(res => {
        return {
          pageId: item,
          list: res.data
        }
      })
    })
    const result = await Promise.all(list)
    dispatch({ type: ActionType.changeUserForm, payload: { ...state, userForm: result[0].list } })
    nodesInfo.forEach((item: CommonParamType) => {
      if (item.type === EventType.STARTEVENT) {
        if (data.bindWfDTO.pageId) {
          modeling.updateProperties(item, { progressForm: data.bindWfDTO.pageId })
        }
      }
      data.bindWfDTO.nodes.length > 0 && data.bindWfDTO.nodes.forEach(async (it: CommonParamType) => {
        if (item.id === it.nodeId) {
          if (item.type === EventType.USERTASK) {
            const newPageAuth = JSON.parse(JSON.stringify(it.pageAuth))
            delete newPageAuth.nodeCandidate
            modeling.updateProperties(item, {
              ...newPageAuth,
              // ...it.pageAuth.noticeInfo,
              deadlineKey: it.pageAuth.noticeInfo?.deadline,
              overtimeNoticeTimeKey: it.pageAuth.noticeInfo?.overtimeNoticeTime,
              urgeNoticeTimeKey: it.pageAuth.noticeInfo?.urgeNoticeTime,
              processorSetting: String(it.pageAuth.nodeCandidate?.processorSetting),
              emptySuperiorDepartment: it.pageAuth.nodeCandidate?.emptySuperiorDepartment,
              superiorDepartment: it.pageAuth.nodeCandidate?.superiorDepartment,
              superior: it.pageAuth.nodeCandidate?.superior,
              ruleParam: it.pageAuth.nodeCandidate?.ruleParam,
              progressForm: it.pageId,
              allocationType: it.pageAuth.nodeCandidate?.allocationType,
              passStatus: it.pageAuth.passStatus,
              rejectStatus: it.pageAuth.rejectStatus
            })
            if (it.pageAuth.noticeInfo) {
              getInitNoticeInfo(it, item, modeling)
            }
          }
          if (item.type === EventType.ENDEVENT) {
            modeling.updateProperties(item, {
              dataSourceType: it.pageAuth?.processCallBackTypeDTO?.type,
              dataSourceUrl: it.pageAuth?.processCallBackTypeDTO?.url,
              dateSourceId: it.pageAuth?.processCallBackTypeDTO?.dateSourceId,
              progressForm: it.pageId,
              callbackStatus: it.pageAuth?.callbackStatus
            })
          }
          if (item.type === EventType.STARTEVENT) {
            modeling.updateProperties(item, { callbackStatus: it.pageAuth?.callbackStatus })
          }
          modeling.updateProperties(item, { callbackFlag: it.pageAuth?.callbackFlag })
          // 设置节点名称的国际化
          if (it.nodeName) {
            const newNameKey = revertLocales(it.nodeName, state.langInfo)
            modeling.updateProperties(item, {
              nameKey: newNameKey,
            })
            let langList: NodeNameItemType[] = []
            try {
              langList = JSON.parse(newNameKey)
            } catch (error) { }
            if (langList.length > 0) {
              const local = langList.filter(x => x.languageCode === localLang)
              if (local.length > 0) {
                modeling.updateProperties(item, {
                  name: local[0].value,
                })
              }
            }
          }
          const realUserForm = await updateUserForm(it, data, result)
          modeling.updateProperties(item, {
            userForm: realUserForm,
          })
          if (!item.businessObject.loopCharacteristics) {
            modeling.updateProperties(item, { nodeApproveType: UserTaskDealType.SINGLE })
          } else if (item.businessObject.loopCharacteristics && item.businessObject.loopCharacteristics.isSequential) {
            modeling.updateProperties(item, { nodeApproveType: UserTaskDealType.SERIAL })
          } else if (item.businessObject.loopCharacteristics && !item.businessObject.loopCharacteristics.isSequential) {
            modeling.updateProperties(item, { nodeApproveType: UserTaskDealType.PARALLEL })
          }
        }
      })
    })
  }
  // 回显通知信息
  const getInitNoticeInfo = (it: CommonParamType, item: CommonParamType, controller: CommonParamType) => {
    const { noticeInfo } = it.pageAuth
    let deadlineInfo = { str: "", formObj: {} };
    let overtimeNoticeTimeInfo = { str: "", formObj: {} };
    let urgeNoticeTimeInfo = { str: "", formObj: {} };
    if (noticeInfo.deadline && noticeInfo.deadline !== '{}') {
      const deadline = JSON.parse(noticeInfo.deadline)
      const result = formatSeconds(deadline.relativeTime as number)
      deadlineInfo = {
        str: result.str,
        formObj: {
          relativeTime: deadline.relativeTime
        }
      }
    }
    if (noticeInfo.overtimeNoticeTime && noticeInfo.overtimeNoticeTime !== '{}') {
      overtimeNoticeTimeInfo = parseNoticeInfo(noticeInfo.overtimeNoticeTime, 'overtimeNoticeTime')
    }
    if (noticeInfo.urgeNoticeTime && noticeInfo.urgeNoticeTime !== '{}') {
      urgeNoticeTimeInfo = parseNoticeInfo(noticeInfo.urgeNoticeTime, 'urgeNoticeTime')
    }
    controller.updateProperties(item, {
      ...it.pageAuth.noticeInfo,
      deadline: deadlineInfo.str,
      deadlineKey: JSON.stringify(deadlineInfo.formObj),
      urgeNoticeTime: urgeNoticeTimeInfo.str,
      urgeNoticeTimeKey: JSON.stringify(urgeNoticeTimeInfo.formObj),
      overtimeNoticeTime: overtimeNoticeTimeInfo.str,
      overtimeNoticeTimeKey: JSON.stringify(overtimeNoticeTimeInfo.formObj)
    })
  }

  const parseNoticeInfo = (origin: string, fieldsName: string): { str: string, formObj: UserTaskNoticeModalParams } => {
    const info = JSON.parse(origin) as UserTaskNoticeModalParams
    let relativeInfo;
    let intervalInfo;
    if (info.relativeTime) {
      relativeInfo = formatSeconds(info.relativeTime as number)
    } else {
      relativeInfo = {
        object: {},
        str: ''
      }
    }
    if (info.intervalTime) {
      intervalInfo = formatSeconds(info.intervalTime as number)
    } else {
      intervalInfo = {
        object: {},
        str: ''
      }
    }
    const obj: UserTaskNoticeModalItem = {
      relativeDay: relativeInfo.object.day,
      relativeHour: relativeInfo.object.hour,
      relativeMinute: relativeInfo.object.minute,
      // relativeSecond: relativeInfo.object.second,
      moreAction: info.moreAction,
      noticeCount: info.noticeCount || 1,
      intervalDay: intervalInfo.object.day,
      intervalHour: intervalInfo.object.hour,
      intervalMinute: intervalInfo.object.minute,
      // intervalSecond: intervalInfo.object.second
    }
    const result = setUrgeNoticeTimeData(obj, fieldsName)
    return result
  }

  const updateUserForm = async (nodesItem: CommonParamType, data: CommonParamType, arr: { pageId: string, list: { itemId: string }[] }[]) => {
    const userFormList: CommonParamType[] = []
    if (arr && arr.length > 0) {
      arr.forEach(item => {
        // 根据有nodeCandidate判断他是否为用户节点
        if (item.pageId === nodesItem.pageId && (nodesItem.pageAuth)?.hasOwnProperty('nodeCandidate')) {
          item.list && item.list.forEach((it: { itemId: string }) => {
            let obj = {}
            if (nodesItem.pageAuth?.formField) {
              Object.entries(nodesItem.pageAuth?.formField).forEach((str: any) => {
                if (it.itemId === str[0]) {
                  if (str[1].disabled) {
                    str[1].activeKey = ActiveKeyType.disabled
                  } else if (str[1].edit) {
                    str[1].activeKey = ActiveKeyType.edit
                  } else {
                    str[1].activeKey = ActiveKeyType.hidden
                  }
                  obj = {
                    ...str[1],
                    ...it
                  }
                }
              })
            } else {
              obj = {
                ...it,
                disabled: true,
                edit: false,
                hidden: false,
                required: false,
                activeKey: 2
              }
            }
            userFormList.push(obj)
          })
        }
      })
    }
    return userFormList
  }

  // 点击保存按钮
  const saveXml = async () => {
    const fileName = getUrlParms('fileName');
    if (!id) { // 新增
      const params = {
        fileName,
      }
      const info = await progressApi.checkFileName(params)
      if (info && info.success) {
        if (!info.data) {
          setFileVisible(true)
          addForm.setFieldsValue({ fileName })
          return
        }
        saveAction(fileName)
        return
      }
    }
    saveAction(fileName)
  }

  // 点击sure按钮
  const saveSure = async () => {
    // const rootInfo = bpmnjsModeler.getDefinitions().rootElements
    const result = await addForm.validateFields()
    if (result) {
      const params = {
        fileName: result.fileName,
        id: id ? id : undefined
      }
      const info = await progressApi.checkFileName(params)
      if (info && info.success) {
        if (!info.data) {
          notification.error({
            message: intl.formatMessage({ id: 'pages.model.watch', defaultMessage: '请注意' }),
            description: intl.formatMessage({ id: 'pages.progress.save.fileName', defaultMessage: '文件名称已存在，请重新输入' })
          })
          return
        }
        const modeling = bpmnjsModeler.get('modeling');
        const ElementRegistry = bpmnjsModeler.get("elementRegistry")
        const rootsNodes = ElementRegistry.filter((x: { type: EventType; }) => x.type === EventType.PROCESS)
        modeling.updateProperties(rootsNodes[0], { name: result.fileName })
        saveAction(result.fileName)
      }

    }
  }

  const saveAction = async (fileName?: string) => {
    const ElementRegistry = bpmnjsModeler.get("elementRegistry")
    const modeling = bpmnjsModeler.get('modeling');
    const nodesInfo = ElementRegistry.getAll()
    const start = nodesInfo.filter((x: { type: EventType; }) => x.type === EventType.STARTEVENT)
    const fileId = nodesInfo[0].id + String(Math.random() * 100000000000).substring(0, 11)
    let params: ProgressSaveType = {
      fileSaveDto: {
        fileContent: '',
        fileKey: '',
        fileName: '',
        appId: '',
        tenantId: ''
      },
      bindWfDTO: {
        pageId: '',
        workFlowId: '',
        workFlowName: '',
        nodes: []
      }
    }
    let startNodesNum = 0 // 开始节点的数量
    let endNodesNum = 0   // 结束节点的数量
    let userTaskNum = 0   // 用户节点的数量
    let pageId = ""     // 开始节点的pageId数据
    nodesInfo.forEach((item: CommonParamType) => {
      if (item.type === EventType.STARTEVENT) { // 开始节点
        startNodesNum++
        pageId = item.businessObject.$attrs.progressForm
      }
      if (item.type === EventType.USERTASK) { // 用户节点
        userTaskNum++
      }
      if (item.type === EventType.ENDEVENT) { // 结束节点
        endNodesNum++
      }
    })
    if (startNodesNum === 0) {
      notification.error({
        message: intl.formatMessage({ id: 'pages.model.watch', defaultMessage: '请注意' }),
        description: intl.formatMessage({ id: 'pages.progress.save.start.empty', defaultMessage: '没有开始节点' })
      })
      return
    }
    if (pageId === "" || !pageId) {
      notification.error({
        message: intl.formatMessage({ id: 'pages.model.watch', defaultMessage: '请注意' }),
        description: intl.formatMessage({ id: 'pages.progress.save.start.info', defaultMessage: '请在开始节点绑定表单，pageId不能为空' })
      })
      return
    }
    if (startNodesNum > 1) {
      notification.error({
        message: intl.formatMessage({ id: 'pages.model.watch', defaultMessage: '请注意' }),
        description: intl.formatMessage({ id: 'pages.progress.save.start.more', defaultMessage: '开始节点只能有一个' })
      })
      return
    }
    if (endNodesNum === 0) {
      notification.error({
        message: intl.formatMessage({ id: 'pages.model.watch', defaultMessage: '请注意' }),
        description: intl.formatMessage({ id: 'pages.progress.save.end.empty', defaultMessage: '没有结束节点' })
      })
      return
    }
    if (endNodesNum > 1) {
      notification.error({
        message: intl.formatMessage({ id: 'pages.model.watch', defaultMessage: '请注意' }),
        description: intl.formatMessage({ id: 'pages.progress.save.end.more', defaultMessage: '结束节点只能有一个' })
      })
      return
    }
    if (userTaskNum === 0) {
      notification.error({
        message: intl.formatMessage({ id: 'pages.model.watch', defaultMessage: '请注意' }),
        description: intl.formatMessage({ id: 'pages.progress.save.userTask.empty', defaultMessage: '没有用户任务' })
      })
      return
    }
    const xmlProperties: any[] = [] // 用于在接口报错时回滚
    nodesInfo.forEach((item: CommonParamType) => {
      xmlProperties.push({
        ...item.businessObject.$attrs,
        id: item.id
      })
      let commonObj: any = {
        nodeId: item.id,
        nodeName: item.businessObject.$attrs.nameKey ? parseLocales(item.businessObject.$attrs.nameKey) : '',
      }
      if (item.type === EventType.PROCESS) { // 根节点
        if (id) { // 编辑
          params.bindWfDTO.workFlowId = state.detailInfo.wfFileVo.fileKey
          params.bindWfDTO.workFlowName = state.detailInfo.wfFileVo.fileName
        } else {
          params.bindWfDTO.workFlowId = fileId
          params.bindWfDTO.workFlowName = item.businessObject.name || fileName
        }
      }
      if (item.type === EventType.STARTEVENT) { // 开始节点
        params.bindWfDTO.pageId = item.businessObject.$attrs.progressForm
        commonObj.pageId = item.businessObject.$attrs.progressForm
        commonObj.pageAuth = {
          callbackStatus: item.businessObject.$attrs.callbackStatus,
          callbackFlag: item.businessObject.$attrs.callbackFlag
        }
        params.bindWfDTO.nodes.push(commonObj as SaveNodeInfo)
      }
      if (item.type === EventType.USERTASK) { // 用户节点
        const { userForm, nodeCandidate, nodeCandidateKey, rule, ruleKey } = item.businessObject.$attrs
        const obj = {}
        userForm && userForm.forEach((it: UserFormType) => {
          obj[it.itemKey] = {
            disabled: it.disabled,
            edit: it.edit,
            hidden: it.hidden,
            required: it.required
          }
        })
        let candidataObj: NodeCandidateType = { processorSetting: 0 }
        if (item.businessObject.$attrs.processorSetting == '0') {
          candidataObj = { processorSetting: 0, org: [], role: [], user: [], position: [] }
          nodeCandidate && nodeCandidate.forEach((row: string, index: number) => {
            const rowType = row.split(":")[0]
            if (rowType === Constant.UserTaskDealPersonTab[0].name) { // 部门
              candidataObj.org?.push(nodeCandidateKey[index])
            }
            if (rowType === Constant.UserTaskDealPersonTab[1].name) { // 角色
              candidataObj.role?.push(nodeCandidateKey[index])
            }
            if (rowType === Constant.UserTaskDealPersonTab[2].name) { // 人员
              candidataObj.user?.push(nodeCandidateKey[index])
            }
            if (rowType === Constant.UserTaskDealPersonTab[3].name) { // 岗位
              candidataObj.position?.push(nodeCandidateKey[index])
            }
          })
        }
        if (item.businessObject.$attrs.processorSetting == '1') {
          candidataObj = { processorSetting: 1, rule: [], ruleParam: item.businessObject.$attrs.ruleParam, allocationType: item.businessObject.$attrs.allocationType }
          ruleKey.forEach((str: string, i: number) => {
            candidataObj.rule?.push({
              ruleId: str,
              order: i
            })
          })
        }
        if (item.businessObject.$attrs.processorSetting == '2') {
          candidataObj = { processorSetting: 2, superior: item.businessObject.$attrs.superior }
        }
        if (item.businessObject.$attrs.processorSetting == '3') {
          candidataObj = { processorSetting: 3, superiorDepartment: item.businessObject.$attrs.superiorDepartment, emptySuperiorDepartment: item.businessObject.$attrs.emptySuperiorDepartment }
        }
        const nodesObj: SaveNodeInfo = {
          ...commonObj,
          pageId: item.businessObject.$attrs.progressForm,
          pageAuth: {
            condition: item.businessObject.$attrs.condition,
            customCondition: item.businessObject.$attrs.customCondition,
            nodeUserType: item.businessObject.$attrs.nodeApproveType === UserTaskDealType.SINGLE ? "0" : "1",
            formField: obj,
            formButton: item.businessObject.$attrs.formButton,
            formButtonUrl: item.businessObject.$attrs.formButtonUrl,
            buttonNotificationInfo: item.businessObject.$attrs.buttonNotificationInfo,
            nodeCandidate: candidataObj,
            passStatus: item.businessObject.$attrs.passStatus,
            rejectStatus: item.businessObject.$attrs.rejectStatus,
            callbackFlag: item.businessObject.$attrs.callbackFlag
          }
        }
        if (item.businessObject.$attrs.noticeType && item.businessObject.$attrs.noticeType.length > 0) {
          nodesObj.pageAuth.noticeInfo = {
            noticeType: item.businessObject.$attrs.noticeType,
            pendingNoticeFlag: item.businessObject.$attrs.pendingNoticeFlag,
            deadline: item.businessObject.$attrs.deadlineKey,
            pendingNoticeUser: item.businessObject.$attrs.pendingNoticeUser,
            urgeNoticeFlag: item.businessObject.$attrs.urgeNoticeFlag,
            urgeNoticeTime: item.businessObject.$attrs.urgeNoticeTimeKey,
            urgeNoticeUser: item.businessObject.$attrs.urgeNoticeUser,
            overtimeFlag: item.businessObject.$attrs.overtimeFlag,
            overtimeFinishFlag: item.businessObject.$attrs.overtimeFinishFlag,
            overtimeNoticeTime: item.businessObject.$attrs.overtimeNoticeTimeKey,
            overtimeNoticeUser: item.businessObject.$attrs.overtimeNoticeUser
          }
        }
        params.bindWfDTO.nodes.push(nodesObj)
      }
      if (item.type == EventType.ENDEVENT) { // 结束节点
        params.bindWfDTO.nodes.push({
          ...commonObj,
          pageId: item.businessObject.$attrs.progressForm || start[0].businessObject.$attrs.progressForm,
          pageAuth: {
            callbackStatus: item.businessObject.$attrs.callbackStatus,
            callbackFlag: item.businessObject.$attrs.callbackFlag,
            nodeUserType: item.businessObject.$attrs.nodeApproveType === UserTaskDealType.SINGLE ? "0" : "1",
            processCallBackTypeDTO: {
              type: item.businessObject.$attrs.dataSourceType,
              url: item.businessObject.$attrs.dataSourceUrl,
              dateSourceId: item.businessObject.$attrs.dateSourceId,
            }
          }
        })
      }
    })
    localStorage.setItem(Constant.PROCESS_STORAGE, JSON.stringify(xmlProperties))
    // 获取所有的流程操作权限对应的回调接口字段
    nodesInfo.forEach((item: CommonParamType) => {
      const resetArr = [
        "formButtonUrl", "conditionField", "conditionRelation", "conditionVal", "buttonNotificationInfo",
        "nodeUserType", "formField", "expressions", "nameKey", "allocationType", "passStatus", "rejectStatus", "callbackFlag", "callbackStatus", "superior", "superiorDepartment", "emptySuperiorDepartment",
        "formButton", "nodeCandidate", "nodeCandidateKey", "userForm", "nodeApproveType", "collection", "variable", "condition", "customCondition", "rule", "ruleKey", "processorSetting",
        "dataSourceUrl", "dataSourceType", "dateSourceId", "progressForm", "noticeType", "pendingNoticeFlag", "deadline", "deadlineKey", "pendingNoticeUser", "urgeNoticeFlag", "urgeNoticeTime",
        "urgeNoticeTimeKey", "urgeNoticeUser", "overtimeFlag", "overtimeFinishFlag", "overtimeNoticeTime", "overtimeNoticeTimeKey", "overtimeNoticeUser", "ruleParam", "executeContent", "executeEventType",
        "executeListening", "executeListeningType", "executeParam", "executeScrpitContent", "executeScrpitType", "executeParamsName", "executeParamsType", "executeParamsValue", "noticeInfo"
      ]
      const obj = {}
      resetArr.forEach(it => {
        obj[it] = undefined
      })
      modeling.updateProperties(item, obj)
      if (item.type === EventType.PROCESS) {
        if (!id) { // 编辑状态
          modeling.updateProperties(item, {
            id: fileId
          })
        }
        if (!item.businessObject.isExecutable) {
          modeling.updateProperties(item, { isExecutable: true })
        }
      }
    })
    const info = await bpmnjsModeler.saveXML({ format: true });
    if (id) { // 更新
      params.bindWfDTO.tenantId = state.detailInfo.bindWfDTO.tenantId
      params.fileSaveDto = {
        appId: getAppId(),
        fileContent: info.xml,
        fileKey: state.detailInfo.wfFileVo.fileKey,
        fileName: state.detailInfo.wfFileVo.fileName,
        id,
        status: state.detailInfo.wfFileVo.status
      }
      params.fileSaveDto.tenantId = getUrlParms('tenantId') || state.detailInfo.bindWfDTO.tenantId
      const res = await progressApi.update(params)
      if (res && res.success) {
        notification.success({
          message: intl.formatMessage({
            id: 'pages.btn.success',
            defaultMessage: '操作成功',
          })
        })
        setFileVisible(false)
        localStorage.removeItem(Constant.PROCESS_STORAGE)
        history.goBack()
      } else {
        revertProcess(nodesInfo, xmlProperties, modeling)
      }
    } else {
      params.fileSaveDto = {
        fileContent: info.xml,
        fileKey: fileId,
        fileName: fileName as string,
        appId: getAppId()
      }
      if (getUrlParms('tenantId')) {
        params.fileSaveDto.tenantId = getUrlParms('tenantId')
        params.bindWfDTO.tenantId = getUrlParms('tenantId')
      }
      const res = await progressApi.save(params)
      if (res && res.success) {
        localStorage.removeItem(Constant.PROCESS_STORAGE)
        notification.success({
          message: intl.formatMessage({
            id: 'pages.btn.success',
            defaultMessage: '操作成功',
          }),
        })
        setFileVisible(false)
        history.goBack()
      } else {
        revertProcess(nodesInfo, xmlProperties, modeling)
      }
    }
  }
  // 当接口报错时，重新把数据写进xml
  const revertProcess = (nodesInfo: CommonParamType, xmlProperties: CommonParamType, modeling: CommonParamType) => {
    nodesInfo.forEach((item: CommonParamType) => {
      xmlProperties.forEach((it: CommonParamType) => {
        if (item.id === it.id) {
          delete it.id
          modeling.updateProperties(item, it)
        }
      })
    })
  }

  // 导出xml
  const exportXml = () => {
    exportProgressXml(bpmnjsModeler, 'xml')
  }

  return (
    <ProgressModal.Provider value={{ state, dispatch }}>
      <Spin spinning={loading}>
        <div className={styles.mainBiz}>
          <div className={styles.bizBlock}>
            <Button onClick={exportXml}>导出XML</Button>
            <Button onClick={saveXml}>保存</Button>
            <Button onClick={() => setExit(true)}>退出</Button>
          </div>
          <div className={classNames(styles.bizBlock, styles.bpmnCanvas)} ref={containerRef} />

          <CustomPanel controller={bpmnjsModeler} />
        </div>
        {/* 点击退出 */}
        <Modal
          title={intl.formatMessage({ id: 'pages.model.tip', defaultMessage: '温馨提示' })}
          visible={exit}
          onOk={() => { setExit(false); history.goBack() }}
          onCancel={() => setExit(false)}
          okText={intl.formatMessage({ id: 'pages.ok', defaultMessage: '确认' })}
          cancelText={intl.formatMessage({ id: 'pages.cancel', defaultMessage: '取消' })}
        >
          <p>{intl.formatMessage({ id: 'pages.exit.placeholder', defaultMessage: '请确认是否要退出?' })}</p>
        </Modal>
        {/* 点击新建流程 */}
        <Modal
          title={intl.formatMessage({ id: "pages.progress.model.title", defaultMessage: "新建流程" })}
          destroyOnClose
          visible={fileVisible}
          okText={intl.formatMessage({ id: "pages.ok", defaultMessage: "确定" })}
          cancelText={intl.formatMessage({ id: "pages.cancel", defaultMessage: "取消" })}
          onOk={saveSure}
          onCancel={() => setFileVisible(false)}>
          <Form
            form={addForm}
            name="advanced_search"
            className="ant-advanced-search-form"
            preserve={false}
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 16 }}
          >
            <Form.Item
              name="fileName"
              label={intl.formatMessage({ id: 'pages.appInfo.progress.table.fileName', defaultMessage: '流程名称' })}
              rules={[{ required: true, message: intl.formatMessage({ id: 'pages.appInfo.progress.form.fileName.placeholder', defaultMessage: '请输入流程名称' }) }]}
            >
              <Input autoComplete='off' placeholder={intl.formatMessage({ id: 'pages.appInfo.progress.form.fileName.placeholder', defaultMessage: '请输入流程名称' })} />
            </Form.Item>
          </Form>
        </Modal>
      </Spin>
    </ProgressModal.Provider>
  );
}

export default Editor;
