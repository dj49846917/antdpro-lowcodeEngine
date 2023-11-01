import { ExecuteListeningType, ExecuteXmlParamsFieldsType, ExecuteXmlParamsType, ReverseExecuteXmlParamsType } from "@/pages/progress/type";
import { CommonParamType } from "@/types/common";

// 创建监听器实例
export function createListenerObject(options: CommonParamType, isTask: boolean, prefix: string) {
  const listenerObj = Object.create(null);
  listenerObj.event = options.event;
  isTask && (listenerObj.id = options.id); // 任务监听器特有的 id 字段
  switch (options.listenerType) {
    case "scriptListener":
      listenerObj.script = createScriptObject(options, prefix);
      break;
    case "expressionListener":
      listenerObj.expression = options.expression;
      break;
    case "delegateExpressionListener":
      listenerObj.delegateExpression = options.delegateExpression;
      break;
    default:
      listenerObj.class = options.class;
  }
  // 注入字段
  if (options.fields) {
    listenerObj.fields = options.fields.map((field: CommonParamType) => {
      return createFieldObject(field, prefix);
    });
  }
  // 任务监听器的 定时器 设置
  if (isTask && options.event === "timeout" && !!options.eventDefinitionType) {
    const timeDefinition = (window as any).bpmnInstances.moddle.create("bpmn:FormalExpression", {
      body: options.eventTimeDefinitions
    });
    const TimerEventDefinition = (window as any).bpmnInstances.moddle.create("bpmn:TimerEventDefinition", {
      id: Date.now(),
      [`time${options.eventDefinitionType.replace(/^\S/, s => s.toUpperCase())}`]: timeDefinition
    });
    listenerObj.eventDefinitions = [TimerEventDefinition];
  }
  return (window as any).bpmnInstances.moddle.create(`${prefix}:${isTask ? "TaskListener" : "ExecutionListener"}`, listenerObj);
}

// 创建 监听器的注入字段 实例
export function createFieldObject(option: CommonParamType, prefix: string) {
  const { name, fieldType, string, expression } = option;
  const fieldConfig = fieldType === "string" ? { name, string } : { name, expression };
  return (window as any).bpmnInstances.moddle.create(`${prefix}:Field`, fieldConfig);
}

// 创建脚本实例
export function createScriptObject(options: CommonParamType, prefix: string) {
  const { scriptType, scriptFormat, value, resource } = options;
  const scriptConfig = scriptType === "inlineScript" ? { scriptFormat, value } : { scriptFormat, resource };
  return (window as any).bpmnInstances.moddle.create(`${prefix}:Script`, scriptConfig);
}

// 更新元素扩展属性
export function updateElementExtensions(element: CommonParamType, extensionList: any[]) {
  const extensions = (window as any).bpmnInstances.moddle.create("bpmn:ExtensionElements", {
    values: extensionList
  });
  (window as any).bpmnInstances.modeling.updateProperties(element, {
    extensionElements: extensions
  });
}

// 组装执行监听的参数
export function parseExecuteListening(dataSource: ExecuteListeningType[]) {
  return dataSource.map(item => {
    let obj = {} as ExecuteXmlParamsType
    obj.fields = []
    if (item.executeEventType) {
      if (item.executeEventType === 'begin') { // 开始
        obj.event = 'start'
      }
      if (item.executeEventType === 'end') { // 结束
        obj.event = "end"
      }
    }
    if (item.executeListeningType) {
      if (item.executeListeningType === "java") { // java类
        obj.listenerType = "classListener"
        obj.class = item.executeContent
      }
      if (item.executeListeningType === "expression") { // 表达式
        obj.listenerType = "expressionListener"
        obj.expression = item.executeContent
      }
      if (item.executeListeningType === "delegation_expression") { // 委托表达式
        obj.listenerType = "delegateExpressionListener"
        obj.delegateExpression = item.executeContent
      }
      if (item.executeListeningType === "script") { // 脚本
        obj.listenerType = "scriptListener"
        obj.scriptFormat = item.executeContent
        if (item.executeScrpitType) {
          if (item.executeScrpitType === "online") { // 在线脚本
            obj.scriptType = "inlineScript"
            obj.value = item.executeScrpitContent
          }
          if (item.executeScrpitType === "cite") { // 引用资源
            obj.scriptType = "externalScript"
            obj.resource = item.executeScrpitContent
          }
        }
      }
    }
    if (item.executeParam.length > 0) {
      obj.fields = item.executeParam.map((it, index) => {
        return {
          name: it.executeParamsName,
          fieldType: it.executeParamsType,
          [it.executeParamsType]: it.executeParamsValue
        }
      })
    }
    return obj
  })
}

// 回显执行监听逻辑
export function parseExecuteListeningInit(dataSource: undefined | { values?: any[] }) {
  if (dataSource && dataSource.values && dataSource.values.length > 0) {
    return dataSource.values?.map((item, i) => {
      let obj = {} as ExecuteListeningType
      obj.executeParam = []
      obj.active = i === 0 ? true : false
      obj.primary_key = Date.now() - i * 100
      if (item.event) {
        if (item.event === 'start') { // 开始
          obj.executeEventType = 'begin'
        }
        if (item.event === 'end') { // 结束
          obj.executeEventType = 'end'
        }
      }
      if (item['class']) { // java类
        obj.executeContent = item.class
        obj.executeListeningType = "java"
      }
      if (item['expression']) { // 表达式
        obj.executeContent = item.expression
        obj.executeListeningType = "expression"
      }
      if (item['delegateExpression']) { // 委托表达式
        obj.executeContent = item.delegateExpression
        obj.executeListeningType = 'delegation_expression'
      }
      if (item['script']) { // 脚本
        obj.executeListeningType = 'script'
        obj.executeContent = item.script.scriptFormat
        if (item.script['value']) { // 在线脚本
          obj.executeScrpitContent = item.script.value
          obj.executeScrpitType = 'online'
        }
        if (item.script['resource']) { // 引用资源
          obj.executeScrpitContent = item.script.resource
          obj.executeScrpitType = 'cite'
        }
      }
      if (item.fields && item.fields.length > 0) {
        obj.executeParam = item.fields.map((it: ExecuteXmlParamsFieldsType, index: number) => {
          if (it['string']) {
            return {
              active: index === 0 ? true : false,
              primary_key: Date.now() - index * 100,
              executeParamsName: it.name,
              executeParamsType: 'string',
              executeParamsValue: it.string
            }
          }
          return {
            active: index === 0 ? true : false,
            primary_key: Date.now() - index * 100,
            executeParamsName: it.name,
            executeParamsType: "expression",
            executeParamsValue: it.expression
          }
        })
      }
      return obj
    })
  }
  return []
}