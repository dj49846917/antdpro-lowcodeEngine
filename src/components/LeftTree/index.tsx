import { useLcPrefix } from "@/hooks/useLcPrefix";
import LcModal from "@/components/LcModal";
import { MouseEvent, useContext, useEffect, useRef, useState } from "react";
import { Dropdown, FormInstance, Menu, message, Modal, ModalProps, Spin, Tree, TreeProps } from "antd";
import { DownOutlined, EllipsisOutlined, PlusOutlined } from "@ant-design/icons";
import type { DataNode, Key } from 'rc-tree/lib/interface';
import { useData } from "@/hooks/useData";
import LcForm, { FieldProps } from "@/components/LcForm";
import "./style.less";
import { useActionReducer } from "@/hooks/useActionReducer";
import { useIntl } from "@@/plugin-locale/localeExports";
import { ActionCtx } from "@/context/actions";

export interface ActionProps {
  title: string;
  confirmTitle?: string;
  actionType: string;
  onClick?: (params: any) => void;
}

interface LeftTreeProps {
  fields: FieldProps[];
  treeTitle: string;
  formProps: { initialValues?: {}, },
  modalProps: Omit<ModalProps, 'title'> & { title: (title: string) => string };
  onSave: (values: any) => Promise<any>;
  getList: () => Promise<any>;
  onMenuChange: (id: string) => void;
}

export interface TreeNodeTitleProps {
  id: string;
  title: string;
  actions: ActionProps[];
}

const MenuActions = ({ id, actions }: { id: string; actions: ActionProps[] }) => {
  const prefixCls = useLcPrefix('menu-actions');
  const intl = useIntl();

  const { dispatch, handleVisible, loadData } = useContext(ActionCtx);
  const onClick = (type: string, title?: string, clickHandler?: (params?: any) => any) => {
    if (type === 'delete') {
      Modal.confirm({
        title,
        onOk: () => {
          clickHandler?.(id).then((res: any) => {
            if (res.success) {
              loadData?.();
              message.success(intl.formatMessage({ id: 'pages.delete.success' }));
            }
          })
        },
      });
      return;
    }
    if (type === 'view') {
      clickHandler?.(id).then((res: any) => {
        if (res.success) {
          handleVisible?.(true);
          dispatch?.({
            type,
            data: res.data
          });
        }
      })
      return;
    }
    handleVisible?.(true);
    dispatch?.({
      type,
      data: {
        id
      }
    });
  }
  return (
    <Menu
      className={prefixCls}
      items={actions.map(action => {
          return {
            key: action.actionType,
            label: <a
              onClick={(e: MouseEvent) => {
                e.stopPropagation();
                onClick(action.actionType, action.confirmTitle, action.onClick)
              }}
            >{action.title}</a>,
          }
        }
      )}
    />
  )
};

const TreeNodeTitle = (props: TreeNodeTitleProps) => {
  const { title, id } = props;
  const prefixCls = useLcPrefix('left-tree-title')
  return (
    <div className={prefixCls}>
      <label>{title}</label>
      <Dropdown
        overlay={<MenuActions
          id={id}
          actions={props.actions}
        />}
        overlayStyle={{ zIndex: 999 }}
      >
        <EllipsisOutlined />
      </Dropdown>
    </div>
  )
}

const LeftTreeHeader = ({ title }: { title: string }) => {
  const headerPrefixCls = useLcPrefix('left-tree-header');

  const { dispatch, handleVisible } = useContext(ActionCtx);
  const onAdd = () => {
    handleVisible?.(true);
    dispatch?.({
      type: 'create'
    });
  }
  return (
    <div className={headerPrefixCls}>
      <label>{title}</label>
      <PlusOutlined onClick={onAdd} />
    </div>
  )
}

function LeftTree(props: LeftTreeProps) {
  const {
    fields,
    onSave,
    getList,
    onMenuChange,
    modalProps,
    formProps,
    ...restProps
  } = props;

  const formRef = useRef<{ form: FormInstance }>();

  const prefixCls = useLcPrefix('left-tree');
  const [visible, setVisible] = useState(false);

  const { data, loadData, loading } = useData<DataNode[]>(getList);
  const [selectedKeys, setSelectedKeys] = useState<Key[]>();
  const { state, dispatch } = useActionReducer();

  const onSelect: TreeProps['onSelect'] = (keys, info) => {
    setSelectedKeys(keys);
    onMenuChange(keys.length === 0 ? '' : info?.node.key as string)
  };

  const handleVisible = (isShow: boolean) => {
    setVisible(isShow);
  }
  const onOk = () => {
    formRef.current?.form.validateFields().then(values => {
      if (values) {
        onSave(values).then((res) => {
          if (res.success) {
            setVisible(false);
            loadData()
          }
        });
      }
    })
  }

  const onCancel = () => {
    handleVisible(false);
  }

  const firstNodeKey = data?.[0]?.key;
  useEffect(() => {
    onMenuChange(firstNodeKey as string);
    setSelectedKeys([firstNodeKey as string]);
  }, [firstNodeKey]);

  const newFormProps = {
    ...formProps,
    initialValues: state?.type === 'view' ? state.data : formProps?.initialValues,
  }

  return (
    <div className={prefixCls}>
      <ActionCtx.Provider
        value={{
          dispatch,
          loadData,
          handleVisible,
        }}
      >
        <LeftTreeHeader title={restProps.treeTitle} />
        <Spin spinning={loading}>
          <Tree
            defaultExpandAll
            blockNode
            switcherIcon={<DownOutlined />}
            selectedKeys={selectedKeys}
            onSelect={onSelect}
            treeData={data as DataNode[]}
          />
        </Spin>
      </ActionCtx.Provider>
      <LcModal
        width={600}
        visible={visible}
        onCancel={onCancel}
        onOk={onOk}
        {...modalProps}
        title={modalProps.title(state?.type || 'create')}
        footer={state?.type === 'view' ? null : undefined}
      >
        {visible && <LcForm
          ref={formRef}
          fields={fields}
          formProps={newFormProps}
          readOnly={state?.type === 'view'}
        />}
      </LcModal>
    </div>
  );
}

LeftTree.TreeNodeTitle = TreeNodeTitle;
LeftTree.ActionCtx = ActionCtx;
export default LeftTree;
