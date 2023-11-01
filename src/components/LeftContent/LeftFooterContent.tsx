import '@/components/LeftContent/index.less'
import { logout } from '@/services/custom/user'
import { notification } from 'antd'
import { FormattedMessage, useIntl, useModel } from 'umi'
import { RedirectPlace } from '@/utils/utils'
import { Constant } from '@/constant'

type LeftFooterContentProps = {}

function LeftFooterContent(props: LeftFooterContentProps) {
  const { initialState, setInitialState } = useModel('@@initialState');
  const intl = useIntl();

  const doLogout = async () => {
    const token = localStorage.getItem(Constant.LOGIN_TOKEN_STORAGE)
    const params = {
      token,
    }
    const result = await logout(params)
    if (result && result.success) {
      notification.success({
        message: intl.formatMessage({
          id: 'pages.logout.success',
          defaultMessage: '退出成功',
        }),
        duration: 1,
        onClose: () => {
          RedirectPlace()
          setInitialState({
            ...initialState,
            currentUser: undefined
          })
        }
      })
    }
  }

  return (
    <div className='left-footer'>
      <div className='logout' onClick={doLogout}><FormattedMessage id="component.leftContent.logout" defaultMessage="退 出" /></div>
    </div>
  )
}

export default LeftFooterContent
