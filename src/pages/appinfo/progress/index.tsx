import { Form, Row, Col, Input, Button, Select, Card, notification, Spin, Modal, Checkbox } from 'antd';
import { useEffect, useState } from 'react';
import type { ColumnsType, TablePaginationConfig } from 'antd/lib/table';
import '@/pages/appinfo/progress/index.less';
import progressApi, { deleteProgressItem, getList, publishProgressItem } from '@/services/custom/appInfo/progress';
import { Constant } from '@/constant';
import { TableRowSelection } from 'antd/lib/table/interface';
import { DicType, ListType, ProgressDataType, TenantInfo } from '@/types/common';
import { FormattedMessage, useHistory, useIntl } from 'umi';
import { ConstantValueToContentKey, getAppId, transLang } from '@/utils/utils';
import DTableButton from '@/components/DTableButton';
import DTable from '@/components/DTable';
import { CopyProcessParamsType } from '@/pages/progress/type';


const { Option } = Select;

type ProgressListProps = {}

function Progress(props: ProgressListProps) {
  const [list, setList] = useState<ListType<ProgressDataType>>({
    dataSource: [],
    pageIndex: 1,
    pageSize: 10,
    total: 0
  })
  const intl = useIntl();
  const [loading, setLoading] = useState(false) // 加载状态
  const [formList, setFormList] = useState<ProgressDataType>({})
  const [form] = Form.useForm();
  const [addForm] = Form.useForm();
  const history = useHistory();
  const [activeRow, setActiveRow] = useState<ProgressDataType>({})
  const [dicList, setDicList] = useState<DicType[]>([])
  const operator = localStorage.getItem(Constant.USER_INFO_STORAGE)
  const [addVisible, setAddVisible] = useState(false)
  const [isCopy, setIsCopy] = useState(false)
  const [tenantUserInfo, setTenantUserInfo] = useState<TenantInfo[]>([])
  const [isMutli, setIsMuti] = useState('否')

  // 点击搜索
  const onFinish = (values: any) => {
    setFormList({
      ...values
    })
    const formParam: ProgressDataType = values
    init(formParam)
  };
  // 初始化
  useEffect(() => {
    // 获取数据
    const formParam: ProgressDataType = {}
    init(formParam)
    getTenantUser()
    getDic()
  }, [])

  const getDic = async () => {
    const params = {
      parentId: ["flowStatus"]
    }
    const result = await progressApi.getDicList(params)
    if (result && result.success) {
      setDicList(result.data)
    }
  }

  // 查询租户
  const getTenantUser = async () => {
    const result = await progressApi.getTenantUserInfo()
    if (result && result.success) {
      const list = result.data.map((item: TenantInfo) => {
        return {
          label: item.tenantName,
          value: item.businessId
        }
      })
      setTenantUserInfo(list)
    }
  }

  // 获取列表
  const init = async (formParam: ProgressDataType, page?: TablePaginationConfig) => {
    const appId = getAppId()
    const params = {
      "data": {
        ...formParam,
        appId
      },
      operator,
      "page": page ? page.current : list.pageIndex,
      "size": page ? page.pageSize : list.pageSize,
      "source": "PC",
      "traceId": "",
      "version": "1",
      "lang": transLang()
    }
    setLoading(true)
    const res = await getList(params)
    setLoading(false)
    if (res && res.data) {
      setList({
        pageIndex: page ? page.current as number : list.pageIndex,
        pageSize: page ? page.pageSize as number : list.pageSize,
        dataSource: res.data.list,
        total: res.data.total
      })
    }
  }

  // 列表选中
  const rowSelection: TableRowSelection<ProgressDataType> = {
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
    const formParam: ProgressDataType = formList
    init(formParam, page)
  }

  // 发布流程
  const publishItem = async (row: ProgressDataType) => {
    const params = {
      "data": {
        "id": row.id
      },
      operator,
      "source": "PC",
      "traceId": "",
      "version": "1"
    }
    setActiveRow(row)
    setLoading(true)
    const result = await publishProgressItem(params)
    setLoading(false)
    if (result && result.success) {
      notification.success({
        message: intl.formatMessage({
          id: 'pages.publish.success',
          defaultMessage: '发布成功',
        })
      })
      const formParam: ProgressDataType = {}
      init(formParam)
    }
  }

  // 删除流程
  const deleteFile = async (row: ProgressDataType) => {
    const params = {
      "data": row.id,
      operator,
      "source": "PC",
      "traceId": "",
      "version": "1"
    }
    setActiveRow(row)
    setLoading(true)
    const result = await deleteProgressItem(params)
    setLoading(false)
    if (result && result.success) {
      notification.success({
        message: intl.formatMessage({
          id: 'pages.delete.success',
          defaultMessage: '删除成功',
        })
      })
      const formParam: ProgressDataType = {}
      init(formParam)
    }
  }

  // 流程复制
  const copyProcess = (row: ProgressDataType) => {
    setActiveRow(row)
    setAddVisible(true)
    setIsCopy(true)
    const isMutli = row.tenantId ? "是" : "否"
    setIsMuti(isMutli)
    addForm.setFieldsValue({
      ...row,
      isMore: isMutli
    })
  }

  // 点击新建流程确定
  const saveAddInfo = async () => {
    const result = await addForm.validateFields()
    if (result) {
      let params = {} as CopyProcessParamsType
      if (isCopy) {
        params = {
          fileName: result.fileName,
          id: activeRow.id as string,
          fileKey: activeRow.fileKey as string,
          tenantId: result.tenantId
        }
      } else {
        params = {
          fileName: result.fileName,
        }
      }
      const info = isCopy ? await progressApi.workflowCopy(params) : await progressApi.checkFileName(params)
      if (info && info.success) {
        if (isCopy) {
          notification.success({
            message: intl.formatMessage({
              id: 'pages.btn.success',
              defaultMessage: '操作成功',
            })
          })
          const formParam: ProgressDataType = {}
          init(formParam)
        } else {
          if (!info.data) {
            notification.error({
              message: intl.formatMessage({ id: 'pages.model.watch', defaultMessage: '请注意' }),
              description: intl.formatMessage({ id: 'pages.progress.save.fileName', defaultMessage: '流程文件名称已存在，请重新输入' })
            })
            return
          }
          if (result.isMore === '否') {
            history.push(`/progress/editor?fileName=${result.fileName}`)
          } else {
            history.push(`/progress/editor?fileName=${result.fileName}&tenantId=${result.tenantId}`)
          }
        }
        setAddVisible(false)
        setIsCopy(false)
        setIsMuti("否")
        setActiveRow({})
        addForm.resetFields()
      }
    }
  }

  const actionRender = (text: string, row: ProgressDataType) => {
    let path = `/progress/editor?id=${row.id}&fileName=${row.fileName}`
    if (row.tenantId) {
      path = path.concat(`&tenantId=${row.tenantId}`)
    }
    if (row.status === 'DRAFT') { // 草稿
      return (
        <>
          <DTableButton iconType="design" onClick={() => { history.push(path) }} />
          <DTableButton iconType="preview" onClick={() => { history.push(`/progress/preview?id=${row.id}`) }} />
          <DTableButton iconType="copy" onClick={() => copyProcess(row)} />
          <DTableButton showComfirm iconType="publish" onClick={() => publishItem(row)} />
          <DTableButton showComfirm iconType="delete" onClick={() => deleteFile(row)} />
        </>
      )
    } else if (row.status === "PUBLISH") {
      return (
        <>
          <DTableButton iconType="design" onClick={() => { history.push(path) }} />
          <DTableButton iconType="preview" onClick={() => { history.push(`/progress/preview?id=${row.id}`) }} />
          <DTableButton iconType="copy" onClick={() => copyProcess(row)} />
        </>
      )
    } else {
      return <DTableButton iconType="preview" onClick={() => { history.push(`/progress/preview?id=${row.id}`) }} />
    }
  }

  const columns: ColumnsType<ProgressDataType> = [
    {
      title: intl.formatMessage({ id: 'pages.appInfo.progress.table.fileKey', defaultMessage: '流程编号' }),
      align: 'center',
      dataIndex: 'fileKey',
    },
    {
      title: intl.formatMessage({ id: 'pages.table.createDate', defaultMessage: '创建时间' }),
      align: 'center',
      dataIndex: 'createTime',
    },
    {
      title: intl.formatMessage({ id: 'pages.appInfo.progress.table.fileName', defaultMessage: '流程名称' }),
      align: 'center',
      dataIndex: 'fileName',
    },
    {
      title: intl.formatMessage({ id: 'pages.table.createUser', defaultMessage: '创建时间' }),
      align: 'center',
      dataIndex: 'createUser',
    },
    {
      title: intl.formatMessage({ id: 'pages.table.status', defaultMessage: '状态' }),
      align: 'center',
      dataIndex: 'status',
      render: (text, row) => {
        return ConstantValueToContentKey(dicList, text)
      }
    },
    {
      title: intl.formatMessage({ id: 'pages.table.version', defaultMessage: '版本号' }),
      align: 'center',
      dataIndex: 'fileVersion',
    },
    {
      title: intl.formatMessage({ id: 'pages.table.action', defaultMessage: '操作' }),
      align: 'center',
      dataIndex: 'action',
      render: (text, row) => actionRender(text, row)
    }
  ];

  return (
    <Card title={intl.formatMessage({ id: 'pages.appInfo.progress.action.design', defaultMessage: '流程设计' })}>
      <Spin spinning={loading}>
        {/* 顶部表单 */}
        <Card>
          <Form
            form={form}
            name="advanced_search"
            className="ant-advanced-search-form"
            onFinish={onFinish}
          >
            <Row gutter={24}>
              <Col span={6}>
                <Form.Item
                  name="fileName"
                  label={intl.formatMessage({ id: 'pages.appInfo.progress.table.fileName', defaultMessage: '流程名称' })}
                >
                  <Input placeholder={intl.formatMessage({ id: 'pages.appInfo.progress.form.fileName.placeholder', defaultMessage: '请输入流程名称' })} />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item
                  name="createUser"
                  label={intl.formatMessage({ id: 'pages.table.createUser', defaultMessage: '创建人' })}
                >
                  <Input placeholder={intl.formatMessage({ id: 'pages.table.createUser.placeholder', defaultMessage: '请输入创建人' })} />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item
                  name="status"
                  label={intl.formatMessage({ id: 'pages.table.status', defaultMessage: '状态' })}
                >
                  <Select placeholder={intl.formatMessage({ id: 'pages.table.status.placeholder', defaultMessage: '请选择状态' })}>
                    {dicList.map(item => (
                      <Option key={item.constantValue} value={item.constantValue}>{item.description}</Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item
                  name="invalidCheck"
                  valuePropName="checked"
                >
                  <Checkbox>{intl.formatMessage({ id: 'pages.table.isOld', defaultMessage: '是否旧版本' })}</Checkbox>
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={24} style={{ textAlign: 'right' }}>
                <Button type="primary" htmlType="submit">
                  <FormattedMessage id="pages.search" defaultMessage='搜索' />
                </Button>
                <Button
                  style={{ margin: '0 8px' }}
                  onClick={() => {
                    form.resetFields();
                    const formParam: ProgressDataType = {}
                    init(formParam)
                  }}
                >
                  <FormattedMessage id="pages.reset" defaultMessage='重置' />
                </Button>
              </Col>
            </Row>
          </Form>
        </Card>
        {/* 表格部分 */}
        <Card className='table_margin'>
          <Button type='primary' size='large' className='top_btn' onClick={() => { setAddVisible(true); setIsCopy(false); setIsMuti("否"); }}><FormattedMessage id="pages.appInfo.progress.form.title" defaultMessage='新建流程' /></Button>
          <DTable
            rowSelection={{ ...rowSelection }}
            columns={columns}
            dataSource={list.dataSource}
            rowKey="id"
            onChange={(e) => changePage(e)}
            pagination={{
              total: Number(list.total),
              current: Number(list.pageIndex),
              pageSize: Number(list.pageSize),
            }}
          />
        </Card>
        <Modal
          title={isCopy ? intl.formatMessage({ id: "pages.appInfo.progress.action.copy", defaultMessage: '流程复制' }) : intl.formatMessage({ id: "pages.appInfo.progress.form.title" })}
          // destroyOnClose
          visible={addVisible}
          okText={intl.formatMessage({ id: "pages.ok", defaultMessage: "确定" })}
          cancelText={intl.formatMessage({ id: "pages.cancel", defaultMessage: "取消" })}
          onOk={() => { saveAddInfo() }}
          onCancel={() => { setAddVisible(false); setIsCopy(false); setActiveRow({}); addForm.resetFields() }}>
          <Form
            form={addForm}
            name="advanced_search"
            className="ant-advanced-search-form"
            preserve={false}
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 16 }}
          >
            <Form.Item
              name="isMore"
              label={intl.formatMessage({ id: 'pages.appInfo.progress.table.isMore', defaultMessage: '是否多租户' })}
              initialValue="否"
            >
              <Select onChange={(e) => setIsMuti(e)}>
                <Option key='否' value="否">否</Option>
                <Option key='是' value="是">是</Option>
              </Select>
            </Form.Item>
            {
              isMutli === '是' ? (
                <Form.Item
                  name="tenantId"
                  label={intl.formatMessage({ id: 'pages.appInfo.progress.table.tenantId', defaultMessage: '租户' })}
                  rules={[{ required: true, message: intl.formatMessage({ id: 'pages.appInfo.progress.table.tenantId.placeholder', defaultMessage: '请选择租户' }) }]}
                >
                  <Select options={tenantUserInfo} showSearch optionFilterProp='label' placeholder={intl.formatMessage({ id: 'pages.appInfo.progress.table.tenantId.placeholder', defaultMessage: '请选择租户' })} />
                </Form.Item>
              ) : null
            }
            <Form.Item
              name="fileName"
              label={intl.formatMessage({ id: 'pages.appInfo.progress.table.fileName', defaultMessage: '流程名称' })}
              rules={[{ required: true, message: intl.formatMessage({ id: 'pages.appInfo.progress.form.fileName.placeholder', defaultMessage: '请输入流程名称' }) }]}
            >
              <Input autoComplete='off' placeholder={intl.formatMessage({ id: 'pages.appInfo.progress.form.fileName.placeholder', defaultMessage: '请输入流程名称' })} />
            </Form.Item>
          </Form>
        </Modal>
      </Spin>
    </Card>
  )
}

export default Progress

// import Preview from "@/components/Preview";

// function Progress() {
//   return (
//     <Preview pageId="073250234153037824" />
//   )
// }

// export default Progress