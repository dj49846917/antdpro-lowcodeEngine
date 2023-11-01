import { IconFont } from "@/components/LcIcon";
import { getTextToLanguage } from "@/utils/utils";
import type { MenuDataItem } from "@ant-design/pro-layout";

export const loopMenuItem = (menus: MenuDataItem[]): MenuDataItem[] =>
  menus.map(({ name, icon, routes, ...other }) => {
    const _name = getTextToLanguage(name);
    return {
      ...other,
      name: _name,
      icon: icon ? <IconFont type={icon as string} /> : undefined,
      routes: routes && loopMenuItem(routes),
    }
  })
