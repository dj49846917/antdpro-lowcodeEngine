import { createFromIconfontCN } from "@ant-design/icons";
import "./index.less"
import React from "react";
import { getBaseUrl } from "@/utils/utils";

interface LcIconProps {
  type: string;
  name?: string;
  style?: React.CSSProperties;
  onClick?: () => void
}
export const IconFont = createFromIconfontCN({
  scriptUrl: `${getBaseUrl()}/oss/file/viewCompatibleImage?fileUrl=common/materials/iconfont.js`
  // scriptUrl: `http://easyapp-file.oss-cn-hangzhou.aliyuncs.com/common/materials/iconfont.js`
});

const LcIcon = ({ type, name, style, onClick }: LcIconProps) => {
  return type ? <IconFont type={type} style={style} onClick={onClick} /> : null
}

export default LcIcon
