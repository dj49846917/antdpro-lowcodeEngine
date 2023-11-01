import { Input, InputProps } from 'antd'
import './index.less'
interface Props extends InputProps {

}

function index(props: Props) {
  return (
    <Input {...props} className="d-input" />
  )
}

export default index