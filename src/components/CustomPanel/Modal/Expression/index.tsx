import { ActionType, ProgressModal } from '@/context/progress'
import { UserFormType } from '@/pages/progress/type'
import { DicType } from '@/types/common'
import { filterDicList } from '@/utils/utils'
import { Form, FormInstance, Input, Modal, Select } from 'antd'
import React, { useContext, useEffect, useState } from 'react'
import { useIntl } from 'umi'

type Props = {
  expressionForm: FormInstance<any>,
  userForm: UserFormType[],
  form: FormInstance<any>,
}

function Expression(props: Props) {
  const intl = useIntl()
  const { state, dispatch } = useContext(ProgressModal)
  const [list, setList] = useState<DicType[]>([])
  const [relationList, setRelationList] = useState<DicType[]>([])

  useEffect(() => {
    if (state.userForm.length > 0) {
      const arr = state.userForm.map(item => {
        return {
          label: item.itemName,
          value: item.itemId
        }
      })
      setList(arr as unknown as DicType[])
    }
  }, [state.userForm])

  useEffect(() => {
    if (state.dicList.length > 0) {
      setRelationList(filterDicList(state.dicList, "conditionalRelation"))
    }
  }, [state.dicList])

  const changeFlow = (e: string) => {
    dispatch({ type: ActionType.changeConditionRelationFlow, payload: { ...state, conditionRelationFlow: e } })
  }

  const sureModal = async () => {
    const val = await props.expressionForm.validateFields();
    if (val) {
      let expressions = ""
      if (val.conditionRelation === "fn:contains") {
        expressions = "${" + `${val.conditionRelation}` + `('${val.conditionField}',` + `'${val.conditionVal}'` + ")}"
      } else {
        expressions = '${' + `${val.conditionField} ${val.conditionRelation} ` + `'${val.conditionVal}'` + "}"
      }
      props.form.setFieldsValue({ expressions })
      dispatch({ type: ActionType.changeExpressionVisible, payload: { ...state, expressionVisible: false } })
    }
  }

  const cancelModal = () => {
    dispatch({ type: ActionType.changeExpressionVisible, payload: { ...state, expressionVisible: false } })
  }

  return (
    <Modal
      title={intl.formatMessage({ id: 'component.customPanel.condition.expression', defaultMessage: '条件表达式' })}
      visible={state.expressionVisible}
      className="expression-modal"
      // width="60vw"
      onOk={sureModal}
      onCancel={cancelModal}
      okText={intl.formatMessage({ id: 'pages.ok', defaultMessage: '确认' })}
      cancelText={intl.formatMessage({ id: 'pages.cancel', defaultMessage: '取消' })}
      forceRender
    >
      <Form
        form={props.expressionForm}
        name="advanced_search"
        className="ant-advanced-search-form"
        preserve={false}
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 16 }}
      >
        <Form.Item
          name="conditionRelation"
          label={intl.formatMessage({ id: 'component.customPanel.condition.relation', defaultMessage: '条件关系' })}
          rules={[{ required: true, message: intl.formatMessage({ id: 'component.customPanel.condition.relation.placeholder', defaultMessage: '请选择条件关系' }) }]}
        >
          <Select
            placeholder={intl.formatMessage({ id: 'component.customPanel.condition.relation.placeholder', defaultMessage: '请选择条件关系' })}
            options={relationList}
            onChange={changeFlow}
          />
        </Form.Item>
        <Form.Item
          name="conditionField"
          label={intl.formatMessage({ id: 'component.customPanel.condition.field', defaultMessage: '条件字段' })}
          rules={[{ required: true, message: intl.formatMessage({ id: 'component.customPanel.condition.field.placeholder', defaultMessage: '请选择条件字段' }) }]}
        >
          {state.conditionRelationFlow === "fn:contains" ? (
            <Input
              placeholder={intl.formatMessage({ id: 'component.customPanel.condition.field', defaultMessage: '条件字段' })}
            />
          ) : (
            <Select
              placeholder={intl.formatMessage({ id: 'component.customPanel.condition.field', defaultMessage: '条件字段' })}
              options={list}
            />
          )}

        </Form.Item>
        <Form.Item
          name="conditionVal"
          label={intl.formatMessage({ id: 'component.customPanel.condition.val', defaultMessage: '条件值' })}
          rules={[{ required: true, message: intl.formatMessage({ id: 'component.customPanel.condition.val.placeholder', defaultMessage: '请输入条件值' }) }]}
        >
          <Input
            placeholder={intl.formatMessage({ id: 'component.customPanel.condition.val.placeholder', defaultMessage: '请输入条件值' })}
          />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default Expression