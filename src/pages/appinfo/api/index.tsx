import { useLcPrefix } from "@/hooks/useLcPrefix";
import { Button, Col, Form, Input, message, Modal, Row, Table } from "antd";
import { useIntl } from "@@/plugin-locale/localeExports";
import LcForm, { FieldProps } from "@/components/LcForm";
import { CompTypeEnum } from "@/constant/comps";
import TopBar from "@/components/TopBar";
import LcModal from "@/components/LcModal";
import { useData } from "@/hooks/useData";
import { useCallback, useState } from "react";
import { useSubmit } from "@/hooks/useSubmit";
import { useVisible } from "@/hooks/useVisible";
import { usePagination } from "@/hooks/usePagination";
import "./style.less";
import cn from "classnames";
import apiService, { ApiType } from "@/services/custom/appInfo/apiService";
import dataDictApi from "@/services/dataDict";
import { ProgressDataType, RenderAction } from "@/types/common";
import { useActionReducer } from "@/hooks/useActionReducer";
import templateApi, { templateDataSource } from "./template";
import { FormattedMessage } from 'umi';
import type { TablePaginationConfig } from 'antd/lib/table';

const useColumns = (renderActions: RenderAction) => {
  const intl = useIntl();
  return [
    {
      dataIndex: 'name',
      title: intl.formatMessage({ id: 'pages.app.api.name', defaultMessage: '数据源ID' })
    },
    {
      dataIndex: 'uri',
      title: intl.formatMessage({ id: 'pages.app.api.uri', defaultMessage: '请求地址' })
    },
    {
      dataIndex: 'method',
      title: intl.formatMessage({ id: 'pages.app.api.method', defaultMessage: '请求方法' })
    },
    {
      dataIndex: 'isCors',
      title: intl.formatMessage({ id: 'pages.app.api.is-cors', defaultMessage: '是否支持跨域' }),
      render: (text: number) => {
        return intl.formatMessage({ id: text ? 'pages.app.api.yes' : 'pages.app.api.no' })
      }
    },
    {
      dataIndex: 'timeout',
      title: intl.formatMessage({ id: 'pages.app.api.timeout', defaultMessage: '超时时长（毫秒）' }),
    },
    {
      fixed: 'right',
      dataIndex: 'actions', title: intl.formatMessage({ id: 'table.actions' }),
      render: renderActions
    },
  ]
}
const useFields = (): FieldProps[] => {
  const intl = useIntl();
  const { data } = useData(() => dataDictApi.query(undefined, ['postMethod'])
    .then(res => res.success ? res.data
      .map((item: any) => ({ value: item.constantKey, label: item.description })) : []))
  return [
    {
      compType: CompTypeEnum.TextInput,
      itemProps: {
        name: 'name',
        label: intl.formatMessage({ id: 'pages.app.api.name' }),
        rules: [{ required: true }],
      }
    },
    {
      compType: CompTypeEnum.TextInput,
      itemProps: {
        name: 'uri',
        label: intl.formatMessage({ id: 'pages.app.api.uri' }),
        rules: [{ required: true }],
      }
    },
    {
      compType: CompTypeEnum.Editor,
      itemProps: {
        name: 'params',
        label: intl.formatMessage({ id: 'pages.app.api.params' }),
        initialValue: '{ \r\n}'
      },
      compProps: {
        language: 'json',
        defaultValue: '{ \r\n}'
      }
    },
    {
      compType: CompTypeEnum.Selector,
      itemProps: {
        name: 'method',
        label: intl.formatMessage({ id: 'pages.app.api.method' }),
        rules: [{ required: true }],
      },
      compProps: {
        options: data
      }
    },
    {
      compType: CompTypeEnum.Switcher,
      itemProps: {
        name: 'isCors',
        valuePropName: "checked",
        label: intl.formatMessage({ id: 'pages.app.api.is-cors' }),
        rules: [{ required: true }],
      },
    },
    {
      compType: CompTypeEnum.NumberInput,
      itemProps: {
        name: 'timeout',
        label: intl.formatMessage({ id: 'pages.app.api.timeout' }),
        initialValue: 10000
      },
      compProps: {
        min: 0,
        precision: 0,
        defaultValue: 10000
      }
    },
    {
      compType: CompTypeEnum.TextArea,
      itemProps: {
        name: 'headers',
        label: intl.formatMessage({ id: 'pages.app.api.headers' }),
        initialValue: '{\r\n' +
          '      "Accept": "application/json",\r\n' +
          '      "Content-Type": "application/json"\r\n' +
          '    }'
      },
      compProps: {
        language: 'json',
        defaultValue: '{\r\n' +
          '      "Accept": "application/json",\r\n' +
          '      "Content-Type": "application/json"\r\n' +
          '    }'
      }
    },
    {
      compType: CompTypeEnum.Editor,
      itemProps: {
        name: 'shouldRequest',
        label: intl.formatMessage({ id: 'pages.app.api.should-request' }),
        initialValue: 'function count(params, systemParams) {\r\n   return true \r\n }'
      },
      compProps: {
        defaultValue: 'function count(params, systemParams) {\r\n   return true \r\n }'
      }
    },
    {
      compType: CompTypeEnum.Editor,
      itemProps: {
        name: 'beforeRequest',
        label: intl.formatMessage({ id: 'pages.app.api.before-request' }),
        initialValue: 'function before(params, systemParams) {\r\n   return params \r\n }'
      },
      compProps: {
        defaultValue: 'function before(params, systemParams) {\r\n   return params \r\n }'
      }
    },
    {
      compType: CompTypeEnum.Editor,
      itemProps: {
        name: 'onSuccess',
        label: intl.formatMessage({ id: 'pages.app.api.on-success' }),
        initialValue: 'function success(res) {\r\n return res \r\n }'
      },
      compProps: {
        defaultValue: 'function success(res) {\r\n return res \r\n }'
      }
    },
    {
      compType: CompTypeEnum.Editor,
      itemProps: {
        name: 'onError',
        label: intl.formatMessage({ id: 'pages.app.api.on-error' }),
        initialValue: 'function fail(err) {\r\n return err \r\n }'
      },
      compProps: {
        defaultValue: 'function fail(err) {\r\n return err \r\n }'
      }
    },
  ]
}

const ApiManagement = () => {
  const prefixCls = useLcPrefix('api-management');
  const intl = useIntl();
  // 点击搜索
  const onFinish = (values: any) => {
    const formParam = { ...values };
    loadData(formParam);
  };
  const { data = {}, loading, loadData } = useData((params) => apiService.getApiPageData(params))
  const fields = useFields();
  const { formRef, onValidate, } = useSubmit();
  const { visible, onOpen, onClose } = useVisible();
  const { state, dispatch } = useActionReducer();
  const [form] = Form.useForm();
  const renderActions = useCallback((_, record: ApiType) => {
    return [
      <a
        key="edit"
        onClick={() => apiService.getDetail(record.id!).then(res => {
          onOpen();
          dispatch({
            type: 'edit',
            data: res
          });
        })}
      >
        {intl.formatMessage({ id: 'table.actions.edit' })}
      </a>,
      <a
        key="view"
        onClick={() => apiService.getDetail(record.id!).then(res => {
          onOpen();
          dispatch({
            type: 'view',
            data: res
          });
        })}
      >
        {intl.formatMessage({ id: 'table.actions.view' })}
      </a>,
      <a
        key="delete"
        onClick={() => Modal.confirm({
          title: intl.formatMessage({ id: 'table.actions.delete.confirm' }),
          onOk: () => {
            apiService.del(record.id!).then(res => {
              if (res.success) {
                loadData();
                message.success(intl.formatMessage({ id: 'pages.delete.success' }));
              }
            })
          },
        })}
      >
        {intl.formatMessage({ id: 'table.actions.delete' })}
      </a>,
    ]
  }, []);
  const columns = useColumns(renderActions);
  const { list, total } = data as API.PageData<ApiType[]>;
  const pagination = usePagination({
    total,
    onChange: (page: number, pageSize: number) => {
      loadData({ current: page, size: pageSize });
    },
  })
  const title = intl.formatMessage({ id: 'pages.app.api.modal.title' })
  const onOk = () => {
    onValidate().then((values) => {
      apiService.save({ ...values, id: state?.data?.id }).then(res => {
        if (res.success) {
          onClose();
          loadData();
        }
      })
    })
  }

  const addApi = () => {
    dispatch({
      type: 'add',
      data: {
        timeout: 10000,
        method: "POST"
      }
    });
    onOpen()
  }

  return (
    <div className={cn(prefixCls, 'lc-admin-table')}>
      <h3>{intl.formatMessage({ id: `pages.app.api.title` })}</h3>
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
                name="apiName"
                label={intl.formatMessage({ id: 'pages.API.name', defaultMessage: 'API名' })}
              >
                <Input placeholder={intl.formatMessage({ id: 'pages.API.name.placeholder', defaultMessage: '请选择API名' })} />
              </Form.Item>
            </Col>
            <Col span={12}></Col>
            <Button type="primary" htmlType="submit">
              <FormattedMessage id="pages.search" defaultMessage='搜索' />
            </Button>
            <Button
              style={{ margin: '0 8px' }}
              onClick={() => {
                form.resetFields();
                const formParams = { apiName: '' };
                loadData(formParams)
              }}
            >
              <FormattedMessage id="pages.reset" defaultMessage='重置' />
            </Button>
          </Row>
        </Form>
      </div>
      <TopBar>
        <Button
          type='primary'
          onClick={() => addApi()}
        >
          {intl.formatMessage({ id: `table.actions.create` })}
        </Button>
      </TopBar>
      <Table
        rowKey={'appId'}
        columns={columns}
        loading={loading}
        dataSource={list}
        pagination={pagination}
      />
      <LcModal
        title={intl.formatMessage({ id: `table.actions.${state?.type}` }) + title}
        visible={visible}
        onCancel={onClose}
        onOk={onOk}
        footer={state?.type === 'view' ? null : undefined}
      >
        {
          visible && (
            <>
              {/* <div className="api-tip">
                <div>请注意：请求参数设置之后，请求数据时会自动赋值。每个参数须遵循以下规则，否则字段可能会找不到值。</div>
                <p>1. 参数名如果没有设置nextFieldsType，则该字段名会被当做是静态数据，不会重新赋值。如：<span>{`username: 张三`}</span></p>
                <p>2. 参数字段名应该和设置时的数据字段保持一致，如果不能保持一致，请设置nextFieldsAlias，他会重新匹配并赋值。</p>
                <p>3. 暂不支持数组的赋值，如果有数组的，请去参数处理那里赋值</p>
                <p>4. 不要在data里面定义一下字段名：source、appId、operator、lang、traceId、version，否则会被系统参数覆盖。</p>
                <p>5. 如果预设参数找不到，仍然可以去请求参数那里去处理入参。</p>
                <p>6. contain类型，格式如下如：{`user$:{nextFieldsType: contain};值会带上%%`}。</p>
                <p>7. between类型，格式如下如：{`user%:{nextFieldsType: between};`}。</p>
                <p>8. 其他类型只需要填写字段名，不用设置特殊符号。如：{`user: {nextFieldsType: notEqual}`}</p>
                <p>9. 参数名设置了nextFieldsType，nextFieldsType映射了APIJSON的查询操作符。可参考：https://taxbps.yuque.com/mwtfo8/gafcua/izgazu398389p2k1#pSipF。这个nextFieldsType对应的类型如下：</p>
                <Table
                  bordered
                  pagination={false}
                  columns={[
                    {
                      title: intl.formatMessage({ id: 'pages.platform.datasource.form.table.fieldType' }),
                      dataIndex: 'type',
                    },
                    {
                      title: intl.formatMessage({ id: 'pages.platform.datasource.form.table.string' }),
                      dataIndex: 'search',
                    }
                  ]}
                  size="small"
                  rowKey="id"
                  dataSource={templateDataSource}
                />
              </div> */}
              <LcForm
                ref={formRef}
                fields={fields}
                readOnly={state?.type === 'view'}
                formProps={{
                  initialValues: { isCors: true, ...state?.data }
                }}
              />
            </>
          )
        }
      </LcModal>
    </div>
  )
};

export default ApiManagement;
