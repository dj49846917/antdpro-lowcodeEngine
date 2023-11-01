import { useLcPrefix } from "@/hooks/useLcPrefix";
import { FC } from "react";
import "./style.less";

const TopBar: FC<any> = (props) => {
  const prefixCls = useLcPrefix('top-bar');

  return (
    <div className={prefixCls} style={props.style}>
      {props.children}
    </div>
  )
}

export default TopBar
