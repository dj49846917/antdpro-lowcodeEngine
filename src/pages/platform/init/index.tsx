import { Constant } from "@/constant";
import Page from "@/pages/appinfo/page";
import { setAppId } from "@/utils/utils";
import { useEffect } from "react";

const PlatformPage = () => {
  useEffect(() => {
    setAppId("1");
    localStorage.removeItem(Constant.APPINFO_STORAGE)
  }, [])

  return (
    <Page isAppInit />
  )
}

export default PlatformPage
