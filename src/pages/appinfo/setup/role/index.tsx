import DButton from "@/components/DButton"
import DTable from "@/components/DTable"
import { Constant } from "@/constant"
import roleApi from "@/services/custom/appInfo/role"
import { ApiConfig, ListType } from "@/types/common"
import { getAppId, parseTreeData, transLang } from "@/utils/utils"
import { PageContainer } from "@ant-design/pro-layout"
import { Button, Card, Dropdown, Form, Input, Modal, notification, Popconfirm, Popover, TablePaginationConfig, Tree } from "antd"
import { useForm } from "antd/lib/form/Form"
import { ColumnsType, TableRowSelection } from "antd/lib/table/interface"
import { useEffect, useState } from "react"
import { useIntl } from "umi"
import { ListParamsType } from "../../page/type"
import './index.less'
import Member from "./Member"
import { AddAndEditParamsType, AuthTreeParamsType, MemberListType, RoleListParamsType, RoleListType } from "./type"
import { apiRequest } from "@/services/custom/appInfo/apiService";
import { DownOutlined } from "@ant-design/icons"
import { DataNode } from "antd/lib/tree"

const { TextArea } = Input;

type Props = {
  isApp?: boolean
}

export const isJsonString = (str: any) => {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
}

function Role(props: Props) {
  const [visible, setVisible] = useState(false)
  const [treeData, setTreeData] = useState([])
  const [resourceType, setResourceType] = useState("")
  const [roleId, setRoleId] = useState("")
  const [loading, setLoading] = useState(false)
  const [mvisible, setMvisible] = useState(false)
  const [actionType, setActionType] = useState<"add" | "edit" | "watch">("add")
  const [activeRow, setActiveRow] = useState<RoleListType>()
  const [memberList, setMemberList] = useState<MemberListType[]>([])
  const [authType, setAuthType] = useState<boolean>(false)
  const [list, setList] = useState<ListType<RoleListType>>({
    dataSource: [],
    pageIndex: 1,
    pageSize: 10,
    total: 0
  })
  const [addForm] = useForm()
  const intl = useIntl()
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [checkedKeys, setCheckedKeys] = useState<React.Key[]>([]);

  const onCheck = (checkedKeysValue: React.Key[]) => {
    setCheckedKeys(checkedKeysValue);
  };

  const showModal = async (type: any, id: any) => {
    setRoleId(id);
    const language = localStorage.getItem('lowcode_lang') || window.navigator.language;
    setResourceType(type);
    let params: ListParamsType<AuthTreeParamsType> = {
      "data": {
        resourceType: type,
        roleId: id
      },
      operator: localStorage.getItem(Constant.USER_INFO_STORAGE),
      appId: getAppId(),
      "page": 0,
      "size": 10,
      "source": "PC",
      "traceId": "",
      "version": "1",
      "lang": transLang()
    }
    const result = await roleApi.getAuthTree(params);
    setIsModalOpen(true);
    const authTreeData = result.data.tree;
    for (let i = 0; i < authTreeData.length; i++) {
      authTreeData[i].title = isJsonString(authTreeData[i].title) ? JSON.parse(authTreeData[i].title)[language] : authTreeData[i].title;
      if (authTreeData[i].children?.length > 0) {
        for (let j = 0; j < authTreeData[i].children.length; j++) {
          authTreeData[i].children[j].title = isJsonString(authTreeData[i].children[j].title) ? JSON.parse(authTreeData[i].children[j].title)[language] : authTreeData[i].children[j].title;
        }
      }
    }
    setCheckedKeys(result.data.checkedKeys)
    setTreeData(result.data.tree)
  };

  const handleOk = async () => {
    const params: ListParamsType<AuthTreeParamsType> = {
      "data": {
        resourceIdList: checkedKeys,
        resourceType: resourceType,
        roleId: roleId
      },
      operator: localStorage.getItem(Constant.USER_INFO_STORAGE),
      appId: getAppId(),
      "page": 0,
      "size": 10,
      "source": "PC",
      "traceId": "",
      "version": "1",
      "lang": transLang()
    }
    const result = await roleApi.saveAuthTree(params);
    if (result.success) {
      notification.success({
        message: intl.formatMessage({ id: 'pages.btn.success' })
      })
    }
    // console.log("saveresult", result)
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const showTitle = () => {
    if (actionType === 'add') {
      return intl.formatMessage({ id: "pages.app.role.table.addRole" })
    } else if (actionType === 'edit') {
      return intl.formatMessage({ id: "pages.app.role.table.editRole" })
    } else {
      return intl.formatMessage({ id: 'pages.app.role.table.watchRole' })
    }
  }

  // 初始化
  useEffect(() => {
    // 获取数据
    init(1)
  }, [])

  // 获取列表
  const init = async (current?: number) => {
    let params: ListParamsType<RoleListParamsType> = {
      "data": {
        appId: getAppId()
      },
      operator: localStorage.getItem(Constant.USER_INFO_STORAGE),
      appId: getAppId(),
      "page": current || 1,
      "size": list.pageSize,
      "source": "PC",
      "traceId": "",
      "version": "1",
      "lang": transLang()
    }
    // 判断是否为应用外的角色管理
    if (props.isApp) {
      delete params.appId
      delete params.data.appId
      params.data.roleType = 0
    }
    setLoading(true)
    const result = await roleApi.getRoleList(params)
    setLoading(false)
    if (result && result.success) {
      setList({
        ...list,
        dataSource: result.data.list,
        total: result.data.total
      })
    }
  }

  // 查询成员列表
  const initMemberList = async (userApi?: ApiConfig) => {
    setLoading(true)
    if (userApi) {
      const result = await apiRequest(userApi)
        .then(res => res?.map?.((item: any) => ({
          ...item,
          key: item['userId'],
          value: item['userId'],
          title: item['fullName']
        })))
      setLoading(false)
      setMemberList(result as any)
      setAuthType(true)
      return
    }
    const result = await roleApi.userList({})
    setLoading(false)
    if (result && result.success) {
      if (result.data.length > 0) {
        const list = parseTreeData(result.data, {
          key: 'userId',
          title: 'fullName'
        })
        setMemberList(list as MemberListType[])
      }
    }
  }

  useEffect(() => {
    roleApi.getApiConfig().then(res => {
      if (res.success && res.data?.authType === 1) {
        initMemberList(res.data.userListApi)
      }
      initMemberList()
    })
  }, [])
  // 列表选中
  const rowSelection: TableRowSelection<RoleListType> = {
    onChange: (selectedRowKeys, selectedRows) => {
    }
  };

  // 切换分页
  const changePage = (page: TablePaginationConfig) => {
    setList({
      ...list,
      pageIndex: page.current || list.pageIndex,
      pageSize: page.pageSize || list.pageSize,
      total: page.total || list.total
    })
    init(page.current)
  }

  const action = (type: "watch" | "edit" | "add", row?: RoleListType) => {
    setActionType(type)
    setVisible(true)
    if (type !== 'add') {
      setActiveRow(row)
      addForm.setFieldsValue({
        ...row
      })
    } else {
      setActiveRow({
        chName: "",
        chDescription: "",
        roleId: "",
        enName: ""
      })
      addForm.resetFields()
    }
  }

  const showMember = (row: RoleListType) => {
    setActiveRow(row)
    setMvisible(true)
  }

  const deleteList = async (row: RoleListType) => {
    setLoading(true)
    const result = await roleApi.deleteRole(row.roleId, props.isApp)
    setLoading(false)
    if (result && result.success) {
      notification.success({
        message: intl.formatMessage({ id: 'pages.btn.success' })
      })
      init(1)
    }
  }

  const saveAction = async () => {
    let params: AddAndEditParamsType;
    const validate = await addForm.validateFields();
    if (validate) {
      setVisible(false)
      params = {
        ...validate,
        appId: getAppId(),
        roleType: 1
      }
      if (actionType === 'edit') {
        params = {
          ...params,
          roleId: activeRow?.roleId,
          roleType: 1
        }
      }
      // 如果是应用外面的角色管理
      if (props.isApp) {
        delete params.appId
        params.roleType = 0
      }
      setLoading(true)
      const res = await roleApi.addAndEditRole(params, props.isApp)
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

  const MenuActions = ({ id }) => {
    return (
      <>
        <div className="mbtn">
          <p onClick={() => showModal("1", id)}>{intl.formatMessage({ id: 'table.actions.platform.menu' })}</p>
          <p onClick={() => showModal("2", id)}>{intl.formatMessage({ id: 'table.actions.pc.menu' })}</p>
          {/* <p onClick={() => showModal("3", id)}>{intl.formatMessage({ id: 'table.actions.app.menu' })}</p> */}
        </div>

      </>
    )
  };

  const columns: ColumnsType<RoleListType> = [
    {
      title: intl.formatMessage({ id: 'pages.app.role.table.roleName' }),
      align: 'center',
      dataIndex: 'chName',
    },
    {
      title: intl.formatMessage({ id: 'pages.app.role.table.roleDesc' }),
      align: 'center',
      dataIndex: 'chDescription',
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
              onClick={() => showMember(row)}
            >{intl.formatMessage({ id: 'table.actions.memberManagement' })}</Button>
            <Popconfirm
              title={intl.formatMessage({ id: 'pages.delete.placeholder' })}
              onConfirm={() => deleteList(row)}
            >
              <Button type='link'>{intl.formatMessage({ id: 'pages.delete' })}</Button>
            </Popconfirm>
            <Dropdown overlay={<MenuActions
              id={row.roleId}
            />}>
              <a>
                {intl.formatMessage({ id: 'table.actions.more' })} <DownOutlined />
              </a>
            </Dropdown>
          </div>
        )
      }
    }
  ];

  return (
    <div className="d-box">
      <PageContainer
        header={{ breadcrumb: {}, className: 'd-sys-header' }}
        title={intl.formatMessage({ id: 'menu.system.auth' })}
        className="d-container"
        loading={loading}
      >
        <Card>
          <DButton
            type='primary'
            onClick={() => {
              setVisible(true);
              setActionType("add");
              addForm.resetFields();
              setActiveRow({})
            }}
          >{intl.formatMessage({ id: "pages.app.role.table.addRole" })}</DButton>
          <DTable
            rowSelection={{ ...rowSelection }}
            columns={columns}
            dataSource={list.dataSource}
            rowKey="roleId"
            onChange={changePage}
            pagination={{
              total: Number(list.total),
              current: Number(list.pageIndex),
              pageSize: Number(list.pageSize),
            }}
          />
        </Card>
      </PageContainer>
      <Modal
        title={showTitle()}
        visible={visible}
        onCancel={() => setVisible(false)}
        footer={
          actionType === 'watch' ? null : (
            <div>
              <Button onClick={() => setVisible(false)}>{intl.formatMessage({ id: 'pages.cancel' })}</Button>
              <Button
                type='primary'
                onClick={() => saveAction()}
              >{intl.formatMessage({ id: 'pages.ok' })}</Button>
            </div>
          )
        }
      >
        <Form
          form={addForm}
          name="advanced_search"
          className="ant-advanced-search-form"
          preserve={false}
          layout="vertical"
        // labelCol={{ span: 6 }}
        // wrapperCol={{ span: 16 }}
        >
          <Form.Item
            name="chName"
            label={intl.formatMessage({ id: 'pages.app.role.table.roleName' })}
            rules={[{ required: true, message: intl.formatMessage({ id: 'pages.app.role.table.chName.placeholder' }) }]}
          >
            <Input
              disabled={actionType === 'watch'}
              autoComplete='off'
              placeholder={intl.formatMessage({ id: 'pages.app.role.table.chName.placeholder' })}
            />
          </Form.Item>
          <Form.Item
            name="chDescription"
            label={intl.formatMessage({ id: 'pages.app.role.table.roleDesc' })}
          >
            <TextArea
              disabled={actionType === 'watch'}
              rows={4}
              placeholder={intl.formatMessage({ id: 'pages.app.role.table.chDescription.placeholder' })}
            />
          </Form.Item>
        </Form>
      </Modal>
      <Modal title={intl.formatMessage({ id: 'table.actions.platform.menu' })} open={isModalOpen} onOk={() => { handleOk() }} onCancel={handleCancel}>
        <Tree
          checkable
          onCheck={onCheck}
          checkedKeys={checkedKeys}
          treeData={treeData}
        />
      </Modal>
      <Member
        visible={mvisible}
        isApp={props.isApp}
        closeDrawer={(show: boolean, type?: string) => {
          if (type) {
            init(1)
          }
          setMvisible(show)
        }}
        authType={authType}
        memberList={memberList}
        roleId={activeRow?.roleId as string}
      />
    </div>
  )
}

export default Role