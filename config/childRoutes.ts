import { TerminalType } from "@/types/common";
import { MenuDataItem } from "@ant-design/pro-layout";


export interface MenuConfigItem extends MenuDataItem {
  path: string,
  name: string,
  icon?: string;
  uri: string;
  /** 用于区分pc应用和app应用 */
  terminalType?: TerminalType,
  routes?: MenuConfigItem[];
}

const routes: MenuConfigItem[] = [
  {
    path: '/appinfo/page',
    name: 'page',
    icon: 'icon-tubiao_sheji',
    uri: "page-manage"
  },
  {
    path: '/appinfo/pagegroup',
    name: 'pagegroup',
    icon: 'icon-tubiao_sheji',
    uri: "page-manage"
  },
  // {
  //   uri: "page-manage",
  //   path: '/appinfo/pagesearch',
  //   name: 'pagesearch',
  //   icon: 'icon-tubiao_sheji',
  // },
  {
    path: '/appinfo/model',
    name: 'model',
    icon: 'icon-tubiao_moxing',
    uri: "model-manage"
  },
  // {
  //   path: '/appinfo/progress',
  //   name: 'progress',
  //   icon: 'icon-tubiao_liucheng',
  //   uri: "workflow-manage"
  // },
  {
    path: '/appinfo/menu',
    name: 'menu',
    icon: 'icon-tubiao_caidan',
    uri: "menu-manage",
    terminalType: TerminalType.Pc
  },
  {
    path: '/appinfo/resource',
    name: 'resource',
    icon: 'icon-tubiao_caidan',
    uri: "menu-manage",
    terminalType: TerminalType.App
  },
  {
    path: '/appinfo/rule',
    name: 'rule',
    icon: 'icon-tubiao_guize',
    uri: "rule-manage"
  },
  {
    path: '/appinfo/publish',
    name: 'publish',
    icon: 'icon-tubiao_fabu',
    uri: "app-deploy"
  },
  // {
  //   path: '/appinfo/role',
  //   name: 'role',
  //   icon: 'icon-tubiao_jiaose',
  //   uri: "role-manage"
  // },
  // {
  //   path: '/appinfo/auth',
  //   name: 'auths',
  //   icon: 'icon-quanxian',
  //   uri: "auth-manage"
  // },
  {
    path: '/appinfo/api',
    name: 'api',
    icon: 'icon-api',
    uri: "api-manage"
  },
  {
    path: '/appinfo/log',
    name: 'log',
    icon: 'icon-yunyingguanli-morenicon',
    uri: "page-manage"
  },
  {
    path: '/appinfo/file',
    name: 'file',
    icon: 'icon-shangchuan',
    terminalType: TerminalType.Pc,
    uri: "page-manage"
  },
  {
    path: '/appinfo/setup',
    name: 'setup',
    icon: 'icon-tubiao_jiaose',
    uri: "app-setting",
    routes: [
      {
        path: '/appinfo/setup/base',
        name: 'base',
        icon: 'icon-quanxian',
        uri: "base-info-manage"
      },
      {
        path: '/appinfo/setup/page',
        name: 'page',
        uri: "base-info-manage",
        terminalType: TerminalType.App,
      },
      {
        path: '/appinfo/setup/inline-page-config',
        name: 'inlinePageConfig',
        uri: "base-info-manage",
        terminalType: TerminalType.App,
      },
      {
        path: '/appinfo/setup/theme',
        name: 'theme',
        icon: 'icon-quanxian',
        uri: "theme-info-manage"
      },
      {
        path: '/appinfo/setup/role',
        name: 'role',
        icon: 'icon-tubiao_jiaose',
        uri: 'role-manage',
      },
      {
        path: '/appinfo/setup/auth',
        name: 'auth',
        icon: 'icon-quanxian',
        uri: "auth-manage"
      },
      {
        path: '/appinfo/setup/org',
        name: 'org',
        icon: 'icon-quanxian',
        uri: "org-info-manage"
      },
      {
        path: '/appinfo/setup/data-auth',
        name: 'data-auth',
        icon: 'icon-quanxian',
        uri: "data-auth-manage"
      },
      {
        path: '/appinfo/setup/syslist',
        name: 'syslist',
        icon: 'icon-quanxian',
        uri: "base-info-manage"
      },
    ]
  },
  {
    path: '/appinfo/general',
    name: 'general',
    icon: 'icon-tubiao_jiaose',
    uri: "page-manage",
    routes: [
      {
        path: '/appinfo/general/config',
        name: 'config',
        icon: 'icon-quanxian',
        uri: "general-config"
      },
      {
        path: '/appinfo/general/field',
        name: 'field',
        icon: 'icon-quanxian',
        uri: "general-field"
      },
      {
        path: '/appinfo/general/verify',
        name: 'verify',
        icon: 'icon-quanxian',
        uri: "general-verify"
      },
      {
        path: '/appinfo/general/basic',
        name: 'basic',
        icon: 'icon-quanxian',
        uri: "general-basic"
      }
    ]
  }
];

/** 根据指定类型,获取应用平台菜单 */
const getAppRouter = (menus: MenuConfigItem[], terminalType: 1 | 2): MenuConfigItem[] => {
  return menus.filter(v => {
    if (v.terminalType) {
      return terminalType == v.terminalType
    }
    return true;
  }).map(v => {
    return v.routes ? {
      ...v,
      routes: getAppRouter(v.routes, terminalType)
    } : v;
  })
}

const AppRoutes = getAppRouter(routes, TerminalType.App);
const PcRoutes = getAppRouter(routes, TerminalType.Pc);

export {
  AppRoutes,
  PcRoutes
} 
