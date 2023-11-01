export const API_PREFIX = "/api"

const { REACT_APP_ENV } = process.env;
const API_URL = REACT_APP_ENV === 'local' ? 'http://10.81.128.35:9090' : 'http://10.81.128.35:9001'

export default {
  local: {
    // API_URL: 'http://10.20.12.58:3000',               // 接口地址
    API_URL: 'http://10.81.128.35:8000',
    LOWCODE_DESIGNER_URL: 'http://localhost:5556/basic-form.html',             // 低代码设计器地址
    LOWCODE_PREVIEW_URL: 'http://localhost:5556/preview.html',
    PUBLIC_KEY: 'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQChmxwagM6yMCiWHFcDlf3hAj1/IB/thNKGLhRE1TU7fM2H49KUNQZ8eSRHBxRo9xV/uE6m9mWaDs2ISxLnYXoKd+j+k6ny1Mk3qxlJ402ssC3lqCLWr3HJGXbTI4WkpR43KJEfztrbDMzS6lrfaGHvuQ+1b7Gl9+EuVtJwPyQaMwIDAQAB',
    BDH_LOGIN_URL: 'https://bdhaccounttest.tax.deloitte.com.cn/auth/oauth/authorize?response_type=code&client_id=lowcode&redirect_uri=http://10.81.128.121:9000/auth/sso/callback',
  },
  ss: {
    API_URL: 'http://10.20.12.58:3000',               // 接口地址
    LOWCODE_DESIGNER_URL: 'http://localhost:5556/basic-form.html',             // 低代码设计器地址
    LOWCODE_PREVIEW_URL: 'http://localhost:5556/preview.html',
    PUBLIC_KEY: 'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQChmxwagM6yMCiWHFcDlf3hAj1/IB/thNKGLhRE1TU7fM2H49KUNQZ8eSRHBxRo9xV/uE6m9mWaDs2ISxLnYXoKd+j+k6ny1Mk3qxlJ402ssC3lqCLWr3HJGXbTI4WkpR43KJEfztrbDMzS6lrfaGHvuQ+1b7Gl9+EuVtJwPyQaMwIDAQAB',
    BDH_LOGIN_URL: 'https://bdhaccounttest.tax.deloitte.com.cn/auth/oauth/authorize?response_type=code&client_id=lowcode&redirect_uri=http://10.81.128.121:9000/auth/sso/callback',
  },
  dev: {
    // API_URL: 'http://10.20.12.58:3000',
    API_URL: 'http://10.81.128.35:8000',
    LOWCODE_DESIGNER_URL: 'http://10.81.128.121:5556/basic-form.html',
    LOWCODE_PREVIEW_URL: 'http://10.81.128.121:5556/preview.html',
    PUBLIC_KEY: 'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQChmxwagM6yMCiWHFcDlf3hAj1/IB/thNKGLhRE1TU7fM2H49KUNQZ8eSRHBxRo9xV/uE6m9mWaDs2ISxLnYXoKd+j+k6ny1Mk3qxlJ402ssC3lqCLWr3HJGXbTI4WkpR43KJEfztrbDMzS6lrfaGHvuQ+1b7Gl9+EuVtJwPyQaMwIDAQAB',
    BDH_LOGIN_URL: 'https://bdhaccounttest.tax.deloitte.com.cn/auth/oauth/authorize?response_type=code&client_id=lowcode&redirect_uri=http://10.81.128.121:9000/auth/sso/callback',
  },
  prod: {
    API_URL,
    LOWCODE_DESIGNER_URL: 'http://10.81.128.121:5556/basic-form.html',
    LOWCODE_PREVIEW_URL: 'http://10.81.128.121:5556/preview.html',
    PUBLIC_KEY: 'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQChmxwagM6yMCiWHFcDlf3hAj1/IB/thNKGLhRE1TU7fM2H49KUNQZ8eSRHBxRo9xV/uE6m9mWaDs2ISxLnYXoKd+j+k6ny1Mk3qxlJ402ssC3lqCLWr3HJGXbTI4WkpR43KJEfztrbDMzS6lrfaGHvuQ+1b7Gl9+EuVtJwPyQaMwIDAQAB',
    BDH_LOGIN_URL: 'https://bdhaccounttest.tax.deloitte.com.cn/auth/oauth/authorize?response_type=code&client_id=lowcode&redirect_uri=http://10.81.128.121:9000/auth/sso/callback',
  },
  API: {
    LC_AUTH: `/lc-auth/`,
    MDM: `/mdm/`,
    WORKFLOW: `/workflow/`,
    BUSINESS: `/business/`,
    OSS: `/oss/`,
    RULE: `/rule/`,
    FSSC_BUSINESS: `/fssc-business/`,
    PLATFORM: `/platform/`,
    MAMAGE: `/manage/`,
    FSSC_MDM: `/fssc-mdm/`,
  }
}
