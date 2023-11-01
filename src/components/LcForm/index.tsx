import { Form } from "antd"
import { forwardRef, useEffect, useImperativeHandle, useMemo } from "react"
import { CompsMap } from "@/constant/comps";
import type { FormItemProps, FormProps } from "antd";
import type { ForwardRefRenderFunction } from "react";
import type { CompTypeEnum } from "@/constant/comps";

export interface FieldItemProps extends FormItemProps {
  group?: FieldProps[];
}
export interface FieldProps {
  compType: CompTypeEnum;
  itemProps: FieldItemProps;
  compProps?: { [key: string]: any }
}

interface GeneralFormProps {
  readOnly?: boolean;
  formProps?: FormProps;
  fields: FieldProps[];
}

const layout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 16,
  },
};

const LcForm: ForwardRefRenderFunction<any, GeneralFormProps> = (props, ref) => {
  const { formProps = {}, readOnly, fields } = props;
  const [form] = Form.useForm();

  useImperativeHandle(ref, () => {
    return {
      form
    }
  });

  const readOnlyProps: FormProps = readOnly ? {
    disabled: true,
    requiredMark: false,
  } : {};

  const formItems = useMemo(() => {
    if (!fields) {
      return;
    }
    // <Form.Item
    //   noStyle
    //   shouldUpdate={(prevValues, currentValues) => prevValues.gender !== currentValues.gender}
    // >
    //   {({ getFieldValue }) =>
    //     getFieldValue('gender') === 'other' ? (
    //       <Form.Item name="customizeGender" label="Customize Gender" rules={[{ required: true }]}>
    //         <Input />
    //       </Form.Item>
    //     ) : null
    //   }
    // </Form.Item>
    return fields.map(field => {
      const FieldItem = CompsMap[field.compType] as any;
      form.setFieldsValue(formProps.initialValues);
      return (
        <Form.Item
          key={field.itemProps.name!.toLocaleString()}
          {...field.itemProps}
        >
          <FieldItem {...field.compProps} form={form} name={field.itemProps.name} />
        </Form.Item>
      )
    })
  }, [fields]);

  return (
    <div>
      <Form
        form={form}
        labelAlign='left'
        {...layout}
        {...formProps}
        {...readOnlyProps}
      >
        {formItems}
      </Form>
    </div>
  )
}

export default forwardRef(LcForm);
