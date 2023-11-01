
import type { AppListType } from '@/pages/application/type';
import type { DicType } from '@/types/common';
import { ConstantKeyToContentValue, setAppId, setAppInfo } from '@/utils/utils';
import { Popconfirm } from 'antd';
import { useHistory, useIntl } from 'umi';
import LcIcon from '../LcIcon'
import './index.less'

type Props = {
  item: AppListType,
  dicList: DicType[],
  deleteApp: (item: AppListType) => void;
}

function DAppCard(props: Props) {
  const intl = useIntl();
  const history = useHistory()
  const goToPage = async (item: AppListType) => {
    setAppId(props.item.appId as string);
    setAppInfo(item);
    history.push(`/appinfo/page`)
  }

  return (
    <div
      className="d-app-box"
      key={props.item.appId}
    >
      <div className="d-app-item">
        <img
          className="d-app-item-logo"
          src={props.item.appLogo}
        />
        <div className="d-app-item-msg">
          <div className={props.item.appType == '0' ? "d-app-item-status" : "d-app-item-done"}>{ConstantKeyToContentValue(props.dicList, props.item.appType as string)}</div>
          <div className="d-app-item-name">{props.item.appName}</div>
          <div className="d-app-item-desc">{props.item.appDesc}</div>
        </div>
      </div>
      <div className="d-modal">
        <div className="d-modal-item">
          <LcIcon type="icon-a-yulan2x1" />
          <span>{intl.formatMessage({ id: 'pages.table.preview' })}</span>
        </div>
        <div
          className="d-modal-item"
          onClick={() => goToPage(props.item)}
        >
          <LcIcon type="icon-a-kaifa2x" />
          <span>{intl.formatMessage({ id: 'pages.application.btnPublish' })}</span>
        </div>
        <div
          className="d-modal-item"
          onClick={() => {
            setAppId(props.item.appId as string);
            setAppInfo(props.item);
            history.push("/appinfo/setup/base")
          }}
        >
          <LcIcon type="icon-a-shezhi2x" />
          <span>{intl.formatMessage({ id: 'pages.application.appSet' })}</span>
        </div>
        <Popconfirm
          title={intl.formatMessage({ id: 'pages.delete.placeholder' })}
          onConfirm={() => props.deleteApp(props.item)}
        >
          <div className="d-modal-item">
            <LcIcon type="icon-a-shanchu2x1" />
            <span>{intl.formatMessage({ id: 'pages.delete' })}</span>
          </div>
        </Popconfirm>
      </div>
    </div>
  )
}

export default DAppCard
