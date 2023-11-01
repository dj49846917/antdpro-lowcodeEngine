import page from '@/locales/zh-CN/pages/appInfo/page'
import menu from '@/locales/zh-CN/pages/appInfo/menu'
import model from '@/locales/zh-CN/pages/appInfo/model'
import publish from '@/locales/zh-CN/pages/appInfo/publish'
import progress from '@/locales/zh-CN/pages/appInfo/progress'
import rule from '@/locales/zh-CN/pages/appInfo/rule'
import role from '@/locales/zh-CN/pages/appInfo/role'
import auth from '@/locales/zh-CN/pages/appInfo/auth'
import api from '@/locales/zh-CN/pages/appInfo/api'
import log from '@/locales/zh-CN/pages/system/log'
import user from '@/locales/zh-CN/pages/system/user'
import org from '@/locales/zh-CN/pages/system/org'

export default {
  ...menu,
  ...model,
  ...page,
  ...progress,
  ...publish,
  ...rule,
  ...role,
  ...auth,
  ...api,
  ...log,
  ...user,
  ...org,
  'pages.application.btnPublish': '开发',
  'pages.application.appSet': '应用设置',
  'pages.application.delete': '删除',
  'pages.application.addApp': '新增应用',
  'pages.application.exportApp': '导出应用',
  'pages.application.searchHolder': '请输入应用名称进行查询',
  'pages.application.model.title': '新建应用',
  'pages.application.model.appName': '应用名称',
  'pages.application.model.appNamePlaceHolder': '请输入应用名称',
  'pages.application.model.appUri': '应用路径',
  'pages.application.model.appUriTip': '请输入应用路径',
  'pages.application.model.appNameTip': '请输入应用名称！',
  'pages.application.model.appDesc': '应用描述',
  'pages.application.model.appDescPlaceHolder': '请输入应用描述',
}
