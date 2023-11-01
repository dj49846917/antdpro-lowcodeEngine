export enum ApiStr {
  "equal" = "equal",                        // =
  "notEqual" = "notEqual",                  // !=
  "greaterThan" = "greaterThan",            // >
  "greaterOrEqual" = "greaterOrEqual",      // >=
  "lessThan" = "lessThan",                  // <
  "lessOrEqual" = "lessOrEqual",            // <=
  "contain" = "contain",                    // 包含
  "between" = "between",                    // 介于
  "subordinate" = "subordinate",            // 从属于
}

const templateApi = {
  beforeRequest: null,
  headers: null,
  params: '{\r\n ' +
    '  "data": { \r\n' +
    '     "@lc_datasource": "4", \r\n' +
    '     "[]": {  \r\n' +
    '        "Ssc_distribution_rule": { \r\n' +
    '          "RULE_NAME$": { "nextFieldsType": "contain" }, \r\n' +
    '          "name$": { "nextFieldsType": "contain", "nextFieldsAlias": "RULE_NAME$" }, \r\n' +
    '          "activeFlag": { "nextFieldsType": "equal", "nextFieldsAlias": "ACTIVE_FLAG" }, \r\n' +
    '          "RULE_TYPE": { "nextFieldsType": "equal" }, \r\n' +
    '          "DELETE_FLAG": 0, \r\n' +
    '          "@order": "MODIFIED_DATE-", \r\n' +
    '          "@column": "BUSINESS_ID,ENTITY_ID,WORK_GROUP_ID,RULE_NAME,RULE_CODE,RULE_TYPE,DIST_TYPE,DIST_FREQ_VALUE,DIST_FREQ_UNIT,DIST_PER_NUMBER,DIST_THRESHOLD,EXIST_TASK_NUMBER,IF_EXCLUDE,IF_TEAM_LEADER,ACTIVE_FLAG,ACTIVE_FLAG" \r\n' +
    '        }, \r\n' +
    '        "MDM_WORK_group": { \r\n' +
    '          "@column": "GROUP_NAME", \r\n' +
    '          "BUSINESS_ID@": "/Ssc_distribution_rule/WORK_GROUP_ID" \r\n' +
    '        } \r\n' +
    '    } \r\n' +
    '  }, \r\n' +
    '  "operator": { "nextFieldsType": "equal" }, \r\n' +
    '  "source": "PC", \r\n' +
    '  "traceId": { "nextFieldsType": "equal" }, \r\n' +
    '  "version": { "nextFieldsType": "equal" }, \r\n' +
    '  "appId": { "nextFieldsType": "equal" }, \r\n' +
    '  "lang": { "nextFieldsType": "equal" }, \r\n' +
    '  "page": { "nextFieldsType": "equal" }, \r\n' +
    '  "size": { "nextFieldsType": "equal" } \r\n' +
    '}',
  id: "",
  isCors: 1,
  method: "POST",
  name: "参数用例api",
  onError: null,
  onSuccess: null,
  shouldRequest: null,
  timeout: 1000,
  uri: ""
}
export default templateApi

export const templateDataSource = [
  { id: "1", type: ApiStr.equal, search: "=" },
  { id: "2", type: ApiStr.notEqual, search: "!=" },
  { id: "3", type: ApiStr.greaterThan, search: ">" },
  { id: "4", type: ApiStr.greaterOrEqual, search: ">=" },
  { id: "5", type: ApiStr.lessThan, search: "<" },
  { id: "6", type: ApiStr.lessOrEqual, search: "<=" },
  { id: "7", type: ApiStr.contain, search: "包含" },
  { id: "8", type: ApiStr.between, search: "介于（类似时间范围查询）" },
  { id: "9", type: ApiStr.subordinate, search: "从属于" }
]