interface FormItemProps {
  required?: boolean;
  disabled?: boolean;
  hidden?: boolean;
  name?: string;
  label?: string;
}

type FormItemSchemaProp = {
  formItemProps: FormItemProps;
  compProps: any;
  id: string;
}
const defaultFormItemProps = {
  required: false,
  disabled: false,
  asterisk: true,
  hidden: false,
  fullWidth: true,
}

const defaultCompProps = {
  hasBorder: true,
  size: 'medium',
  placeholder: '请输入',
}

const defaultSelectProps = {
  hasClear: true,
  hasArrow: true,
  placeholder: "请选择",
}

const setCompProps = (props: any) => {
  return {
    ...defaultCompProps,
    ...props,
  }
}

const setFormItemProps = (props: FormItemProps) => {
  return {
    ...defaultFormItemProps,
    ...props,
  }
}

const FormItemCreator = {
  FormInput: ({
    compProps,
    formItemProps
  }: FormItemSchemaProp) => {
    return {
      title: '输入框',
      schema: {
        componentName: 'FormInput',
        props: {
          ...setCompProps(compProps),
          formItemProps: setFormItemProps(formItemProps)
        },
      },
    }
  },
  FormTextArea: ({
    compProps,
    formItemProps
  }: FormItemSchemaProp) => {
    return {
      title: '多行文本框',
      schema: {
        componentName: 'FormTextArea',
        props: {
          ...setCompProps(compProps),
          formItemProps: setFormItemProps(formItemProps)
        },
      },
    }
  },
  // FormNumberPicker: ({
  //   compProps,
  //   formItemProps
  // }: FormItemSchemaProp) => {
  //   return {
  //     title: '数字输入框',
  //     schema: {
  //       componentName: 'FormNumberPicker',
  //       props: {
  //         step: 1,
  //         ...setCompProps(compProps),
  //         formItemProps: setFormItemProps(formItemProps)
  //       },
  //     },
  //   }
  // },
  FormNumberRangeInput: ({
    compProps,
    formItemProps
  }: FormItemSchemaProp) => {
    return {
      title: '数字范围输入框',
      schema: {
        componentName: 'FormNumberRangeInput',
        props: {
          step: 1,
          ...setCompProps(compProps),
          formItemProps: setFormItemProps(formItemProps)
        },
      },
    }
  },
  FormDatePicker: ({
    compProps,
    formItemProps
  }: FormItemSchemaProp) => {
    return {
      title: '日期选择框',
      schema: {
        componentName: 'FormDatePicker',
        props: {
          format: 'YYYY-MM-DD',
          _format_options_date: compProps?.format,
          hasClear: true,
          placeholder: "请选择",
          ...setCompProps(compProps),
          formItemProps: setFormItemProps(formItemProps)
        },
      },
    }
  },
  FormRangePicker: ({
    compProps,
    formItemProps
  }: FormItemSchemaProp) => {
    return {
      title: '日期区段选择',
      schema: {
        componentName: 'FormRangePicker',
        props: {
          _format_options_date: compProps?.format,
          format: 'YYYY-MM-DD',
          hasClear: true,
          placeholder: "请选择",
          ...setCompProps(compProps),
          formItemProps: setFormItemProps(formItemProps)
        },
      },
    }
  },
  FormSelect: ({
    compProps,
    formItemProps
  }: FormItemSchemaProp) => {
    return {
      title: '选择器',
      schema: {
        componentName: 'FormSelect',
        props: {
          hasArrow: true,
          hasBorder: true,
          hasClear: true,
          placeholder: "请选择",
          ...setCompProps(compProps),
          formItemProps: setFormItemProps(formItemProps)
        },
      },
    }
  },
  // FormTreeSelect: ({
  //   compProps,
  //   formItemProps
  // }: FormItemSchemaProp) => {
  //   return {
  //     title: '树型选择控件',
  //     schema: {
  //       componentName: 'FormTreeSelect',
  //       props: {
  //         treeCheckedStrategy: 'all',
  //         hasArrow: true,
  //         hasBorder: true,
  //         hasClear: true,
  //         placeholder: "请选择",
  //         ...setCompProps(compProps),
  //         formItemProps: setFormItemProps(formItemProps)
  //       },
  //     },
  //   }
  // },
  // FormRefObj: ({
  //   compProps,
  //   formItemProps
  // }: FormItemSchemaProp) => {
  //   return {
  //     title: '引用对象',
  //     schema: {
  //       componentName: 'FormRefObj',
  //       props: {
  //         ...setCompProps(compProps),
  //         labelInValue: true,
  //         formItemProps: setFormItemProps(formItemProps)
  //       },
  //     },
  //   }
  // },
  FormImageUpload: ({
    compProps,
    formItemProps
  }: FormItemSchemaProp) => {
    return {
      title: '图片上传',
      schema: {
        componentName: 'FormImageUpload',
        props: {
          ...setCompProps(compProps),
          formItemProps: setFormItemProps(formItemProps)
        },
      },
    }
  },
  FormFileUpload: ({
    compProps,
    formItemProps
  }: FormItemSchemaProp) => {
    return {
      title: '文件上传',
      schema: {
        componentName: 'FormFileUpload',
        props: {
          ...setCompProps(compProps),
          formItemProps: setFormItemProps(formItemProps)
        },
      },
    }
  },
  FormEditTable: ({
    compProps,
    formItemProps
  }: FormItemSchemaProp) => {
    return {
      title: '可编辑表格',
      schema: {
        componentName: 'FormEditTable',
        props: {
          listButtons: [
            {
              "children": "新增",
              "type": "normal",
              "actionType": "create"
            },
          ],
          ...setCompProps(compProps),
          formItemProps: {
            ...setFormItemProps(formItemProps),
          }
        },
      },
    }
  },
  FormCascaderSelect: ({
    compProps,
    formItemProps
  }: FormItemSchemaProp) => {
    return {
      title: '级联选择器',
      schema: {
        componentName: 'FormCascaderSelect',
        props: {
          ...defaultSelectProps,
          ...setCompProps(compProps),
          formItemProps: {
            ...setFormItemProps(formItemProps),
          }
        },
      },
    }
  },
  FormI18nInput: ({
    compProps,
    formItemProps
  }: FormItemSchemaProp) => {
    return {
      title: '国际化',
      schema: {
        componentName: 'FormI18nInput',
        props: {
          ...setCompProps(compProps),
          formItemProps: {
            ...setFormItemProps(formItemProps),
          }
        },
      },
    }
  },
  // FormInputGroup: ({
  //   compProps,
  //   formItemProps
  // }: FormItemSchemaProp) => {
  //   return {
  //     title: '可编辑表格',
  //     schema: {
  //       componentName: 'FormInputGroup',
  //       props: {
  //         ...setCompProps(compProps),
  //         formItemProps: {
  //           ...setFormItemProps(formItemProps),
  //         }
  //       },
  //     },
  //   }
  // },
  // FormCalendar: ({
  //   compProps,
  //   formItemProps
  // }: FormItemSchemaProp) => {
  //   return {
  //     title: '日历',
  //     schema: {
  //       componentName: 'FormCalendar',
  //       props: {
  //         size: 'medium',
  //         ...compProps,
  //         formItemProps: {
  //           ...setFormItemProps(formItemProps),
  //         }
  //       },
  //     },
  //   }
  // },
  // FormNestedForm: ({
  //   compProps,
  //   formItemProps
  // }: FormItemSchemaProp) => {
  //   return {
  //     title: '嵌套表单',
  //     schema: {
  //       componentName: 'FormNestedForm',
  //       props: {
  //         isNestedForm: true,
  //         ...setCompProps(compProps),
  //         formItemProps: {
  //           ...setFormItemProps(formItemProps),
  //         }
  //       },
  //     },
  //   }
  // },
  FormOrgSelect: ({
    compProps,
    formItemProps
  }: FormItemSchemaProp) => {
    return {
      title: '组织选择',
      schema: {
        componentName: 'FormOrgSelect',
        props: {
          ...defaultSelectProps,
          ...setCompProps(compProps),
          formItemProps: {
            ...setFormItemProps(formItemProps),
          }
        },
      },
    }
  },
  // FormColorSelect: ({
  //   compProps,
  //   formItemProps
  // }: FormItemSchemaProp) => {
  //   return {
  //     title: '颜色选择器',
  //     schema: {
  //       componentName: 'FormColorSelect',
  //       props: {
  //         size: 'medium',
  //         placeholder: "请选择",
  //         ...compProps,
  //         formItemProps: {
  //           ...setFormItemProps(formItemProps),
  //         }
  //       },
  //     },
  //   }
  // },
  FormCheckboxGroup: ({
    compProps,
    formItemProps
  }: FormItemSchemaProp) => {
    return {
      title: '多选框',
      schema: {
        componentName: 'FormCheckboxGroup',
        props: {
          ...compProps,
          formItemProps: {
            ...setFormItemProps(formItemProps),
          }
        },
      },
    }
  },
  // FormEditor: ({
  //   compProps,
  //   formItemProps
  // }: FormItemSchemaProp) => {
  //   return {
  //     title: '富文本',
  //     schema: {
  //       componentName: 'FormEditor',
  //       props: {
  //         ...compProps,
  //         formItemProps: {
  //           ...setFormItemProps(formItemProps),
  //           columnSpan: 3
  //         }
  //       },
  //     },
  //   }
  // },
  FormRadioGroup: ({
    compProps,
    formItemProps
  }: FormItemSchemaProp) => {
    return {
      title: '单选框',
      schema: {
        componentName: 'FormRadioGroup',
        props: {
          ...compProps,
          formItemProps: {
            ...setFormItemProps(formItemProps),
          }
        },
      },
    }
  },
  FormSwitch: ({
    compProps,
    formItemProps
  }: FormItemSchemaProp) => {
    return {
      title: '开关',
      schema: {
        componentName: 'FormSwitch',
        props: {
          ...compProps,
          formItemProps: {
            ...setFormItemProps(formItemProps),
          }
        },
      },
    }
  },
  FormTimePicker: ({
    compProps,
    formItemProps
  }: FormItemSchemaProp) => {
    return {
      title: '时间选择框',
      schema: {
        componentName: 'FormTimePicker',
        props: {
          hasClear: true,
          placeholder: "请选择",
          ...compProps,
          formItemProps: {
            ...setFormItemProps(formItemProps),
          }
        },
      },
    }
  },
  FormUserSelect: ({
    compProps,
    formItemProps
  }: FormItemSchemaProp) => {
    return {
      title: '人员选择',
      schema: {
        componentName: 'FormUserSelect',
        props: {
          ...defaultSelectProps,
          ...compProps,
          formItemProps: {
            ...setFormItemProps(formItemProps),
          }
        },
      },
    }
  },
  FormPassword: ({
    compProps,
    formItemProps
  }: FormItemSchemaProp) => {
    return {
      title: '密码框',
      schema: {
        componentName: 'FormPassword',
        props: {
          ...setCompProps(compProps),
          formItemProps: {
            ...setFormItemProps(formItemProps),
          }
        },
      },
    }
  },
  FormSerialNumber: ({
    compProps,
    formItemProps
  }: FormItemSchemaProp) => {
    return {
      title: '流水号',
      schema: {
        componentName: 'FormSerialNumber',
        props: {
          ...setCompProps(compProps),
          formItemProps: {
            ...setFormItemProps(formItemProps),
          }
        },
      },
    }
  },
  FormPhone: ({
    compProps,
    formItemProps
  }: FormItemSchemaProp) => {
    return {
      title: '固定电话',
      schema: {
        componentName: 'FormPhone',
        props: {
          ...setCompProps(compProps),
          formItemProps: {
            ...setFormItemProps(formItemProps),
          }
        },
      },
    }
  },
  FormMobile: ({
    compProps,
    formItemProps
  }: FormItemSchemaProp) => {
    return {
      title: '手机号',
      schema: {
        componentName: 'FormMobile',
        props: {
          ...setCompProps(compProps),
          formItemProps: {
            ...setFormItemProps(formItemProps),
          }
        },
      },
    }
  }
}

export default FormItemCreator
