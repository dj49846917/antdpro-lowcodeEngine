import type { TableListData } from "@/services/custom/platform/service";
import datasourceApi from "@/services/custom/platform/service"
import { CloseOutlined } from "@ant-design/icons"
import { Button, Drawer, notification, Select, Spin } from "antd"
import { useEffect, useRef, useState } from "react"
import { useIntl } from "umi"
import type { ChildTableInfoType, ErModelList } from "./type"
import './index.less'
import type { ActionType, ProColumns } from "@ant-design/pro-table";
import { EditableProTable } from "@ant-design/pro-table"
import { useRefFunction } from "@ant-design/pro-components"
import progressApi from "@/services/custom/appInfo/progress"
import type { DicType } from "@/types/common"
import React from "react"
import DTableButton from "@/components/DTableButton"
import { useForm } from "antd/lib/form/Form"

const { Option } = Select;

type Props = {
  activeRow: TableListData,
  visible: boolean,
  closeDrawer: (show: boolean) => void
}

const waitTime = (time: number = 100) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, time);
  });
};

type DataSourceType = {
  id?: React.Key;
  title?: string;
  decs?: string;
  state?: string;
  created_at?: string;
  update_at?: string;
  children?: DataSourceType[];
};

const loopDataSourceFilter = (
  data: DataSourceType[],
  id: React.Key | undefined,
): DataSourceType[] => {
  return data
    .map((item) => {
      if (item.id !== id) {
        if (item.children) {
          const newChildren = loopDataSourceFilter(item.children, id);
          return {
            ...item,
            children: newChildren.length > 0 ? newChildren : undefined,
          };
        }
        return item;
      }
      return null;
    })
    .filter(Boolean) as DataSourceType[];
};

function parseData(data: ErModelList[]): ErModelList[] {
  return data.map(menu => {
    if (menu.children && menu.children.length > 0) {
      return {
        id: menu.id,
        leftFieldName: menu.leftFieldName,
        relationType: menu.relationType,
        rightFieldName: menu.rightFieldName,
        tableName: menu.tableName,
        children: parseData(menu.children)
      }
    } else {
      return {
        id: menu.id,
        leftFieldName: menu.leftFieldName,
        relationType: menu.relationType,
        rightFieldName: menu.rightFieldName,
        tableName: menu.tableName,
        children: []
      }
    }

  })
}

function Ermodel(props: Props) {
  const [dataSource, setDataSource] = useState<ErModelList[]>([])
  const [tableList, setTableList] = useState<TableListData[]>([])
  const [relationList, setRelationList] = useState<DicType[]>([])
  const [leftInfo, setLeftInfo] = useState<ChildTableInfoType>({})
  const [rightInfo, setRightInfo] = useState<ChildTableInfoType>({})
  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>([]);
  const [form] = useForm();
  const actionRef = useRef<ActionType>();
  const [loading, setLoading] = useState(false)
  const intl = useIntl()

  useEffect(() => {
    getDicArr()
  }, [])

  useEffect(() => {
    if (props.activeRow) {
      initList()
      initChildList()
    }
  }, [props.activeRow])

  const initList = async () => {
    const params = {
      tableName: props.activeRow.tableName,
      datasourceId: props.activeRow.id.split(':')[0]
    }
    setLoading(true)
    const result = await datasourceApi.getDetailInfo(params)
    setLoading(false)
    if (result && result.success) {
      result.data.id = Date.now()
      getTableInfo(result.data, setLeftInfo, '')
      setDataSource([result.data])
    }
  }

  const initChildList = async () => {
    const params = {
      datasourceId: props.activeRow.id.split(':')[0]
    }
    setLoading(true)
    const result = await datasourceApi.getErDetailChild(params)
    setLoading(false)
    if (result && result.success) {
      const list = result.data.map((item: TableListData) => {
        return {
          label: item.tableName,
          value: item.tableName
        }
      })
      setTableList(list)
    }
  }

  const getDicArr = async () => { // 查询数据字典
    const params = {
      parentId: ["relationType"]
    }
    setLoading(true)
    const result = await progressApi.getDicList(params)
    setLoading(false)
    if (result && result.success) {
      const list = result.data.map((item: DicType) => {
        return {
          label: item.description,
          value: Number(item.constantValue)
        }
      })
      setRelationList(list)
    }
  }

  const getTableInfo = async (record: ErModelList, setData: React.Dispatch<React.SetStateAction<ChildTableInfoType>>, e: string) => {
    const params = {
      datasourceId: props.activeRow.id.split(':')[0],
      tableName: record.tableName || e
    }
    setLoading(true)
    const result = await datasourceApi.getTableDetailInfo(params)
    setLoading(false)
    if (result && result.success) {
      const obj = {}
      result.data.columns.forEach((item: { columnName: string }) => {
        obj[item.columnName] = {
          text: item.columnName,
          status: item.columnName
        }
      })
      setData(obj)
    }
  }

  const removeRow = useRefFunction((record: DataSourceType) => {
    setDataSource(loopDataSourceFilter(dataSource, record.id));
  });

  const saveList = async () => {
    const str = parseData(dataSource[0].children as ErModelList[])
    const params = {
      datasourceId: props.activeRow.id.split(':')[0],
      tableName: dataSource[0].tableName as string,
      children: str
    }
    setLoading(true)
    const result = await datasourceApi.saveErModel(params);
    setLoading(false)
    if (result && result.success) {
      notification.success({
        message: intl.formatMessage({
          id: 'pages.btn.success'
        })
      })
      props.closeDrawer(false)
    }
  }

  const columns: ProColumns<ErModelList>[] = [
    {
      title: intl.formatMessage({ id: 'pages.app.model.ermodel.table.tableName' }),
      ellipsis: true,
      width: 200,
      dataIndex: 'tableName',
      valueType: 'select',
      request: async () => {
        return tableList
      },
      renderFormItem: (_, { record }) => {
        return (
          <Select onChange={(e) => getTableInfo(record as ErModelList, setRightInfo, e)}>
            {tableList.map(item => (
              <Option key={item.value} value={item.value}>{item.label}</Option>
            ))}
          </Select>
        )
      },
      formItemProps: {
        rules: [
          {
            required: true,
            message: '此项为必填项',
          },
        ],
      },
    },
    {
      title: intl.formatMessage({ id: 'pages.app.model.ermodel.table.relationType' }),
      ellipsis: true,
      width: 200,
      dataIndex: 'relationType',
      valueType: 'select',
      request: async () => {
        return relationList
      },
      formItemProps: {
        rules: [
          {
            required: true,
            message: '此项为必填项',
          },
        ],
      },
    },
    {
      title: intl.formatMessage({ id: 'pages.app.model.ermodel.table.foreignKey.left' }),
      ellipsis: true,
      width: 200,
      dataIndex: 'leftFieldName',
      valueType: 'select',
      valueEnum: leftInfo,
      formItemProps: {
        rules: [
          {
            required: true,
            message: '此项为必填项',
          },
        ],
      },
    },
    {
      title: intl.formatMessage({ id: 'pages.app.model.ermodel.table.foreignKey.right' }),
      ellipsis: true,
      width: 200,
      dataIndex: 'rightFieldName',
      valueEnum: rightInfo,
      formItemProps: {
        rules: [
          {
            required: true,
            message: '此项为必填项',
          },
        ],
      },
    },
    {
      title: intl.formatMessage({ id: 'pages.table.action', defaultMessage: '操作' }),
      ellipsis: true,
      fixed: 'right',
      width: 100,
      dataIndex: 'action',
      valueType: 'option',
      render: (text, record, _, action) => {
        return [
          <EditableProTable.RecordCreator
            key="add"
            record={{
              id: Date.now(),
            }}
            parentKey={record.id}

          >
            <DTableButton iconType="add" />
          </EditableProTable.RecordCreator>,
          record.relationType === 6 ? null : <DTableButton key="edit" iconType="edit" onClick={() => action?.startEditable?.(record.id)} />,
          <DTableButton key="delete" showComfirm iconType="delete" onClick={() => removeRow(record)} />,
        ]
      }
    }
  ]

  return (
    <Spin spinning={loading}>
      <Drawer
        destroyOnClose
        className="d-er-drawer"
        width="52.08vw"
        title={intl.formatMessage({ id: 'pages.platform.datasource.table.ermoel' })}
        extra={<CloseOutlined onClick={() => props.closeDrawer(false)} />}
        closable={false}
        placement="right"
        onClose={() => props.closeDrawer(false)}
        visible={props.visible}
        footer={
          <div className="d-role-btn">
            <Button onClick={() => props.closeDrawer(false)} style={{ "marginRight": "10px" }}>{intl.formatMessage({ id: 'pages.cancel', defaultMessage: '取消' })}</Button>
            <Button type="primary" onClick={() => saveList()}>{intl.formatMessage({ id: 'pages.ok', defaultMessage: '确定' })}</Button>
          </div>
        }
      >
        {
          dataSource.length > 0 && tableList.length > 0 ? (
            <EditableProTable<ErModelList>
              expandable={{
                defaultExpandAllRows: true,
              }}
              scroll={{
                x: 960,
              }}
              actionRef={actionRef}
              rowKey="id"
              recordCreatorProps={false}
              columns={columns}
              value={dataSource}
              onChange={(val) => {
                setDataSource(val)
              }}
              editable={{
                form,
                type: 'multiple',
                editableKeys,
                onSave: async (rowKey, data, row) => {
                  await waitTime(2000);
                },
                onChange: setEditableRowKeys,
                // onValuesChange(record, dataSource) {
                //   console.log("22211", record, dataSource)
                //   if (record.tableName) {
                //     form.resetFields()
                //   }
                // },
                // actionRender: (row, config, dom) => [dom.save, dom.cancel],
                saveText: <DTableButton iconType="save" />,
                deleteText: <DTableButton iconType="delete" />,
                cancelText: <DTableButton iconType="cancel" />
              }}
            />
          ) : null
        }
      </Drawer>
    </Spin>
  )
}

export default React.memo(Ermodel)