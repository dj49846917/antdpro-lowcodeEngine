import menusManagementApi, { AppMenuPagesData, AppMenuTreeData } from "@/services/custom/appInfo/menu/service";
import { DefaultOptionType } from "antd/lib/select";
import { DataNode } from "antd/lib/tree";
import React, { useEffect, useMemo, useState } from "react";

export type UseTreeDataType = { title: string, id: string, pageId: string }
export const useTreeData = (renderTitle: ({ title, id, pageId }: UseTreeDataType) => React.ReactNode): {
  treeData?: DataNode[];
  ids?: string[];
  loading: boolean;
  loadData: () => void;
} => {
  const [menuTreeData, setMenuTreeData] = useState<AppMenuTreeData[]>();
  const [loading, setLoading] = useState(false);

  const loadData = () => {
    setLoading(true);
    menusManagementApi.getAppMenusTree().then((res) => {
      if (res.success) {
        setMenuTreeData(res.data);
      }
    }).catch(() => {
    }).finally(() => setLoading(false))
  }
  const treeDataAndIds = useMemo(() => {
    if (!menuTreeData) {
      return;
    }
    const ids: string[] = [];
    const formatTreeData = (data?: AppMenuTreeData[]): DataNode[] | undefined => {
      return data?.map(menu => {
        ids.push(menu.menuId);
        return {
          key: menu.menuId,
          title: renderTitle({
            title: menu.menuName,
            id: menu.menuId,
            pageId: menu.pageId
          }),
          nodeData: menu,
          children: menu.children && formatTreeData(menu.children)
        }
      })
    };
    return {
      treeData: formatTreeData(menuTreeData),
      ids
    };
  }, [menuTreeData]);

  useEffect(() => {
    loadData();
  }, []);

  return { ...treeDataAndIds, loadData, loading }
}

export const usePages = (params?: { terminalType?: 1 | 2 }) => {
  const [pages, setPages] = useState<DefaultOptionType[]>([]);
  useEffect(() => {
    const formatPages = (data: AppMenuPagesData[]) => {
      return data?.map(page => {
        return {
          value: page.pageId,
          label: page.pageName,
        }
      })
    }
    menusManagementApi.getPages(params).then(res => {
      setPages(formatPages(res.data));
    })
  }, []);
  return pages;
}


