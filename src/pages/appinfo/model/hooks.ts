import { useIntl } from "@@/plugin-locale/localeExports";
import { FieldProps } from "@/components/LcForm";
import { CompTypeEnum } from "@/constant/comps";
import { useMemo } from "react";
import { useData } from "@/hooks/useData";
import datasourceApi from "@/services/custom/platform/service";
import { ActionProps } from "@/components/LeftTree";

export const useTitle = () => {
  const intl = useIntl();
  return {
    create: intl.formatMessage({ id: 'pages.app.model.form.create' }),
    edit: intl.formatMessage({ id: 'pages.app.model.form.edit' }),
    delete: intl.formatMessage({ id: 'pages.app.model.form.delete' }),
    view: intl.formatMessage({ id: 'pages.app.model.form.view' }),
  }
}

export const useModelFields = () => {
  const intl = useIntl();
  const { data: dataSourceList } = useData(() => {
    return datasourceApi.getDatabaseList().then(res => {
      if (res.success) {
        return res.data.map(item => ({ value: item.datasourceId, label: item.datasourceName }))
      }
      return []
    })
  })
  const fields: FieldProps[] = useMemo(() => {
    return [
      {
        itemProps: {
          name: 'datasourceId',
          label: intl.formatMessage({ id: `pages.app.model.form.datasource` }),
          rules: [{
            required: true
          }],
        },
        compProps: {
          options: dataSourceList,
        },
        compType: CompTypeEnum.Selector,
      },
      {
        itemProps: {
          name: 'datasourceId',
          label: intl.formatMessage({ id: `pages.app.model.form.datasourceId` }),
          rules: [{
            required: false
          }],
        },
        compProps: {
          disabled: true
        },
        compType: CompTypeEnum.TextInput,
      }
    ];
  }, [dataSourceList]);
  return fields
}

export const useTableFormFields = () => {
  return []
}

export const useTableColumns = () => {
  return []
}

export const useActions = () => {
  const intl = useIntl();
  const actions: ActionProps[] = [
    {
      title: intl.formatMessage({ id: 'pages.platform.datasource.form.view' }),
      actionType: 'view',
      onClick: (id: string) => {
        return datasourceApi.getDatabaseDetail(id).then(res => {
          if (res.data?.type == '1') {
          }
          return res
        });
      }
    },
    {
      title: intl.formatMessage({ id: 'pages.app.model.form.delete' }),
      confirmTitle: intl.formatMessage({ id: 'pages.app.model.form.confirmTitle' }),
      actionType: 'delete',
      onClick: (id: string) => {
        return datasourceApi.modelUnBindsDataSource(id);
      }
    }
  ];

  return actions
}
