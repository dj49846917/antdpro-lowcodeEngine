import { CommonParamType } from "@/types/common"
import { Dropdown, DropdownProps, Menu, MenuProps, Popconfirm, Space } from "antd"
import type * as React from 'react';
import { useEffect, useState } from "react"
import { useIntl } from "umi"

type DataSourceType = {
  title: string,
  showComfirm?: boolean,
  comfirmTip?: string
  action: (row: CommonParamType) => void,
  id: React.Key
}

type MenuItemType = {
  label: React.ReactNode,
  key: React.Key,
}

interface Props extends DropdownProps {
  dataSource: DataSourceType[],
  overlay: React.ReactElement
}

function DTableDropdown(props: Props) {
  const [dropdownInfo, setDropdownInfo] = useState<MenuItemType[]>([])
  const [visible, setVisible] = useState(false)
  const intl = useIntl()
  useEffect(() => {
    const nodesInfo: React.SetStateAction<MenuItemType[]> = []
    props.dataSource.forEach((item) => {
      let obj: MenuItemType = {
        label: undefined,
        key: ""
      }
      if (item.showComfirm) {
        obj = {
          label: (
            <Popconfirm
              title={item.comfirmTip || intl.formatMessage({ id: 'pages.action.placeholder' })}
              onConfirm={(e) => {
                item.action(e as any)
                setVisible(false)
              }}
              onCancel={() => setVisible(false)}
            >
              <a href="javascript:void(0)">{item.title}</a>
            </Popconfirm>
          ),
          key: item.id
        }
      } else {
        obj = {
          label: (
            <a href="javascript:void(0)" onClick={item.action}>{item.title}</a>
          ),
          key: item.id
        }
      }
      nodesInfo.push(obj)
      setDropdownInfo(nodesInfo)
    })
  }, [])

  const handleVisibleChange = (flag: boolean) => {
    setVisible(flag);
  };

  const handleMenuClick: MenuProps['onClick'] = e => {
    const list = props.dataSource.filter(x => x.id === e.key)
    if (list.length > 0) {
      list.forEach(item => {
        if (!item.showComfirm) {
          setVisible(false);
        }
      })
    }
  };

  return (
    <Dropdown {...props}
      overlay={
        <div className='d-table-dropdown'>
          <Menu
            onClick={handleMenuClick}
            items={dropdownInfo}
          />
        </div>
      }
      trigger={['click']}
      visible={visible}
      onVisibleChange={handleVisibleChange}
    />
  )
}

export default DTableDropdown
DTableDropdown.defaultProps = {
  overlay: <></>
}
