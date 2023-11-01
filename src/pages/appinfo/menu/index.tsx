import { EllipsisOutlined, PlusOutlined } from '@ant-design/icons';
import { Dropdown, Menu, Modal, Spin, Tree, TreeProps } from 'antd';
import { useLcPrefix } from "@/hooks/useLcPrefix";
import "./style.less";
import { useTreeData, UseTreeDataType } from "@/pages/appinfo/menu/hooks";
import { MenuCtx, ModalCtx } from './context';
import { MouseEvent, useContext, useEffect, useRef, useState } from 'react';
import MenuForm from "@/pages/appinfo/menu/MenuForm";
import menusManagementApi from "@/services/custom/appInfo/menu/service";
import { useIntl } from "@@/plugin-locale/localeExports";
import type { Key } from 'rc-tree/lib/interface';
import LcModal from "@/components/LcModal";
import { useActionReducer } from "@/hooks/useActionReducer";
import Preview from "@/components/Preview";

const { confirm } = Modal;

interface TreeNodeTitleProps {
  id: string;
  title: string;
  pageId: string;
}

const MenuActions = ({ id, pageId }: { id: string, pageId: string }) => {
  const intl = useIntl();
  const prefixCls = useLcPrefix('menu-actions');
  const { handleVisible, loadData, dispatch } = useContext(MenuCtx);

  const handleCreateSubmenu = (e: MouseEvent) => {
    e.stopPropagation();
    handleVisible(true);
    dispatch({
      type: 'createSubmenu',
      data: {
        parentId: id || '0'
      }
    });
  }

  const handleView = (e: MouseEvent) => {
    e.stopPropagation();
    menusManagementApi.getDetail(id).then((res) => {
      handleVisible(true);
      dispatch({
        type: 'view',
        data: res
      });
    })
  }

  const handleEdit = (e: MouseEvent) => {
    e.stopPropagation();
    menusManagementApi.getDetail(id).then((res) => {
      handleVisible(true);
      dispatch({
        type: 'edit',
        data: res
      });
    })
  }

  const handleDel = (e: MouseEvent) => {
    e.stopPropagation();
    confirm({
      title: intl.formatMessage({ id: 'pages.appInfo.menu.form.modal.confirm.title' }),
      onOk: () => {
        menusManagementApi.delMenu(id).then(() => {
          loadData();
        }).catch(err => console.log('delMenuErr>>>', err.message));
      },
    })
  }

  const handlePageDesign = (e: MouseEvent) => {
    e.stopPropagation();
    window.open(`/designer?pageId=${pageId}`)
  }

  return (
    <Menu
      className={prefixCls}
      items={[
        {
          key: '1',
          label: (
            <a onClick={handleCreateSubmenu}>{intl.formatMessage({ id: 'pages.appInfo.menu.action.createSubmenu' })}</a>
          ),
        },
        {
          key: '2',
          label: (
            <a onClick={handleEdit}>{intl.formatMessage({ id: 'pages.appInfo.menu.action.edit' })}</a>
          ),
        },
        {
          key: '3',
          label: (
            <a onClick={handleView}>{intl.formatMessage({ id: 'pages.appInfo.menu.action.view' })}</a>
          ),
        },
        {
          key: '4',
          label: (
            <a onClick={handleDel}>{intl.formatMessage({ id: 'pages.appInfo.menu.action.delete' })}</a>
          ),
        },
        {
          key: '5',
          label: (
            <a onClick={handlePageDesign}>{intl.formatMessage({ id: 'pages.appInfo.menu.action.page' })}</a>
          ),
        },
      ]}
    />
  )
};
const TreeNodeTitle = (props: TreeNodeTitleProps) => {
  const { title, id, pageId } = props;
  const prefixCls = useLcPrefix('menu-title')
  return (
    <div className={prefixCls}>
      <label>{title}</label>
      <Dropdown
        overlay={<MenuActions id={id} pageId={pageId} />}
        overlayStyle={{ zIndex: 999 }}
      >
        <EllipsisOutlined />
      </Dropdown>
    </div>
  )
}

const PagesManagement = ({ onMenuChange }: { onMenuChange: (pageId: string) => void }) => {

  const formRef = useRef<{ onSave: () => Promise<boolean> }>();

  const intl = useIntl();
  const prefixCls = useLcPrefix('pages-management');
  const plusPrefixCls = useLcPrefix('pages-management-plus');
  const [visible, setVisible] = useState(false);

  const renderTitle = (renderTitleProps: UseTreeDataType) => {
    return (
      <TreeNodeTitle
        {...renderTitleProps}
      />
    )
  }
  const { treeData, ids, loadData, loading } = useTreeData(renderTitle);
  const [selectedKeys, setSelectedKeys] = useState<Key[]>();

  const onSelect: TreeProps['onSelect'] = (keys, info) => {
    setSelectedKeys(keys);
    onMenuChange((info?.node as any).nodeData?.pageId)
  };

  const { state, dispatch } = useActionReducer();
  const handleVisible = (isShow: boolean) => {
    setVisible(isShow);
  }
  const onOk = () => {
    formRef.current?.onSave().then(res => {
      if (res) {
        setVisible(false);
        loadData();
      }
    })
  }
  const onAdd = () => {
    handleVisible(true);
    dispatch({
      type: 'create'
    });
  }
  const onCancel = () => {
    handleVisible(false);
  }

  const firstNodeKey = treeData?.[0]?.key;
  useEffect(() => {
    onMenuChange((treeData?.[0] as any)?.nodeData?.pageId);
    setSelectedKeys([firstNodeKey as string]);
  }, [firstNodeKey]);
  return (
    <div className={prefixCls}>
      <MenuCtx.Provider value={{ loadData, handleVisible, dispatch }}>
        <div className={plusPrefixCls}>
          <label>{intl.formatMessage({ id: 'pages.appInfo.menu.pages.management' })}</label>
          <PlusOutlined onClick={onAdd} />
        </div>
        <Spin spinning={loading}>
          <Tree
            className='tree'
            expandedKeys={ids}
            selectedKeys={selectedKeys}
            onSelect={onSelect}
            treeData={treeData}
          />
        </Spin>
      </MenuCtx.Provider>
      <ModalCtx.Provider value={{ state }}>
        <LcModal
          title={intl.formatMessage({ id: `pages.appInfo.menu.action.${state?.type || 'create'}` })}
          visible={visible}
          onCancel={onCancel}
          onOk={onOk}
          footer={state?.type === 'view' ? null : undefined}
        >
          {visible && <MenuForm ref={formRef} />}
        </LcModal>
      </ModalCtx.Provider>
    </div>
  );
}

const MenusManagement = () => {
  const prefixCls = useLcPrefix('menus-management');
  const contentPrefixCls = useLcPrefix('menus-management-content');
  const [pageId, setPageId] = useState<string>('');

  const onMenuChange = (id: string) => {
    setPageId(id);
  }

  return (
    <div className={prefixCls}>
      <PagesManagement onMenuChange={onMenuChange} />
      <div className={contentPrefixCls}>
        {/*<Frame*/}
        {/*  pageId={pageId}*/}
        {/*  url={Constant.LOWCODE_PREVIEW_URL}*/}
        {/*/>*/}
        {pageId && <Preview pageId={pageId} menuId="true" />}
      </div>
    </div>
  )
};

export default MenusManagement;
