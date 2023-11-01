import { useIntl } from "umi"
import { Button, ButtonProps, Popconfirm, Tooltip } from "antd"
import LcIcon, { IconFont } from "../LcIcon"
import './index.less'

interface Props extends ButtonProps {
  iconType: "preview" | "edit" | "watch" | "design" | 'copy' | "delete" | "add" | "more" | "cancel" | "publish" | "reset" | "save" | "rename" | "print",
  tip?: string,
  comfirmTip?: string,
  onClick: () => void,
  showComfirm?: boolean
}

function DTableButton(props: Props) {
  const intl = useIntl()
  const showIcon = (icon: string) => {
    switch (icon) {
      case 'design':
        return <LcIcon type="icon-a-sheji2x" name="d-table-btn" style={{ fontSize: '24px', position: 'relative', left: '-4px' }} />
      case 'copy':
        return <LcIcon type="icon-a-fuzhi2x" name="d-table-btn" style={{ fontSize: '24px' }} />
      case 'edit':
        return <LcIcon type="icon-a-bianji2x2" name="d-table-btn" style={{ fontSize: '24px' }} />
      case 'preview':
        return <LcIcon type="icon-a-yulan2x" name="d-table-btn" style={{ fontSize: '24px' }} />
      case 'delete':
        return <LcIcon type="icon-a-shanchu2x" name="d-table-btn" style={{ fontSize: '24px' }} />
      case 'add':
        return <LcIcon type="icon-a-2x" name="d-table-btn" style={{ fontSize: '24px' }} />
      case 'more':
        return <LcIcon type="icon-a-gengduo2x" name="d-table-btn" style={{ fontSize: '24px' }} />
      case 'cancel':
        return <LcIcon type="icon-a-X2x" name="d-table-btn" style={{ fontSize: '24px' }} />
      case 'publish':
        return <LcIcon type="icon-fabu" style={{ fontSize: '24px', position: 'relative', top: '-2px' }} name="d-table-btn" />
      case 'reset':
        return <LcIcon type="icon-zhongzhi1" name="d-table-btn" style={{ fontSize: '15px', position: 'relative', left: '4px' }} />
      case 'save':
        return <LcIcon type="icon-baocun" name="d-table-btn" style={{ fontSize: '24px' }} />
      case 'rename':
        return <LcIcon type="icon-a-caozuo2x" name="d-table-btn" style={{ fontSize: '24px' }} />
      case 'print':
        return <LcIcon type="icon-dayin" name="d-table-btn" style={{ fontSize: '14px' }} />
      default:
        return <IconFont type={icon} style={{marginLeft: '10px', fontSize: '14px'}} />
    }
  }

  const showTitle = () => {
    if (props.tip) {
      return props.tip
    } else {
      if (props.iconType === 'design') {
        return intl.formatMessage({ id: 'pages.appInfo.page.table.action.pageDesign' })
      }
      if (props.iconType === 'copy') {
        return intl.formatMessage({ id: 'pages.appInfo.page.table.action.copy' })
      }
      if (props.iconType === 'add') {
        return intl.formatMessage({ id: 'table.actions.add' })
      }
      if (props.iconType === 'edit') {
        return intl.formatMessage({ id: 'table.actions.edit' })
      }
      if (props.iconType === 'delete') {
        return intl.formatMessage({ id: 'table.actions.delete' })
      }
      if (props.iconType === "preview") {
        return intl.formatMessage({ id: 'pages.table.preview' })
      }
      if (props.iconType === "more") {
        return intl.formatMessage({ id: 'table.actions.more' })
      }
      if (props.iconType === "watch") {
        return intl.formatMessage({ id: 'table.actions.view' })
      }
      if (props.iconType === "cancel") {
        return intl.formatMessage({ id: 'pages.cancel' })
      }
      if (props.iconType === "publish") {
        return intl.formatMessage({ id: 'pages.publish' })
      }
      if (props.iconType === "reset") {
        return intl.formatMessage({ id: 'table.action.resetPsd' })
      }
      if (props.iconType === "save") {
        return intl.formatMessage({ id: 'table.action.save' })
      }
      if (props.iconType === "rename") {
        return intl.formatMessage({ id: 'table.action.rename' })
      }
      if (props.iconType === "print") {
        return intl.formatMessage({ id: 'table.action.print' })
      }
      return intl.formatMessage({ id: 'pages.table.action' })
    }
  }

  return (
    <Tooltip placement="topLeft" title={props.title ? props.title : () => showTitle()} arrowPointAtCenter>
      {
        props.showComfirm ? (
          <Popconfirm
            title={props.comfirmTip || intl.formatMessage({ id: 'pages.action.placeholder' })}
            onConfirm={() => {
              props.onClick()
            }}
          >
            <Button icon={showIcon(props.iconType)} type="link" disabled={props.disabled} />
          </Popconfirm>
        ) : (
          <Button onClick={() => props.onClick()} icon={showIcon(props.iconType)} type="link" disabled={props.disabled} />
        )
      }
    </Tooltip>
  )
}

export default DTableButton

DTableButton.defaultProps = {
  onClick: () => { }
}
