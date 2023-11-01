import { Constant } from "@/constant";
import { Drequest } from "@/utils/request";
import { getAppId, getUserId } from "@/utils/utils";

export interface AppMenuTreeData {
  menuId: string;
  menuName: string;
  pageId: string;
  children: AppMenuTreeData[];
}

export interface AppMenuPagesData {
  pageId: string;
  pageName: string;
}

export interface MenuFormData {
  id: string;
  name: string;
  icon: string;
  page: string;
  path: string;
  order: number;
  parentId: string;
  visible: boolean;
  creator?: string;
  date?: string;
}

const menusManagementApi = {
  getAppMenusTree: (): Promise<API.Result<AppMenuTreeData[]>> => {
    return Drequest.post(`${Constant.API.MDM}appMenu/list`, {
      data: {
        "data": getAppId(),
        "operator": getUserId(),
        "source": "PC",
        "traceId": "",
        "version": "1"
      }
    })
  },
  createMenu: (params: MenuFormData) => {
    const req: {
      "appId": string; //"当前应用ID",
      "menuId": string; //"菜单id",
      "menuIcon": string; //"ProjectOutlined(菜单前端显示ICON)",
      "menuName": string; //"菜单名称",
      "menuOrder": number; //0,
      "menuUri": string; //"/formTest（菜单前端路由uri）",
      "pageId": string; //"绑定页面ID",
      "menuVisible": number; //"是否显示",
      "menuParentId": string; //"父级菜单ID，根节点传0"
    } = {
      appId: getAppId(),
      menuIcon: params.icon,
      menuId: params.id,
      menuName: params.name,
      menuOrder: params.order,
      menuUri: params.path,
      pageId: params.page,
      menuVisible: Number(params.visible || 0),
      menuParentId: params.parentId,
    }
    return Drequest.post(`${Constant.API.MDM}appMenu/save`, {
      data: {
        "data": req,
        "operator": getUserId(),
        "source": "PC",
        "traceId": "",
        "version": "1"
      }
    })
  },
  getDetail: (id: string): Promise<MenuFormData> => {
    return Drequest.post(`${Constant.API.BUSINESS}appMenu/detail`, {
      data: {
        "data": id,
        "operator": getUserId(),
        "source": "PC",
        "traceId": "",
        "version": "1"
      }
    }).then(res => {
      return {
        icon: res.data.menuIcon,
        id: res.data.menuId,
        name: res.data.menuName,
        visible: !!res.data.menuVisible,
        order: res.data.menuOrder,
        path: res.data.menuUri,
        page: res.data.pageId,
        parentId: res.data.menuParentId,
        creator: res.data.createUser,
        date: res.data.createDate,
      }
    })
  },
  getPages: (params?: { terminalType?: 1 | 2 }): Promise<API.Result<AppMenuPagesData[]>> => {
    return Drequest.post(`${Constant.API.MDM}page/list`, {
      data: {
        "data": {
          ...params,
          "appId": getAppId(),
          "datasourceId": "",
          "pageDesc": "",
          "pageId": "",
          "pageName": "",
          "tableName": ""
        },
        "operator": getUserId(),
        "source": "PC",
        "traceId": "",
        "version": "1"
      }
    })
  },
  delMenu: (id: string) => {
    return Drequest.post(`${Constant.API.MDM}appMenu/delete`, {
      data: {
        "data": id,
        "operator": getUserId(),
        "source": "PC",
        "traceId": "",
        "version": "1"
      }
    })
  }
}

export default menusManagementApi
