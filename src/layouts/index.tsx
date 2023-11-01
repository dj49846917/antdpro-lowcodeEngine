import { Constant } from "@/constant";
import { getAppId, removeAppInfo, setAppId } from "@/utils/utils";
import { useEffect, useMemo } from "react";

export default (props: any) => {
    const pathName: string = useMemo(() => props.location.pathname, [props.location.pathname])
    useEffect(() => {
        /** 监听浏览器标签切换 */
        const callback = () => {
            if (!document.hidden) {
                localStorage.setItem(Constant.APPID_STORAGE, getAppId());
            }
        }
        document.addEventListener('visibilitychange', callback);
        return () => {
            document.removeEventListener('visibilitychange', callback);
        }
    }, []);

    useMemo(() => {
        console.log("pathName", pathName)
        // 应用配置
        if (pathName.startsWith('/appinfo/')) {
            // 兼容 lowcode页面内通过loca
            localStorage.setItem(Constant.APPID_STORAGE, getAppId());
        } else if (pathName.startsWith('/designer') || pathName.startsWith('/progress')) {
            // 兼容 lowcode页面内通过loca
            localStorage.setItem(Constant.APPID_STORAGE, getAppId());
        } else {
            // 平台配置
            setAppId('0');
            removeAppInfo();
            // 兼容 lowcode页面内通过loca
            localStorage.setItem(Constant.APPID_STORAGE, "0");
        }
    }, [pathName]);
    return props.children;
}
