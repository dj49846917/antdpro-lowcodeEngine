
import Preview from "@/components/Preview";
import { Constant } from "@/constant";
import { setAppId } from "@/utils/utils";
import { useEffect } from "react";

function DashBoard() {
  useEffect(() => {
    setAppId("1");
    localStorage.removeItem(Constant.APPINFO_STORAGE)
  }, [])
  return <Preview pageId="108798357572022272" />
}

export default DashBoard