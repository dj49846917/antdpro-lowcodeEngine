import { useIntl } from "umi"
import { Button, ButtonProps, Popconfirm, Tooltip } from "antd"
import LcIcon from "../LcIcon"
import '../DTableButton/index.less'
import { useState } from "react"


interface Props extends ButtonProps {
  iconType: "preview" | "edit" | "watch" | "design" | 'copy' | "delete" | "add" | "more",
  tip?: string,
  comfirmTip?: string,
  onClick: () => void,
  showComfirm?: boolean
}

function DTip(props: Props) {
  const intl = useIntl()
  const showIcon = (icon: string) => {
    switch (icon) {
      case 'design':
        return <LcIcon type="icon-a-sheji2x" name="d-table-btn" />
      case 'copy':
        return <LcIcon type="icon-a-fuzhi2x" name="d-table-btn" />
      case 'edit':
        return <LcIcon type="icon-a-bianji2x2" name="d-table-btn" />
      case 'preview':
        return <LcIcon type="icon-a-yulan2x" name="d-table-btn" />
      case 'delete':
        return <LcIcon type="icon-a-shanchu2x" name="d-table-btn" />
      case 'add':
        return <LcIcon type="icon-a-2x" name="d-table-btn" />
      case 'more':
        return <LcIcon type="icon-a-gengduo2x" name="d-table-btn" />
      default:
        return null
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
      return intl.formatMessage({ id: 'pages.table.action' })
    }
  }

  return (
    <Tooltip placement="topLeft" title={() => showTitle()} arrowPointAtCenter>
      {showIcon(props.iconType)}
    </Tooltip>
  )
}

export default DTip

DTip.defaultProps = {
  onClick: () => { }
}