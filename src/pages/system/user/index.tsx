import DButton from '@/components/DButton';
import DTable from '@/components/DTable';
import DTableButton from '@/components/DTableButton';
import LcIcon from '@/components/LcIcon';
import { Constant } from '@/constant';;
import progressApi from '@/services/custom/appInfo/progress';
import userApi from '@/services/custom/system/user';
import { CommonResponseType, DicType, ListType } from '@/types/common';
import { parseTreeData, transLang } from '@/utils/utils';
import { PageContainer } from '@ant-design/pro-layout';
import { Button, Card, Col, Form, Input, Modal, notification, Row, Select, Tooltip, Tree, TreeSelect } from 'antd'
import { useForm } from 'antd/lib/form/Form';
import { ColumnsType, TablePaginationConfig } from 'antd/lib/table';
import { DataNode } from 'antd/lib/tree';
import { useEffect, useState } from 'react';
import { useIntl } from 'umi';
import './index.less'
import { AddAndEditUserType, TableFormData, UserListData } from './type';
import schemaApi from '@/services/schemaApi';

const { SHOW_PARENT } = TreeSelect;

type Props = {}
function User(props: Props) {
  const { Option } = Select;
  const intl = useIntl()
  const [form] = useForm()
  const [addForm] = useForm()
  const [loading, setLoading] = useState(false)
  const [departmentList, setDepartmentList] = useState<DataNode[]>([])
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const [treeValue, setTreeValue] = useState<string[]>([]);
  const [treeData, setTreeData] = useState<DataNode[]>([])
  const [actionType, setActionType] = useState<"add" | "edit">("add")
  const [activeRow, setActiveRow] = useState<UserListData>({})
  const [visible, setVisible] = useState(false)
  const [tenantArr, setTenantArr] = useState([])
  const [list, setList] = useState<ListType<UserListData>>({
    dataSource: [],
    pageIndex: 1,
    pageSize: 10,
    total: 0
  })

  useEffect(() => {
    getOrgList()
    initRoleList()
  }, [])

  // 查询初始化列表
  const getOrgList = async () => {
    setLoading(true)
    const result = await progressApi.getUserTaskDepartment()
    setLoading(false)
    if (result && result.success) {
      const parseData = parseTreeData(result.data, {
        key: 'businessId',
        title: 'organizationName'
      })
      setDepartmentList(parseData)
      const formData: TableFormData = {
        organizationId: parseData[0]?.key as string || ""
      }
      setSelectedKeys(parseData[0] ? [parseData[0].key as string] : [])
      initTable(formData)
    }
  }

  // 初始化角色列表
  const initRoleList = async () => {
    const params = {}
    setLoading(true)
    const result = await progressApi.getUserTaskAuth(params)
    setLoading(false)
    if (result && result.success) {
      if (result.data.length > 0) {
        const parseData = parseTreeData(result.data, {
          key: 'roleId',
          title: 'chName'
        })
        setTreeData(parseData)
      }
    }
  }

  const isJsonString = (str: any) => {
    try {
      JSON.parse(str);
    } catch (e) {
      return false;
    }
    return true;
  }

  const handleData = (data: any) => {
    const language = localStorage.getItem('lowcode_lang') || window.navigator.language;
    return typeof (data) === "string" && isJsonString(data) ? (JSON.parse(data)[language] === undefined ? "" : JSON.parse(data)[language]) : data
  }

  const initTable = async (data: TableFormData, current?: number) => {
    const res = await schemaApi.tenantBlock();
    setTenantArr(res);
    const params = {
      "data": {
        ...data,
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
    const result = await userApi.getList(params)
    const handleresult = result.data.list.map((item: any) => {
      return {
        ...item,
        orgName: handleData(item.orgName)
      }
    })
    setLoading(false)
    if (result && result.success) {
      setList({
        pageIndex: current || 1,
        pageSize: 10,
        dataSource: handleresult,
        total: result.data.total,
      })
    }
  }

  const searchList = async () => { // 搜索
    const validate = await form.getFieldsValue()
    const params: TableFormData = {
      ...validate,
      organizationId: selectedKeys[0]
    }
    initTable(params)
  }

  const resetAction = () => { // 重置
    form.resetFields()
    const params: TableFormData = {
      organizationId: selectedKeys[0]
    }
    initTable(params)
  }

  // 切换分页
  const changePage = (page: TablePaginationConfig) => {
    setList({
      ...list,
      pageIndex: page.current || list.pageIndex,
      pageSize: page.pageSize || list.pageSize,
      total: page.total || list.total
    })
    const formParam: TableFormData = {
      ...form.getFieldsValue(),
      organizationId: selectedKeys[0]
    }
    initTable(formParam, page.current)
  }

  const onExpand = (expandedKeysValue: React.Key[]) => { // 展开树
    setExpandedKeys(expandedKeysValue);
  };

  const onSelect = (selectedKeysValue: React.Key[], info: any) => { // 树选中
    setSelectedKeys(selectedKeysValue as string[]);
    const formData: TableFormData = {
      organizationId: selectedKeysValue[0] as string
    }
    initTable(formData)
  };

  const showTitle = () => {
    if (actionType === 'add') {
      return intl.formatMessage({ id: "pages.app.user.modal.add" })
    }
    if (actionType === 'edit') {
      return intl.formatMessage({ id: "pages.app.user.modal.edit" })
    }
    return null
  }

  const addUser = () => {
    setActionType('add');
    setVisible(true);
    setActiveRow({});
    addForm.resetFields()
  }

  // 编辑
  const editItem = (record: UserListData) => {
    addForm.setFieldsValue({
      ...record
    })
    setActionType("edit")
    setActiveRow(record)
    setVisible(true)
  }

  // 增删改查之后的操作
  const commonAction = (result: CommonResponseType) => {
    if (result && result.success) {
      notification.success({
        message: intl.formatMessage({
          id: 'pages.btn.success',
        })
      })
      const formData: TableFormData = {
        organizationId: selectedKeys[0]
      }
      setActionType("add")
      setActiveRow({})
      initTable(formData)
    }
  }

  // 删除
  const deleteItem = async (record: UserListData) => {
    setActiveRow(record)
    setLoading(true)
    const result = await userApi.deleteUser(record.userId as string)
    setLoading(false)
    commonAction(result)
  }

  // 重置密码
  const resetPsd = async (record: UserListData) => {
    const params = {
      userId: record.userId as string
    }
    setLoading(true)
    const result = await userApi.resetPsd(params)
    setLoading(false)
    commonAction(result)
  }

  const tProps = {
    treeData: treeData,
    value: treeValue,
    treeCheckable: true,
    showCheckedStrategy: SHOW_PARENT,
    treeNodeFilterProp: "title",
    placeholder: intl.formatMessage({ id: 'pages.app.user.modal.roleIdList.placeholder' }),
    style: {
      width: '100%',
    },
  };

  const addAndEditSave = async () => { // 新增、编辑用户
    const validate = await addForm.validateFields()
    if (validate) {
      const params: AddAndEditUserType = {
        ...validate,
        organizationId: selectedKeys[0]
      }
      if (actionType === 'edit') {
        params.userId = activeRow.userId
      }
      setLoading(true)
      const result = await userApi.addAndEditUser(params)
      setLoading(false)
      setVisible(false)
      commonAction(result)
    }
  }

  const columns: ColumnsType<UserListData> = [
    {
      title: intl.formatMessage({ id: 'pages.app.log.table.userId' }),
      width: 100,
      dataIndex: 'userId',
    },
    {
      title: intl.formatMessage({ id: 'pages.app.role.table.fullName' }),
      width: 100,
      dataIndex: 'fullName',
    },
    {
      title: intl.formatMessage({ id: 'pages.app.user.table.orgName' }),
      width: 100,
      dataIndex: 'orgName',
    },
    {
      title: intl.formatMessage({ id: 'pages.app.user.table.mobilePhone' }),
      width: 100,
      dataIndex: 'mobilePhone',
    },
    {
      title: intl.formatMessage({ id: 'app.settings.basic.email' }),
      width: 100,
      dataIndex: 'email',
    },
    // {
    //   title: intl.formatMessage({ id: 'pages.app.user.table.employeeNo' }),
    //   width: 100,
    //   dataIndex: 'employeeNo',
    // },
    {
      title: intl.formatMessage({ id: 'pages.table.action', defaultMessage: '操作' }),
      width: 100,
      ellipsis: true,
      fixed: "right",
      dataIndex: 'action',
      render: (text, row) => {
        return (
          <div className='d-table-row'>
            <DTableButton iconType="edit" onClick={() => editItem(row)} />
            <DTableButton showComfirm iconType="reset" onClick={() => resetPsd(row)} />
            <DTableButton showComfirm iconType="delete" onClick={() => deleteItem(row)} />
          </div>
        )
      }
    }
  ];

  return (
    <PageContainer className='d-sys-user' loading={loading}>
      <div className='d-sys-user-menu'>
        <div className='menu'>
          <div className='header'>{intl.formatMessage({ id: 'menu.system.user' })}</div>
          <Tree
            onExpand={onExpand}
            className='tree'
            autoExpandParent
            expandedKeys={expandedKeys}
            onSelect={onSelect}
            selectedKeys={selectedKeys}
            treeData={departmentList}
          />
        </div>
        <div className='content'>
          <Card className='d-sys-form'>
            <Form
              form={form}
              layout="vertical"
              className='d-sys-form-item'
            >
              <Row style={{ display: 'flex', alignItems: 'center' }}>
                <Col span={21}>
                  <Row gutter={24}>
                    <Col span={5}>
                      <Form.Item name="email" label={intl.formatMessage({ id: 'app.settings.basic.email' })}>
                        <Input placeholder={intl.formatMessage({ id: 'app.settings.basic.email-message' })} />
                      </Form.Item>
                    </Col>
                    <Col span={5}>
                      <Form.Item name="fullName" label={intl.formatMessage({ id: 'pages.app.role.table.fullName' })}>
                        <Input placeholder={intl.formatMessage({ id: 'pages.app.role.member.form.fullName.placeholder' })} />
                      </Form.Item>
                    </Col>
                    {/* <Col span={5}>
                      <Form.Item name="employeeNo" label={intl.formatMessage({ id: 'pages.app.user.table.employeeNo' })}>
                        <Input placeholder={intl.formatMessage({ id: 'pages.app.user.table.employeeNo.placeholder' })} />
                      </Form.Item>
                    </Col> */}
                  </Row>
                </Col>
                <Col span={3}>
                  <div className='d-form-btn'>
                    <Tooltip title={intl.formatMessage({ id: 'pages.reset' })}>
                      <Button onClick={() => resetAction()} shape="circle" icon={<LcIcon type='icon-zhongzhi' />} className="btn" />
                    </Tooltip>
                    <Tooltip title={intl.formatMessage({ id: 'pages.search' })}>
                      <Button onClick={() => searchList()} shape="circle" type="primary" icon={<LcIcon type='icon-sousuo1' />}></Button>
                    </Tooltip>
                  </div>
                </Col>
              </Row>
            </Form>
          </Card>
          <Card className='d-sys-table'>
            <DButton onClick={() => addUser()} type='primary' style={{ marginRight: '10px' }}>{intl.formatMessage({ id: 'table.actions.add' })}</DButton>
            <DTable
              scroll={{ x: 1500 }}
              columns={columns}
              dataSource={list.dataSource}
              rowKey="logId"
              onChange={changePage}
              pagination={{
                total: Number(list.total),
                current: Number(list.pageIndex),
                pageSize: Number(list.pageSize),
              }}
            />
          </Card>
        </div>
      </div>
      <Modal
        // destroyOnClose
        title={showTitle()}
        visible={visible}
        onCancel={() => setVisible(false)}
        okText={intl.formatMessage({ id: 'pages.ok' })}
        cancelText={intl.formatMessage({ id: 'pages.cancel' })}
        onOk={() => addAndEditSave()}
      >
        <Form
          form={addForm}
          name="advanced_search"
          className="ant-advanced-search-form"
          // preserve={false}
          layout="vertical"
        >
          {/* <Form.Item
            name="employeeNo"
            label={intl.formatMessage({ id: 'pages.app.user.table.employeeNo' })}
            rules={[{ required: true, message: intl.formatMessage({ id: 'pages.app.user.table.employeeNo.placeholder' }) }]}
          >
            <Input placeholder={intl.formatMessage({ id: 'pages.app.user.table.employeeNo.placeholder' })} />
          </Form.Item> */}
          <Form.Item
            name="fullName"
            label={intl.formatMessage({ id: 'pages.app.role.table.fullName' })}
            rules={[{ required: true, message: intl.formatMessage({ id: 'pages.app.role.member.form.fullName.placeholder' }) }]}
          >
            <Input placeholder={intl.formatMessage({ id: 'pages.app.role.member.form.fullName.placeholder' })} />
          </Form.Item>
          <Form.Item
            name="email"
            label={intl.formatMessage({ id: 'app.settings.basic.email' })}
            rules={[
              { required: true, message: intl.formatMessage({ id: 'app.settings.basic.email-message' }) },
              { pattern: /^([a-zA-Z\d][\w-]{2,})@(\w{2,})\.([a-z]{2,})(\.[a-z]{2,})?$/, message: intl.formatMessage({ id: 'app.settings.basic.email-message-wrong' }) },
            ]}
          >
            <Input placeholder={intl.formatMessage({ id: 'app.settings.basic.email-message' })} />
          </Form.Item>
          <Form.Item
            name="tenantId"
            label={intl.formatMessage({ id: 'app.settings.basic.tenant' })}
            rules={[
              { required: true, message: intl.formatMessage({ id: 'app.settings.basic.tenant-message' }) },
            ]}
          >
            <Select placeholder={intl.formatMessage({ id: 'app.settings.basic.tenant-message' })}
            >
              {tenantArr.length > 0 && tenantArr.map((item: any) => <Option key={item.tenantCode} value={item.tenantCode}>{item.Transient_tenantName}</Option>)}
            </Select>
          </Form.Item>
          <Form.Item
            name="mobilePhone"
            label={intl.formatMessage({ id: 'pages.app.user.table.mobilePhone' })}
            rules={[
              { required: true, message: intl.formatMessage({ id: 'pages.app.user.table.mobilePhone.placeholder' }) },
              { pattern: /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/, message: intl.formatMessage({ id: 'pages.app.user.table.mobilePhone.wrong' }) },
            ]}
          >
            <Input placeholder={intl.formatMessage({ id: 'pages.app.user.table.mobilePhone.placeholder' })} />
          </Form.Item>
          <Form.Item
            name="roleIdList"
            label={intl.formatMessage({ id: 'pages.app.user.modal.roleIdList' })}
            rules={[{ required: true, message: intl.formatMessage({ id: 'pages.app.user.modal.roleIdList.placeholder' }) }]}
          >
            <TreeSelect {...tProps} />
          </Form.Item>
        </Form>
      </Modal>
    </PageContainer>
  )
}
export default User