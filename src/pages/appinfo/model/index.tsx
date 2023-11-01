import { useRef } from 'react'
import LeftTree from "@/components/LeftTree";
import datasourceApi from "@/services/custom/platform/service";
import { useLcPrefix } from "@/hooks/useLcPrefix";
import { useIntl } from "@@/plugin-locale/localeExports";
import { getAppId } from "@/utils/utils";
import { useActions, useModelFields, useTitle } from "@/pages/appinfo/model/hooks";
import "./style.less";
import { RightContent } from '@/pages/platform/datasource';
import { useForm } from 'antd/lib/form/Form';

const ModelManagement = () => {
  const intl = useIntl();
  const prefixCls = useLcPrefix('model-management');
  const modelFields = useModelFields();
  const actions = useActions();
  const appId = getAppId();
  const formProps = {}
  const titleMap = useTitle();
  const [searchForm] = useForm()
  const rightContentRef = useRef<any>();

  const getModels = () => {
    return datasourceApi.getDatabaseList(appId).then(res => {
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
      return []
    })
  }

  const onMenuChange = (id: string) => {
    rightContentRef.current?.loadData({ id, current: 1, size: 10 })
  }
  const onSave = (values: any) => {
    return datasourceApi.modelBindsDataSource(values.datasourceId)
  }
  return (
    <div className={prefixCls}>
      <LeftTree
        onSave={onSave}
        getList={getModels}
        treeTitle={intl.formatMessage({ id: 'pages.app.model.tree.title' })}
        modalProps={{
          style: {
            height: '50%'
          },
          title: (type: string) => titleMap[type],
          okText: intl.formatMessage({ id: 'pages.app.model.modal.okText' })
        }}
        onMenuChange={onMenuChange}
        fields={modelFields}
        formProps={formProps}
      />
      <RightContent ref={rightContentRef} />
    </div>
  )
}

export default ModelManagement
