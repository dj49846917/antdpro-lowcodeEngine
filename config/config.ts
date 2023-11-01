// https://umijs.org/config/
import { defineConfig } from 'umi';
import defaultSettings from './defaultSettings';
import proxy from './proxy';
import routes from './routes';

const HtmlWebpackPlugin = require('html-webpack-plugin');
// const ThemePlugin = require('@alifd/next-theme-webpack-plugin');
// const ExtractTextPlugin = require('extract-text-webpack-plugin');
// import { join } from 'path';

// const { REACT_APP_ENV } = process.env;
export default defineConfig({
  hash: true,
  antd: {},
  dva: {
    hmr: true,
  },
  layout: {
    // https://umijs.org/zh-CN/plugins/plugin-layout
    locale: true,
    siderWidth: 208,
    ...defaultSettings,
  },
  // https://umijs.org/zh-CN/plugins/plugin-locale
  locale: {
    // default zh-CN
    default: 'zh-CN',
    antd: true,
    // default true, when it is true, will use `navigator.language` overwrite default
    baseNavigator: true,
  },
  dynamicImport: {
    loading: '@ant-design/pro-layout/es/PageLoading',
  },
  targets: {
    ie: 11,
  },
  // umi routes: https://umijs.org/docs/routing
  routes,
  access: {},
  // Theme for antd: https://ant.design/docs/react/customize-theme-cn
  theme: {
    // 如果不想要 configProvide 动态设置主题需要把这个设置为 default
    // 只有设置为 variable， 才能使用 configProvide 动态设置主色调
    // https://ant.design/docs/react/customize-theme-variable-cn
    'root-entry-name': 'variable',
    'blue-base': '#009A44',
  },
  // esbuild is father build tools
  // https://umijs.org/plugins/plugin-esbuild
  esbuild: {},
  base: '/',
  title: false,
  ignoreMomentLocale: true,
  proxy: proxy.local,
  manifest: {
    basePath: '/',
  },
  // Fast Refresh 热更新
  fastRefresh: {},
  // openAPI: [
  //   {
  //     requestLibPath: "import { request } from 'umi'",
  //     // 或者使用在线的版本
  //     // schemaPath: "https://gw.alipayobjects.com/os/antfincdn/M%24jrzTTYJN/oneapi.json"
  //     schemaPath: join(__dirname, 'oneapi.json'),
  //     mock: false,
  //   },
  //   {
  //     requestLibPath: "import { request } from 'umi'",
  //     schemaPath: 'https://gw.alipayobjects.com/os/antfincdn/CA1dOm%2631B/openapi.json',
  //     projectName: 'swagger',
  //   },
  // ],
  nodeModulesTransform: { type: 'none' },
  mfsu: {},
  exportStatic: {},
  sass: {},
  externals: {
    "react": "var window.React",
    "react-dom": "var window.ReactDOM",
    "prop-types": "var window.PropTypes",
    "@alifd/next": "var window.Next",
    "@alilc/lowcode-engine": "var window.AliLowCodeEngine",
    "@alilc/lowcode-editor-core": "var window.AliLowCodeEngine.common.editorCabin",
    "@alilc/lowcode-editor-skeleton": "var window.AliLowCodeEngine.common.skeletonCabin",
    "@alilc/lowcode-designer": "var window.AliLowCodeEngine.common.designerCabin",
    "@alilc/lowcode-engine-ext": "var window.AliLowCodeEngineExt",
    "@ali/lowcode-engine": "var window.AliLowCodeEngine",
    "moment": "var window.moment",
    "lodash": "var window._"
  },
  chainWebpack: (config) => {

    config.merge({
      entry: {
        'preview': require.resolve(`../src/preview.tsx`),
        'mobile-preview': require.resolve(`../src/preview.tsx`),
      },
    });
    config
      .plugin('preview')
      .use(HtmlWebpackPlugin, [
        {
          template: require.resolve('../src/pages/preview.html'),
          filename: 'preview.html',
          chunks: ['preview'],
        },
        {
          template: require.resolve('../src/pages/mobile-preview.html'),
          filename: 'mobile-preview.html',
          chunks: ['mobile-preview'],
        },
      ]);
    config
      .plugin('mobile-preview')
      .use(HtmlWebpackPlugin, [
        {
          template: require.resolve('../src/pages/mobile-preview.html'),
          filename: 'mobile-preview.html',
          chunks: ['mobile-preview'],
        },
      ]);

    // config.module.rule('svg').uses.clear().end().use('svg').loader('@svgr/webpack').end()

    // config.module
    //   .rule('.css$')
    //   .test(/\.css$/)
    //   .use(ExtractTextPlugin.extract({
    //     use: 'css-loader',
    //   }));
    // config.plugin('build-plugin-fusion').use(BuildPluginFusion, [
    //   [{
    //     "uniteBaseComponent": "@alifd/next",
    //     "cssVariable": true,
    //     "importOptions": {
    //       "libraryDirectory": "lib"
    //     },
    //     "themePackage": [
    //       {
    //         "name": "@alifd/theme-22231",
    //         "default": true
    //       },
    //     ]
    //   }]
    // ])
  },
});
