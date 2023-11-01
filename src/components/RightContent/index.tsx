import { Space } from 'antd';
import React, { Fragment, useMemo } from 'react';
import { useModel, SelectLang } from 'umi';
import Avatar from './AvatarDropdown';
import './index.less';
import { ENU_IMG } from '@/constant/img';
import { getAppInfo, getTextToLanguage } from '@/utils/utils';
import { Constant } from '@/constant';

export type SiderTheme = 'light' | 'dark';

const useAppInfo = (pathname: string) => {
  return useMemo(() => {
    if (!pathname.startsWith('/appinfo')) {
      return undefined;
    }
    return getAppInfo()
  }, [pathname])
}

const GlobalHeaderRight: React.FC = () => {
  const { initialState } = useModel('@@initialState');
  const { terminalType, appName } = useAppInfo(window.location.pathname) || {};
  const sourceRender = useMemo(() => {
    if (!terminalType) {
      return null;
    }
    const name = getTextToLanguage(appName);
    return `${name}`;
  }, [terminalType, appName]);

  if (!initialState || !initialState.settings) {
    return null;
  }
  const { navTheme, layout } = initialState.settings;
  let className = 'right';

  if ((navTheme === 'dark' && layout === 'top') || layout === 'mix') {
    className = `right  dark`;
  }

  const menuFlag = window.location.href.indexOf("pageId=") > -1 || !initialState?.currentUser

  return (<>
    {menuFlag ? (<></>) : <Space className={className}>
      {sourceRender}
      <SelectLang className="action" icon={<img src={ENU_IMG.lang} />} onItemClick={(e) => {
        localStorage.setItem(Constant.LANG_STORAGE, e.key);
        localStorage.setItem("umi_locale", e.key);
        window.location.reload();
      }} />
      <img style={{ width: '22px' }} src={ENU_IMG.notice} />
      <Avatar menu />
    </Space>}
  </>);
};
export default GlobalHeaderRight;
