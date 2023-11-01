import {
  Button,
  Col,
  Form,
  FormInstance,
  FormProps,
  Input,
  message,
  Modal,
  PaginationProps,
  Row
} from 'antd';
import { useLcPrefix } from "@/hooks/useLcPrefix";
import "./style.less";
import { useIntl } from "@@/plugin-locale/localeExports";
import {
  DEFAULT_TABLE_VALUES_KEYS,
  useActions,
  useColumns,
  useDatabaseFields,
  useDefaultTableValues,
  useTableFields
} from "@/pages/platform/datasource/hooks";
import datasourceApi, {
  TableFieldType,
  TableListData
} from "@/services/custom/platform/service";
import LeftTree from "@/components/LeftTree";
import { useData } from "@/hooks/useData";
import React, {
  forwardRef,
  useCallback,
  useContext,
  useImperativeHandle,
  useMemo,
  useRef,
  useState
} from 'react';
import { useActionReducer } from "@/hooks/useActionReducer";
import LcModal from "@/components/LcModal";
import { ActionCtx } from "@/context/actions";
import Ermodel from './erModel';
import DTable from '@/components/DTable';
import DButton from '@/components/DButton';
import { FormattedMessage } from 'umi';
import { PreviewProvider } from "@/provider/preview";
import { useVisible } from "@/hooks/useVisible";

const TopBar = () => {
  const intl = useIntl();
  const prefixCls = useLcPrefix('top-bar');
  const {
    handleVisible,
    dispatch
  } = useContext(ActionCtx);

  return (
    <div className={prefixCls}>
      <DButton
        type={'primary'}
        onClick={() => {
          dispatch({ type: 'create' })
          handleVisible?.(true)
        }}
      >
        {intl.formatMessage({ id: 'pages.platform.datasource.table.create' })}
      </DButton>
      {/*<Input.Search*/}
      {/*  placeholder={intl.formatMessage({ id: 'pages.platform.datasource.table.search.placeholder' })}*/}
      {/*  style={{ width: 200 }}*/}
      {/*/>*/}
    </div>
  )
}

interface RightContentProps {
  isPlatform?: boolean;
}

export const RightContent = forwardRef(({ isPlatform }: RightContentProps, ref) => {
  const [form] = Form.useForm();
  const formRef = useRef<{ form: FormInstance }>();
  const rightContentRef = useRef<any>({});
  const intl = useIntl();
  const prefixCls = useLcPrefix('right-content');
  const {
    visible,
    handleVisible,
    onClose,
  } = useVisible();
  const {
    state,
    dispatch
  } = useActionReducer();
  const [drawVisible, setDrawVisible] = useState(false)
  const [activeRow, setActiveRow] = useState<TableListData>()
  const fields = useTableFields(formRef, state.type === 'view');

  // 点击搜索
  const onFinish = (values: any) => {
    const formParam = { ...rightContentRef.current.params, ...values };
    console.log(3454, { values, formParam })
    loadData({
      ...formParam,
      current: 1,
      size: 10
    });
  };
  const getTableData = (params: any): Promise<API.PageData<TableListData[]>> => {

    const newParams = { ...rightContentRef.current.params, ...params };
    rightContentRef.current.params = newParams;
    if (!newParams?.id) {
      return Promise.resolve<API.PageData<TableListData[]>>({
        hasNextPage: false,
        list: [],
        total: 0
      });
    }

    return datasourceApi.getTableList(newParams).then(res => {
      return res.data || {}
    })
  }
  const {
    data = {},
    loading,
    loadData
  } = useData<API.PageData<TableListData[]>>(getTableData, true);

  const renderActions = useCallback((_, record: TableListData) => {
    return [
      // <a
      //   key="erp"
      //   onClick={() => {
      //     setActiveRow(record)
      //     setDrawVisible(true)
      //   }}
      //   style={{
      //     marginRight: '10px',
      //     display: isPlatform ? 'none' : 'inline-block'
      //   }}
      // >
      //   {intl.formatMessage({ id: 'pages.platform.datasource.table.ermoel' })}
      // </a>,
      <a
        key="view"
        style={{
          marginRight: '10px',
          display: isPlatform ? 'none' : 'inline-block'
        }}
        onClick={() => {
          datasourceApi.getTableDetailInfo({
            "datasourceId": rightContentRef.current.params.id,
            "tableName": record.tableName
          }).then(res => {
            const dataSource = res.data.columns?.map((item: any) => {
              return {
                fieldName: item.columnName,
                fieldDesc: item.comments,
                fieldLength: item.precisions,
                fieldType: item.jdbcType,
                unique: item.uniques,
                decimals: item.scales,
                default: item.defaultValue,
                notNull: item.notNull,
              }
            })
            dispatch({
              type: 'edit',
              data: {
                name: res.data.tableName,
                description: res.data.comments,
                datasourceId: res.data.dataSourceId,
                columns: dataSource
              }
            })
            handleVisible(true)
            return res
          });
        }}
      >
        {intl.formatMessage({ id: 'pages.platform.datasource.form.edit' })}
      </a>,
      // <a
      //   key="delete"
      //   onClick={() => Modal.confirm({
      //     title: intl.formatMessage({ id: 'pages.platform.datasource.form.confirmTitle' }),
      //     onOk: () => {
      //       setActiveRow(record)
      //       datasourceApi.deleteTable(record.id).then(res => {
      //         if (res.success) {
      //           loadData?.();
      //           message.success(intl.formatMessage({ id: 'pages.delete.success' }));
      //         }
      //       })
      //     },
      //   })}
      // >
      //   {intl.formatMessage({ id: 'pages.platform.datasource.form.delete' })}
      // </a>,
    ]
  }, [
    dispatch,
    intl,
    isPlatform,
    loadData
  ]);
  const columns = useColumns(renderActions, isPlatform);

  const {
    list: dataSource,
    total
  } = data as API.PageData<TableListData[]>;
  const pagination: PaginationProps = {
    ...rightContentRef.current.params,
    pageSize: rightContentRef.current?.params?.size,
    total,
    onChange: (page: number, pageSize: number) => {
      loadData({
        current: page,
        size: pageSize
      });
    },
    // showTotal: (totalRows: number) =>
    //   `${intl.formatMessage({ id: 'pages.platform.datasource.table.total' })} ${totalRows}`
  }

  const defaultTableFieldsValue = useDefaultTableValues();

  const formProps: FormProps = {
    layout: 'vertical',
    labelCol: undefined,
    wrapperCol: undefined,
    initialValues: state?.type === 'view' ? state.data : {
      columns: defaultTableFieldsValue
    }
  };

  const onOk = () => {
    formRef.current?.form.validateFields().then(values => {
      if (values) {
        datasourceApi.createTable({
          ...values,
          dataSourceId: rightContentRef.current.params?.id,
          columns: values.columns.filter((column: TableFieldType) =>
            !DEFAULT_TABLE_VALUES_KEYS.includes(column.fieldName)),
        }).then((res) => {
          if (res.success) {
            onClose();
            loadData();
          }
        });
      }
    })
  }

  const titleMap = {
    create: intl.formatMessage({ id: 'pages.platform.datasource.form.create' }),
    edit: intl.formatMessage({ id: 'pages.platform.datasource.form.edit' }),
    delete: intl.formatMessage({ id: 'pages.platform.datasource.form.delete' }),
    view: intl.formatMessage({ id: 'pages.platform.datasource.form.view' }),
  }

  useImperativeHandle(ref, () => ({
    loadData
  }), []);

  const modalParams = useMemo(() => {
    return {
      params: {
        dataSourceId: rightContentRef.current?.params?.id,
        tableName: state?.data?.name,
      },
      methods: {
        close: () => {
          onClose();
          if (state?.type !== "view") {
            loadData();
          }
        },
      }
    }
  },
    [
      onClose,
      loadData,
      state,
      rightContentRef.current?.params?.id
    ]
  );
  return (
    <div className={prefixCls}>
      <div className='search_box'>
        <Form
          form={form}
          name="model_search"
          className="ant-advanced-search-form"
          onFinish={onFinish}
        >
          <Row gutter={24}>
            <Col span={8}>
              <Form.Item
                name="tableName"
                label={intl.formatMessage({
                  id: 'pages.table.code',
                  defaultMessage: '数据表编码'
                })}
              >
                <Input
                  placeholder={intl.formatMessage({
                    id: 'pages.table.code.placeholder',
                    defaultMessage: '请输入表编码'
                  })}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="comments"
                label={intl.formatMessage({
                  id: 'pages.table.name',
                  defaultMessage: '数据表名称'
                })}
              >
                <Input
                  placeholder={intl.formatMessage({
                    id: 'pages.table.name.placeholder',
                    defaultMessage: '请输入表名'
                  })}
                />
              </Form.Item>
            </Col>
            <Button
              type="primary"
              htmlType="submit"
            >
              <FormattedMessage
                id="pages.search"
                defaultMessage='搜索'
              />
            </Button>
            <Button
              style={{ margin: '0 8px' }}
              onClick={() => {
                form.resetFields();
                const formParams = {
                  ...rightContentRef.current.params,
                  ...form.getFieldsValue()
                };
                loadData(formParams)
              }}
            >
              <FormattedMessage
                id="pages.reset"
                defaultMessage='重置'
              />
            </Button>
          </Row>
        </Form>
      </div>
      <ActionCtx.Provider
        value={{
          dispatch,
          handleVisible
        }}
      >
        <TopBar />
      </ActionCtx.Provider>
      <DTable
        rowKey={'id'}
        loading={loading}
        size='small'
        columns={columns}
        dataSource={dataSource}
        pagination={pagination}
      />
      <LcModal
        visible={visible}
        onCancel={onClose}
        onOk={onOk}
        title={titleMap[state?.type || 'create']}
        footer={null}
      >
        {/*{visible && <LcForm*/}
        {/*  ref={formRef}*/}
        {/*  fields={fields}*/}
        {/*  readOnly={state?.type === 'view'}*/}
        {/*  formProps={formProps}*/}
        {/*/>}*/}
        {
          visible && (
            <PreviewProvider
              pageId={"113953010378993664"}
              modalParams={modalParams}
            />
          )
        }
      </LcModal>
      <Ermodel
        visible={drawVisible}
        activeRow={activeRow as TableListData}
        closeDrawer={(show: boolean) => setDrawVisible(show)}
      />
    </div>
  )
})

const DataSourceManagement = () => {
  const prefixCls = useLcPrefix('datasource-management');
  const formProps = {
    initialValues: {
      type: '0'
    }
  }
  const intl = useIntl();
  const dataSourceRef = useRef<(hidden: boolean) => void>(() => { });
  const rightContentRef = useRef<any>();
  const fields = useDatabaseFields(dataSourceRef);
  const actions = useActions(dataSourceRef);
  const renderTitle = (type: string) => {
    const titleMap = {
      create: intl.formatMessage({ id: 'pages.platform.datasource.form.create' }),
      edit: intl.formatMessage({ id: 'pages.platform.datasource.form.edit' }),
      delete: intl.formatMessage({ id: 'pages.platform.datasource.form.delete' }),
      view: intl.formatMessage({ id: 'pages.platform.datasource.form.view' }),
    }
    return titleMap[type]
  }

  const onMenuChange = (id: string) => {
    rightContentRef.current?.loadData({
      id,
      current: 1,
      size: 10
    })
  }

  const getTreeData = () => {
    return datasourceApi.getDatabaseList().then((res) => {
      if (res.success) {
        return res.data.map(item => {
          return {
            key: item.datasourceId,
            title: (
              <LeftTree.TreeNodeTitle
                title={item.datasourceName}
                id={item.datasourceId}
                actions={actions}
              />
            )
          }
        })
      }
      return [];
    })
  }

  return (
    <div className={prefixCls}>
      <LeftTree
        onSave={datasourceApi.createDataSource}
        getList={getTreeData}
        treeTitle={intl.formatMessage({ id: 'pages.platform.datasource.tree.title' })}
        modalProps={{
          title: renderTitle,
          okText: intl.formatMessage({ id: 'pages.platform.datasource.modal.okText' })
        }}
        onMenuChange={onMenuChange}
        fields={fields}
        formProps={formProps}
      />
      <RightContent
        ref={rightContentRef}
        isPlatform
      />
    </div>
  )
};

export default DataSourceManagement;
