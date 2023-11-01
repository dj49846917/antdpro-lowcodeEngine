import type { EditableFormInstance } from '@ant-design/pro-components';
import { EditableProTable, } from '@ant-design/pro-components';
import { EditableProTableProps } from '@ant-design/pro-table/lib/components/EditableTable';
import type { FormInstance } from 'antd';
import { useRef } from 'react';
import { useIntl } from "@@/plugin-locale/localeExports";

type DataSourceType = {
  id: string;
  [key: string]: string;
};
type EditableProps = EditableProTableProps<DataSourceType, DataSourceType> & {form: FormInstance} & {disabled?: boolean}

export default (props: EditableProps) => {
  const { columns, form, name, disabled } = props;
  const intl = useIntl();
  const editorFormRef = useRef<EditableFormInstance<DataSourceType>>(null);
  return (
    <EditableProTable<DataSourceType>
      rowKey="id"
      scroll={{
        x: 960,
      }}
      size='small'
      editableFormRef={editorFormRef}
      recordCreatorProps={disabled ? false : {
        position: 'bottom',
        creatorButtonText: intl.formatMessage({id: 'components.editable-table.add'}),
        record: () => ({ id: (Math.random() * 1000000).toFixed(0) }),
      }}
      name={name}
      columns={columns}
      editable={{
        form,
        type: 'multiple',
      }}
    />
  );
};
