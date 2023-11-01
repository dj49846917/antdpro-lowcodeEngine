import env from '../../config/env'

export const Constant = {
  PUBLIC_KEY: env[REACT_APP_ENV || 'local']['PUBLIC_KEY'],
  BDH_LOGIN_URL: env[REACT_APP_ENV || 'local']['BDH_LOGIN_URL'],
  API: {
    LC_AUTH: env.API.LC_AUTH,
    MDM: env.API.MDM,
    WORKFLOW: env.API.WORKFLOW,
    BUSINESS: env.API.BUSINESS,
    OSS: env.API.OSS,
    RULE: env.API.RULE,
    FSSC_BUSINESS: env.API.FSSC_BUSINESS,
    FSSC_MDM: env.API.FSSC_MDM
  },
  APPID_STORAGE: "appId",
  APPINFO_STORAGE: "appInfo",
  BASE_URL: "baseUrl",
  LOGIN_TOKEN_STORAGE: "loginToken",
  LOGIN_SYSTEM_STORAGE: 'loginSystem',
  USER_INFO_STORAGE: 'userId',
  USER_STORAGE: 'userInfo',
  USER_TASK_PERSON: 'dealPerson',
  USER_TASK_RULE: 'rule',
  LANG_STORAGE: "lowcode_lang",
  PROCESS_STORAGE: "process_info",
  baseUrl: "https://easydp.tax.deloitte.com.cn", // 接口主地址
  appTypeArr: [{ // 应用类型
    "DicCode": 0,
    "DicName": "表单",
    "SubTypeCode": 1000000,
    "SubTypeName": "应用类型"
  }, {
    "DicCode": 1,
    "DicName": "个性化页面",
    "SubTypeCode": 1000000,
    "SubTypeName": "应用类型"
  }, {
    "DicCode": 2,
    "DicName": "高级表格",
    "SubTypeCode": 1000000,
    "SubTypeName": "应用类型"
  }],
  activeFlagArr: [{ // 状态
    "DicCode": 0,
    "DicName": "无效",
    "SubTypeCode": 1000001,
    "SubTypeName": "生效标志"
  }, {
    "DicCode": 1,
    "DicName": "有效",
    "SubTypeCode": 1000001,
    "SubTypeName": "生效标志"
  }],
  progressActiveFlagArr: [{ // 文件状态
    "DicCode": "DRAFT",
    "DicName": "草稿",
    "SubTypeCode": 1000002,
    "SubTypeName": "文件编辑状态"
  }, {
    "DicCode": "PUBLISH",
    "DicName": "已发布",
    "SubTypeCode": 1000002,
    "SubTypeName": "文件编辑状态"
  }],
  lowcodeActiveFlagArr: [{ // 低代码应用类型
    "DicCode": 0,
    "DicName": "开发中",
    "SubTypeCode": 1000003,
    "SubTypeName": "应用状态"
  }, {
    "DicCode": 1,
    "DicName": "已发布",
    "SubTypeCode": 1000003,
    "SubTypeName": "应用状态"
  }],
  isSure: [{ // 是否
    "DicCode": 0,
    "DicName": "否",
    "SubTypeCode": 1000004,
    "SubTypeName": "是否"
  }, {
    "DicCode": 1,
    "DicName": "是",
    "SubTypeCode": 1000004,
    "SubTypeName": "是否"
  }],
  UserTaskDealPersonTab: [
    {
      id: "1",
      name: "部门"
    },
    {
      id: "2",
      name: "角色"
    },
    {
      id: "3",
      name: "成员"
    },
    {
      id: "4",
      name: "岗位"
    },
  ],
  ProcessSequenceFlow: "默认规则",

}
