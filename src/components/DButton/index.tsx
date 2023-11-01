import { useIntl } from "umi"
import { Button, ButtonProps } from "antd"

import './index.less'


interface Props extends ButtonProps {

}

function DTableButton(props: Props) {
  const intl = useIntl()

  return (
    <Button className="d-custom-btn" {...props}></Button>
  )
}

export default DTableButton