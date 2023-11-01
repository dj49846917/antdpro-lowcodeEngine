import {
  Button,
  Card,
  Col,
  Form,
  Input,
  Modal,
  notification,
  Radio,
  Row,
  Select,
  Spin,
  Switch
} from 'antd';
import {
  useEffect,
  useState
} from 'react';
import { useIntl } from 'umi';
import type {
  ColumnsType,
  TablePaginationConfig
} from 'antd/lib/table';
import pageApi, {
  createApplication,
  deleteApplication,
  getDataSourceListById
} from '@/services/custom/appInfo';
import { Constant } from '@/constant';
import type { TableRowSelection } from 'antd/lib/table/interface';
import type {
  DicType,
  ListType
} from '@/types/common';
import {
  commonParams,
  getAppId,
  getAppInfo,
  isSuperAdmin,
  transLang
} from '@/utils/utils';
import progressApi from '@/services/custom/appInfo/progress';
import type {
  addFormInfoType,
  CopyAppType,
  DataType,
  TemplateListType
} from './type';
import DTable from '@/components/DTable';
import DTableButton from '@/components/DTableButton';
import datasourceApi from "@/services/custom/platform/service";
import type { LabeledValue } from 'antd/lib/select';
import publishApi from '@/services/custom/appInfo/publish';

import './index.less';
import { usePages } from '../menu/hooks';

const { Option } = Select;
const { TextArea } = Input;

export type DataSourceListTyope = {
  datasourceDesc: string,
  datasourceId: string,
  datasourceName: string,
  [key: string]: any
}

function Page({ isAppInit }: { isAppInit?: boolean }) {

  const [list, setList] = useState<ListType<DataType>>({
    dataSource: [],
    pageIndex: 1,
    pageSize: 10,
    total: 0
  })
  const [, update] = useState({});
  const [selectedRows, setSelectedRows] = useState<any[]>([])
  const [assignVisible, setAssignVisible] = useState(false)
  const [revertVisible, setRevertVisible] = useState(false)
  const [activeRow, setActiveRow] = useState<DataType>({})
  const [formList, setFormList] = useState<DataType>({ terminalType: 0 })
  const intl = useIntl();
  const [versionList, setVersionList] = useState<DicType[]>([])
  const [visible, setVisible] = useState(false) // 弹窗
  const [renameVisible, setRenameVisible] = useState(false)
  const [loading, setLoading] = useState(false) // 加载状态
  const [form] = Form.useForm();
  const [revertForm] = Form.useForm();
  const [nameForm] = Form.useForm();
  const [addForm] = Form.useForm();
  const [assignForm] = Form.useForm();
  const [dicList, setDicList] = useState<DicType[]>([])
  const [templateList, setTemplateList] = useState<TemplateListType[]>([])
  const [groupArr, setGroupArr] = useState<LabeledValue[]>([])
  const [userList, setUserList] = useState<DicType[]>([])
  const [addFormInfo, setAddFormInfo] = useState<addFormInfoType>({ // 获取所有数据源列表
    pageName: "",
    pageType: "",
    datasourceId: "",
    tableName: ""
  });
  const [rowActiveType, setRowActiveType] = useState<'edit' | 'copy'>("copy")
  const [pageType, setPageType] = useState("")
  const [tables, setTables] = useState()
  const appPages = usePages({ terminalType: 2 });
  const onPageTypeChange = (value: string) => {
    addForm.resetFields(['templateId', 'datasourceId', 'tableName', 'childTableList', 'pageDesc'])
    setPageType(value)
  }

  const onDatabaseChange = async (value: string) => {
    const res = await getDataSourceListById(commonParams({ datasourceId: value }))
    if (res.success) {
      setTables(res.data?.map((item: { tableName: string; comments: string; }) => ({ value: item.tableName, label: `${item.comments}(${item.tableName})` })))
    }
  }

  const operator = localStorage.getItem(Constant.USER_INFO_STORAGE)


  const initUserList = async () => {
    const params = {}
    const result = await progressApi.getAllUserTaskPerson()
    if (result && result.success) {
      const arr = result.data.map((item: { fullName: string, userId: string }) => {
        return {
          label: item.fullName,
          value: item.userId
        }
      })
      setUserList(arr || [])
    }
  }

  const getVersion = async () => {
    const params = {
      current: 1,
      size: 200
    }
    const result = await publishApi.getList(params)
    if (result && result.success) {
      const ssArr = result.data.list.map(item => {
        return {
          label: item.deployVersion,
          value: item.deployId
        }
      })
      setVersionList(ssArr as DicType[])
    }
  }

  const initGroupInfo = async () => {
    setLoading(true)
    const result = await pageApi.getGroupInfo({
      appId: getAppId(),
    })
    if (result && result.success) {
      const arr = result.data.map((item: { groupCode: string; groupName: string; businessId: string }) => {
        return {
          key: item.businessId,
          value: item.groupCode,
          label: item.groupName
        }
      })
      setGroupArr(arr || [])
    }
  }

  // 获取列表
  const init = (formParam: DataType, current?: number) => {
    setLoading(true)
    const appId = getAppId();
    const params = {
      "data": {
        ...formParam,
        appId: appId as any
      },
      operator,
      "page": current || 1,
      "size": list.pageSize,
      "source": "PC",
      "traceId": "",
      "version": "1",
      "lang": transLang()
    } as any

    if (isAppInit) {
      params.data.initPage = true
    }
    pageApi.getList(params, false, isAppInit).then(res => {
      if (res && res.data) {
        setList({
          ...list,
          pageIndex: current || 1,
          dataSource: res.data.list,
          total: res.data.total
        })
      }
    }).finally(() => {
      setLoading(false)
    })
  }

  // 点击搜索
  const onFinish = (values: any) => {
    setFormList({
      ...values,
      /** terminalType为0（全部）时，空值 */
      // terminalType: values.terminalType || undefined,
    })
    const formParam: DataType = values
    if (values.terminalType === 0) {
      delete formParam.terminalType
    }
    init(formParam)
  };

  const initTemplateList = async (_pageType: string) => {
    const result = await pageApi.getTemplateList(_pageType)
    if (result && result.success) {
      setTemplateList(result.data)
    }
  }


  // 查询所有数据源
  const getFormAllList = async () => {
    setLoading(true)
    const appId = getAppId()
    const result = await datasourceApi.getDatabaseList(appId)
    setLoading(false)
    if (result.data) {
      setAddFormInfo({
        ...addFormInfo,
        dataList: result.data
      })
    }
  }

  // 查询数据字典
  const getDic = async () => {
    const params = {
      parentId: ["pageType"]
    }
    const result = await progressApi.getDicList(params)
    if (result && result.success) {
      setDicList(result.data)
    }
  }


  // 初始化
  useEffect(() => {
    // 获取数据
    const formParam: DataType = {}
    const timer = setTimeout(() => init(formParam), 200)

    initGroupInfo()
    getFormAllList()
    getDic()
    getVersion()

    initUserList()
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    initTemplateList(pageType)
  }, [pageType])

  // 列表选中
  const rowSelection: TableRowSelection<DataType> = {
    onChange: (rowKeys, rows) => {
      setSelectedRows(rows)
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
    const formParam: DataType = formList
    if (formParam.terminalType === 0) {
      delete formParam.terminalType
    }
    init(formParam, page.current)
  }

  const copyAction = async (row: DataType) => {
    nameForm.setFieldsValue({
      pageName: row.pageName
    })
    setRowActiveType("copy")
    setActiveRow(row)
    setRenameVisible(true)
  }

  // 打开回退版本按钮
  const resetVersion = (row: DataType) => {
    setActiveRow(row)
    setRevertVisible(true)
  }

  const openDesigner = (row: DataType, action?: string) => { // 点击页面设计

    setActiveRow(row)
    if (row.terminalType == 2) {
      window.open(isAppInit ? `/designer/mobile?pageId=${row.tempId}&isTemplate=1` : `/designer/mobile?pageId=${row.pageId}`)
      return
    }
    if (action === 'mapping') {
      window.open(`/designer/mobile?pageId=${row.pageId}&mapping=true`)
      return;
    }
    if (action === 'print') {
      window.open(`/designer/print?pageId=${row.pageId}`)
      return;
    }
    window.open(isAppInit ? `/designer?pageId=${row.tempId}&isTemplate=1` : `/designer?pageId=${row.pageId}`)
  }

  const openPreview = (row: DataType) => {
    setActiveRow(row)
    window.open(isAppInit ? `/preview.html?scenarioName=pc&pageId=${row.tempId}&isTemplate=1` : `/preview.html?scenarioName=pc&pageId=${row.pageId}`);
  }

  const addApplication = async () => { // 点击创建应用
    const result = await addForm.validateFields()
    if (result) {
      setLoading(true)
      const params = {
        ...result,
        appId: getAppId(),
      }
      if (result.childTableList && result.childTableList.length > 0) {
        params.childTableList = result.childTableList.join(",")
      }

      // 模板新增
      if (isAppInit) {
        params.appId = "1"
      }
      const res = isAppInit ? await pageApi.addTemplate(params) : await createApplication(commonParams(params))
      setLoading(false)
      if (res && res.success) {
        notification.success({
          message: intl.formatMessage({
            id: 'pages.add.success',
            defaultMessage: '创建成功',
          })
        })
        const formParam: DataType = {}
        setFormList({});
        init(formParam);
        setPageType("");
        setVisible(false)
        if (!isAppInit) {
          if (result.terminalType == 2) {
            window.open(`/designer/mobile?pageId=${res.data}&init=true`)
            return
          }
          window.open(`/designer?pageId=${res.data}&init=true&name=${params.pageName}`)
        }
      }
    }
  }

  // 删除列表
  const delelteItem = async (row: DataType) => {
    setActiveRow(row)
    const params = {
      id: row.pageId
    }
    setLoading(true)
    const result = isAppInit ? await pageApi.deleteTemplate(row.tempId as string) : await deleteApplication(commonParams(params))
    setLoading(false)
    if (result && result.success) {
      const formParam: DataType = {}
      setFormList({});
      init(formParam)
    }
  }
  // 点击重命名
  const renameAction = (row: DataType) => {
    nameForm.setFieldsValue({
      ...row
    })
    setRowActiveType("edit")
    setActiveRow(row)
    setRenameVisible(true)
  }

  // 重命名弹窗确定
  const renameSave = async () => {
    const val = await nameForm.validateFields()
    if (val) {
      if (rowActiveType === 'edit') {
        setLoading(true)
        const params = {
          ...val,
          appId: activeRow.appId,
          pageId: activeRow.pageId
        }
        if (isAppInit) {
          params.tempId = activeRow.tempId
        }
        const res = isAppInit ? await pageApi.addTemplate(params) : await createApplication(commonParams(params))
        setLoading(false)
        if (res && res.success) {
          notification.success({
            message: intl.formatMessage({
              id: 'pages.btn.success',
              defaultMessage: '操作成功',
            })
          })
          setRenameVisible(false)
          const formParam: DataType = {};
          setFormList({});
          init(formParam)
        }
      }
      if (rowActiveType === 'copy') {
        if (activeRow.pageName === val.pageName) {
          notification.error({
            message: intl.formatMessage({
              id: 'page.rename.error',
              defaultMessage: '页面名称重复',
            })
          })
          return
        }
        const params: CopyAppType = {
          pageId: activeRow.pageId as string,
          pageName: val.pageName as string
        }
        setLoading(true)
        const res = await pageApi.copyApp(params)
        setLoading(false)
        if (res && res.success) {
          notification.success({
            message: intl.formatMessage({
              id: 'pages.btn.success',
              defaultMessage: '操作成功',
            })
          })
          setRenameVisible(false)
          const formParam: DataType = {};
          setFormList({});
          init(formParam)
        }
      }
    }
  }

  // 回退版本保存
  const revertSave = async () => {
    const val = await revertForm.validateFields()
    setLoading(true)
    if (val) {
      const params = {
        ...val,
        pageId: activeRow.pageId,
      }
      setLoading(true)
      const res = await pageApi.revertVersionSave(params)
      setLoading(false)
      if (res && res.success) {
        notification.success({
          message: intl.formatMessage({
            id: 'pages.btn.success',
            defaultMessage: '操作成功',
          })
        })
        setRevertVisible(false)
        const formParam: DataType = {};
        setFormList({});
        init(formParam)
        revertForm.resetFields();
      }
    }
  }
  // 转让他人保存
  const assignSave = async () => {
    const val = await assignForm.validateFields()
    if (val) {
      if (selectedRows.length === 0) {
        notification.error({
          message: intl.formatMessage({ id: 'pages.appInfo.page.tip.noData', defaultMessage: '请至少勾选一条数据' })
        })
        return
      }
      let flag = false
      if (!isSuperAdmin()) {
        const createUser = JSON.parse(localStorage.getItem(Constant.USER_STORAGE) as string).fullName
        selectedRows.forEach(item => {
          if (item.createUser !== createUser) {
            flag = true
          }
        })
      }

      if (flag) {
        notification.error({
          message: intl.formatMessage({ id: 'pages.appInfo.page.tip.err' })
        })
        return
      }
      const params = {
        ...val,
        pageIdList: selectedRows.map(item => {
          return item.pageId
        })
      }
      setLoading(true)
      const res = await pageApi.assignUsers(params)
      setLoading(false)
      if (res && res.success) {
        notification.success({
          message: intl.formatMessage({
            id: 'pages.btn.success',
            defaultMessage: '操作成功',
          })
        })
        setRevertVisible(false)
        const formParam: DataType = {};
        setFormList({});
        init(formParam)
        revertForm.resetFields();
      }
    }
  }
  // 控制按钮权限
  const controlBtn = (user: string) => {
    const appId = getAppId();
    if (appId === '0' || appId === '1') {
      return false
    }
    const appInfo = getAppInfo();
    const userInfo = JSON.parse(localStorage.getItem(Constant.USER_STORAGE) as string)
    if (appInfo) {
      const flag = appInfo.devWhiteList?.split(",").includes(userInfo.userId);
      if (flag) {
        return !flag
      }
      // return !(appObj.devWhiteList.split(",").includes(userInfo.userId))
    }
    return !(userInfo?.fullName === user)
  }

  // 页面添加版本
  const addVersion = () => {
    if (selectedRows.length === 0) {
      notification.error({
        message: intl.formatMessage({ id: 'pages.appInfo.page.tip.noData' })
      })
      return
    }
  }

  const columns: ColumnsType<DataType> = [
    {
      title: intl.formatMessage({ id: 'pages.appInfo.page.table.pageId', defaultMessage: '页面编号' }),
      align: 'center', dataIndex: 'pageId', width: 200, fixed: 'left',
    },
    {
      title: intl.formatMessage({ id: 'pages.table.createDate', defaultMessage: '创建时间' }),
      align: 'center', dataIndex: 'createDate', width: 200
    },
    {
      title: intl.formatMessage({ id: 'pages.appInfo.page.table.pageName', defaultMessage: '页面名称' }),
      align: 'center', dataIndex: 'pageName', width: 200
    },
    {
      title: intl.formatMessage({ id: 'pages.appInfo.page.terminalType', defaultMessage: '终端类型' }),
      align: 'center', dataIndex: 'terminalType', width: 100, render: (v) => {
        return v == 2 ? "app" : "pc"
      }
    },
    {
      title: intl.formatMessage({ id: 'pages.appInfo.page.table.groupName', defaultMessage: '页面分组' }),
      align: 'center',
      dataIndex: 'groupName',
      width: 200,
    },
    {
      title: intl.formatMessage({ id: 'pages.table.developer', defaultMessage: '开发者' }),
      align: 'center',
      dataIndex: 'createUser',
      width: 200,
    },
    {
      title: intl.formatMessage({ id: 'pages.table.updateUser', defaultMessage: '修改人' }),
      align: 'center',
      dataIndex: 'modifiedUser',
      width: 200,
    },
    {
      title: intl.formatMessage({ id: 'pages.table.updateTime', defaultMessage: '修改时间' }),
      align: 'center',
      dataIndex: 'modifiedDate',
      width: 200,
    },
    {
      title: intl.formatMessage({ id: 'pages.appInfo.page.table.pageType', defaultMessage: '页面类型' }),
      align: 'center',
      dataIndex: 'pageType',
      width: 100,
      render: (text) => {
        const arr = dicList.filter(x => x.constantValue == text)
        if (arr.length > 0) {
          return <span>{arr[0].constantKey}</span>
        }
        return text
      }
    },
    {
      title: intl.formatMessage({ id: 'pages.appInfo.page.table.activeFlag', defaultMessage: '状态' }),
      align: 'center',
      dataIndex: 'activeFlag',
      width: 100,
      render: (text) => {
        const arr = Constant.activeFlagArr.filter(x => x.DicCode === text)
        if (arr.length > 0) {
          return <span>{arr[0].DicName}</span>
        }
        return text
      }
    },
    {
      title: intl.formatMessage({ id: 'pages.table.action', defaultMessage: '操作' }),
      align: 'center',
      dataIndex: 'action',
      fixed: 'right',
      width: 220,
      render: (text, row) => {
        return (
          <div className='d-table-row'>
            <DTableButton
              disabled={controlBtn(row.createUser as string)}
              iconType="design"
              onClick={() => openDesigner(row)}
            />
            {
              row.terminalType == 1 && <DTableButton
                disabled={controlBtn(row.createUser as string)}
                iconType="print"
                onClick={() => openDesigner(row, 'print')}
              />
            }
            <DTableButton
              iconType="copy"
              onClick={() => copyAction(row)}
            />
            <DTableButton
              disabled={controlBtn(row.createUser as string)}
              showComfirm
              iconType="delete"
              onClick={() => delelteItem(row)}
            />
            <DTableButton
              iconType="preview"
              onClick={() => openPreview(row)}
            />
            <DTableButton
              disabled={controlBtn(row.createUser as string)}
              iconType="edit"
              onClick={() => renameAction(row)}
            />
            <DTableButton
              disabled={controlBtn(row.createUser as string)}
              iconType="reset"
              onClick={() => resetVersion(row)}
              tip={intl.formatMessage({ id: "table.action.resetVersion" })}
            />
            {
              row.terminalType == 1 && <DTableButton
                disabled={controlBtn(row.createUser as string)}
                iconType={"icon-yingshe" as any}
                title={"历史(流程表单、高级表格、高级表单)转移动端"}
                onClick={() => openDesigner(row, 'mapping')}
              />
            }
          </div>
        )
      }
    }
  ];

  const templateColumns: ColumnsType<DataType> = [
    {
      title: intl.formatMessage({ id: 'pages.appInfo.page.table.tempId', defaultMessage: '模板编号' }),
      align: 'center',
      dataIndex: 'tempId',
    },
    {
      title: intl.formatMessage({ id: 'pages.appInfo.page.table.tempName', defaultMessage: '模板名称' }),
      align: 'center',
      dataIndex: 'tempName',
    },
    {
      title: intl.formatMessage({ id: 'pages.table.createDate', defaultMessage: '创建时间' }),
      align: 'center',
      dataIndex: 'createDate',
    },
    {
      title: intl.formatMessage({ id: 'pages.table.developer', defaultMessage: '开发者' }),
      align: 'center',
      dataIndex: 'createUser',
    },
    {
      title: intl.formatMessage({ id: 'pages.table.action', defaultMessage: '操作' }),
      align: 'center',
      dataIndex: 'action',
      fixed: 'right',
      render: (text, row) => {
        return (
          <div className='d-table-row'>
            <DTableButton iconType="design" onClick={() => openDesigner(row)} />
            <DTableButton disabled={controlBtn(row.createUser as string)} showComfirm iconType="delete" onClick={() => delelteItem(row)} />
            <DTableButton iconType="preview" onClick={() => openPreview(row)} />
            <DTableButton disabled={controlBtn(row.createUser as string)} iconType="edit" onClick={() => renameAction(row)} />
          </div>
        )
      }
    }
  ];

  // 页面名称
  const pageNameComp = () => {
    return (
      <Form.Item
        name="pageName"
        label={intl.formatMessage({ id: 'pages.appInfo.page.table.pageName', defaultMessage: '页面名称' })}
        rules={[{ required: true, message: intl.formatMessage({ id: 'pages.appInfo.page.table.pageName.placeholder', defaultMessage: '请输入页面名称' }) }]}
      >
        <Input
          autoComplete='off'
          placeholder={intl.formatMessage({ id: 'pages.appInfo.page.table.pageName.placeholder', defaultMessage: '请输入页面名称' })}
        />
      </Form.Item>
    )
  }
  const terminalTypeItem = ({ disabled }: { disabled?: boolean }) => {
    return <Form.Item
      required
      name="terminalType"
      label={intl.formatMessage({ id: 'pages.appInfo.page.terminalType', defaultMessage: '终端类型' })}
      initialValue={1}
    >
      <Radio.Group onChange={() => {
        addForm.setFieldValue("needAppPage", false);
        update({});
      }} disabled={disabled}>
        <Radio value={1}>{intl.formatMessage({ id: 'pages.appInfo.page.terminalType.pc', defaultMessage: 'pc端' })}</Radio>
        <Radio value={2}>{intl.formatMessage({ id: 'pages.appInfo.page.terminalType.app', defaultMessage: 'app端' })}</Radio>
      </Radio.Group>
    </Form.Item>
  }

  // 页面分组
  const groupCodeComp = (require: boolean) => {
    return (
      <Form.Item
        name="groupCode"
        label={intl.formatMessage({ id: 'pages.appInfo.page.table.groupName', defaultMessage: '页面分组' })}
        rules={[{
          required: require,
          message: intl.formatMessage({ id: 'pages.appInfo.page.table.groupName.placeholder' })
        }]}
      >
        <Select placeholder={intl.formatMessage({ id: 'pages.appInfo.page.table.groupName.placeholder', defaultMessage: '请选择页面分组' })} options={groupArr} />
      </Form.Item>
    )
  }

  // 页面描述
  const pageDescComp = () => {
    return (
      <Form.Item
        name="pageDesc"
        label={intl.formatMessage({ id: 'pages.appInfo.page.form.pageDesc', defaultMessage: '页面描述' })}
      >
        <TextArea
          rows={4}
          placeholder={intl.formatMessage({
            id: 'pages.appInfo.page.form.pageDesc.placeholder',
            defaultMessage: '请输入页面描述'
          })}
        />
      </Form.Item>
    )
  }

  // 模板的新增、编辑公用表单
  const tempCommonForm = () => {
    return (
      <>
        <Form.Item
          name="tempName"
          label={intl.formatMessage({ id: 'pages.appInfo.page.table.tempName', defaultMessage: '模板名称' })}
          rules={[{
            required: true,
            message: intl.formatMessage({ id: 'pages.appInfo.page.table.tempName.placeholder', defaultMessage: '请输入模板名称' })
          }]}
        >
          <Input placeholder={intl.formatMessage({ id: 'pages.appInfo.page.table.tempName.placeholder', defaultMessage: '请输入模板名称' })} />
        </Form.Item>
        <Form.Item
          name="tempDesc"
          label={intl.formatMessage({ id: 'pages.appInfo.page.table.tempDesc', defaultMessage: '模板描述' })}
        >
          <TextArea rows={4} placeholder={intl.formatMessage({ id: 'pages.appInfo.page.table.tempDesc.placeholder', defaultMessage: '请输入模板描述' })} />
        </Form.Item>
      </>
    )
  }

  return (
    <Card title={isAppInit ? intl.formatMessage({ id: 'pages.appInfo.template.title', defaultMessage: '页面模板管理列表' }) : intl.formatMessage({ id: 'pages.appInfo.page.title', defaultMessage: '页面管理列表' })}>
      <Spin spinning={loading}>
        <Card>
          {/* 顶部表单 */}
          <Form
            form={form}
            name="advanced_search"
            className="ant-advanced-search-form"
            onFinish={onFinish}
          >
            <Row gutter={24}>
              <Col span={8}>
                <Form.Item
                  name={"terminalType"}
                  label={intl.formatMessage({ id: 'pages.appInfo.page.terminalType', defaultMessage: '终端类型' })}
                  initialValue={0}
                >
                  <Radio.Group>
                    <Radio value={0}>{intl.formatMessage({ id: 'pages.appInfo.page.terminalType.all', defaultMessage: '全部' })}</Radio>
                    <Radio value={1}>{intl.formatMessage({ id: 'pages.appInfo.page.terminalType.pc', defaultMessage: 'pc端' })}</Radio>
                    <Radio value={2}>{intl.formatMessage({ id: 'pages.appInfo.page.terminalType.app', defaultMessage: 'app端' })}</Radio>
                  </Radio.Group>
                </Form.Item>
              </Col>
              {isAppInit ? null : (
                <Col span={8}>
                  <Form.Item
                    name="userId"
                    label={intl.formatMessage({ id: 'pages.table.developer', defaultMessage: '开发者' })}
                  >
                    <Select
                      options={userList}
                      placeholder={intl.formatMessage({ id: 'pages.table.developer.placeholder', defaultMessage: '开发者' })}
                    />
                  </Form.Item>
                </Col>
              )}

              <Col span={8}>
                <Form.Item
                  name={isAppInit ? "tempName" : "pageName"}
                  label={isAppInit ? intl.formatMessage({ id: 'pages.appInfo.page.table.tempName', defaultMessage: '模板名称' }) : intl.formatMessage({ id: 'pages.appInfo.page.table.pageName', defaultMessage: '页面名称' })}
                >
                  <Input autoComplete='off' placeholder={isAppInit ? intl.formatMessage({ id: 'pages.appInfo.page.table.tempName.placeholder', defaultMessage: '请输入模板名称' }) : intl.formatMessage({ id: 'pages.appInfo.page.table.pageName.placeholder', defaultMessage: '请输入页面名称' })} />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name={isAppInit ? "tempId" : "pageId"}
                  label={isAppInit ? intl.formatMessage({ id: 'pages.appInfo.page.table.tempId', defaultMessage: '模板编号' }) : intl.formatMessage({ id: 'pages.appInfo.page.table.pageId', defaultMessage: '页面Id' })}
                >
                  <Input autoComplete='off' placeholder={isAppInit ? intl.formatMessage({ id: 'pages.appInfo.page.table.tempId.placeholder', defaultMessage: '请输入模板Id' }) : intl.formatMessage({ id: 'pages.appInfo.page.table.pageId.placeholder', defaultMessage: '请输入页面Id' })} />
                </Form.Item>
              </Col>
              {
                isAppInit ? null : (
                  <>
                    <Col span={8}>
                      <Form.Item name="pageType" label={intl.formatMessage({ id: 'pages.appInfo.page.table.pageType', defaultMessage: '页面类型' })}>
                        <Select
                          placeholder={intl.formatMessage({
                            id: 'pages.appInfo.page.table.pageType.placeholder',
                            defaultMessage: '请选择页面类型'
                          })}
                          onChange={value => setPageType(value)}
                        >
                          {dicList.length > 0 && dicList.map(item => <Option key={item.constantValue} value={item.constantValue}>{item.constantKey}</Option>)}
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col span={8}>{groupCodeComp(false)}</Col>
                  </>
                )
              }
            </Row>
            <Row>
              <Col span={24} style={{ textAlign: 'right' }}>
                <Button type="primary" htmlType="submit">{intl.formatMessage({ id: 'pages.search', defaultMessage: '搜索' })}</Button>
                <Button
                  style={{ margin: '0 8px' }}
                  onClick={() => {
                    form.resetFields();
                    const formParam: DataType = {};
                    setFormList(formParam);
                    init(formParam)
                  }}
                >
                  {intl.formatMessage({ id: 'pages.reset', defaultMessage: '重置' })}
                </Button>
              </Col>
            </Row>
          </Form>
        </Card>
        {/* 表格部分 */}
        <Card className='table_margin'>
          <Button type='primary' size='large' className='top_btn' onClick={() => { setVisible(true) }}>{isAppInit ? intl.formatMessage({ id: 'pages.appInfo.temp.btn.add', defaultMessage: '新建页面模板' }) : intl.formatMessage({ id: 'pages.appInfo.page.btn.add', defaultMessage: '新建页面' })}</Button>
          <Button type='primary' size='large' className='top_btn' onClick={() => { setAssignVisible(true) }}>{intl.formatMessage({ id: 'pages.appInfo.page.btn.revertDeveloper' })}</Button>
          {isAppInit && <Button type='primary' size='large' className='top_btn' onClick={() => addVersion()}>{intl.formatMessage({ id: 'pages.appInfo.page.btn.pageVersion' })}</Button>}
          <DTable
            rowSelection={{ ...rowSelection }}
            columns={isAppInit ? templateColumns : columns}
            dataSource={list.dataSource}
            rowKey={isAppInit ? "tempId" : "pageId"}
            onChange={changePage}
            scroll={{ x: isAppInit ? undefined : 1300 }}
            pagination={{
              total: Number(list.total),
              current: Number(list.pageIndex),
              pageSize: Number(list.pageSize),
            }}
          />
        </Card>
        {/* 创建页面 */}
        <Modal
          title={isAppInit ? intl.formatMessage({ id: 'pages.appInfo.temp.btn.add', defaultMessage: '新建页面模板' }) : intl.formatMessage({ id: 'pages.appInfo.page.btn.add', defaultMessage: '新建页面' })}
          destroyOnClose
          open={visible}
          okText={intl.formatMessage({ id: "pages.ok", defaultMessage: "确定" })}
          cancelText={intl.formatMessage({ id: "pages.cancel", defaultMessage: "取消" })}
          onOk={addApplication}
          onCancel={() => {
            setPageType("")
            setVisible(false)
          }}
        >
          <Form
            form={addForm}
            name="advanced_search"
            className="ant-advanced-search-form"
            preserve={false}
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 16 }}
          >
            {
              isAppInit ? tempCommonForm() : (
                <>
                  {terminalTypeItem({})}
                  <Form.Item
                    name="needAppPage"
                    label={intl.formatMessage({ id: 'pages.appInfo.page.needAppPage":', defaultMessage: '是否有app页面' })}
                    hidden={addForm.getFieldValue("terminalType") == 2}
                    initialValue={false}
                  >
                    <Switch />
                  </Form.Item>
                  {pageNameComp()}
                  <Form.Item
                    name="pageType"
                    label={intl.formatMessage({ id: 'pages.appInfo.page.table.pageType', defaultMessage: '页面类型' })}
                    rules={[{
                      required: true,
                      message: intl.formatMessage({ id: 'pages.appInfo.page.table.pageType.placeholder', defaultMessage: '请选择页面类型' })
                    }]}
                  >
                    <Select
                      showSearch
                      onChange={onPageTypeChange}
                      placeholder={intl.formatMessage({ id: 'pages.appInfo.page.table.pageType.placeholder', defaultMessage: '请选择页面类型' })}
                      options={dicList?.map(item => ({ value: item.constantValue, label: item.constantKey }))}
                    />
                  </Form.Item>
                  {groupCodeComp(true)}
                  {
                    pageType && (
                      <Form.Item
                        name="templateId"
                        label={intl.formatMessage({ id: 'pages.appInfo.page.table.tempName', defaultMessage: '页面模板' })}
                      >
                        <Select
                          placeholder={intl.formatMessage({
                            id: 'pages.appInfo.page.table.tempName.placeholder',
                            defaultMessage: '请选择页面模板'
                          })}
                          options={templateList?.map(item => ({ label: item.tempName, value: item.tempId }))}
                        />
                      </Form.Item>
                    )
                  }
                  {
                    (pageType === '2' || pageType === '0') && (
                      <>
                        <Form.Item
                          name="datasourceId"
                          label={intl.formatMessage({ id: 'pages.appInfo.page.table.datasourceId', defaultMessage: '数据源' })}
                          rules={[{
                            required: true,
                            message: intl.formatMessage({ id: 'pages.appInfo.page.table.datasourceId.placeholder', defaultMessage: '请选择数据源' })
                          }]}
                        >
                          <Select
                            showSearch
                            onChange={onDatabaseChange}
                            options={addFormInfo?.dataList?.map(item => ({ value: item.datasourceId, label: item.datasourceName }))}
                          />
                        </Form.Item>
                        <Form.Item
                          name="tableName"
                          label={intl.formatMessage({ id: 'pages.appInfo.page.table.tableName', defaultMessage: '数据表' })}
                          rules={[{
                            required: true,
                            message: intl.formatMessage({ id: 'pages.appInfo.page.table.datasourceId.placeholder', defaultMessage: '请选择数据源' })
                          }]}
                        >
                          <Select
                            showSearch
                            options={tables}
                          />
                        </Form.Item>
                      </>
                    )
                  }
                  {pageDescComp()}
                </>
              )
            }
          </Form>
        </Modal>
        {/* 重命名 */}
        <Modal
          title={rowActiveType === "edit" ? intl.formatMessage({ id: "table.actions.edit", defaultMessage: "编辑" }) : intl.formatMessage({ id: 'pages.appInfo.page.table.action.copy' })}
          open={renameVisible}
          okText={intl.formatMessage({ id: "pages.ok", defaultMessage: "确定" })}
          cancelText={intl.formatMessage({ id: "pages.cancel", defaultMessage: "取消" })}
          onOk={renameSave}
          onCancel={() => setRenameVisible(false)}>
          <Form
            form={nameForm}
            name="advanced_search"
            className="ant-advanced-search-form"
            preserve={false}
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 16 }}
          >
            {
              isAppInit ? tempCommonForm() : (
                <>
                  {terminalTypeItem({ disabled: true })}
                  {
                    activeRow.terminalType != 2 ? (<Form.Item
                      name="appPageId"
                      label={intl.formatMessage({ id: 'pages.appInfo.page.table.appPage', defaultMessage: '关联app页面' })}
                    >
                      <Select
                        options={appPages}
                        showSearch
                        optionFilterProp='label'
                        allowClear
                      />
                    </Form.Item>) : null
                  }
                  {pageNameComp()}
                  {
                    rowActiveType === "edit" ? (
                      <>
                        {groupCodeComp(true)}
                        {pageDescComp()}
                      </>
                    ) : null
                  }
                </>
              )
            }
          </Form>
        </Modal>
        {/* 回退版本 */}
        <Modal
          title={intl.formatMessage({ id: "table.action.resetVersion" })}
          open={revertVisible}
          okText={intl.formatMessage({ id: "pages.ok", defaultMessage: "确定" })}
          cancelText={intl.formatMessage({ id: "pages.cancel", defaultMessage: "取消" })}
          onOk={revertSave}
          onCancel={() => setRevertVisible(false)}>
          <Form
            form={revertForm}
            name="advanced_search"
            className="ant-advanced-search-form"
            preserve={false}
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 16 }}
          >
            <Form.Item
              name="deployId"
              label={intl.formatMessage({ id: 'pages.table.version', defaultMessage: '版本号' })}
              rules={[{ required: true, message: intl.formatMessage({ id: 'pages.table.version.placeholder', defaultMessage: '请选择版本号' }) }]}
            >
              <Select
                placeholder={intl.formatMessage({ id: 'pages.table.version.placeholder', defaultMessage: '请选择版本号' })}
                options={versionList}
              />
            </Form.Item>
          </Form>
        </Modal>
        <Modal
          title={intl.formatMessage({ id: "pages.app.role.drawer.btn.revertUser" })}
          open={assignVisible}
          okText={intl.formatMessage({ id: "pages.ok", defaultMessage: "确定" })}
          cancelText={intl.formatMessage({ id: "pages.cancel", defaultMessage: "取消" })}
          onOk={assignSave}
          onCancel={() => setAssignVisible(false)}>
          <Form
            form={assignForm}
            name="advanced_search"
            className="ant-advanced-search-form"
            preserve={false}
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 16 }}
          >
            <Form.Item
              name="userId"
              label={intl.formatMessage({ id: 'pages.table.transferor' })}
              rules={[{ required: true, message: intl.formatMessage({ id: 'pages.table.transferor.placeholder' }) }]}
            >
              <Select
                allowClear
                options={userList}
                placeholder={intl.formatMessage({ id: 'pages.table.transferor.placeholder' })}
              />
            </Form.Item>
          </Form>
        </Modal>
      </Spin>
    </Card >
  )
}

export default Page
