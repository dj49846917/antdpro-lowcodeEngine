import env from './env'

/**
 * 在生产环境 代理是无法生效的，所以这里没有生产环境的配置
 * -------------------------------
 * The agent cannot take effect in the production environment
 * so there is no configuration of the production environment
 * For details, please see
 * https://pro.ant.design/docs/deploy
 */
const { REACT_APP_ENV } = process.env;

export default {
  local: {
    // localhost:8000/api/** -> https://preview.pro.ant.design/api/**
    [env.API.LC_AUTH]: {
      // 要代理的地址
      target: env[REACT_APP_ENV || 'local'].API_URL,
      changeOrigin: true,
    },
    [env.API.MDM]: {
      // 要代理的地址
      target: env[REACT_APP_ENV || 'local'].API_URL,
      changeOrigin: true,
    },
    [env.API.WORKFLOW]: {
      // 要代理的地址
      target: env[REACT_APP_ENV || 'local'].API_URL,
      changeOrigin: true,
    },
    [env.API.BUSINESS]: {
      // 要代理的地址
      target: env[REACT_APP_ENV || 'local'].API_URL,
      changeOrigin: true,
    },
    [env.API.OSS]: {
      // 要代理的地址
      target: env[REACT_APP_ENV || 'local'].API_URL,
      changeOrigin: true,
    },
    [env.API.RULE]: {
      // 要代理的地址
      target: env[REACT_APP_ENV || 'local'].API_URL,
      changeOrigin: true,
    },
    [env.API.FSSC_BUSINESS]: {
      // 要代理的地址
      target: env[REACT_APP_ENV || 'local'].API_URL,
      changeOrigin: true,
    },
    ['/image/']: {
      // 要代理的地址
      target: env[REACT_APP_ENV || 'local'].API_URL,
      changeOrigin: true,
    },
    [env.API.PLATFORM]: {
      // 要代理的地址
      target: env[REACT_APP_ENV || 'local'].API_URL,
      changeOrigin: true,
    },
    [env.API.MAMAGE]: {
      // 要代理的地址
      target: env[REACT_APP_ENV || 'local'].API_URL,
      changeOrigin: true,
    },
    [env.API.FSSC_MDM]: {
      // 要代理的地址
      target: env[REACT_APP_ENV || 'local'].API_URL,
      changeOrigin: true,
    },
  },
  test: {
    '/api/': {
      target: 'https://proapi.azurewebsites.net',
      changeOrigin: true,
      pathRewrite: { '^': '' },
    },
  },
  pre: {
    '/api/': {
      target: 'your pre url',
      changeOrigin: true,
      pathRewrite: { '^': '' },
    },
  },
};
