import React, { useCallback, useState } from 'react';
import { DownOutlined } from '@ant-design/icons';
import { Divider, Form, Input, Menu, Modal, notification, Spin } from 'antd';
import { FormattedMessage, useIntl, useModel } from 'umi';
import HeaderDropdown from '../HeaderDropdown';
import './index.less';
import type { MenuInfo } from 'rc-menu/lib/interface';
import { ENU_IMG } from '@/constant/img';
import { logout } from '@/services/custom/user';
import { RedirectPlace } from '@/utils/utils';
import { Constant } from '@/constant';
import { useForm } from 'antd/lib/form/Form';
import userApi from '@/services/custom/system/user';
import { EditAndResetPasswordType } from '@/pages/system/user/type';

export type GlobalHeaderRightProps = {
  menu?: boolean;
};

/**
 * 退出登录，并且将当前的 url 保存
 */

const AvatarDropdown: React.FC<GlobalHeaderRightProps> = ({ menu }) => {
  const { initialState, setInitialState } = useModel('@@initialState');
  const intl = useIntl();
  const [psdForm] = useForm();
  const [visible, setVisible] = useState(false)
  const loginOut = async () => {
    const token = localStorage.getItem(Constant.LOGIN_TOKEN_STORAGE)
    const params = {
      token,
    }
    const result = await logout(params)
    if (result && result.success) {
      notification.success({
        message: intl.formatMessage({
          id: 'pages.logout.success',
          defaultMessage: '退出成功',
        }),
        duration: 1,
        onClose: () => {
          setInitialState({
            ...initialState,
            currentUser: undefined
          })
          RedirectPlace()
        }
      })
    }
  };

  const save = async () => {
    const validate = await psdForm.validateFields();
    let encrypt = new JSEncrypt()
    encrypt.setPublicKey(Constant.PUBLIC_KEY)
    if (validate) {
      const params = {
        oldPassword: encrypt.encrypt(validate.oldPassword),
        password: encrypt.encrypt(validate.password),
        userId: localStorage.getItem(Constant.USER_INFO_STORAGE)
      } as EditAndResetPasswordType
      const result = await userApi.editPsd(params)
      if (result && result.success) {
        notification.success({
          message: intl.formatMessage({
            id: 'pages.btn.success',
          })
        })
        setVisible(false)
      }
    }
  }

  const onMenuClick = useCallback(
    (event: MenuInfo) => {
      const { key } = event;
      if (key === 'logout') {
        loginOut();
      }
      if (key === 'updatePsd') {
        setVisible(true)
      }
    },
    [setInitialState],
  );

  const loading = (
    <span className={`action account`}>
      <Spin
        size="small"
        style={{
          marginLeft: 8,
          marginRight: 8,
        }}
      />
    </span>
  );

  if (!initialState) {
    return loading;
  }

  const { currentUser } = initialState;

  if (!currentUser || !currentUser.fullName) {
    return loading;
  }

  const menuHeaderDropdown = (
    <Menu className="d-menu" selectedKeys={[]} onClick={onMenuClick}>
      <Menu.Item key="user">
        <div className='d-user'>
          <img src={currentUser.image || ENU_IMG.defaultUserIcon_0} className="avatar" />
          <div className='d-menu-item'>
            <div className='d-menu-item-name'>{currentUser.fullName}</div>
            <div className='d-menu-item-role'>{currentUser.tenantName}</div>
          </div>
        </div>
      </Menu.Item>
      <Divider className='d-line' />
      <Menu.Item key="updatePsd">
        <div className='d-menu-item-val'><FormattedMessage id="component.leftContent.updatePsd" defaultMessage="修改密码" /></div>
      </Menu.Item>
      <Menu.Item key="logout">
        <div className='d-menu-item-val'><FormattedMessage id="component.leftContent.logout2" defaultMessage="退出登录" /></div>
      </Menu.Item>
    </Menu>
  );
  return (
    <>
      <HeaderDropdown overlay={menuHeaderDropdown}>
        <span className={`action account`}>
          <img src={currentUser.image || ENU_IMG.defaultUserIcon_0} className="avatar" />
          <span className={`name anticon`}>{currentUser.fullName}</span>
          <DownOutlined className="icons" />
        </span>
      </HeaderDropdown>
      <Modal
        title={intl.formatMessage({ id: 'component.leftContent.updatePsd' })}
        visible={visible}
        onCancel={() => setVisible(false)}
        okText={intl.formatMessage({ id: 'pages.ok' })}
        cancelText={intl.formatMessage({ id: 'pages.cancel' })}
        onOk={() => save()}
      >
        <Form
          form={psdForm}
          name="advanced_search"
          className="ant-advanced-search-form"
          preserve={false}
          layout="vertical"
        >
          <Form.Item
            name="oldPassword"
            label={intl.formatMessage({ id: 'component.leftContent.oldPassword' })}
            rules={[{ required: true, message: intl.formatMessage({ id: 'component.leftContent.oldPassword.placeholder' }) }]}
          >
            <Input.Password placeholder={intl.formatMessage({ id: 'component.leftContent.oldPassword.placeholder' })} />
          </Form.Item>
          <Form.Item
            name="password"
            label={intl.formatMessage({ id: 'component.leftContent.newPassword' })}
            rules={[{ required: true, message: intl.formatMessage({ id: 'component.leftContent.newPassword.placeholder' }) }]}
          >
            <Input.Password placeholder={intl.formatMessage({ id: 'component.leftContent.newPassword.placeholder' })} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default AvatarDropdown;
