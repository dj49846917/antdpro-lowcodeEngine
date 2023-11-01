import { useEffect, useState } from "react"
import ProCard from "@ant-design/pro-card";
import { PageContainer } from "@ant-design/pro-layout"
import { useIntl } from "umi";
import { Form, Input, Modal, notification, Spin, Tabs } from "antd"
import type { DicType, ListType } from "@/types/common";
import appApi, { createApplication, getList } from "@/services/custom/application";
import { Constant } from "@/constant";
import { commonParams } from "@/utils/utils";
import { getUserInfo } from "@/services/custom/user";
import progressApi from "@/services/custom/appInfo/progress";
import LcIcon from "@/components/LcIcon";
import DButton from "@/components/DButton";
import DAppCard from "@/components/DAppCard";

import type { AppListType } from "../type";
import './index.less'

const { Search, TextArea } = Input;

type formType = {
  appName?: string
}

function Application() {
  const intl = useIntl();
  const [loading, setLoading] = useState(false)
  const [searchVal, setSearchVal] = useState("") // 搜索的内容
  const [visible, setVisible] = useState(false) // 新增应用
  const [addForm] = Form.useForm();
  const [oLoading, setOLoading] = useState(false) // 弹窗的loading
  const [dicList, setDicList] = useState<DicType[]>([])
  const [list, setList] = useState<ListType<AppListType>>({
    dataSource: [],
    pageIndex: 1,
    pageSize: 10,
    total: 0
  })

  // 获取列表
  const init = (formParam: formType) => {
    const params = commonParams({
      ...formParam,
    })
    setLoading(true)
    getList(params).then(res => {
      if (res && res.success) {
        setList({
          ...list,
          dataSource: res.data,
        })
      }
    }).finally(() => {
      setLoading(false)
    })
  }


  // 查询数据字典
  const getDic = async () => {
    const params = {
      parentId: ["app_status"]
    }
    const result = await progressApi.getDicList(params)
    if (result && result.success) {
      setDicList(result.data)
    }
  }

  // 初始化
  useEffect(() => {
    // 获取数据
    const formParam: formType = {}
    init(formParam)
    getDic()
  }, [])


  // 根据名称查询
  const onSearch = (val: string) => {
    const formParam: formType = {
      appName: val
    }
    init(formParam)
  }

  const addApplication = async () => { // 点击创建应用
    const result = await addForm.validateFields()
    const token = localStorage.getItem(Constant.LOGIN_TOKEN_STORAGE)
    const params = commonParams({
      ...result,
      "appType": 0,
      token,
    })
    if (result) {
      setOLoading(true)
      const res = await createApplication(params)
      setOLoading(false)
      if (res && res.success) {
        notification.success({
          message: intl.formatMessage({
            id: 'pages.add.success',
            defaultMessage: '创建成功',
          }),
        })
        const formParam: formType = {}
        getUserInfo({ token })
        init(formParam)
        setVisible(false)
      }
    }
  }
  const deleteApp = async (item: any) => {
    const token = localStorage.getItem(Constant.LOGIN_TOKEN_STORAGE)
    const params = {
      id: item.appId
    }
    const result = await appApi.deleteApplication(params)
    if (result && result.success) {
      notification.success({
        message: intl.formatMessage({
          id: 'pages.delete.success',
          defaultMessage: '删除成功',
        })
      })
      const formParam: formType = {}
      getUserInfo({ token })
      init(formParam)
      setVisible(false)
    }
  }

  return (
    <div className="d-app-main">
      <PageContainer
        header={{ breadcrumb: {}, className: 'd-sys-header' }} title={intl.formatMessage({ id: 'menu.application' })} className="d-container" loading={loading}
      >
        <div className="d-app-header">
          <Input
            value={searchVal}
            allowClear
            onChange={(e) => {
              if (!e.target.value) {
                onSearch("")
              }
              setSearchVal(e.target.value)
            }}
            placeholder={intl.formatMessage({ id: 'pages.application.searchHolder' })}
            className="d-app-header-input"
            prefix={<LcIcon type='icon-sousuo1' onClick={() => onSearch(searchVal)} style={{ cursor: 'pointer' }} />}
          />
          <div className="d-app-header-btn">
            <DButton onClick={() => setVisible(true)} type="primary" style={{ "marginRight": "10px" }}>{intl.formatMessage({ id: 'pages.application.addApp' })}</DButton>
            <DButton>{intl.formatMessage({ id: 'pages.application.exportApp' })}</DButton>
          </div>
        </div>
        <ProCard wrap>
          <div className="d-app-content">
            {
              list.dataSource.map(item => (
                <DAppCard
                  item={item}
                  key={item.appId}
                  dicList={dicList}
                  deleteApp={(row) => deleteApp(row)}
                />
              ))
            }
          </div>
        </ProCard>


      </PageContainer>
      {/* 创建应用 */}
      <Modal title={intl.formatMessage({ id: 'pages.application.model.title', defaultMessage: '新建应用' })}
        destroyOnClose
        visible={visible}
        okText={intl.formatMessage({ id: 'pages.ok', defaultMessage: '确定' })}
        cancelText={intl.formatMessage({ id: 'pages.cancel', defaultMessage: '取消' })}
        onOk={addApplication}
        onCancel={() => setVisible(false)}>
        <Spin spinning={oLoading}>
          <Form
            form={addForm}
            name="advanced_search"
            className="ant-advanced-search-form"
            preserve={false}
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 16 }}
          >
            <Form.Item
              name="appName"
              label={intl.formatMessage({ id: 'pages.application.model.appName', defaultMessage: '应用名称' })}
              rules={[{ required: true, message: intl.formatMessage({ id: 'pages.application.model.appNameTip', defaultMessage: '请输入应用名称' }) }]}
            >
              <Input placeholder={intl.formatMessage({ id: 'pages.application.model.appNamePlaceHolder', defaultMessage: '请输入应用名称' })} />
            </Form.Item>
            <Form.Item
              name="appUri"
              label={intl.formatMessage({ id: 'pages.application.model.appUri', defaultMessage: '应用路径' })}
              rules={[{ required: true, message: intl.formatMessage({ id: 'pages.application.model.appUriTip', defaultMessage: '请输入应用路径' }) }]}
            >
              <Input placeholder={intl.formatMessage({ id: 'pages.application.model.appUri', defaultMessage: '请输入应用路径' })} />
            </Form.Item>
            <Form.Item
              name="appDesc"
              label={intl.formatMessage({ id: 'pages.application.model.appDesc', defaultMessage: '应用描述' })}
            >
              <TextArea rows={4} placeholder={intl.formatMessage({ id: 'pages.application.model.appDescPlaceHolder', defaultMessage: '请输入应用描述' })} />
            </Form.Item>
          </Form>
        </Spin>
      </Modal>
    </div>
  )
}

export default Application
