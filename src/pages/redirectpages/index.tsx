import { useEffect } from 'react'
import { history, useModel } from 'umi';
import { getUrlParms } from '@/utils/utils';
import { getUserInfo } from '@/services/custom/user';
import defaultSettings from '../../../config/defaultSettings';
import { Constant } from '@/constant';

function RedirectPages() {
  const { initialState, setInitialState } = useModel('@@initialState');
  useEffect(() => {
    const getToken = localStorage.getItem(Constant.LOGIN_TOKEN_STORAGE)
    if (!getToken) {
      const token = getUrlParms('token')
      if (token) {
        const params = {
          token,
        }
        getUserInfo(params).then(res => {
          localStorage.setItem(Constant.USER_INFO_STORAGE, res.data.userId)
          localStorage.setItem(Constant.USER_STORAGE, res.data)
          setInitialState({
            ...initialState,
            currentUser: res.data,
            settings: defaultSettings,
            pageFlag: false,
            currentPath: history.location.pathname
          })
        })
        localStorage.setItem(Constant.LOGIN_TOKEN_STORAGE, token)
        history.push("/dashboard")
      } else {
        history.push("/user/login")
      }
    } else {
      history.push("/dashboard")
    }
  }, [])
  return (
    <div>获取token</div>
  )
}

export default RedirectPages
