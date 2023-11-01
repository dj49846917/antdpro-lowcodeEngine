import { Constant } from '@/constant'
import { ENU_IMG } from '@/constant/img'
import '@/pages/user/login/index.less'
import loginApi, { getUserInfo, login } from '@/services/custom/user'
import { Button, Checkbox, Form, Input, notification, Tabs } from 'antd'
import defaultSettings from '../../../../config/defaultSettings'
import { useEffect, useRef, useState } from 'react'
import { FormattedMessage, history, useIntl, useModel } from 'umi'
import { loadAssets } from "@/utils/utils";
import { ProFormCaptcha } from '@ant-design/pro-components'

type LoginProps = {}

function Login(props: LoginProps) {
  const { REACT_APP_ENV } = process.env;
  console.log("666", REACT_APP_ENV);
  const intl = useIntl();
  const { initialState, setInitialState } = useModel('@@initialState');
  const [activeKey, setActiveKey] = useState('2')
  const [form] = Form.useForm()

  const doLogin = async () => { // 登录
    const validate = await form.validateFields()
    let encrypt = new JSEncrypt()
    encrypt.setPublicKey(Constant.PUBLIC_KEY)
    let params = {}
    if (activeKey === '1') { // 邮箱登录
      params = {
        loginType: "EMAIL",
        loginKey: validate.email,
        credentials: encrypt.encrypt(validate.credentials)
      }
    }
    if (activeKey === '2') { // 用户名登录
      params = {
        loginType: "LOGIN_NAME",
        loginKey: validate.username,
        credentials: encrypt.encrypt(validate.password)
      }
    }
    if (activeKey === '3') { // 手机号登录
      params = {
        loginType: "MOBILE_PHONE",
        loginKey: validate.phone,
        credentials: validate.code
      }
    }
    const result = await login(params)
    if (result && result.success) {
      localStorage.setItem(Constant.LOGIN_TOKEN_STORAGE, result.data)
      await loadAssets();
      notification.success({
        message: intl.formatMessage({
          id: 'pages.login.success',
          defaultMessage: '登录成功',
        }),
        duration: 0.5,
        onClose: async function () {
          // 查询用户信息
          const params = {
            token: result.data,
          }
          const res = await getUserInfo(params)
          const userInfo = {
            ...initialState,
            currentUser: res.data,
            settings: defaultSettings,
          }
          setInitialState(userInfo)
          localStorage.setItem(Constant.USER_INFO_STORAGE, userInfo.currentUser.userId)
          localStorage.setItem(Constant.USER_STORAGE, JSON.stringify(res.data))
          localStorage.setItem(Constant.BASE_URL, window.location.origin)
          history.push('/')
        }
      });
    }
  }

  const goToOhter = () => {
    localStorage.setItem(Constant.LOGIN_SYSTEM_STORAGE, 'bdh')
    window.open(Constant.BDH_LOGIN_URL)
  }

  const ref = useRef<HTMLDivElement>(null);


  useEffect(() => {
    const onKeyDown = (event: HTMLElementEventMap['keydown']) => {
      if (event.code === "Enter") {
        doLogin();
      }
    }
    const node = ref.current;
    node?.addEventListener('keydown', onKeyDown)

    return () => {
      node?.removeEventListener('keydown', onKeyDown);
    }
  }, [form])

  return (
    <div className='d-main'>
      <div
        className='d-container'
        ref={ref}
      >
        <img src={ENU_IMG.login_bg} />
        <div className='d-box'>
          <div className='d-login'>
            <div className='d-login-box'>
              <img src={ENU_IMG.logo_deloitte} />
              <div className='d-login-title'>{intl.formatMessage({
                id: 'page.login.title',
                defaultMessage: 'EasyDP易码低代码平台'
              })}</div>
            </div>
            <Form
              name="basic"
              initialValues={{ remember: true }}
              autoComplete="off"
              layout="vertical"
              requiredMark={false}
              className="d-form"
              form={form}
            >
              {
                REACT_APP_ENV === "ss" ? null : <Tabs defaultActiveKey="2" activeKey={activeKey} onChange={(e) => setActiveKey(e)} centered>
                  <Tabs.TabPane tab={intl.formatMessage({ id: 'app.login.user.title' })} key="2" />
                  <Tabs.TabPane tab={intl.formatMessage({ id: 'app.login.email.title' })} key="1" />
                  <Tabs.TabPane tab={intl.formatMessage({ id: 'app.login.phone.title' })} key="3" />
                </Tabs>
              }
              {
                activeKey === '1' && (
                  <>
                    <Form.Item
                      className='d-form-item'
                      label={intl.formatMessage({ id: 'app.settings.basic.email', defaultMessage: '邮箱' })}
                      name="email"
                      rules={[
                        {
                          required: true,
                          message: intl.formatMessage({ id: 'app.settings.basic.email-message', defaultMessage: '请输入您的邮箱' })
                        },
                        {
                          pattern: new RegExp(/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/),
                          message: intl.formatMessage({
                            id: 'app.settings.basic.email-message-wrong',
                            defaultMessage: '您的邮箱格式不合法！'
                          })
                        },
                      ]}
                    >
                      <Input
                        className='d-login-item'
                        placeholder={intl.formatMessage({
                          id: 'app.settings.basic.email-message',
                          defaultMessage: '请输入您的邮箱'
                        })}
                      />
                    </Form.Item>
                    <Form.Item
                      className='d-form-item'
                      label={intl.formatMessage({ id: 'pages.platform.datasource.form.password', defaultMessage: '密码' })}
                      name="credentials"
                      rules={[{
                        required: true,
                        message: intl.formatMessage({ id: 'app.settings.security.password-msg', defaultMessage: '请输入密码！' })
                      }]}
                    >
                      <Input.Password
                        className='d-login-item'
                        placeholder={intl.formatMessage({
                          id: 'app.settings.security.password-msg',
                          defaultMessage: '请输入密码！'
                        })}
                      />
                    </Form.Item>
                  </>
                )
              }
              {
                activeKey === '2' && (
                  <>
                    <Form.Item
                      className='d-form-item'
                      label={intl.formatMessage({ id: 'app.login.user.label', defaultMessage: '用户名' })}
                      name="username"
                      rules={[
                        {
                          required: true,
                          message: intl.formatMessage({ id: 'app.login.user.placeholder', defaultMessage: '请输入您的用户名' })
                        }
                      ]}
                    >
                      <Input
                        className='d-login-item'
                        placeholder={intl.formatMessage({ id: 'app.login.user.placeholder', defaultMessage: '请输入您的用户名' })}
                      />
                    </Form.Item>
                    <Form.Item
                      className='d-form-item'
                      label={intl.formatMessage({ id: 'pages.platform.datasource.form.password', defaultMessage: '密码' })}
                      name="password"
                      rules={[{
                        required: true,
                        message: intl.formatMessage({ id: 'app.settings.security.password-msg', defaultMessage: '请输入密码！' })
                      }]}
                    >
                      <Input.Password
                        className='d-login-item'
                        placeholder={intl.formatMessage({
                          id: 'app.settings.security.password-msg',
                          defaultMessage: '请输入密码！'
                        })}
                      />
                    </Form.Item>
                  </>
                )
              }
              {
                activeKey === '3' && (
                  <>
                    <Form.Item
                      className='d-form-item'
                      label={intl.formatMessage({ id: 'app.login.phone.label', defaultMessage: '手机号' })}
                      name="phone"
                      rules={[
                        {
                          required: true,
                          message: intl.formatMessage({ id: 'app.login.phone.label.placeholder', defaultMessage: '请输入手机号' })
                        },
                        {
                          pattern: new RegExp(/^1[35789]\d{9}$/),
                          message: intl.formatMessage({
                            id: 'app.login.phone.errormsg',
                            defaultMessage: '手机号格式不合法'
                          })
                        }
                      ]}
                    >
                      <Input
                        className='d-login-item'
                        placeholder={intl.formatMessage({ id: 'app.login.phone.label.placeholder', defaultMessage: '请输入手机号' })}
                      />
                    </Form.Item>
                    <span className='d-login-box'>
                      <div className='d-phone-label'>{intl.formatMessage({ id: 'app.login.code.label' })}</div>
                      <ProFormCaptcha
                        placeholder={intl.formatMessage({
                          id: 'pages.login.captcha.placeholder',
                          defaultMessage: '请输入验证码',
                        })}
                        captchaTextRender={(timing, count) => {
                          if (timing) {
                            return `${count} ${intl.formatMessage({
                              id: 'pages.getCaptchaSecondText',
                              defaultMessage: '获取验证码',
                            })}`;
                          }
                          return intl.formatMessage({
                            id: 'pages.login.phoneLogin.getVerificationCode',
                            defaultMessage: '获取验证码',
                          });
                        }}
                        name="code"
                        phoneName="phone"
                        rules={[
                          {
                            required: true,
                            message: (
                              <FormattedMessage
                                id="pages.login.captcha.required"
                                defaultMessage="请输入验证码！"
                              />
                            ),
                          },
                        ]}
                        onGetCaptcha={async (phone) => {
                          loginApi.getCode(phone)
                        }}
                      />
                    </span>
                  </>
                )
              }
              {
                REACT_APP_ENV === "ss" ? <div style={{ marginTop: "24px" }} /> : (
                  <div className='d-form-check-form'>
                    <Form.Item
                      name="remember"
                      valuePropName="checked"
                    >
                      <Checkbox className='d-form-check-box'><span className='d-form-check'>同意并接受</span><span className='d-link'>{`《隐私保护条例》`}</span></Checkbox>
                    </Form.Item>
                    <div className='d-form-forget'>忘记密码</div>
                  </div>
                )
              }
              <Button
                type="primary"
                onClick={doLogin}
                className='d-login-btn'
              >登 录</Button>
            </Form>
            {/* <div className='d-more'>
              <div></div>
              <span>更多登录方式</span>
              <div></div>
            </div>
            <div className='d-more-btn'>
              <Button
                className='d-more-btn-item'
                onClick={goToOhter}
              >BDH</Button>
            </div> */}
          </div>
        </div>
      </div>
      <div className='d-footer'>
        <div>©2021 Deloitte</div>
        <div>沪ICP备14034xxx号-3</div>
        <div><img src={ENU_IMG.record} />沪公网安备31010102006816号</div>
      </div>
    </div>
  )
}

export default Login
