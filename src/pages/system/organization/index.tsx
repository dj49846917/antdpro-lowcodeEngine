// import DButton from '@/components/DButton'
// import DTable from '@/components/DTable'
// import DTableButton from '@/components/DTableButton'
// import I18nInputComp from '@/components/I18nInputComp'
// import LcIcon from '@/components/LcIcon'
// import { Constant } from '@/constant'
// import progressApi from '@/services/custom/appInfo/progress'
// import roleApi from '@/services/custom/appInfo/role'
// import orgApi from '@/services/custom/system/organization'
// import { DicType, ListType } from '@/types/common'
// import { ConstantValueToContentKey, parseTreeData, transLang } from '@/utils/utils'
// import { PageContainer } from '@ant-design/pro-layout'
// import { Button, Card, Col, Form, Input, Modal, notification, Row, Select, TablePaginationConfig, Tooltip, TreeDataNode, TreeSelect } from 'antd'
// import { useForm } from 'antd/lib/form/Form'
// import { ColumnsType } from 'antd/lib/table'
// import { useEffect, useState } from 'react'
// import { useIntl } from 'umi'
// import './index.less'
// import { OrgList, TenantList, UserListType } from './type'

// const { Option } = Select;
// const { TextArea } = Input;

// function Organization() {
//   const [loading, setLoading] = useState(false)
//   const [dicList, setDicList] = useState<DicType[]>([])
//   const [actionType, setActionType] = useState<"add" | "edit">("add")
//   const [activeRow, setActiveRow] = useState<OrgList>({})
//   const [tenantUserList, setTenantUserList] = useState<TenantList[]>([])
//   const [userList, setUserList] = useState<UserListType[]>([])
//   const [visible, setVisible] = useState(false)
//   const [orgList, setOrgList] = useState<TreeDataNode[]>([])
//   const [list, setList] = useState<ListType<OrgList>>({
//     dataSource: [],
//     pageIndex: 1,
//     pageSize: 10,
//     total: 0
//   })
//   const intl = useIntl()
//   const [form] = useForm()
//   const [addForm] = useForm()

//   useEffect(() => {
//     const params: OrgList = {}
//     init(params)
//     initTenantList()
//     initUserList()
//     initOrgList()
//     getDicArr()
//   }, [])

//   // 获取列表
//   const init = async (formParam: OrgList, current?: number) => {
//     setLoading(true)
//     const params = {
//       "data": {
//         ...formParam,
//       },
//       operator: localStorage.getItem(Constant.USER_INFO_STORAGE),
//       "page": current || 1,
//       "size": list.pageSize,
//       "source": "PC",
//       "traceId": "",
//       "version": "1",
//       "lang": transLang()
//     }
//     setLoading(true)
//     const res = await orgApi.getList(params)
//     setLoading(false)
//     if (res && res.data) {
//       setList({
//         ...list,
//         pageIndex: current || 1,
//         dataSource: res.data.list,
//         total: res.data.total
//       })
//     }
//   }

//   // 获取租户列表
//   const initTenantList = async () => {
//     const result = await orgApi.getTenantList()
//     if (result && result.success) {
//       setTenantUserList(result.data)
//     }
//   }

//   // 获取用户列表
//   const initUserList = async () => {
//     const result = await roleApi.userList({})
//     if (result && result.success) {
//       setUserList(result.data)
//     }
//   }

//   // 获取组织列表
//   const initOrgList = async () => {
//     const result = await progressApi.getUserTaskDepartment()
//     if (result && result.success) {
//       const parseData = parseTreeData(result.data, {
//         key: 'businessId',
//         title: 'organizationName'
//       })
//       setOrgList(parseData)
//     }
//   }

//   const getDicArr = async () => { // 查询数据字典
//     const params = {
//       parentId: ["organizationType"]
//     }
//     const result = await progressApi.getDicList(params)
//     if (result && result.success) {
//       setDicList(result.data)
//     }
//   }

//   // 切换分页
//   const changePage = (page: TablePaginationConfig) => {
//     setList({
//       ...list,
//       pageIndex: page.current || list.pageIndex,
//       pageSize: page.pageSize || list.pageSize,
//       total: page.total || list.total
//     })
//     const formParam: OrgList = {
//       ...form.getFieldsValue()
//     }
//     init(formParam, page.current)
//   }

//   const searchList = async () => {
//     const validate = await form.getFieldsValue()
//     const params = {
//       ...validate
//     }
//     init(params, 1)
//   }

//   const resetAction = async () => {
//     init({}, 1)
//     form.resetFields()
//   }

//   // 新增
//   const addList = async () => {
//     setActionType('add');
//     setVisible(true);
//     setActiveRow({});
//     addForm.resetFields()
//   }

//   // 编辑
//   const editItem = async (record: OrgList) => {
//     const result = await orgApi.getDetail(record.businessId as string)
//     if (result && result.success) {
//       addForm.setFieldsValue({
//         ...result.data,
//         name: result.data.name
//       })
//       setActiveRow(result.data)
//     }
//     setActionType("edit")
//     setVisible(true)
//   }

//   // 删除
//   const deleteItem = async (record: OrgList) => {
//     setLoading(true)
//     const result = await orgApi.deleteOrgItem(record.businessId as string)
//     setLoading(false)
//     if (result && result.success) {
//       if (result && result.success) {
//         notification.success({
//           message: intl.formatMessage({
//             id: 'pages.btn.success',
//           })
//         })
//         const params: OrgList = {}
//         setVisible(false)
//         init(params)
//       }
//     }
//   }

//   // 新增、编辑保存
//   const addAndEditSave = async () => {
//     const validate = await addForm.validateFields()
//     if (validate) {
//       const params = {
//         ...validate,
//       }
//       if (actionType === 'edit') {
//         params.organizationId = activeRow.organizationId
//       }
//       setLoading(true)
//       const result = await orgApi.addAndEditList(params)
//       setLoading(false)
//       if (result && result.success) {
//         notification.success({
//           message: intl.formatMessage({
//             id: 'pages.btn.success',
//           })
//         })
//         const params: OrgList = {}
//         setVisible(false)
//         init(params)
//       }
//     }
//   }

//   const showTitle = () => {
//     if (actionType === 'add') {
//       return intl.formatMessage({ id: "table.actions.create" })
//     }
//     if (actionType === 'edit') {
//       return intl.formatMessage({ id: "table.actions.edit" })
//     }
//     return null
//   }

//   const columns: ColumnsType<OrgList> = [
//     {
//       title: intl.formatMessage({ id: 'pages.app.org.table.organizationCode' }),
//       width: 100,
//       ellipsis: true,
//       dataIndex: 'organizationCode',
//     },
//     {
//       title: intl.formatMessage({ id: 'pages.app.org.table.name' }),
//       width: 100,
//       ellipsis: true,
//       dataIndex: 'organizationName',
//     },
//     {
//       title: intl.formatMessage({ id: 'pages.app.org.table.organizationTypeEnumVal' }),
//       width: 40,
//       ellipsis: true,
//       dataIndex: 'organizationTypeEnumVal',
//       render: (text) => {
//         return ConstantValueToContentKey(dicList, text)
//       }
//     },
//     {
//       title: intl.formatMessage({ id: 'pages.app.org.table.leaderName' }),
//       width: 40,
//       ellipsis: true,
//       dataIndex: 'leader',
//     },
//     {
//       title: intl.formatMessage({ id: 'pages.app.org.table.tenantName' }),
//       width: 100,
//       ellipsis: true,
//       dataIndex: 'tenantName',
//     },
//     {
//       title: intl.formatMessage({ id: 'pages.table.action', defaultMessage: '操作' }),
//       ellipsis: true,
//       width: 40,
//       // fixed: 'right',
//       dataIndex: 'action',
//       render: (text, row) => {
//         return (
//           <div className='d-table-row'>
//             <DTableButton iconType="edit" onClick={() => editItem(row)} />
//             <DTableButton showComfirm iconType="delete" onClick={() => deleteItem(row)} />
//           </div>
//         )
//       }
//     }
//   ];

//   return (
//     <div className='d-sys-log'>
//       <PageContainer header={{ breadcrumb: {}, className: 'd-sys-header' }} title={intl.formatMessage({ id: 'menu.system.organization' })} className="d-container" loading={loading}>
//         <Card className='d-sys-form'>
//           <Form
//             form={form}
//             layout="vertical"
//             className='d-sys-form-item'
//           >
//             <Row style={{ display: 'flex', alignItems: 'center' }}>
//               <Col span={21}>
//                 <Row gutter={24}>
//                   <Col span={5}>
//                     <Form.Item name="organizationTypeEnumVal" label={intl.formatMessage({ id: 'pages.app.org.table.organizationTypeEnumVal' })}>
//                       <Select placeholder={intl.formatMessage({ id: 'pages.app.org.table.organizationTypeEnumVal.placeholder' })}>
//                         {dicList.length > 0 && dicList.map(item => (
//                           <Option key={item.constantValue} value={item.constantValue}>{item.constantKey}</Option>
//                         ))}
//                       </Select>
//                     </Form.Item>
//                   </Col>
//                   <Col span={5}>
//                     <Form.Item name="name" label={intl.formatMessage({ id: 'pages.app.org.table.name' })}>
//                       <Input placeholder={intl.formatMessage({ id: 'pages.app.org.table.name.placeholder' })} />
//                     </Form.Item>
//                   </Col>
//                 </Row>
//               </Col>
//               <Col span={3}>
//                 <div className='d-form-btn'>
//                   <Tooltip title={intl.formatMessage({ id: 'pages.reset' })}>
//                     <Button onClick={() => resetAction()} shape="circle" icon={<LcIcon type='icon-zhongzhi' />} className="btn" />
//                   </Tooltip>
//                   <Tooltip title={intl.formatMessage({ id: 'pages.search' })}>
//                     <Button onClick={() => searchList()} shape="circle" type="primary" icon={<LcIcon type='icon-sousuo1' />}></Button>
//                   </Tooltip>
//                 </div>
//               </Col>
//             </Row>
//           </Form>
//         </Card>
//         <Card className='d-sys-table'>
//           <DButton onClick={() => addList()} type='primary' style={{ marginRight: '10px' }}>{intl.formatMessage({ id: 'table.actions.add' })}</DButton>
//           <DTable
//             scroll={{ x: 1000 }}
//             columns={columns}
//             dataSource={list.dataSource}
//             rowKey="businessId"
//             onChange={changePage}
//             pagination={{
//               total: Number(list.total),
//               current: Number(list.pageIndex),
//               pageSize: Number(list.pageSize),
//             }}
//           />
//         </Card>
//         <Modal
//           width="50vw"
//           // destroyOnClose
//           title={showTitle()}
//           visible={visible}
//           onCancel={() => setVisible(false)}
//           okText={intl.formatMessage({ id: 'pages.ok' })}
//           cancelText={intl.formatMessage({ id: 'pages.cancel' })}
//           onOk={() => addAndEditSave()}
//         >
//           <Form
//             form={addForm}
//             name="advanced_search"
//             className="ant-advanced-search-form"
//             // preserve={false}
//             layout="vertical"
//           >
//             <Row gutter={24}>
//               <Col span={12}>
//                 <Form.Item
//                   name="organizationCode"
//                   label={intl.formatMessage({ id: 'pages.app.org.table.organizationCode' })}
//                   rules={[{ required: true, message: intl.formatMessage({ id: 'pages.app.org.table.organizationCode.placeholder' }) }]}
//                 >
//                   <Input placeholder={intl.formatMessage({ id: 'pages.app.org.table.organizationCode.placeholder' })} />
//                 </Form.Item>
//               </Col>
//               <Col span={12}>
//                 <I18nInputComp
//                   name="name"
//                   form={addForm}
//                   label={intl.formatMessage({ id: 'pages.app.org.table.name' })}
//                   placeholder={intl.formatMessage({ id: 'pages.app.org.table.name.placeholder' })}
//                   rules={[{ required: true, message: intl.formatMessage({ id: 'pages.app.org.table.name.placeholder' }) }]}
//                 />
//                 {/* <Form.Item
//                   name="name"
//                   label={intl.formatMessage({ id: 'pages.app.org.table.name' })}
//                   rules={[{ required: true, message: intl.formatMessage({ id: 'pages.app.org.table.name.placeholder' }) }]}
//                 >
//                   <Input placeholder={intl.formatMessage({ id: 'pages.app.org.table.name.placeholder' })} />
//                 </Form.Item> */}
//               </Col>
//               <Col span={12}>
//                 <Form.Item
//                   name="organizationTypeEnumVal"
//                   label={intl.formatMessage({ id: 'pages.app.org.table.organizationTypeEnumVal' })}
//                   rules={[{ required: true, message: intl.formatMessage({ id: 'pages.app.org.table.organizationTypeEnumVal.placeholder' }) }]}
//                 >
//                   <Select allowClear placeholder={intl.formatMessage({ id: 'pages.app.org.table.organizationTypeEnumVal.placeholder' })}>
//                     {dicList.length > 0 && dicList.map(item => (
//                       <Option key={item.constantValue} value={item.constantValue}>{item.constantKey}</Option>
//                     ))}
//                   </Select>
//                 </Form.Item>
//               </Col>
//               <Col span={12}>
//                 <Form.Item
//                   name="leader"
//                   label={intl.formatMessage({ id: 'pages.app.org.table.leaderName' })}
//                 >
//                   <Select
//                     allowClear
//                     optionFilterProp="label"
//                     showSearch
//                     placeholder={intl.formatMessage({ id: 'pages.app.org.table.leaderName.placeholder' })}
//                   >
//                     {userList.length > 0 && userList.map(item => (
//                       <Option key={item.userId} value={item.userId} label={item.fullName}>{item.fullName}</Option>
//                     ))}
//                   </Select>
//                 </Form.Item>
//               </Col>
//               <Col span={12}>
//                 <Form.Item
//                   name="parentOrganizationId"
//                   label={intl.formatMessage({ id: 'pages.app.org.table.parentOrganizationName' })}
//                 >
//                   <TreeSelect
//                     allowClear
//                     showSearch
//                     treeNodeFilterProp="title"
//                     treeData={orgList}
//                     placeholder={intl.formatMessage({ id: 'pages.app.org.table.parentOrganizationName.placeholder' })}
//                     style={{ width: '100%' }}
//                   />
//                 </Form.Item>
//               </Col>
//               <Col span={12}>
//                 <Form.Item
//                   name="tenantId"
//                   label={intl.formatMessage({ id: 'pages.app.org.table.tenantName' })}
//                   rules={[
//                     { required: true, message: intl.formatMessage({ id: 'pages.app.org.table.tenantName.placeholder' }) },
//                   ]}
//                 >
//                   <Select
//                     allowClear
//                     optionFilterProp="label"
//                     showSearch
//                     placeholder={intl.formatMessage({ id: 'pages.app.org.table.tenantName.placeholder' })}
//                   >
//                     {tenantUserList.length > 0 && tenantUserList.map(item => (
//                       <Option key={item.tenantCode} value={item.tenantCode} label={item.tenantName}>{item.tenantName}</Option>
//                     ))}
//                   </Select>
//                 </Form.Item>
//               </Col>
//               <Col span={12}>
//                 <I18nInputComp
//                   name="description"
//                   form={addForm}
//                   label={intl.formatMessage({ id: 'pages.app.org.table.description' })}
//                   placeholder={intl.formatMessage({ id: 'pages.app.org.table.description.placeholder' })}
//                   rows={4}
//                   isTextArea
//                 />
//                 {/* <Form.Item
//                   name="description"
//                   label={intl.formatMessage({ id: 'pages.app.org.table.description' })}
//                 >
//                   <TextArea rows={4} placeholder={intl.formatMessage({ id: 'pages.app.org.table.description.placeholder' })} />
//                 </Form.Item> */}
//               </Col>
//             </Row>
//           </Form>
//         </Modal>
//       </PageContainer>
//     </div>
//   )
// }

// export default Organization

import Preview from "@/components/Preview";
import React from "react";

function Organization() {
  return (
    <Preview pageId="070293675424870400" />
  )
}

export default React.memo(Organization)