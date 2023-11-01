// import progressApi from '@/services/custom/appInfo/progress';
import { Button, notification, Tree } from 'antd'
import { DataNode } from 'antd/lib/tree';
import { useReducer, useState } from 'react';
import { useIntl } from 'umi';
// import AppAuth from './AppAuth';
import './index.less'
import SourceAuth from './SourceAuth';
// import SourceDefaultAuth from './SourceDefaultAuth';
import { initialState, reducer, AuthModel, ActionType } from './context';
import authApi from '@/services/custom/appInfo/auth';
import PageAuth from './PageAuth';

type Props = {}

function AuthManage(props: Props) {
  const intl = useIntl();
  const menuAuthName = intl.formatMessage({ id: 'pages.app.auth.menu.sourceAuth' })
  const [state, dispatch] = useReducer(reducer, initialState)
  const [selectedKeys, setSelectedKeys] = useState<string[]>([menuAuthName]);
  const [refreshCountPage, setRefreshCountPage] = useState(0)
  const [refreshCountMenu, setRefreshCountMenu] = useState(0)

  const treeData: DataNode[] = [
    {
      title: menuAuthName,
      key: menuAuthName,
    },
    {
      title: intl.formatMessage({ id: 'pages.app.auth.menu.pageAuth' }),
      key: intl.formatMessage({ id: 'pages.app.auth.menu.pageAuth' }),
    },
    // {
    //   title: intl.formatMessage({ id: 'pages.app.auth.menu.appAuth' }),
    //   key: intl.formatMessage({ id: 'pages.app.auth.menu.appAuth' }),
    // },
    // {
    //   title: intl.formatMessage({ id: 'pages.app.auth.menu.sourceDefaultAuth' }),
    //   key: intl.formatMessage({ id: 'pages.app.auth.menu.sourceDefaultAuth' }),
    // }
  ];

  const onSelect = (selectedKeysValue: React.Key[], info: any) => {
    setSelectedKeys(selectedKeysValue as string[]);
    dispatch({ type: ActionType.changeSelectedKeysSource, payload: { ...state, selectedKeysSource: [] } })
  };

  const showContent = () => {
    if (selectedKeys[0] === menuAuthName) { // 资源权限
      return <SourceAuth refreshFlag={refreshCountMenu} />
    } else {
      return <PageAuth refreshFlag={refreshCountPage} />
    }

    // else if (selectedKeys[0] === intl.formatMessage({ id: 'pages.app.auth.menu.appAuth' })) {
    //   return <AppAuth title={selectedKeys[0]} />
    // } else {
    //   return <SourceDefaultAuth title={selectedKeys[0]} />
    // }
  }

  const saveData = async () => {
    if (selectedKeys[0] === menuAuthName) {
      const params = {
        roleId: state.selectedKeysSource[0],
        menuAuthMap: state.saveParams
      }
      const result = await authApi.saveSource(params)
      if (result && result.success) {
        notification.success({
          message: intl.formatMessage({ id: 'pages.btn.success' })
        })
        setRefreshCountMenu(refreshCountMenu + 1)
      }
    } else {
      const params = {
        roleId: state.selectedKeysSource[0],
        authJson: state.pageAuthSaveParams
      }
      const result = await authApi.savePageSource(params)
      if (result && result.success) {
        notification.success({
          message: intl.formatMessage({ id: 'pages.btn.success' })
        })
        setRefreshCountPage(refreshCountPage + 1)
      }
    }
  }

  return (
    <AuthModel.Provider value={{ state, dispatch }}>
      <div className='d-box'>
        <div className='container'>
          <div className='menu margin'>
            <div className='header'>{intl.formatMessage({ id: 'menu.setup.auth' })}</div>
            <Tree
              className='tree'
              onSelect={onSelect}
              selectedKeys={selectedKeys}
              treeData={treeData}
            />
          </div>

          {showContent()}
          {/* <div className='content'>
        <div className="d-title">{selectedKeys[0]}</div>
      </div> */}
        </div>
        <div className='footer'>
          <Button type='primary' onClick={() => saveData()}>保存</Button>
        </div>
      </div>
    </AuthModel.Provider>
  )
}

export default AuthManage
