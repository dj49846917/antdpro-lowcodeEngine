import Preview from "@/components/Preview";
import { Constant } from "@/constant";
import { setAppId } from "@/utils/utils";
import { useEffect } from "react";

function DashBoard() {
  useEffect(() => {
    setAppId("0");
    localStorage.removeItem(Constant.APPINFO_STORAGE)
  }, [])
  return <Preview pageId="108402800634490880" />
}

export default DashBoard