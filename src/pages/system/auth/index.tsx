import { Constant } from '@/constant'
import Role from '@/pages/appinfo/setup/role'
import './index.less'

function Auth() {
  return (
    <div className='d-sys-auth'>
      <Role isApp={true} />
    </div>
  )
}

export default Auth
