import { ActionType, ProgressModal } from '@/context/progress'
import { ActiveKeyType, UserFormType } from '@/pages/progress/type'
import { CommonParamType } from '@/types/common'
import { Checkbox, Col, Modal, Radio, RadioChangeEvent, Row } from 'antd'
import { CheckboxChangeEvent } from 'antd/lib/checkbox'
import { useContext, useEffect, useState } from 'react'
import { useIntl } from 'umi'
import './index.less'

type SettingFieldsProps = {
  visible: boolean,
  controller: CommonParamType,
  userForm: UserFormType[],
  updateUserForm: (e: UserFormType[]) => void,
  closeModal: (e: boolean) => void
}

function SettingFields({ visible, controller, userForm, updateUserForm, closeModal }: SettingFieldsProps) {
  const [data, setData] = useState<any[]>([])
  const intl = useIntl()
  useEffect(() => {
    if (userForm.length > 0) {
      const newData = JSON.parse(JSON.stringify(userForm))
      setData(newData)
    } else {
      setData([])
    }
  }, [userForm])

  const onChangeItem = (e: RadioChangeEvent, row: UserFormType) => {
    const list = data && data.map((item: UserFormType) => {
      if (item.itemId === row.itemId) {
        item = {
          ...item,
          disabled: e.target.value == ActiveKeyType.disabled ? true : false,
          edit: e.target.value == ActiveKeyType.edit ? true : false,
          hidden: e.target.value == ActiveKeyType.hidden ? true : false,
          activeKey: e.target.value
        }
        return item
      } else {
        return item
      }
    })
    setData(list)
  }

  // 点击每列的复选框
  const onChangeItemCheck = (e: CheckboxChangeEvent, row: UserFormType) => {
    const list = data && data.map((item: UserFormType) => {
      if (item.itemId === row.itemId) {
        item = {
          ...item,
          required: e.target.checked
        }
        return item
      } else {
        return item
      }
    })
    setData(list)
  }

  // 取消弹窗
  const cancelModal = () => {
    setData(userForm)
    closeModal(false)
  }

  const sureModal = () => {
    const list: any[] = []
    data.forEach(item => {
      list.push(item)
    })
    setData(data)
    updateUserForm(data)
    closeModal(false)
  }
  return (
    <Modal
      title={intl.formatMessage({ id: 'component.customPanel.auth.field', defaultMessage: '字段操作权限' })}
      destroyOnClose
      visible={visible}
      className="table"
      okText={intl.formatMessage({ id: "pages.ok", defaultMessage: "确定" })}
      cancelText={intl.formatMessage({ id: "pages.cancel", defaultMessage: "取消" })}
      onOk={sureModal}
      onCancel={cancelModal}>
      <div>
        <Row>
          <Col span={11} className='table-title'>
            <div className='title-text'>表单字段</div>
          </Col>
          <Col span={3} className='table-title'>
            <div className='title-text'>编辑</div>
          </Col>
          <Col span={3} className='table-title'>
            <div className='title-text'>只读</div>
          </Col>
          <Col span={3} className='table-title'>
            <div className='title-text'>隐藏</div>
          </Col>
          <Col span={3} className='table-title'>
            <div className='title-text'>必填</div>
          </Col>
        </Row>
        {/* <Row className='table-content'>
          <Col span={11}>
            <div className='title-text'>全选</div>
          </Col>
          <Col span={12}>
            <Radio.Group onChange={onChange} className="list-item">
              <Col span={6}>
                <Radio value={1} className="list-item-video"></Radio>
              </Col>
              <Col span={6}>
                <Radio value={2} className="list-item-video"></Radio>
              </Col>
              <Col span={6}>
                <Radio value={3} className="list-item-video"></Radio>
              </Col>
              <Col span={6}></Col>
            </Radio.Group>
          </Col>
        </Row> */}
        {data && data.map((item: UserFormType) => {
          if (item && JSON.stringify(item) !== '{}') {
            return (
              <Row className='table-content' key={item.itemId}>
                <Col span={11}>
                  <div className='title-text'>&nbsp;&nbsp;{item.itemName}</div>
                </Col>
                <Col span={12} className="content-item">
                  <Col span={18}>
                    <Radio.Group onChange={(e) => onChangeItem(e, item)} value={item.activeKey} className="list-item">
                      <Col span={8}>
                        <Radio value={ActiveKeyType.edit} className="list-item-video"></Radio>
                      </Col>
                      <Col span={8}>
                        <Radio value={ActiveKeyType.disabled} className="list-item-video"></Radio>
                      </Col>
                      <Col span={8}>
                        <Radio value={ActiveKeyType.hidden} className="list-item-video"></Radio>
                      </Col>
                    </Radio.Group>
                  </Col>
                  <Col span={5} offset={1}>
                    <Checkbox onChange={(e) => onChangeItemCheck(e, item)} checked={item.required} className="list-item-video"></Checkbox>
                  </Col>
                </Col>
              </Row>
            )
          }
          return null
        })}
      </div>
    </Modal>
  )
}

export default SettingFields