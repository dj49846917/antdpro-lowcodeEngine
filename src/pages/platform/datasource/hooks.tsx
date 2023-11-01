import { useIntl } from "umi";
import { CompTypeEnum } from "@/constant/comps";
import { FieldProps } from "@/components/LcForm";
import { ActionProps } from "@/components/LeftTree";
import { useData } from "@/hooks/useData";
import datasourceApi, { TableFieldType, TableListData } from "@/services/custom/platform/service";
import { ProColumns, ProSchemaValueEnumType } from "@ant-design/pro-components";
import dataDictApi from "@/services/dataDict";
import React, { MutableRefObject, RefObject, useMemo, useState } from "react";
import { RadioChangeEvent } from "antd";
import { CommonParamType } from "@/types/common";

const FILED_LOCALE = 'pages.platform.datasource.form.';
const TABLE_LOCALE = 'pages.platform.datasource.form.table.';
const COLUMN_LOCALE = 'pages.platform.datasource.column.';
export const DEFAULT_TABLE_VALUES_KEYS = ["BUSINESS_ID", "CREATE_USER", "CREATE_DATE", "MODIFIED_USER", "MODIFIED_DATE"];
const randomId = () => (Math.random() * 1000000).toFixed(0);
export const useDefaultTableValues = () => {
  return [
    {
      id: randomId(),
      fieldName: "BUSINESS_ID",
      fieldType: "VARCHAR",
      fieldLength: 20,
      notNull: true,
      unique: true,
      fieldDesc: "系统生成主键"
    },
    {
      id: randomId(),
      fieldName: "CREATE_USER",
      fieldType: "VARCHAR",
      fieldLength: 20,
      notNull: true,
      fieldDesc: "创建人"
    },
    {
      id: randomId(),
      fieldName: "CREATE_DATE",
      fieldType: "DATE",
      fieldDesc: "创建时间"
    },
    {
      id: randomId(),
      fieldName: "MODIFIED_USER",
      fieldLength: 20,
      fieldType: "VARCHAR",
      fieldDesc: "修改人"
    },
    {
      id: randomId(),
      fieldName: "MODIFIED_DATE",
      fieldType: "DATE",
      fieldDesc: "修改时间"
    },
  ]
}

export const useDatabaseFields = (datasourceRef: MutableRefObject<(isHidden: boolean) => void>) => {

  const intl = useIntl();

  const [hidden, setHidden] = useState(true);

  const { data: drivers, } = useData(() => {
    return datasourceApi.getDrivers().then((res) => {
      if (res.success) {
        return res.data.map(item => {
          return {
            value: item.driverId,
            label: item.driverName,
          }
        })
      }
      return []
    })
  });
  const { data: tenants, } = useData(() => datasourceApi.getTenantList().then(res => {
    if (res.success) {
      return res.data?.map(item => {
        return {
          value: item.datasourceId,
          label: item.datasourceName,
        }
      })
    }
    return []
  }));
  const [tables, setTables] = useState<any[]>([]);
  const [tableFields, setTablesFields] = useState<any[]>([]);
  const [datasourceId, setDataSourceId] = useState("")

  const handleHidden = (isHidden: boolean) => {
    setHidden(isHidden);
  }
  datasourceRef.current = handleHidden;

  const onTenantChange = (value: string) => {
    setDataSourceId(value)
    datasourceApi.getTenantTableList(value).then(res => {
      if (res.success) {
        const options = (res.data).map(table => {
          return {
            value: table.tableName,
            label: table.tableName,
            columns: table.columns,
          }
        });
        setTables(options);
      }
    })
  }

  const onTenantTableChange = async (value: string, row: CommonParamType) => {
    const params = {
      datasourceId,
      tableName: value
    }
    const result = await datasourceApi.getTenantTableFieldList(params)
    if (result?.success) {
      const list = result?.data?.columns.map(item => {
        return {
          label: item.columnName,
          value: item.columnName
        }
      })
      setTablesFields(list)
    }
  }

  const fields: FieldProps[] = useMemo(() => {
    return [
      {
        itemProps: {
          name: 'name',
          label: intl.formatMessage({ id: `${FILED_LOCALE}name` }),
          rules: [{
            required: true
          }],
        },
        compType: CompTypeEnum.TextInput,
      },
      {
        itemProps: {
          name: 'description',
          label: intl.formatMessage({ id: `${FILED_LOCALE}description` }),
        },
        compType: CompTypeEnum.TextInput,
      },
      {
        itemProps: {
          name: 'driver',
          label: intl.formatMessage({ id: `${FILED_LOCALE}driver` }),
          rules: [{
            required: true
          }],
        },
        compProps: {
          options: drivers,
        },
        compType: CompTypeEnum.Selector,
      },
      {
        itemProps: {
          name: 'ip',
          label: intl.formatMessage({ id: `${FILED_LOCALE}ip` }),
          rules: [{
            required: true
          }],
        },
        compType: CompTypeEnum.TextInput,
      },
      {
        itemProps: {
          name: 'database',
          label: intl.formatMessage({ id: `${FILED_LOCALE}database` }),
          rules: [{
            required: true
          }],
        },
        compType: CompTypeEnum.TextInput,
      },
      {
        itemProps: {
          name: 'port',
          label: intl.formatMessage({ id: `${FILED_LOCALE}port` }),
          rules: [{
            required: true
          }],
        },
        compType: CompTypeEnum.TextInput,
      },
      {
        itemProps: {
          name: 'password',
          label: intl.formatMessage({ id: `${FILED_LOCALE}password` }),
          rules: [{
            required: true
          }],
        },
        compType: CompTypeEnum.PasswordInput,

      },
      {
        itemProps: {
          name: 'username',
          label: intl.formatMessage({ id: `${FILED_LOCALE}username` }),
          rules: [{
            required: true
          }],
        },
        compType: CompTypeEnum.TextInput,
      },
      {
        itemProps: {
          name: 'type',
          label: intl.formatMessage({ id: `${FILED_LOCALE}type` }),
        },
        compProps: {
          onChange: (value: RadioChangeEvent) => {
            handleHidden(value.target.value !== '1');
          },
          options: [
            { label: '普通数据源', value: '0' },
            { label: '多租户数据源', value: '1' },
            { label: '内部数据源', value: '2', disabled: true },
          ],
        },
        compType: CompTypeEnum.RadioGroup,
      },
      {
        itemProps: {
          name: 'tenantDatasourceId',
          label: intl.formatMessage({ id: `${FILED_LOCALE}tenantDatasourceId` }),
          hidden
        },
        compProps: {
          options: tenants,
          onChange: onTenantChange
        },
        compType: CompTypeEnum.Selector,
      },
      {
        itemProps: {
          name: 'tenantTable',
          label: intl.formatMessage({ id: `${FILED_LOCALE}tenantTable` }),
          hidden,
        },
        compProps: {
          options: tables,
          onChange: onTenantTableChange,
        },
        compType: CompTypeEnum.Selector,
      },
      {
        itemProps: {
          name: 'tenantField',
          label: intl.formatMessage({ id: `${FILED_LOCALE}tenantField` }),
          hidden,
        },
        compProps: {
          options: tableFields,
        },
        compType: CompTypeEnum.Selector,
      },
    ];
  }, [hidden, drivers, tables, tableFields]);
  return fields;
}

export const useColumns = (renderActions: (_: string, record: TableListData) => React.ReactNode[], isPlatform: boolean = false) => {
  const intl = useIntl();
  const columns = [
    // {
    //   title: intl.formatMessage({ id: `${COLUMN_LOCALE}datasource` }),
    //   dataIndex: 'namespace',
    //   ellipsis: true,
    // },
    {
      title: intl.formatMessage({ id: isPlatform ? `${COLUMN_LOCALE}table` : 'pages.app.model.column.table' }),
      dataIndex: 'tableName',
      ellipsis: true,
    },
    {
      title: intl.formatMessage({ id: isPlatform ? `${COLUMN_LOCALE}desc` : 'pages.app.model.column.desc' }),
      dataIndex: 'comments',
      ellipsis: true,
    },
    {
      title: intl.formatMessage({ id: `${COLUMN_LOCALE}createDate` }),
      dataIndex: 'createDate',
      ellipsis: true,
    },
    {
      title: intl.formatMessage({ id: `${COLUMN_LOCALE}updateDate` }),
      dataIndex: 'updateDate',
      ellipsis: true,
    },
    {
      title: intl.formatMessage({ id: `${COLUMN_LOCALE}actions` }),
      dataIndex: 'actions',
      ellipsis: true,
      fixed: "right",
      width: 200,
      render: renderActions
    }
  ];

  return columns;
}

export const useTableFields = (formRef: RefObject<any>, isView?: boolean) => {

  const intl = useIntl();
  const { data } = useData<ProSchemaValueEnumType>(() =>
    dataDictApi.query(undefined, ['jdbc_type']).then(res => {
      return res.data?.reduce((option, item) => {
        option[item.constantKey] = {
          text: item.constantKey
        }
        return option;
      }, {}) as ProSchemaValueEnumType
    }));

  const switchProps = {
    checkedChildren: intl.formatMessage({ id: 'pages.platform.datasource.form.table.switch.checked' }),
    unCheckedChildren: intl.formatMessage({ id: 'pages.platform.datasource.form.table.switch.unchecked' })
  }

  const columns: ProColumns<TableFieldType>[] = [
    {
      title: intl.formatMessage({ id: `${TABLE_LOCALE}fieldName` }),
      dataIndex: 'fieldName',
      ellipsis: true,
      formItemProps: {
        rules: [
          {
            required: true,
            message: intl.formatMessage({ id: 'pages.platform.datasource.form.table.validator.required' }),
          },
          {
            max: 64,
            message: `${intl.formatMessage({ id: 'pages.platform.datasource.form.table.validator.max' })}64`
          },
          {
            pattern: /^[a-zA-Z_$][\w$]*$/,
            message: `${intl.formatMessage({ id: 'pages.platform.datasource.form.table.validator.variable' })}`,
          }
        ],
      },
    },
    {
      title: intl.formatMessage({ id: `${TABLE_LOCALE}fieldType` }),
      dataIndex: 'fieldType',
      ellipsis: true,
      valueType: 'select',
      valueEnum: data as ProSchemaValueEnumType,
    },
    {
      title: intl.formatMessage({ id: `${TABLE_LOCALE}fieldLength` }),
      dataIndex: 'fieldLength',
      ellipsis: true,
      valueType: 'digit',
      fieldProps: {
        max: 21845,
      }
    },
    {
      title: intl.formatMessage({ id: `${TABLE_LOCALE}decimals` }),
      dataIndex: 'decimals',
      ellipsis: true,
      valueType: 'digit',
      fieldProps: {
        max: 30,
      }
    },
    {
      title: intl.formatMessage({ id: `${TABLE_LOCALE}default` }),
      dataIndex: 'default',
      ellipsis: true,
    },
    {
      title: intl.formatMessage({ id: `${TABLE_LOCALE}notNull` }),
      dataIndex: 'notNull',
      ellipsis: true,
      valueType: 'switch',
      fieldProps: switchProps,
      width: 80,
    },
    {
      title: intl.formatMessage({ id: `${TABLE_LOCALE}unique` }),
      dataIndex: 'unique',
      ellipsis: true,
      valueType: 'switch',
      fieldProps: switchProps,
      width: 80,
    },
    {
      title: intl.formatMessage({ id: `${TABLE_LOCALE}fieldDesc` }),
      dataIndex: 'fieldDesc',
      ellipsis: true,
    },
    {
      title: intl.formatMessage({ id: `${TABLE_LOCALE}actions` }),
      dataIndex: 'actions',
      ellipsis: true,
      valueType: 'option',
      width: 150,
      fixed: 'right',
      hideInTable: isView,
      render: (text, record, _, action) => {
        if (DEFAULT_TABLE_VALUES_KEYS.includes(record.fieldName)) {
          return null;
        }
        return [
          <a
            key="editable"
            onClick={() => {
              action?.startEditable?.(record.id);
            }}
          >
            {intl.formatMessage({ id: 'pages.platform.datasource.form.edit' })}
          </a>,
          <a
            key="delete"
            onClick={() => {
              const tableDataSource = formRef.current?.form?.getFieldValue('columns') as TableFieldType[];
              formRef.current?.form?.setFieldsValue({
                table: tableDataSource.filter((item) => item.id !== record.id),
              });
            }}
          >
            {intl.formatMessage({ id: 'pages.platform.datasource.form.delete' })}
          </a>,
        ]
      },
    },
  ]

  const fields: FieldProps[] = [
    {
      itemProps: {
        name: 'name',
        label: intl.formatMessage({ id: `${TABLE_LOCALE}name` }),
        rules: [{
          required: true,
          max: 64
        }],
        style: {
          width: 300
        }
      },
      compType: CompTypeEnum.TextInput,
    },
    {
      itemProps: {
        name: 'description',
        label: intl.formatMessage({ id: `${TABLE_LOCALE}description` }),
        style: {
          width: 300
        }
      },
      compType: CompTypeEnum.TextInput,
    },
    {
      itemProps: {
        name: 'columns',
        label: intl.formatMessage({ id: `${TABLE_LOCALE}columns` }),
        rules: [{
          required: true
        }],
      },
      compProps: {
        disabled: isView,
        columns,
        scroll: {
          x: 500,
          y: 300
        },
      },
      compType: CompTypeEnum.EditProTable,
    },
  ];

  return fields;
}

export const useActions = (datasourceRef: MutableRefObject<(isHidden: boolean) => void>) => {
  const intl = useIntl();
  const actions: ActionProps[] = [
    {
      title: intl.formatMessage({ id: 'pages.platform.datasource.form.view' }),
      actionType: 'view',
      onClick: (id: string) => {
        return datasourceApi.getDatabaseDetail(id).then(res => {
          if (res.data?.type == '1') {
            datasourceRef.current(false)
          }
          return res
        });
      }
    },
    {
      title: intl.formatMessage({ id: 'pages.platform.datasource.form.delete' }),
      confirmTitle: intl.formatMessage({ id: 'pages.platform.datasource.form.confirmTitle' }),
      actionType: 'delete',
      onClick: (id: string) => {
        return datasourceApi.deleteDatabase(id);
      }
    }
  ];

  return actions
}


