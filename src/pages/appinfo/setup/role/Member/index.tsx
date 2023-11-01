import DTable from "@/components/DTable"
import progressApi from "@/services/custom/appInfo/progress"
import roleApi from "@/services/custom/appInfo/role"
import { indexOfObjectArray, parseTreeData } from "@/utils/utils"
import { CloseOutlined } from "@ant-design/icons"
import { Button, Drawer, Form, Input, message, Modal, notification, Popconfirm, TreeSelect } from "antd"
import { useForm } from "antd/es/form/Form"
import { ColumnsType } from "antd/lib/table"
import { useEffect, useState } from "react"
import { useIntl } from "umi"
import { MemberListType } from "../type"
import './index.less'

const { SHOW_PARENT } = TreeSelect;

type Props = {
  visible: boolean,
  authType: boolean,
  closeDrawer: (show: boolean, type?: string) => void,
  memberList: MemberListType[],
  roleId: string,
  isApp?: boolean
}

function Member(props: Props) {
  const intl = useIntl()
  const [userForm] = useForm()
  const [userVisible, setUserVisible] = useState(false)
  const [treeValue, setTreeValue] = useState<string[]>([]);
  const [list, setList] = useState<MemberListType[]>([]);

  const tProps = {
    treeData: props.memberList,
    value: treeValue,
    treeNodeFilterProp: "title",
    treeCheckable: true,
    showCheckedStrategy: SHOW_PARENT,
    placeholder: intl.formatMessage({ id: 'pages.app.role.member.form.fullName.placeholder' }),
    style: {
      width: '100%',
    },
  };

  const afterVisibleChange = (visible: boolean) => {
    if (visible) {
      if (props.authType) {
        progressApi.getMemberPage(props.roleId).then(res => {
          if (res && res.success) {
            setList(res.data.map?.((item: MemberListType) => {
              const member = props.memberList.find(member => member.userId === item.id)
              return {
                ...member
              }
            }))
          }
        })
      } else {
        const params = {
          roleIdList: [props.roleId]
        }
        progressApi.getUserTaskPersonByDepartment(params).then(res => {
          if (res && res.success) {
            const list2 = parseTreeData(res.data, {
              key: 'userId',
              title: 'fullName'
            })
            setList(list2 as MemberListType[])
          }
        })
      }
    }
  }

  const deleteItem = (row: MemberListType) => {
    setList((list) => {
      return list.filter(x => x.userId !== row.userId)
    })
  }

  const openAddUser = () => {
    setTreeValue([])
    setUserVisible(true)
  }

  // 保存添加用户
  const saveAction = async () => {
    const result: { fullName: string[] } = await userForm.validateFields()
    if (result) {
      const arr: string[] = []
      const info: MemberListType[] = []
      result.fullName.forEach(item => {
        if (!indexOfObjectArray(list, item, 'key')) {
          arr.push(item)
        }
      })
      if (arr.length > 0) {
        props.memberList.forEach(item => {
          arr.forEach(it => {
            if (item.key === it) {
              info.push(item)
            }
          })
        })
      }
      if (info.length > 0) {
        const newList = JSON.parse(JSON.stringify(list))
        info.forEach(item => {
          newList.push(item)
        })
        setList(newList)
      }
      setUserVisible(false)
    }
  }

  // 保存抽屉
  const saveMember = async () => {
    const userIds: string[] = []
    if (list.length === 0) {
      message.error(intl.formatMessage({ id: 'pages.app.role.member.drawer.placeholder' }))
      return
    }
    list.forEach(item => {
      userIds.push(item.userId)
    })
    const params = {
      roleId: props.roleId,
      userIds: userIds.join(",")
    }
    const result = await roleApi.saveRoleMember(params)
    if (result && result.success) {
      notification.success({
        message: intl.formatMessage({ id: 'pages.btn.success' })
      })
      props.closeDrawer(false, 'save')
    }
  }

  const columns: ColumnsType<MemberListType> = [
    {
      title: intl.formatMessage({ id: 'pages.app.role.table.fullName' }),
      align: 'center',
      dataIndex: 'fullName',
    },
    {
      title: intl.formatMessage({ id: 'pages.app.role.table.email' }),
      align: 'center',
      dataIndex: 'email',
    },
    {
      title: intl.formatMessage({ id: 'pages.table.action' }),
      align: 'center',
      dataIndex: 'action',
      render: (text, row) => {
        return (
          <div>
            <Popconfirm title={intl.formatMessage({ id: 'pages.delete.placeholder' })} onConfirm={() => deleteItem(row)}>
              <Button type='link'>{intl.formatMessage({ id: 'pages.delete' })}</Button>
            </Popconfirm>
          </div>
        )
      }
    }
  ];

  return (
    <>
      <Drawer
        afterVisibleChange={afterVisibleChange}
        destroyOnClose
        className="d-role-draw"
        width="40vw"
        title={intl.formatMessage({ id: 'table.actions.memberManagement' })}
        extra={<CloseOutlined onClick={() => props.closeDrawer(false)} />}
        closable={false}
        placement="right"
        onClose={() => props.closeDrawer(false)}
        visible={props.visible}
        footer={
          <div className="d-role-btn">
            <Button onClick={() => props.closeDrawer(false)} style={{ "marginRight": "10px" }}>{intl.formatMessage({ id: 'pages.cancel', defaultMessage: '取消' })}</Button>
            <Button type="primary" onClick={() => saveMember()}>{intl.formatMessage({ id: 'pages.ok', defaultMessage: '确定' })}</Button>
          </div>
        }
      >
        <Button onClick={() => openAddUser()}>{intl.formatMessage({ id: "pages.app.role.drawer.btn.add" })}</Button>
        <DTable
          columns={columns}
          dataSource={list}
          rowKey="roleId"
        />
      </Drawer>
      <Modal
        destroyOnClose
        title={intl.formatMessage({ id: 'pages.app.role.drawer.btn.add' })}
        visible={userVisible}
        onCancel={() => setUserVisible(false)}
        okText={intl.formatMessage({ id: 'pages.ok' })}
        cancelText={intl.formatMessage({ id: 'pages.cancel' })}
        onOk={() => saveAction()}
      >
        <Form
          form={userForm}
          name="advanced_search"
          preserve={false}
          layout="vertical"
        >
          <Form.Item
            name="fullName"
            label={intl.formatMessage({ id: 'pages.app.role.table.fullName' })}
            rules={[{ required: true, message: intl.formatMessage({ id: 'pages.app.role.member.form.fullName.placeholder' }) }]}
          >
            <TreeSelect {...tProps} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}

export default Member
