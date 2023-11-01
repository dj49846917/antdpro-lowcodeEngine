import { Settings as LayoutSettings } from '@ant-design/pro-layout';

const Settings: LayoutSettings & {
  pwa?: boolean;
  logo?: string;
} = {
  navTheme: 'light',
  // 拂晓蓝
  primaryColor: '#009A44',
  layout: 'mix',
  contentWidth: 'Fluid',
  fixedHeader: false,
  fixSiderbar: true,
  colorWeak: false,
  title: 'EasyDP易码低代码平台',
  pwa: false,
  // logo: 'https://bdhtest.tax.deloitte.com.cn/images/logo_deloitte.png',
  iconfontUrl: '',
};

export default Settings;
