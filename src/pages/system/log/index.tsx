import DTable from '@/components/DTable'
import LcIcon from '@/components/LcIcon'
import { Constant } from '@/constant'
import logApi from '@/services/custom/system/log'
import type { ListType } from '@/types/common'
import { transLang } from '@/utils/utils'
import { PageContainer } from '@ant-design/pro-layout'
import type { TablePaginationConfig } from 'antd';
import { Button, Card, Col, Form, Input, Row, Tooltip } from 'antd'
import { useForm } from 'antd/lib/form/Form'
import type { ColumnsType } from 'antd/lib/table'
import { useEffect, useState } from 'react'
import { useIntl } from 'umi'
import './index.less'
import type { LogData } from './type'

function Log() {
  const [loading, setLoading] = useState(false)
  const [list, setList] = useState<ListType<LogData>>({
    dataSource: [],
    pageIndex: 1,
    pageSize: 10,
    total: 0
  })
  const intl = useIntl()
  const [form] = useForm()

  useEffect(() => {
    const params: LogData = {}
    init(params)
  }, [])

  // 获取列表
  const init = async (formParam: LogData, current?: number) => {
    setLoading(true)
    const params = {
      "data": {
        ...formParam,
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
    const res = await logApi.getList(params);
    setLoading(false)
    if (res && res.success) {
      setList({
        ...list,
        pageIndex: current || 1,
        dataSource: res.data.list,
        total: res.data.total
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
    const formParam: LogData = {
      ...form.getFieldsValue()
    }
    init(formParam, page.current)
  }

  const searchList = async () => {
    const validate = await form.getFieldsValue()
    const params = {
      ...validate
    }
    init(params, 1)
  }

  const columns: ColumnsType<LogData> = [
    {
      title: intl.formatMessage({ id: 'pages.app.log.table.logId' }),
      width: 100,
      dataIndex: 'logId',
    },
    {
      title: intl.formatMessage({ id: 'pages.app.log.table.traceId' }),
      width: 100,
      dataIndex: 'traceId',
    },
    {
      title: intl.formatMessage({ id: 'pages.app.log.table.modules' }),
      width: 100,
      dataIndex: 'modules',
    },
    {
      title: intl.formatMessage({ id: 'pages.app.log.table.eventName' }),
      width: 100,
      dataIndex: 'eventName',
    },
    {
      title: intl.formatMessage({ id: 'pages.app.log.table.requestType' }),
      width: 100,
      dataIndex: 'requestType',
    },
    {
      title: intl.formatMessage({ id: 'pages.app.log.table.requestUrl' }),
      width: 100,
      dataIndex: 'requestUrl',
    },
    {
      title: intl.formatMessage({ id: 'pages.app.log.table.source' }),
      width: 100,
      dataIndex: 'source',
    },
    {
      title: intl.formatMessage({ id: 'pages.app.log.table.eventDate' }),
      width: 100,
      dataIndex: 'eventDate',
    },
    {
      title: intl.formatMessage({ id: 'pages.app.log.table.dealTime' }),
      width: 100,
      dataIndex: 'dealTime',
    },
    {
      title: intl.formatMessage({ id: 'pages.app.log.table.userId' }),
      width: 100,
      ellipsis: true,
      dataIndex: 'userId',
    }
  ];

  return (
    <div className='d-sys-log'>
      <PageContainer header={{ breadcrumb: {}, className: 'd-sys-header' }} title={intl.formatMessage({ id: 'menu.system.log' })} className="d-container" loading={loading}>
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
                    <Form.Item name="traceId" label={intl.formatMessage({ id: 'pages.app.log.table.traceId' })}>
                      <Input placeholder={intl.formatMessage({ id: 'pages.app.log.table.traceId.placeholder' })} />
                    </Form.Item>
                  </Col>
                  <Col span={5}>
                    <Form.Item name="eventName" label={intl.formatMessage({ id: 'pages.app.log.table.eventName' })}>
                      <Input placeholder={intl.formatMessage({ id: 'pages.app.log.table.eventName.placeholder' })} />
                    </Form.Item>
                  </Col>
                </Row>
              </Col>
              <Col span={3}>
                <div className='d-form-btn'>
                  <Tooltip title={intl.formatMessage({ id: 'pages.reset' })}>
                    <Button onClick={() => form.resetFields()} shape="circle" icon={<LcIcon type='icon-zhongzhi' />} className="btn" />
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
          <DTable
            scroll={{ x: 2000 }}
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
      </PageContainer>
    </div>
  )
}

export default Log