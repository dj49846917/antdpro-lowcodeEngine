import {
  FormFieldTypeEnum,
  FormItemType
} from "@/pages/designer/constants";
import {
  isEmpty,
  omit
} from "lodash";
import {
  mockId,
  nextId
} from "@/pages/designer/utils";
import FormItemCreator from "@/pages/designer/template/pc/form-items";
import type { FieldProps } from "@/pages/designer/template/types";
import { defaultPCComponentProps } from "../common";

export const defaultComponentProps = defaultPCComponentProps

export const ProFormComponent = {
  ...defaultComponentProps,
  exportName: "ProForm",
  componentName: "ProForm"
}

export const FormInputComponent = {
  ...defaultComponentProps,
  exportName: "FormInput",
  componentName: "FormInput"
}

export const commonComponents = [
  {
    ...defaultComponentProps,
    exportName: "ProCard",
    componentName: "ProCard"
  }
]

export const contextProps = {
  "history": {
    "type": "JSExpression",
    "value": "this.history"
  },
  "$this": {
    "type": "JSExpression",
    "value": "this"
  },
  "constants": {
    "type": "JSExpression",
    "value": "this.constants"
  },
  "primaryKey": "businessId",
  "sourceType": "dataTable",
}

function createColumn(field: FieldProps, id: string, options?: any) {
  const {
    formComponentName,
    hidden,
    columnLabel: title,
    columnName: dataIndex,
  } = field;
  const columnSchema = createFormItem(field, id, options)
  const { props = {}, } = columnSchema;

  const {
    formItemProps,
    _format_options_date,
    ...compProps
  } = props;

  const formatType = FormFieldTypeEnum[formComponentName] || FormFieldTypeEnum.FormInput;
  compProps.defaultValue = isEmpty(compProps.defaultValue) ? undefined : compProps.defaultValue;
  return {
    compProps,
    formatType,
    dataIndex,
    title,
    hidden,
    _format_options_date,
    formItemProps: omit(formItemProps, ['label'])
  }
}

function createFormItems(fields: FieldProps[], docId: string, seqId: { seqId: number }, options?: { components?: any }) {
  return fields?.map(field => {
    const {
      fields: attrs,
      ...restProps
    } = field;
    let columns;
    if (field.formComponentName === "FormEditTable" && Array.isArray(attrs)) {
      columns = attrs.map(attr => {
        return createColumn(attr, nextId(docId, seqId), { isTableList: true, ...options });
      });
    }
    return createFormItem({
      ...restProps,
      columns
    }, nextId(docId, seqId), options);
  });
}

function createFormItem(field: FieldProps, id: string, options?: any) {
  const {
    formComponentName,
    required,
    disabled,
    hidden,
    columnLabel: label,
    columnName: name,
    ...compProps
  } = field;
  if (!FormItemCreator[formComponentName]) {
    options?.components?.push?.(FormInputComponent)
  }
  const formItemCreator = FormItemCreator[formComponentName] || FormItemCreator.FormInput;

  const formItemSchema = formItemCreator(
    {
      compProps: filterAttr(formComponentName, compProps as any),
      formItemProps: {
        required,
        disabled,
        hidden,
        name,
        label,
        primaryKey: mockId(),
      }
    },
  );
  const { props = {} } = formItemSchema.schema || {};
  return {
    ...formItemSchema.schema,
    props: omit(props, [
      'datasourceId',
      'parentField',
      'fields',
      'parentField',
      'tableName',
    ]),
    id
  };
}

function filterAttr(type: string, compProps: FieldProps,) {
  const filterKeys: string[] = [];
  if (![
    FormItemType.FormSelect,
    FormItemType.FormRefObj,
    FormItemType.FormTreeSelect,
    FormItemType.FormCascaderSelect
  ].includes(type)) {
    filterKeys.push("labelInValue");
    filterKeys.push("mode");
    filterKeys.push("labelKey");
    filterKeys.push("valueKey");
  }
  if (![
    FormItemType.FormNumberPicker,
    FormItemType.FormNumberRangeInput
  ].includes(type)) {
    filterKeys.push("precisions");
    filterKeys.push("maxLength");
  }
  if (![
    FormItemType.FormDatePicker,
    FormItemType.FormRangePicker
  ].includes(type)) {
    filterKeys.push("format");
  }
  return omit(compProps, filterKeys);
}

const Creator = {
  createColumn,
  createFormItems,
  createFormItem,
  filterAttr
}
export default Creator;
