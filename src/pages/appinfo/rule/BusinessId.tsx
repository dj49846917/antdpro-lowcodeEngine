import DTable from '@/components/DTable'
import { Constant } from '@/constant'
import ruleApi from '@/services/custom/appInfo/rule'
import { DicType, ListType } from '@/types/common'
import { ConstantValueToContentKey, filterDicList, getAppId, transLang } from '@/utils/utils'
import { Button, Form, Input, Modal, notification, Popconfirm, Select, Spin } from 'antd'
import { useForm } from 'antd/lib/form/Form'
import { ColumnsType, TablePaginationConfig, TableRowSelection } from 'antd/lib/table/interface'
import React, { useEffect, useState } from 'react'
import { useIntl } from 'umi'
import { RuleData } from './type'
import dataDictApi from "@/services/dataDict";

const { Option } = Select;
const { TextArea } = Input;
type Props = {
  dicList: DicType[]
}

function BusinessId(props: Props) {
  const [visible, setVisible] = useState(false)
  const [loading, setLoading] = useState(false)
  const [serialNumberRules, setSerialNumberRules] = useState<any>();
  const [actionType, setActionType] = useState<"add" | "edit" | "watch">("add")
  const [activeRow, setActiveRow] = useState<RuleData>({} as RuleData)
  const [list, setList] = useState<ListType<RuleData>>({
    dataSource: [],
    pageIndex: 1,
    pageSize: 10,
    total: 0
  })
  const [ruleForm] = useForm()
  const intl = useIntl()

  useEffect(() => {
    init(1)
  }, [])

  useEffect(() => {
    dataDictApi.query(undefined, ['serial_number']).then((res) => {
      setSerialNumberRules(res?.data?.map(item => {
        return {
          value: item.constantValue,
          label: item.constantKey,
        }
      }))
    })
  }, [])

  const init = async (current: number) => {
    const params = {}
    setLoading(true)
    const result = await ruleApi.getBusinessIdList(params, current)
    setLoading(false)
    if (result && result.success) {
      setList({
        ...list,
        dataSource: result.data.list,
        total: result.data.total,
        pageIndex: current
      })
    }
  }

  // 切换分页
  const changePage = (page: TablePaginationConfig) => {
    setList({
      ...list,
      pageIndex: page.current || list.pageIndex,
      pageSize: page.pageSize || list.pageSize,
      total: page.total || list.total
    })
    init(page.current as number)
  }

  const showTitle = () => {
    if (actionType === 'add') {
      return intl.formatMessage({ id: 'pages.app.rule.table.addRule' })
    } else if (actionType === 'edit') {
      return intl.formatMessage({ id: 'pages.app.rule.table.editRule' })
    } else {
      return intl.formatMessage({ id: 'pages.app.rule.table.watchRule' })
    }
  }

  // 列表选中
  const rowSelection: TableRowSelection<RuleData> = {
    onChange: (selectedRowKeys, selectedRows) => {
    }
  };

  const action = (type: "watch" | "edit" | "add", row?: RuleData) => {
    setActionType(type)
    setVisible(true)
    if (type !== 'add') {
      setActiveRow(row as RuleData)
      ruleForm.setFieldsValue({
        ...row
      })
    } else {
      setActiveRow({} as RuleData)
      ruleForm.resetFields()
    }
  }

  const deleteItem = async (row: RuleData) => {
    setLoading(true)
    const result = await ruleApi.deleteRuleItem(row.id, "3")
    setLoading(false)
    if (result && result.success) {
      notification.success({
        message: intl.formatMessage({ id: 'pages.btn.success' })
      })
      init(1)
    }
  }

  const saveAction = async () => {
    let params;
    if (actionType !== 'watch') {
      const result = await ruleForm.validateFields()
      if (result) {
        params = {
          ...result,
          ruleName: result.numberName,
          appId: getAppId(),
          ruleType: 3,
          activeFlag: 1
        }
        if (actionType === 'edit') {
          params = {
            ...params,
            ruleId: activeRow?.id
          }
        }
        setLoading(true)
        const res = await ruleApi.addAndEditRule(params)
        setLoading(false)
        if (res && res.success) {
          notification.success({
            message: intl.formatMessage({ id: 'pages.btn.success' })
          })
          setVisible(false)
          init(1)
        }
      }
    }
  }

  const cancelAcition = () => {
    setVisible(false)
  }

  const columns: ColumnsType<RuleData> = [
    {
      title: intl.formatMessage({ id: 'pages.app.rule.table.businessName' }),
      align: 'center',
      dataIndex: 'numberName',
    },
    {
      title: intl.formatMessage({ id: 'pages.app.rule.table.rulePrefix' }),
      align: 'center',
      dataIndex: 'numberPrefix',
    },
    // {
    //   title: intl.formatMessage({ id: 'pages.app.rule.table.activeFlag' }),
    //   align: 'center',
    //   dataIndex: 'activeFlag',
    //   render: (text) => ConstantValueToContentKey(activeFlagList, text)
    // },
    {
      title: intl.formatMessage({ id: 'pages.table.action' }),
      align: 'center',
      dataIndex: 'action',
      render: (text, row) => {
        return (
          <div>
            <Button
              type='link'
              onClick={() => action('watch', row)}
            >{intl.formatMessage({ id: 'table.actions.view' })}</Button>
            <Button
              type='link'
              onClick={() => action('edit', row)}
            >{intl.formatMessage({ id: 'table.actions.edit' })}</Button>
            <Popconfirm
              title={intl.formatMessage({ id: 'pages.delete.placeholder' })}
              onConfirm={() => deleteItem(row)}
            >
              <Button type='link'>{intl.formatMessage({ id: 'pages.delete' })}</Button>
            </Popconfirm>
          </div>
        )
      }
    }
  ];

  // const [ruleType, setRuleType] = useState();

  return (
    <Spin spinning={loading}>
      <div className='tables'>
        <Button
          type='primary'
          onClick={() => action("add")}
        >{intl.formatMessage({ id: 'pages.app.rule.table.addRule' })}</Button>
        <DTable
          className='table'
          rowSelection={{ ...rowSelection }}
          columns={columns}
          dataSource={list.dataSource}
          rowKey="ruleId"
          onChange={changePage}
          pagination={{
            total: Number(list.total),
            current: Number(list.pageIndex),
            pageSize: Number(list.pageSize),
          }}
        />
      </div>
      <Modal
        // wrapClassName="abc"
        // className='d-group-modal'
        title={showTitle()}
        visible={visible}
        onCancel={cancelAcition}
        footer={
          actionType === 'watch' ? null : (
            <div>
              <Button onClick={cancelAcition}>{intl.formatMessage({ id: 'pages.cancel' })}</Button>
              <Button
                type='primary'
                onClick={saveAction}
              >{intl.formatMessage({ id: 'pages.ok' })}</Button>
            </div>
          )
        }
      >
        <Form
          form={ruleForm}
          name="advanced_search"
          className="ant-advanced-search-form"
          preserve={false}
          layout="vertical"
        >
          <Form.Item
            name="numberName"
            label={intl.formatMessage({ id: 'pages.app.rule.table.businessName', defaultMessage: '流水号名称' })}
            rules={[{
              required: true,
            }]}
          >
            <Input
              disabled={actionType === 'watch'}
              autoComplete='off'
            />
          </Form.Item>
          <Form.Item
            name="numberDigit"
            label={intl.formatMessage({ id: 'pages.app.rule.table.numberDigit', defaultMessage: '流水号位数' })}
            rules={[{
              required: true,
            }]}
          >
            <Input
              disabled={actionType === 'watch'}
              autoComplete='off'
            />
          </Form.Item>
          <Form.Item
            name="numberRule"
            label={intl.formatMessage({ id: 'pages.app.rule.table.numberRule', defaultMessage: '流水号规则' })}
            rules={[{
              required: true,
            }]}
          >
            <Select
              options={serialNumberRules}
              disabled={actionType === 'watch'}
            />
          </Form.Item>
          <Form.Item
            name="numberPrefix"
            label={intl.formatMessage({ id: 'pages.app.rule.table.rulePrefix', defaultMessage: '流水号前缀' })}
          >
            <Input
              disabled={actionType === 'watch'}
              autoComplete='off'
            />
          </Form.Item>
          {/* <Form.Item
            name="activeFlag"
            label={intl.formatMessage({ id: 'pages.app.rule.table.activeFlag', defaultMessage: '是否生效' })}
            rules={[{
              required: true,
            }]}
          >
            <Select
              disabled={actionType === 'watch'}
            >
              {activeFlagList.length > 0 && activeFlagList.map(item => (
                <Option
                  key={item.constantValue}
                  value={item.constantValue}
                >{item.constantKey}</Option>
              ))}
            </Select>
          </Form.Item> */}
        </Form>
      </Modal>
    </Spin>
  )
}

export default React.memo(BusinessId)
