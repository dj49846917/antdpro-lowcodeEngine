import DTable from '@/components/DTable'
import RuleGroupModalList from '@/components/RuleGroupModalList'
import { Constant } from '@/constant'
import { ActiveTreeType, UserTaskTreeInfoType, UserTaskTreeRowType } from '@/pages/progress/type'
import progressApi from '@/services/custom/appInfo/progress'
import ruleApi from '@/services/custom/appInfo/rule'
import { CheckInfo, DicType, ListType } from '@/types/common'
import { parseTreeData, transLang, ConstantValueToContentKey, filterDicList, getAppId } from '@/utils/utils'
import { Button, Form, Input, message, Modal, notification, Popconfirm, Spin } from 'antd'
import { useForm } from 'antd/es/form/Form'
import { ColumnsType, TablePaginationConfig, TableRowSelection } from 'antd/lib/table/interface'
import { DataNode } from 'antd/lib/tree'
import React from 'react'
import { useEffect, useState } from 'react'
import { useIntl } from 'umi'
import { RuleGroupData } from './type'

const { TextArea } = Input;
type Props = {
  dicList: DicType[]
}

function RuleGroup(props: Props) {
  const intl = useIntl()
  const [groupForm] = useForm()
  const [carryoutForm] = useForm()
  const [visible, setVisible] = useState(false)
  const [actionType, setActionType] = useState<"add" | "edit" | "watch">("add")
  const [activeRow, setActiveRow] = useState<RuleGroupData>()
  const [activeFlagList, setActiveFlagList] = useState<DicType[]>([])
  const [carryVisible, setCarryVisible] = useState(false)
  const [list, setList] = useState<ListType<RuleGroupData>>({
    dataSource: [],
    pageIndex: 1,
    pageSize: 10,
    total: 0
  })
  const [loading, setLoading] = useState(false)
  const [ruleList, setRuleList] = useState<DataNode[]>([])
  const [checkedRuleInfo, setCheckedRuleInfo] = useState<UserTaskTreeInfoType>({
    checkedKeys: [],
    checkedRowInfo: []
  })
  // 用于深拷贝方便取消和确定时切换数据
  const [modalCheckedRuleInfo, setModalCheckedRuleInfo] = useState<UserTaskTreeInfoType>({
    checkedKeys: [],
    checkedRowInfo: []
  })

  useEffect(() => {
    init(1)
    initRuleList()
  }, [])

  useEffect(() => {
    if (props.dicList.length > 0) {
      setActiveFlagList(filterDicList(props.dicList, "active_flag"))
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
    const result = await ruleApi.getRuleGroupList(params)
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

  const initRuleList = async () => {
    const params = {
      appId: getAppId(),
      ruleType: 1
    }
    const result = await progressApi.getRuleList(params)
    if (result && result.success) {
      if (result.data && result.data.length > 0) {
        const parseData = parseTreeData(result.data, {
          key: 'ruleId',
          title: 'ruleName'
        })
        setRuleList(parseData)
      }
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
      return intl.formatMessage({ id: 'pages.app.rule.table.addGroup' })
    } else if (actionType === 'edit') {
      return intl.formatMessage({ id: 'pages.app.rule.table.editGroup' })
    } else {
      return intl.formatMessage({ id: 'pages.app.rule.table.watchGroup' })
    }
  }

  // 列表选中
  const rowSelection: TableRowSelection<RuleGroupData> = {
    onChange: (selectedRowKeys, selectedRows) => {
    }
  };

  // 列表操作按钮
  const action = (type: "watch" | "edit" | "add", row?: RuleGroupData) => {
    setActionType(type)
    setVisible(true)
    if (type !== 'add') {
      setActiveRow(row)
      groupForm.setFieldsValue({
        ...row
      })
      // 根据groupId查询rule列表
      getRuleListByRuleGroupId(row?.ruleGroupId as string)
    } else {
      setActiveRow({
        ruleGroupId: '',
        ruleGroupDesc: '',
        ruleGroupName: ''
      })
      groupForm.resetFields()
      setModalCheckedRuleInfo(JSON.parse(JSON.stringify(checkedRuleInfo)))
    }
  }

  // 根据ruleGroupId查询rule列表
  const getRuleListByRuleGroupId = async (id: string) => {
    setLoading(true)
    const result = await ruleApi.getRuleListByRuleGroupId(id)
    setLoading(false)
    if (result && result.success) {
      const parseData = parseTreeData(result.data, {
        key: 'ruleId',
        title: 'ruleName'
      })
      const arrKey: ActiveTreeType = []
      const arr: UserTaskTreeRowType[] = []
      parseData.forEach(item => {
        arrKey.push(item.key)
        arr.push(item as UserTaskTreeRowType)
      })
      setCheckedRuleInfo({ checkedKeys: arrKey, checkedRowInfo: arr })
      setModalCheckedRuleInfo({ checkedKeys: arrKey, checkedRowInfo: arr })
    }
  }

  // 删除按钮
  const deleteList = async (row: RuleGroupData) => {
    setLoading(true)
    setActiveRow(row)
    const result = await ruleApi.deleteGroupItem(row.ruleGroupId)
    setLoading(false)
    if (result && result.success) {
      notification.success({
        message: intl.formatMessage({ id: 'pages.btn.success' })
      })
      init(1)
    }
  }

  // 修改状态
  const changeStatus = async (row: RuleGroupData) => {
    setLoading(true)
    setActiveRow(row)
    let result;
    if (row.activeFlag === 0) {
      result = await ruleApi.activeGroup(row.ruleGroupId)
    } else {
      result = await ruleApi.disableGroup(row.ruleGroupId)
    }
    setLoading(false)
    if (result && result.success) {
      notification.success({
        message: intl.formatMessage({ id: 'pages.btn.success' })
      })
      init(1)
    }
  }

  const checkRules = (checkedKeysValue: ActiveTreeType, event: CheckInfo) => {
    setModalCheckedRuleInfo({
      checkedKeys: checkedKeysValue,
      checkedRowInfo: event.checkedNodes as any
    })
  }

  const deleteItem = (row: UserTaskTreeRowType) => {
    setModalCheckedRuleInfo({
      checkedKeys: Array.isArray(modalCheckedRuleInfo.checkedKeys) ? modalCheckedRuleInfo.checkedKeys.filter((x: string | number) => x !== row.key) : modalCheckedRuleInfo.checkedKeys.checked.filter((x: string | number) => x !== row.key),
      checkedRowInfo: modalCheckedRuleInfo.checkedRowInfo.filter((x: { key: string | number; }) => x.key !== row.key)
    })
  }

  const moveItem = (row: UserTaskTreeRowType, type: "up" | "done") => { // 移动规则
    const arr: UserTaskTreeRowType[] = JSON.parse(JSON.stringify(modalCheckedRuleInfo.checkedRowInfo))
    const arr2: ActiveTreeType = JSON.parse(JSON.stringify(modalCheckedRuleInfo.checkedKeys))
    if (type === 'up') {
      arr.forEach((item: UserTaskTreeRowType, index: number) => {
        if (row.key === item.key) {
          let temp = arr[index - 1];
          arr[index - 1] = arr[index];
          arr[index] = temp;
        }
      })
      if (!Array.isArray(arr2)) {
        arr2.checked.forEach((item, index) => {
          if (row.key === item) {
            let temp = arr2.checked[index - 1];
            arr2.checked[index - 1] = arr2.checked[index];
            arr2.checked[index] = temp;
          }
        })
      }
    }
    if (type === 'done') {
      arr.forEach((item: UserTaskTreeRowType, index: number) => {
        if (row.key === item.key) {
          if (arr.length > index + 1) {
            let temp = arr[index + 1];
            arr[index + 1] = arr[index];
            arr[index] = temp;
          }
        }
      })
      if (!Array.isArray(arr2)) {
        arr2.checked.forEach((item, index) => {
          if (row.key === item) {
            if (arr2.checked.length > index + 1) {
              let temp = arr2.checked[index + 1];
              arr2.checked[index + 1] = arr2.checked[index];
              arr2.checked[index] = temp;
            }

          }
        })
      }
    }
    setModalCheckedRuleInfo({
      checkedKeys: arr2,
      checkedRowInfo: arr
    })
  }

  const deleteAll = () => { // 点击弹窗的清除所有按钮
    setModalCheckedRuleInfo({
      checkedKeys: [],
      checkedRowInfo: []
    })
  }

  // 点击取消
  const cancelAcition = () => {
    groupForm.resetFields()
    setVisible(false)
  }

  // 点击确定
  const saveAction = async () => {
    const result = await groupForm.validateFields()
    if (result) {
      if (modalCheckedRuleInfo.checkedRowInfo.length === 0) {
        message.error(
          intl.formatMessage({ id: 'pages.app.rule.modal.rule.placeholder' })
        )
        return
      }
      const list = modalCheckedRuleInfo.checkedRowInfo.map((item, index) => {
        if (actionType === 'add') {
          return {
            ruleId: item.key,
            rulePriority: index
          }
        }
        return {
          ruleId: item.key,
          rulePriority: index,
          ruleGroupId: activeRow?.ruleGroupId
        }
      })
      const params = {
        ...result,
        appId: getAppId(),
        ruleList: list
      }
      if (actionType !== 'add') {
        params.ruleGroupId = activeRow?.ruleGroupId
      }
      setLoading(true)
      const res = await ruleApi.addAndEditRuleGroup(params)
      setCheckedRuleInfo(modalCheckedRuleInfo)
      setLoading(false)
      if (res && res.success) {
        notification.success({
          message: intl.formatMessage({ id: 'pages.btn.success' })
        })
        init(1)
        setVisible(false)
      }
    }
  }

  // 点击执行弹窗的确定
  const saveCarryout = async () => {
    const validate = await carryoutForm.validateFields();
    let ruleParams;
    if (validate) {
      try {
        ruleParams = JSON.parse(validate.ruleParams)
      } catch (error) {
        message.error(intl.formatMessage({ id: 'pages.app.rule.modal.ruleGroup.formParams.error' }))
      }
    }
    if (ruleParams) {
      const params = {
        resultFactKey: validate.resultFactKey,
        ruleParams,
        ruleGroupId: activeRow?.ruleGroupId as string
      }
      setLoading(true)
      const result = await ruleApi.carryoutGroup(params)
      setLoading(false)
      if (result && result.success) {
        notification.success({
          message: intl.formatMessage({ id: 'pages.btn.success' })
        })
        init(1)
        setCarryVisible(false)
      }
    }
  }

  const columns: ColumnsType<RuleGroupData> = [
    {
      title: intl.formatMessage({ id: 'pages.app.rule.table.ruleGroupName' }),
      align: 'center',
      dataIndex: 'ruleGroupName',
    },
    {
      title: intl.formatMessage({ id: 'pages.app.rule.table.ruleGroupDesc' }),
      align: 'center',
      dataIndex: 'ruleGroupDesc',
    },
    {
      title: intl.formatMessage({ id: 'pages.appInfo.page.table.activeFlag' }),
      align: 'center',
      dataIndex: 'activeFlag',
      render: (text) => ConstantValueToContentKey(activeFlagList, text)
    },
    {
      title: intl.formatMessage({ id: 'pages.table.action' }),
      align: 'center',
      dataIndex: 'action',
      render: (text, row) => {
        return (
          <div>
            <Button type='link' onClick={() => action('watch', row)}>{intl.formatMessage({ id: 'table.actions.view' })}</Button>
            <Button type='link' onClick={() => action('edit', row)}>{intl.formatMessage({ id: 'table.actions.edit' })}</Button>
            <Popconfirm title={intl.formatMessage({ id: 'pages.delete.placeholder' })} onConfirm={() => deleteList(row)}>
              <Button type='link'>{intl.formatMessage({ id: 'pages.delete' })}</Button>
            </Popconfirm>
            {
              row.activeFlag === 0 ? (
                <Popconfirm title={intl.formatMessage({ id: 'pages.action.placeholder' })} onConfirm={() => changeStatus(row)}>
                  <Button type='link'>{intl.formatMessage({ id: 'table.actions.active' })}</Button>
                </Popconfirm>
              ) : (
                <>
                  <Popconfirm title={intl.formatMessage({ id: 'pages.action.placeholder' })} onConfirm={() => changeStatus(row)}>
                    <Button type='link'>{intl.formatMessage({ id: 'table.actions.disable' })}</Button>
                  </Popconfirm>
                  <Button type='link' onClick={() => { setActiveRow(row); setCarryVisible(true) }}>{intl.formatMessage({ id: 'table.actions.carryout' })}</Button>
                </>
              )
            }
          </div>
        )
      }
    }
  ];

  return (
    <Spin spinning={loading}>
      <div className='tables'>
        <Button type='primary' onClick={() => action("add")}>{intl.formatMessage({ id: 'pages.app.rule.table.addGroup' })}</Button>
        <DTable
          className='table'
          rowSelection={{ ...rowSelection }}
          columns={columns}
          dataSource={list.dataSource}
          rowKey="ruleGroupId"
          onChange={changePage}
          pagination={{
            total: Number(list.total),
            current: Number(list.pageIndex),
            pageSize: Number(list.pageSize),
          }}
        />
      </div>
      <Modal
        title={showTitle()}
        visible={visible}
        onCancel={cancelAcition}
        footer={
          actionType === 'watch' ? null : (
            <div>
              <Button onClick={cancelAcition}>{intl.formatMessage({ id: 'pages.cancel' })}</Button>
              <Button type='primary' onClick={saveAction}>{intl.formatMessage({ id: 'pages.ok' })}</Button>
            </div>
          )
        }
      >
        <Form
          form={groupForm}
          name="advanced_search"
          className="ant-advanced-search-form"
          preserve={false}
          layout="vertical"
        >
          <Form.Item
            name="ruleGroupName"
            label={intl.formatMessage({ id: 'pages.app.rule.table.ruleGroupName' })}
            rules={[{ required: true, message: intl.formatMessage({ id: 'pages.app.rule.table.ruleGroupName.placeholder' }) }]}
          >
            <Input disabled={actionType === 'watch'} autoComplete='off' placeholder={intl.formatMessage({ id: 'pages.app.rule.table.ruleGroupName.placeholder' })} />
          </Form.Item>
          <Form.Item
            name="ruleGroupDesc"
            label={intl.formatMessage({ id: 'pages.app.rule.table.ruleGroupDesc' })}
          >
            <TextArea disabled={actionType === 'watch'} rows={4} placeholder={intl.formatMessage({ id: 'pages.app.rule.table.ruleGroupDesc.placeholder' })} />
          </Form.Item>
        </Form>
        <RuleGroupModalList
          actionType={actionType}
          checkRules={(checkedKeysValue, event) => checkRules(checkedKeysValue, event)}
          checkedRuleInfo={modalCheckedRuleInfo}
          treeData={ruleList}
          deleteAll={() => deleteAll()}
          moveItem={(row: UserTaskTreeRowType, type: "up" | "done") => moveItem(row, type)}
          deleteItem={(row: UserTaskTreeRowType) => deleteItem(row)}
        />
      </Modal>
      <Modal
        destroyOnClose
        title={intl.formatMessage({ id: 'pages.app.rule.modal.ruleGroup.title' })}
        visible={carryVisible}
        onCancel={() => setCarryVisible(false)}
        onOk={() => saveCarryout()}
        cancelText={intl.formatMessage({ id: 'pages.cancel' })}
        okText={intl.formatMessage({ id: 'pages.ok' })}
      >
        <Form
          form={carryoutForm}
          name="advanced_search"
          className="ant-advanced-search-form"
          preserve={false}
          layout="vertical"
        >
          <Form.Item
            name="resultFactKey"
            label={intl.formatMessage({ id: 'pages.app.rule.modal.ruleGroup.resultFactKey' })}
            rules={[{ required: true, message: intl.formatMessage({ id: 'pages.app.rule.modal.ruleGroup.resultFactKey.placeholder' }) }]}
          >
            <TextArea rows={4} placeholder={intl.formatMessage({ id: 'pages.app.rule.modal.ruleGroup.resultFactKey.placeholder' })} />
          </Form.Item>
          <Form.Item
            name="ruleParams"
            label={intl.formatMessage({ id: 'pages.app.rule.modal.ruleGroup.formParams.placeholder' })}
            rules={[{ required: true, message: intl.formatMessage({ id: 'pages.app.rule.modal.ruleGroup.formParams.placeholder' }) }]}
          >
            <TextArea rows={4} placeholder={intl.formatMessage({ id: 'pages.app.rule.modal.ruleGroup.formParams.placeholder' })} />
          </Form.Item>
        </Form>
      </Modal>
    </Spin>
  )
}

export default React.memo(RuleGroup)