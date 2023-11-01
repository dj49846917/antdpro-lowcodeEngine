import page from '@/locales/en-US/pages/appInfo/page'
import menu from '@/locales/en-US/pages/appInfo/menu'
import model from '@/locales/en-US/pages/appInfo/model'
import progress from '@/locales/en-US/pages/appInfo/progress'
import publish from '@/locales/en-US/pages/appInfo/publish'
import rule from '@/locales/en-US/pages/appInfo/rule'
import role from '@/locales/en-US/pages/appInfo/role'
import auth from '@/locales/en-US/pages/appInfo/auth'
import api from '@/locales/en-US/pages/appInfo/api'
import log from '@/locales/en-US/pages/system/log'
import user from '@/locales/en-US/pages/system/user'
import org from '@/locales/en-US/pages/system/org'

export default {
  ...menu,
  ...page,
  ...progress,
  ...publish,
  ...model,
  ...rule,
  ...role,
  ...auth,
  ...api,
  ...log,
  ...user,
  ...org,
  'pages.application.btnPublish': 'dev',
  'pages.application.appSet': 'appSet',
  'pages.application.delete': 'delete',
  'pages.application.addApp': 'addApp',
  'pages.application.exportApp': 'exportApp',
  'pages.application.searchHolder': 'please input appName to search',
  'pages.application.model.title': 'addApp',
  'pages.application.model.appName': 'appName',
  'pages.application.model.appNamePlaceHolder': 'please input appName',
  'pages.application.model.appNameTip': 'please input appName！',
  'pages.application.model.appDesc': 'appDesc',
  'pages.application.model.appDescPlaceHolder': 'please input appDesc',
}
