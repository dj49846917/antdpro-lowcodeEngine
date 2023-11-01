import type { Settings as LayoutSettings } from '@ant-design/pro-layout';
// import { SettingDrawer } from '@ant-design/pro-layout';
import { PageLoading } from '@ant-design/pro-layout';
import type { RunTimeLayoutConfig } from 'umi';
import { history } from 'umi';
import RightContent from '@/components/RightContent';
import defaultSettings from '../config/defaultSettings';
import { getUserInfo } from '@/services/custom/user'
import {
  getAppId,
  getAppInfo,
  getToken,
  initLanguage,
  loadAssets,
  RedirectPlace
} from './utils/utils';
import {
  AppRoutes,
  MenuConfigItem,
  PcRoutes
} from '../config/childRoutes'
import { loopMenuItem } from './constant/Icon';
import { Constant } from './constant';
import { ENU_IMG } from './constant/img';
import appApi from './services/custom/application';

const isDev = process.env.NODE_ENV === 'development';

/** 获取用户信息比较慢的时候会展示一个 loading */
export const initialStateConfig = {
  loading: <PageLoading />,
};

/**
 * @see  https://umijs.org/zh-CN/plugins/plugin-initial-state
 * */
export async function getInitialState(): Promise<{
  settings?: Partial<LayoutSettings>;
  currentUser?: API.CurrentUser;
  loading?: boolean;
  fetchUserInfo?: () => Promise<API.CurrentUser | undefined>;
  pageFlag?: boolean,
  currentPath?: string
}> {
  initLanguage()
  const token = getToken();
  const loginSystem = localStorage.getItem(Constant.LOGIN_SYSTEM_STORAGE)
  if (loginSystem && !token) {
    history.replace(`/redirectpages${history.location.search}`)
    return Promise.resolve({});
  }
  if (!token) {
    RedirectPlace()
    return Promise.resolve({});
  }
  const params = {
    token,
  }
  console.log('getInitialState');
  await loadAssets();
  const res = await appApi.getPageAuth(getAppId())
  let pageResourceMap = {}
  if (res && res.success) {
    pageResourceMap = res.data
  }
  const result = await getUserInfo(params)
  localStorage.setItem(Constant.USER_INFO_STORAGE, result.data.userId)
  localStorage.setItem(Constant.USER_STORAGE, JSON.stringify({
    ...result.data,
    pageResourceMap
  }))
  let pageFlag = false
  if (window.location.pathname.indexOf("/appinfo/") > -1) {
    pageFlag = true
  }
  return {
    currentUser: result.data,
    settings: defaultSettings,
    pageFlag,
    currentPath: history.location.pathname
  }
}

// ProLayout 支持的api https://procomponents.ant.design/components/layout
export const layout: RunTimeLayoutConfig = ({ initialState, setInitialState }) => {
  return {

    disableContentMargin: false,
    waterMarkProps: {
      content: initialState?.currentUser?.name,
    },
    menu: {
      params: initialState,
      request: (params, defaultMenuData) => {
        if (location.pathname.indexOf("/appinfo/") > -1) {
          /** pc应用和app应用菜单已经合并 */
          return loopMenuItem(initialState?.currentUser?.pcMenuTree);
        } else {
          return loopMenuItem(initialState?.currentUser?.platformMenuTree);
        }
      },
      locale: false,
    },
    onPageChange: () => {
      const lang = localStorage.getItem("umi_locale")
      if (localStorage.getItem("umi_locale")) {
        const otherLang = localStorage.getItem(Constant.LANG_STORAGE)
        if (otherLang !== lang) {
          localStorage.setItem(Constant.LANG_STORAGE, lang || 'zh-CN')
        }
      }
      const { location } = history; // 如果没有登录，重定向到 login
      if (initialState?.currentUser) {
        if (location.pathname.indexOf("/appinfo/") > -1) {
          setInitialState({
            ...initialState,
            pageFlag: true
          })
        } else if (location.pathname.indexOf("/login") > -1) {
          setInitialState({
            ...initialState,
            currentUser: undefined
          })
        } else {
          setInitialState({
            ...initialState,
            pageFlag: false
          })
        }
      }
    },
    headerHeight: initialState?.currentUser ? ((window.location.href.indexOf("pageId=") > -1) ? 0 : 68) : 0,
    siderWidth: initialState?.currentUser ? ((window.location.href.indexOf("pageId=") > -1) ? 0 : 240) : 0,
    collapsed: false,
    collapsedButtonRender: false,
    menuProps: {
      theme: undefined,
      className: 'dtt-side-menu',
    },
    // menuFooterRender: () => (<LeftFooterContent />),
    rightContentRender: () => <RightContent />,
    logo: () => (<img src={ENU_IMG.logo_deloitte} />),
    ...initialState?.settings,
  };
};
