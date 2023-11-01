export const defaultCompsMap = [{ "devMode": "lowCode", "componentName": "Page" },
{
  package: "dtt-comps",
  destructuring: true,
  subName: "",
  exportName: "ProCard",
  main: "src/index.js",
},
{
  "package": "dtt-comps",
  "exportName": "ProForm",
  "main": "src/index.js",
  "destructuring": true,
  "subName": "",
  "componentName": "ProForm"
}, {
  "package": "dtt-comps",
  "exportName": "FormInput",
  "main": "src/index.tsx",
  "destructuring": true,
  "subName": "",
  "componentName": "FormInput"
}, {
  "package": "dtt-comps",
  "exportName": "FormNumberPicker",
  "main": "",
  "destructuring": true,
  "subName": "",
  "componentName": "FormNumberPicker"
}, {
  "package": "dtt-comps",
  "exportName": "FormSelect",
  "main": "",
  "destructuring": true,
  "subName": "",
  "componentName": "FormSelect"
}, {
  "package": "dtt-comps",
  "exportName": "FormDatePicker",
  "main": "",
  "destructuring": true,
  "subName": "",
  "componentName": "FormDatePicker"
}]
export enum FormFieldTypeEnum {
  FormCascaderSelect = 'cascader',
  FormCheckboxGroup = 'checkbox',
  FormDatePicker = 'date',
  FormInput = 'text',
  FormNumberPicker = 'number',
  FormPassword = 'text',
  FormRangePicker = 'dateRange',
  FormTextArea = 'text',
  FormSelect = 'select',
  FormTreeSelect = 'tree',
  FormEditTable = 'table',
  FormRefObj = 'refObj',
  FormSwitch = 'boolean',
}


export const FormItemType = {
  FormCascaderSelect: 'FormCascaderSelect',
  FormCheckboxGroup: 'FormCheckboxGroup',
  FormDatePicker: 'FormDatePicker',
  FormInput: 'FormInput',
  FormNumberPicker: 'FormNumberPicker',
  FormNumberRangeInput: 'FormNumberRangeInput',
  FormPassword: 'FormPassword',
  FormRangePicker: 'FormRangePicker',
  FormMonthPicker: "FormMonthPicker",
  FormTimePicker: "FormTimePicker",
  FormYearPicker: "FormYearPicker",
  FormTextArea: 'FormTextArea',
  FormSelect: 'FormSelect',
  FormTreeSelect: 'FormTreeSelect',
  FormEditTable: 'FormEditTable',
  FormTabTableContainer: 'FormTabTableContainer',
  FormInputGroup: 'FormInputGroup',
  FormTabTableItem: 'FormTabTableItem',
  FormGroupEditTable: 'FormGroupEditTable',
  FormRefObj: 'FormRefObj',
  FormSwitch: 'FormSwitch',
  FormBusinessUpload: "FormBusinessUpload",
  FormNumberInput: "FormNumberInput",
}

export const CellType = {
  'text': FormItemType.FormInput,
  'address': FormItemType.FormInput,
  'chineseName': FormItemType.FormInput,
  'idCard': FormItemType.FormInput,
  'link': FormItemType.FormInput,
  'phone': FormItemType.FormInput,
  'email': FormItemType.FormInput,
  'mobile': FormItemType.FormInput,
  'tag': FormItemType.FormInput,
  'dialog': FormItemType.FormInput,
  'select': FormItemType.FormSelect,
  'date': FormItemType.FormDatePicker,
  'number': FormItemType.FormNumberInput,
  'money': FormItemType.FormNumberInput,
}

export const ActionType = {
  "submit": "submit",
  "save": "save",
  "cancel": "cancel",
  "agree": "agree",
  "transfer": "transfer",
  "reject": "reject",
  "communicate": "communicate",
  "completeAndSign": "addAfter",
  "inform": "notify",
  "launchWf": "",
  "returnToPreNode": "returnUp",
  "returnToTheSpecifiedNode": "returnOne",
  "signBeforeMe": "addBefore",
  "temporaryStorage": "",
  "urge": "urge",
  "withdraw": "withdraw",
  "custom": "custom",
}
