import { LangListType, NodeNameItemType } from '@/pages/progress/type'
import { getLocaleLanguage, LangType } from '@/utils/utils'
import { EditableProTable, ProColumns } from '@ant-design/pro-components'
import { FormInstance, Modal, notification } from 'antd'
import { useEffect, useState } from 'react'
import { useIntl } from 'umi'

type Props = {
  form: FormInstance<any>,
  langDataSource: NodeNameItemType[]
  changeDataSource: React.Dispatch<React.SetStateAction<NodeNameItemType[]>>,
  visible: boolean,
  changeVisible: React.Dispatch<React.SetStateAction<boolean>>,
  langList: LangListType
}

function InputModal(props: Props) {
  const intl = useIntl()
  // const { state, dispatch } = useContext(ProgressModal)
  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>([]);
  const [dataSource, setDataSource] = useState<NodeNameItemType[]>([]);

  useEffect(() => {
    if (props.langDataSource.length > 0) {
      const newData = JSON.parse(JSON.stringify(props.langDataSource))
      setEditableRowKeys(() => newData.map((item: { id: number }) => item.id))
      setDataSource(newData)
    } else {
      setDataSource([])
    }
  }, [props.langDataSource])

  const sureModal = () => {
    const localLang = getLocaleLanguage()
    if (dataSource.length === 0) {
      notification.error({
        message: intl.formatMessage({ id: 'pages.model.watch', defaultMessage: '请注意' }),
        description: intl.formatMessage({ id: 'component.customPanel.modal.field.placeholder' })
      })
      return
    }
    let flag = false
    let hasLocalLangValue = false
    const arr: string[] = []
    dataSource.forEach((item: NodeNameItemType) => {
      if (!item.languageCode || !item.value) {
        flag = true
      }
      if (item.languageCode) {
        arr.push(item.languageCode as string)
        if (item.languageCode === localLang && item.value) {
          hasLocalLangValue = true
        }
      }
    })
    if (flag) {
      notification.error({
        message: intl.formatMessage({ id: 'pages.model.watch' }),
        description: intl.formatMessage({ id: 'component.customPanel.modal.field.empty' })
      })
      return
    }
    if (Array.from(new Set(arr)).length < arr.length) {
      notification.error({
        message: intl.formatMessage({ id: 'pages.model.watch' }),
        description: intl.formatMessage({ id: 'component.customPanel.modal.field.repeat' })
      })
      return
    }
    if (!hasLocalLangValue) {
      notification.error({
        message: intl.formatMessage({ id: 'pages.model.watch' }),
        description: localLang === LangType.CHINESE ? intl.formatMessage({ id: 'component.customPanel.modal.field.local.cn' }) : intl.formatMessage({ id: 'component.customPanel.modal.field.local.en' })
      })
      return
    }
    const list = dataSource.filter(x => x.languageCode === localLang)
    if (list.length > 0) {
      props.form.setFieldsValue({
        name: list[0].value
      })
    }
    let oobj = {}
    dataSource.map(item => {
      oobj[item.languageCode as string] = item.value
    })
    props.form.setFieldsValue({
      name: JSON.stringify(oobj)
    })
    props.changeDataSource(dataSource)
    props.changeVisible(false)
  }

  const cancelModal = () => {
    props.changeVisible(false)
  }

  const columns: ProColumns<NodeNameItemType>[] = [
    {
      title: intl.formatMessage({ id: 'navBar.lang' }),
      key: 'languageCode',
      dataIndex: 'languageCode',
      valueType: 'select',
      valueEnum: props.langList,
      formItemProps: (form) => {
        return {
          rules: [{ required: true, message: intl.formatMessage({ id: 'component.customPanel.modal.lang.placeholder' }) }],
        };
      },
    },
    {
      title: intl.formatMessage({ id: 'component.customPanel.executeListening.executeParamsValue' }),
      dataIndex: 'value',
      formItemProps: (form) => {
        return {
          rules: [{ required: true, message: intl.formatMessage({ id: 'component.customPanel.modal.lang.placeholder' }) }],
        };
      },
    },
    {
      title: intl.formatMessage({ id: 'table.actions' }),
      valueType: 'option',
      width: 200,
      render: () => {
        return null
      }
    },
  ];
  return (
    <Modal
      title={intl.formatMessage({ id: 'pages.appInfo.menu.form.menu.name' })}
      visible={props.visible}
      width="60vw"
      onOk={sureModal}
      onCancel={cancelModal}
      okText={intl.formatMessage({ id: 'pages.ok', defaultMessage: '确认' })}
      cancelText={intl.formatMessage({ id: 'pages.cancel', defaultMessage: '取消' })}
      forceRender
    >
      <EditableProTable<NodeNameItemType>
        rowKey="id"
        maxLength={5}
        scroll={{
          x: 960,
        }}
        recordCreatorProps={{
          newRecordType: 'dataSource',
          record: () => ({ id: Date.now() }),
        }}
        loading={false}
        columns={columns}
        value={dataSource}
        onChange={setDataSource}
        editable={{
          actionRender: (row, config, defaultDoms) => {
            return [defaultDoms.delete];
          },
          onValuesChange: (record, recordList) => {
            setDataSource(recordList);
          },
          deleteText: intl.formatMessage({ id: 'pages.delete' }),
          type: 'multiple',
          editableKeys,
          onChange: setEditableRowKeys,
        }}
      />
    </Modal>
  )
}

export default InputModal