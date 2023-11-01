// import { Button, message, Modal, Table } from 'antd'
// import { ReactNode, useCallback, useRef } from 'react'
// import { useIntl } from "@@/plugin-locale/localeExports";
// import TopBar from "@/components/TopBar";
// import { useLcPrefix } from "@/hooks/useLcPrefix";
// import "./style.less";
// import { useData } from "@/hooks/useData";
// import publishApi, { PublishedAppType } from "@/services/custom/appInfo/publish";
// import LcForm, { FieldProps } from "@/components/LcForm";
// import LcModal from "@/components/LcModal";
// import { useVisible } from "@/hooks/useVisible";
// import { CompTypeEnum } from "@/constant/comps";
// import { useSubmit } from "@/hooks/useSubmit";
// import { usePagination } from "@/hooks/usePagination";
// import { FormItemTypes } from "@/setters/api-setter";

// const useColumns = (renderActions: (_: string, record: PublishedAppType) => ReactNode[]) => {
//   const intl = useIntl();
//   return [
//     { dataIndex: 'deployName', title: intl.formatMessage({ id: 'pages.app.publish.table.column.name' }) },
//     { dataIndex: 'deployVersion', title: intl.formatMessage({ id: 'pages.app.publish.table.column.version' }) },
//     // { dataIndex: 'deployPath', title: intl.formatMessage({ id: 'pages.app.publish.table.column.path' }) },
//     { dataIndex: 'createUser', title: intl.formatMessage({ id: 'pages.app.publish.table.column.createUser' }) },
//     { dataIndex: 'createDate', title: intl.formatMessage({ id: 'pages.app.publish.table.column.createDate' }) },
//     {
//       dataIndex: 'activeFlag', title: intl.formatMessage({ id: 'pages.app.publish.table.column.active' }),
//       render: (_: number) => {
//         return _ === 1 ? intl.formatMessage({ id: 'pages.app.publish.table.column.active.yes' }) :
//           intl.formatMessage({ id: 'pages.app.publish.table.column.active.no' })
//       }
//     },
//     {
//       dataIndex: 'actions', title: intl.formatMessage({ id: 'pages.app.publish.table.column.actions' }),
//       render: renderActions
//     },
//   ]
// }

// const useFields = (): FieldProps[] => {
//   const intl = useIntl();
//   return [
//     {
//       compType: CompTypeEnum.TextInput,
//       itemProps: {
//         name: 'deployName',
//         label: intl.formatMessage({ id: 'pages.app.publish.table.column.name' }),
//         rules: [{ required: true }],
//       }
//     },
//     // {
//     //   compType: CompTypeEnum.TextInput,
//     //   itemProps: {
//     //     name: 'deployPath',
//     //     label: intl.formatMessage({ id: 'pages.app.publish.table.column.path' }),
//     //     rules: [{ required: true }],
//     //   }
//     // },
//     {
//       compType: CompTypeEnum.TextInput,
//       itemProps:
//       {
//         name: 'deployVersion',
//         label: intl.formatMessage({ id: 'pages.app.publish.table.column.version' }),
//         rules: [{ required: true }],
//       }
//     },
//   ]
// }

// const useEnvFields = (): FieldProps[] => {
//   const intl = useIntl();
//   const { data = [] } = useData(() => publishApi.getEnvs().then(res => {
//     if (res.success) {
//       return res.data.map(item => ({value: item.envId, label: item.envName}))
//     }
//     return [];
//   }))
//   return [
//     {
//       compType: CompTypeEnum.Selector,
//       itemProps: {
//         name: 'env',
//         label: intl.formatMessage({ id: 'pages.app.publish.table.column.env', defaultMessage: '选择环境' }),
//         rules: [{ required: true }],
//       },
//       compProps: {
//         allowClear: true,
//         options: data
//       }
//     },
//   ]
// }

// function Publish() {
//   const intl = useIntl();
//   const prefixCls = useLcPrefix('app-publish');

//   const { data = {}, loading, loadData } = useData((params) => publishApi.getList(params).then(res => {
//     if (res.success) {
//       return res.data
//     }
//     return {};
//   }))

//   const renderActions = useCallback((_, record: PublishedAppType) => {
//     return [
//       <a
//         key="delete"
//         onClick={() => Modal.confirm({
//           title: intl.formatMessage({ id: 'table.actions.delete.confirm' }),
//           onOk: () => {
//             publishApi.deleteApp(record.deployId!).then(res => {
//               if (res.success) {
//                 loadData();
//                 message.success(intl.formatMessage({ id: 'pages.delete.success' }));
//               }
//             })
//           },
//         })}
//       >
//         {intl.formatMessage({ id: 'table.actions.delete' })}
//       </a>,
//     ]
//   }, []);
//   const columns = useColumns(renderActions);
//   const fields = useFields();
//   const envFields = useEnvFields();
//   const { formRef, onValidate } = useSubmit();
//   const { visible, onOpen, onClose } = useVisible();
//   const modeTypeRef = useRef('publish');
//   const onEnvPublish = () => {
//     modeTypeRef.current = 'env'
//     onOpen()
//   }
//   const { list, total } = data as API.PageData<PublishedAppType[]>;
//   const pagination = usePagination({
//     total,
//     onChange: (page: number, pageSize: number) => {
//       loadData({ current: page, size: pageSize });
//     },
//   })

//   const onOk = () => {
//     onValidate().then((values) => {
//       if (modeTypeRef.current === 'env') {
//         publishApi.publishEnvApp(values).then(res => {
//           if (res.success) {
//             onClose();
//             message.success(intl.formatMessage({ id: `pages.app.publish.success`, defaultMessage: '同步成功' }))
//           }
//         })
//         return
//       }
//       publishApi.publishApp(values).then(res => {
//         if (res.success) {
//           onClose();
//           loadData();
//           message.success(intl.formatMessage({ id: `pages.app.publish.success` }))
//         }
//       })
//     })
//   }
//   return (
//     <div className={prefixCls}>
//       <h3>{intl.formatMessage({ id: `pages.app.publish.title` })}</h3>
//       <TopBar style={{justifyContent: 'flex-start', gap: 20}}>
//         <Button
//           type='primary'
//           onClick={() => {
//             modeTypeRef.current = 'publish'
//             onOpen()
//           }}
//         >
//           {intl.formatMessage({ id: `pages.app.publish.top.bar.publish` })}
//         </Button>
//         <Button
//           type='primary'
//           onClick={onEnvPublish}
//         >
//           {intl.formatMessage({ id: `pages.app.publish.top.bar.env`, defaultMessage: '环境同步' })}
//         </Button>
//       </TopBar>
//       <Table
//         rowKey={'deployId'}
//         columns={columns}
//         loading={loading}
//         dataSource={list}
//         pagination={pagination}
//       />
//       <LcModal
//         title={intl.formatMessage({ id: 'pages.app.publish.top.bar.publish' })}
//         visible={visible}
//         onCancel={onClose}
//         onOk={onOk}
//       >
//         <LcForm
//           ref={formRef}
//           fields={modeTypeRef.current === 'env' ? envFields : fields}
//         />
//       </LcModal>
//     </div>
//   )
// }

// export default Publish

import Preview from "@/components/Preview";

function Publish() {
  return (
    <Preview pageId="063035788176650240" />
  )
}

export default Publish