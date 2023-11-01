import component from './en-US/component';
import menu from './en-US/menu';
import pages from './en-US/pages';
import settingDrawer from './en-US/settingDrawer';
import settings from './en-US/settings';
import components from "@/locales/en-US/components";
import table from "@/locales/en-US/table";

export default {
  'navBar.lang': 'Languages',
  'layout.user.link.help': 'Help',
  'layout.user.link.privacy': 'Privacy',
  'layout.user.link.terms': 'Terms',
  'app.copyright.produced': 'Produced by Ant Financial Experience Department',
  'app.preview.down.block': 'Download this page to your local project',
  'app.welcome.link.fetch-blocks': 'Get all block',
  'app.welcome.link.block-list': 'Quickly build standard, pages based on `block` development',
  ...menu,
  ...settingDrawer,
  ...settings,
  ...component,
  ...pages,
  ...components,
  ...table,
};
