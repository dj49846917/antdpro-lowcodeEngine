import { ActionType, ProcessAction, ProcessStateType } from "@/context/progress"
import { CommonParamType } from "@/types/common"
import { formatSeconds } from "@/utils/utils"
import { FormInstance } from "antd"
import { ExecuteListeningType, LangListType, NodeNameItemType, UserTaskNoticeModalItem, UserTaskNoticeModalParams } from "../type"
import { v4 as uuidv4 } from 'uuid';

// 用户节点通知获取处理完成时限
export const setDeadlineData = (fields: UserTaskNoticeModalItem) => {
  let words = ''
  const arr = []
  if (fields.relativeDay) {
    words += `${fields.relativeDay}天`
    arr.push(fields.relativeDay * 24 * 60 * 60)
  }
  if (fields.relativeHour) {
    words += `${fields.relativeHour}时`
    arr.push(fields.relativeHour * 60 * 60)
  }
  if (fields.relativeMinute) {
    words += `${fields.relativeMinute}分`
    arr.push(fields.relativeMinute * 60)
  }
  // if (fields.relativeSecond) {
  //   words += `${fields.relativeSecond}秒`
  //   arr.push(fields.relativeSecond)
  // }
  const number = arr.reduce((prev, cur) => {
    return prev + cur
  }, 0)

  return {
    words,
    relative: {
      relativeTime: number
    }
  }
}

// 用户节点通知获取间隔时间
export const setIntervalData = (fields: UserTaskNoticeModalItem) => {
  let words = ''
  const arr = []
  if (fields.intervalDay) {
    words += `${fields.intervalDay}天`
    arr.push(fields.intervalDay * 24 * 60 * 60)
  }
  if (fields.intervalHour) {
    words += `${fields.intervalHour}时`
    arr.push(fields.intervalHour * 60 * 60)
  }
  if (fields.intervalMinute) {
    words += `${fields.intervalMinute}分`
    arr.push(fields.intervalMinute * 60)
  }
  // if (fields.intervalSecond) {
  //   words += `${fields.intervalSecond}秒`
  //   arr.push(fields.intervalSecond)
  // }
  if (fields.noticeCount) {
    words += `${fields.noticeCount}次`
  }
  const number = arr.reduce((prev, cur) => {
    return prev + cur
  }, 0)
  return {
    words,
    interval: {
      intervalTime: number,
      noticeCount: fields.noticeCount
    }
  }
}

// 用户节点通知获取催办提醒
export const setUrgeNoticeTimeData = (fields: UserTaskNoticeModalItem, fieldsName: string) => {
  const formObj: UserTaskNoticeModalParams = {}
  let str = fieldsName === 'urgeNoticeTime' ? '提前' : '超过'
  if (!fields.relativeDay && !fields.relativeDay && !fields.relativeMinute) {
    str = ""
  } else {
    const { words, relative } = setDeadlineData(fields)
    formObj.relativeTime = relative.relativeTime
    if (words) {
      str += `${words}${fieldsName === 'urgeNoticeTime' ? '催办提醒' : '开始执行'}`
    }
    if (fields.moreAction) {
      if (fields.intervalDay || fields.intervalHour || fields.intervalMinute) {
        formObj.moreAction = true
        str += "(多次执行)"
        const { words, interval } = setIntervalData(fields)
        str += words
        formObj.intervalTime = interval.intervalTime
        formObj.noticeCount = interval.noticeCount
      } else {
        formObj.moreAction = false
        formObj.noticeCount = 1
        formObj.intervalTime = 0
      }
    }
  }
  return {
    str,
    formObj
  }
}

// 重置通知数据
export const resetNoticeForm = (controller: FormInstance<any>) => {
  controller.setFieldsValue({
    relativeDay: null,
    relativeHour: null,
    relativeMinute: null,
    // relativeSecond: null,
    moreAction: false,
    intervalDay: null,
    intervalHour: null,
    intervalMinute: null,
    // intervalSecond: null,
    noticeCount: null,

  })
}

// 将通知数据进行回写
export const parseInitNoticeModalInfo = (fields: string, controller: FormInstance<any>) => {
  if (!fields || fields === '{}') {
    resetNoticeForm(controller)
    return
  }
  const origin: UserTaskNoticeModalParams = JSON.parse(fields)
  if (!origin) {
    resetNoticeForm(controller)
    return
  }
  let obj: UserTaskNoticeModalItem = {}
  let interval: CommonParamType = {}
  const { object } = formatSeconds(origin.relativeTime as number)
  if (origin.intervalTime) {
    const result = formatSeconds(origin.intervalTime as number)
    interval = result.object
  }
  obj = {
    relativeDay: object.day,
    relativeHour: object.hour,
    relativeMinute: object.minute,
    // relativeSecond: object.second,
    intervalDay: interval.day,
    intervalHour: interval.hour,
    intervalMinute: interval.minute,
    // intervalSecond: interval.second,
    moreAction: origin.moreAction,
    noticeCount: origin.noticeCount
  }
  controller.setFieldsValue(obj)
}

// 修改执行监听中的每一个表单
export const executeChangeListenRow = (e: string, key: string, state: ProcessStateType, dispatch: React.Dispatch<ProcessAction>, props: { form: FormInstance<any>, }) => {
  const obj = JSON.parse(JSON.stringify(state.selectListeningRow)) as ExecuteListeningType
  let arr: ExecuteListeningType[] = []
  if (obj.primary_key) {
    obj[key] = e
    arr = state.executeListeningList.map(item => {
      if (item.primary_key === obj.primary_key) {
        return {
          ...obj
        }
      }
      return item
    })
  }
  dispatch({
    type: ActionType.changeSelectListening, payload: { ...state, selectListeningRow: obj }
  })
  dispatch({
    type: ActionType.changeExecuteListeningList, payload: { ...state, executeListeningList: arr }
  })
  props.form.setFieldsValue({ executeListening: JSON.stringify(arr) })
}

// 修改执行监听中部分表单后重置部分表单
export const controllFields = (e: string, key: string, props: { form: FormInstance<any> }, setExecuteListeningType: React.Dispatch<React.SetStateAction<string>>) => {
  // 字段参数-类型
  if (key === 'executeParamsType') {
    props.form.setFieldsValue({
      executeParamsValue: ''
    })
  }
  // 执行监听-java类
  if (key === 'executeListeningType') {
    setExecuteListeningType(e)
    props.form.setFieldsValue({
      executeContent: ''
    })
  }
}

// 保存时转换国际化
export const parseLocales = (str: string) => {
  const arr = JSON.parse(str)
  let obj = {}
  arr.forEach((item: NodeNameItemType) => {
    obj[item.languageCode as string] = item.value
  })
  return JSON.stringify(obj)
}

// 初始化时国际化转换
export const revertLocales = (str: string, langInfo: LangListType) => {
  const obj = JSON.parse(str)
  const arr: NodeNameItemType[] = []
  Object.keys(obj).forEach(item => {
    let id = uuidv4().replace('-', '').substring(0, 8);
    arr.push({
      id,
      languageCode: item,
      languageName: langInfo[item].text,
      value: obj[item]
    })
  })
  return JSON.stringify(arr)
}