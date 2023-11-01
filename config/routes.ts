import type { MenuDataItem } from "@ant-design/pro-layout";


const menus: MenuDataItem[] = [
  {
    path: '/user',
    layout: false,
    routes: [
      {
        name: 'login',
        path: '/user/login',
        component: './user/login',
      },
      {
        component: './404',
      },
    ],
  },
  {
    path: '/',
    flatMenu: true,
    component: '@/layouts/index',
    routes: [
      {
        path: '/',
        redirect: '/redirectpages',
      },
      {
        path: '/redirectpages',
        layout: false,
        hideInMenu: true,
        name: 'auth',
        component: './redirectpages',
      },
      {
        path: '/dashboard',
        icon: 'icon-tubiao_gongzuotai',
        name: 'dashboard',
        component: './dashboard',
      },
      {
        path: '/analysis',
        icon: 'icon-tubiao_gongzuotai',
        name: 'analysis',
        component: './dashboard/Analysis',
      },
      {
        path: '/plat',
        icon: 'icon-tubiao_pingtaiguanli',
        name: 'platform',
        routes: [
          {
            path: '/plat/pagesearch',
            name: 'pagesearch',
            component: './appinfo/pageSearch',
          },
          {
            path: '/plat/api',
            name: 'apimanage',
            component: './appinfo/api',
          },
          // {
          //   path: '/plat/datasource',
          //   name: 'datasource',
          //   component: './platform/datasource',
          // },
          {
            path: '/plat/page',
            name: 'page',
            component: './platform/page',
          },
          {
            path: '/plat/template',
            name: 'template',
            component: './platform/template',
          },
          {
            path: '/plat/inline-page',
            name: 'inlinePage',
            component: './platform/inline-page',
          },
          {
            path: '/plat/initpage',
            name: 'initpage',
            component: './platform/init',
          },
          {
            component: './404',
          },
        ],
      },
      {
        path: '/application',
        icon: 'icon-tubiao_yingyongguanli',
        name: 'application',
        routes: [
          {
            path: '/application/web',
            name: 'web',
            component: './application/web'
          },
          {
            path: '/application/aggregation',
            name: 'aggregation',
            component: './application/aggregation'
          },
        ]
      },
      {
        path: '/system',
        icon: 'icon-tubiao_xitongshezhi',
        name: 'system',
        routes: [
          {
            path: '/system/organization',
            name: 'organization',
            component: './system/organization',
          },
          {
            path: '/system/staff',
            name: 'staff',
            component: './system/staff',
          },
          {
            path: '/system/user',
            name: 'user',
            component: './system/user',
          },
          {
            path: '/system/position',
            name: 'position',
            component: './system/position',
          },
          {
            path: '/system/tenant',
            name: 'tenant',
            component: './system/tenant',
          },
          {
            path: '/system/auth',
            name: 'auth',
            component: './system/auth',
          },
          {
            path: '/system/log',
            name: 'log',
            component: './system/log',
          },
          {
            component: './404',
          },
        ],
      },
      {
        path: '/progress/editor',
        name: 'editor',
        hideInMenu: true,
        layout: false,
        icon: 'icon-a-shixin1beifen10',
        component: './progress/editor',
      },
      {
        path: '/progress/preview',
        name: 'editor',
        hideInMenu: true,
        layout: false,
        icon: 'icon-a-shixin1beifen10',
        component: './progress/preview',
      },
      {
        path: '/designer',
        name: 'designer',
        layout: false,
        hideInMenu: true,
        component: '@/pages/designer',
      },
      {
        path: '/designer/mobile',
        name: 'designer-mobile',
        layout: false,
        hideInMenu: true,
        component: '@/pages/designer/mobile',
      },
      {
        path: '/designer/print',
        name: 'designer-print',
        layout: false,
        hideInMenu: true,
        component: '@/pages/designer/print',
      },
      {
        // app应用下面的菜单路径
        path: '/appinfo',
        flatMenu: true,
        hideInMenu: true,
        routes: [
          {
            path: '/appinfo',
            redirect: '/appinfo/page',
          },
          {
            path: '/appinfo/page',
            name: 'page',
            icon: 'icon-tubiao_sheji',
            hideInMenu: true,
            component: './appinfo/page',
          },
          {
            path: '/appinfo/pagegroup',
            name: 'pagegroup',
            icon: 'icon-yonghuliebiao',
            hideInMenu: true,
            component: './appinfo/pageGroup',
          },
          // {
          //   path: '/appinfo/pagesearch',
          //   name: 'pagesearch',
          //   icon: 'icon-liuchengyinqing-morenicon',
          //   hideInMenu: true,
          //   component: './appinfo/pageSearch',
          // },
          {
            path: '/appinfo/model',
            name: 'model',
            icon: 'icon-tubiao_moxing',
            hideInMenu: true,
            component: './appinfo/model',
          },
          // {
          //   path: '/appinfo/progress',
          //   name: 'progress',
          //   icon: 'icon-tubiao_liucheng',
          //   hideInMenu: true,
          //   component: './appinfo/progress',
          // },
          {
            path: '/appinfo/menu',
            name: 'menu',
            icon: 'icon-tubiao_caidan',
            hideInMenu: true,
            component: './appinfo/menu',
          },
          {
            path: '/appinfo/resource',
            name: 'resource',
            icon: 'icon-tubiao_caidan',
            hideInMenu: true,
            component: './appinfo/resource',
          },
          {
            path: '/appinfo/rule',
            name: 'rule',
            icon: 'icon-tubiao_guize',
            hideInMenu: true,
            component: './appinfo/rule',
          },
          {
            path: '/appinfo/publish',
            name: 'publish',
            icon: 'icon-tubiao_fabu',
            hideInMenu: true,
            component: './appinfo/publish',
          },
          {
            path: '/appinfo/setup',
            hideInMenu: true,
            name: 'setup',
            icon: 'icon-tubiao_jiaose',
            routes: [
              {
                path: '/appinfo/setup/role',
                name: 'role',
                icon: 'icon-tubiao_jiaose',
                hideInMenu: true,
                component: './appinfo/setup/role',
              },
              {
                path: '/appinfo/setup/auth',
                name: 'auth',
                icon: 'icon-quanxian',
                hideInMenu: true,
                component: './appinfo/setup/auth',
              },
              {
                path: '/appinfo/setup/base',
                name: 'base',
                icon: 'icon-quanxian',
                hideInMenu: true,
                component: './appinfo/setup/base',
              },
              {
                path: '/appinfo/setup/page',
                name: 'page',
                icon: 'icon-quanxian',
                hideInMenu: true,
                component: './appinfo/setup/page',
              },
              {
                path: '/appinfo/setup/inline-page-config',
                name: 'inlinePageConfig',
                icon: 'icon-quanxian',
                hideInMenu: true,
                component: './appinfo/setup/inline-page-config',
              },
              {
                path: '/appinfo/setup/theme',
                name: 'theme',
                icon: 'icon-quanxian',
                hideInMenu: true,
                component: './appinfo/setup/theme',
              },
              {
                path: '/appinfo/setup/org',
                name: 'org',
                icon: 'icon-quanxian',
                hideInMenu: true,
                component: './appinfo/setup/org',
              },
              {
                path: '/appinfo/setup/data-auth',
                name: 'data-auth',
                icon: 'icon-quanxian',
                hideInMenu: true,
                component: './appinfo/setup/data-auth',
              },
              {
                path: '/appinfo/setup/syslist',
                name: 'syslist',
                icon: 'icon-quanxian',
                hideInMenu: true,
                component: './appinfo/setup/syslist',
              }
            ]
          },
          {
            path: '/appinfo/file',
            name: 'file',
            icon: 'icon-shangchuan',
            hideInMenu: true,
            component: './appinfo/file',
          },
          {
            path: '/appinfo/api',
            name: 'api',
            icon: 'icon-tubiao_fabu',
            hideInMenu: true,
            component: './appinfo/api',
          },
          {
            path: '/appinfo/log',
            name: 'log',
            icon: 'icon-yunyingguanli-morenicon',
            hideInMenu: true,
            component: './appinfo/log',
          },
          {
            path: '/appinfo/general',
            hideInMenu: true,
            name: 'general',
            icon: 'icon-tubiao_jiaose',
            routes: [
              {
                path: '/appinfo/general/config',
                name: 'config',
                icon: 'icon-tubiao_jiaose',
                hideInMenu: true,
                component: './appinfo/general/config',
              },
              {
                path: '/appinfo/general/field',
                name: 'field',
                icon: 'icon-tubiao_jiaose',
                hideInMenu: true,
                component: './appinfo/general/field',
              },
              {
                path: '/appinfo/general/verify',
                name: 'verify',
                icon: 'icon-tubiao_jiaose',
                hideInMenu: true,
                component: './appinfo/general/verify',
              },
              {
                path: '/appinfo/general/basic',
                name: 'basic',
                icon: 'icon-tubiao_jiaose',
                hideInMenu: true,
                component: './appinfo/general/basic',
              }
            ],
          }
        ],
      },
    ]
  },
]
export default menus;
