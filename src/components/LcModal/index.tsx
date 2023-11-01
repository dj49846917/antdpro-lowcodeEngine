import { Modal, ModalProps } from "antd";
import { useLcPrefix } from "@/hooks/useLcPrefix";
import "./style.less";
import { useState } from "react";
import { FullscreenExitOutlined, FullscreenOutlined } from "@ant-design/icons";

const LcModal = (props: ModalProps) => {
  const prefixCls = useLcPrefix('modal');
  const headerPrefixCls = useLcPrefix('modal-header');
  const [full, setFull] = useState(false);

  const handleFull = () => {
    setFull(!full);
  }

  const width = full ? '100%' : props.width || '70%';
  const style = {
    height: full ? '100%' : (props.style?.height || '80%')
  }
  return (
    <Modal
      destroyOnClose
      className={prefixCls}
      centered
      {...props}
      width={width}
      style={style}
      title={
        <header className={headerPrefixCls}>
          <label>{props.title}</label>
          {full ? <FullscreenExitOutlined onClick={handleFull} />
            : <FullscreenOutlined onClick={handleFull} />}
        </header>
      }
    >
      {props.children}
    </Modal>
  )
}

export default LcModal;
