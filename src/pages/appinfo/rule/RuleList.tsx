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

function RuleList(props: Props) {
  const [visible, setVisible] = useState(false)
  const [loading, setLoading] = useState(false)
  const [actionType, setActionType] = useState<"add" | "edit" | "watch">("add")
  const [activeRow, setActiveRow] = useState<RuleData>()
  const [ruleTypeList, setRuleTypeList] = useState<DicType[]>([])
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
    if (props.dicList.length > 0) {
      setRuleTypeList(filterDicList(props.dicList, "rule_type"))
    }
  }, [props.dicList])

  const init = async (current: number) => {
    const params = {
      "data": {
        // appId: "991295760049893376"
        appId: getAppId()
      },
      operator: localStorage.getItem(Constant.USER_INFO_STORAGE),
      "page": current || 1,
      "size": list.pageSize,
      "source": "PC",
      "traceId": "",
      "version": "1",
      "lang": transLang()
    }
    setLoading(true)
    const result = await ruleApi.getRuleList(params)
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
      setActiveRow(row)
      getDetailByRuleId(row?.ruleId as string, row?.ruleType as string)
    } else {
      setActiveRow({
        ruleDesc: '',
        ruleId: '',
        ruleName: '',
        ruleType: ''
      })
      ruleForm.resetFields()
    }
  }

  const getDetailByRuleId = async (id: string, ruleType: string) => {
    setLoading(true)
    const result = await ruleApi.getDetailByRuleId(id, ruleType)
    setLoading(false)
    if (result && result.success) {
      ruleForm.setFieldsValue({
        ...result.data,
        ruleType: String(result.data.ruleType)
      })
    }
  }

  const deleteItem = async (row: RuleData) => {
    setLoading(true)
    const result = await ruleApi.deleteRuleItem(row.ruleId, row.ruleType)
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
          appId: getAppId()
        }
        if (actionType === 'edit') {
          params = {
            ...params,
            ruleId: activeRow?.ruleId
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
      title: intl.formatMessage({ id: 'pages.app.rule.table.ruleName' }),
      align: 'center',
      dataIndex: 'ruleName',
    },
    {
      title: intl.formatMessage({ id: 'pages.app.rule.table.ruleDesc' }),
      align: 'center',
      dataIndex: 'ruleDesc',
    },
    {
      title: intl.formatMessage({ id: 'pages.app.rule.table.ruleType' }),
      align: 'center',
      dataIndex: 'ruleType',
      render: (text) => ConstantValueToContentKey(ruleTypeList, text)
    },
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

  const [ruleType, setRuleType] = useState();
  const [serialNumberRules, setSerialNumberRules] = useState<any>();

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
        // labelCol={{ span: 6 }}
        // wrapperCol={{ span: 16 }}
        >
          <Form.Item
            name="ruleType"
            label={intl.formatMessage({ id: 'pages.app.rule.table.ruleType' })}
            rules={[{
              required: true,
              message: intl.formatMessage({ id: 'pages.app.rule.table.ruleType.placeholder' })
            }]}
          >
            <Select
              disabled={actionType === 'watch'}
              onChange={setRuleType}
              placeholder={intl.formatMessage({ id: 'pages.app.rule.table.ruleType.placeholder' })}
            >
              {ruleTypeList.length > 0 && ruleTypeList.map(item => (
                <Option
                  key={item.constantValue}
                  value={item.constantValue}
                >{item.constantKey}</Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="ruleName"
            label={intl.formatMessage({ id: 'pages.app.rule.table.ruleName' })}
            rules={[{
              required: true,
              message: intl.formatMessage({ id: 'pages.app.rule.table.ruleName.placeholder' })
            }]}
          >
            <Input
              disabled={actionType === 'watch'}
              autoComplete='off'
              placeholder={intl.formatMessage({ id: 'pages.app.rule.table.ruleName.placeholder' })}
            />
          </Form.Item>
          {
            ruleType == 3 && (
              <>
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
                <Form.Item
                  name="activeFlag"
                  label={intl.formatMessage({ id: 'pages.app.rule.table.activeFlag', defaultMessage: '生效标识' })}
                >
                  <Input
                    disabled={actionType === 'watch'}
                    autoComplete='off'
                  />
                </Form.Item>
              </>
            )
          }
          <Form.Item
            name="ruleDesc"
            label={intl.formatMessage({ id: 'pages.app.rule.table.ruleDesc' })}
          >
            <TextArea
              disabled={actionType === 'watch'}
              rows={4}
              placeholder={intl.formatMessage({ id: 'pages.app.rule.table.ruleDesc.placeholder' })}
            />
          </Form.Item>
          {ruleType != 3 && <Form.Item
            name="srcCode"
            label={intl.formatMessage({ id: 'pages.app.rule.table.srcCode' })}
            rules={[{
              required: ruleType != 3,
              message: intl.formatMessage({ id: 'pages.app.rule.table.srcCode.placeholder' })
            }]}
          >
            <TextArea
              disabled={actionType === 'watch'}
              rows={4}
              placeholder={intl.formatMessage({ id: 'pages.app.rule.table.srcCode.placeholder' })}
            />
          </Form.Item>}
        </Form>
      </Modal>
    </Spin>
  )
}

export default React.memo(RuleList)
