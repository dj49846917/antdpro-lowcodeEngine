import { ActionType, ProgressModal } from "@/context/progress";
import { DicType } from "@/types/common";
import { filterDicList } from "@/utils/utils";
import { Button, Collapse, Form, FormInstance, Input } from "antd";
import { useContext, useEffect, useState } from "react";
import { useIntl } from "umi";
import BaseInfo from "../BaseInfo";
import styles from '../index.less';
import ExecuteListening from "../ProcessListen/ExecuteListening";

const { Panel } = Collapse;
type IProps = {
  form: FormInstance<any>,
  eventType: string,
  executeForm: FormInstance<any>,
  expressionForm: FormInstance<any>
}

function parseExpressionVal(val: string, relationArr: DicType[]) {
  if (!val) {
    return ""
  }
  const arr = relationArr.filter(x => {
    return val.indexOf(`${x.value}`) > -1 || val.indexOf(` ${x.value} `) > -1
  })
  const conditionRelation = arr[0].value
  // 包含
  let splitArr = []
  let conditionField = ""
  let conditionVal = ""
  if (conditionRelation === "fn:contains") {
    const str1 = val.replace("${" + arr[0].value + '(', "")
    const str2 = str1.replace(")}", "")
    splitArr = str2.split(",")
    conditionField = splitArr[0].replaceAll("'", "")
    conditionVal = splitArr[1].replaceAll("'", "")
  } else {
    splitArr = val.split(` ${conditionRelation} `).length > 1 ? val.split(` ${conditionRelation} `) : val.split(`${conditionRelation}`)
    conditionField = splitArr[0].split("${")[1]
    conditionVal = splitArr[1].split("}")[0].split("'")[1]
  }
  return {
    conditionRelation,
    conditionField,
    conditionVal
  }
}

function SequenceFlow(props: IProps) {
  const intl = useIntl()
  const { state, dispatch } = useContext(ProgressModal)
  const [relationList, setRelationList] = useState<DicType[]>([])

  useEffect(() => {
    if (state.dicList.length > 0) {
      setRelationList(filterDicList(state.dicList, "conditionalRelation"))
    }
  }, [state.dicList])

  const openExpression = () => {
    const val = props.form.getFieldValue("expressions")
    const result = parseExpressionVal(val, relationList)
    if (result) {
      props.expressionForm.setFieldsValue({
        ...result
      })
    }
    dispatch({ type: ActionType.changeConditionRelationFlow, payload: { ...state, conditionRelationFlow: typeof result === 'string' ? "" : result.conditionRelation as string } })
    dispatch({ type: ActionType.changeExpressionVisible, payload: { ...state, expressionVisible: true } })
  }

  return (
    <Collapse defaultActiveKey={['1', '2', '3']} className={styles.list}>
      <Panel header={intl.formatMessage({ id: 'component.customPanel.info', defaultMessage: '节点信息' })} key="1">
        <BaseInfo eventType={props.eventType} />
      </Panel>
      <Panel header={intl.formatMessage({ id: 'component.customPanel.condition', defaultMessage: '条件' })} key="2">
        <div className={styles.list_item}>
          <div className={styles.list_item_content}>
            <Form.Item
              className="inlineItem"
              label={intl.formatMessage({ id: 'component.customPanel.condition.expression', defaultMessage: '条件表达式' })}
            >
              <Form.Item name="expressions" noStyle>
                <Input disabled placeholder={intl.formatMessage({ id: 'component.customPanel.condition.expression.placeholder', defaultMessage: '请输入条件表达式' })} />
              </Form.Item>
              <Button
                onClick={() => openExpression()}
              >{intl.formatMessage({ id: 'app.settings.security.set' })}</Button>
            </Form.Item>
          </div>
        </div>
      </Panel>
      <Panel header={intl.formatMessage({ id: 'component.customPanel.executeListening' })} key="3">
        <ExecuteListening
          form={props.form}
          executeForm={props.executeForm}
        />
      </Panel>
    </Collapse>
  )
}

export default SequenceFlow