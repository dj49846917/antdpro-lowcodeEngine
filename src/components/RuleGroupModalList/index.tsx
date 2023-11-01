import { ActiveTreeType, UserTaskTreeInfoType, UserTaskTreeRowType } from "@/pages/progress/type"
import { CheckInfo } from "@/types/common"
import { Button, Card, Col, Row, Tree } from "antd"
import { DataNode } from "antd/lib/tree"
import { useIntl } from "umi"
import './index.less'

type Props = {
  checkRules: (checkedKeysValue: ActiveTreeType, event: CheckInfo) => void,
  checkedRuleInfo: UserTaskTreeInfoType,
  treeData: DataNode[],
  deleteAll: () => void,
  moveItem: (item: UserTaskTreeRowType, type: "up" | "done") => void,
  deleteItem: (item: UserTaskTreeRowType) => void,
  actionType?: string
}

function RuleGroupModalList(props: Props) {
  const intl = useIntl();
  return (
    <Row className="main">
      <Col className="left" span={11}>
        <Card size="small" title={intl.formatMessage({ id: 'pages.app.rule.table.ruleName' })}>
          <Tree
            checkable
            disabled={props.actionType === 'watch'}
            checkStrictly
            selectable={false}
            onCheck={(checkedKeysValue: ActiveTreeType, event: CheckInfo) => props.checkRules(checkedKeysValue, event)}
            checkedKeys={props.checkedRuleInfo.checkedKeys}
            treeData={props.treeData}
          />
        </Card>
      </Col>
      <Col className="right" span={13}>
        <Card size="small" title={intl.formatMessage({ id: 'pages.app.rule.modal.right' })} extra={props.actionType === 'watch' ? null : <span onClick={() => props.deleteAll()} className="header-exta">{intl.formatMessage({ id: 'table.actions.empty' })}</span>} className="right">
          {
            props.checkedRuleInfo.checkedRowInfo.length > 0 ? (
              <div className="choose">
                {
                  props.checkedRuleInfo.checkedRowInfo.map((item, index) => (
                    <div className="choose-item" key={item.key}>
                      <span>{item.title}</span>
                      {props.actionType === 'watch' ? null : (
                        <div className="chosed-right">
                          {index === 0 ? null : <Button type="link" size="small" onClick={() => props.moveItem(item, 'up')}>{intl.formatMessage({ id: 'table.actions.up' })}</Button>}
                          {index === props.checkedRuleInfo.checkedRowInfo.length - 1 ? null : <Button type="link" size="small" onClick={() => props.moveItem(item, 'done')}>{intl.formatMessage({ id: 'table.actions.up' })}</Button>}
                          <Button type="link" size="small" onClick={() => props.deleteItem(item)}>{intl.formatMessage({ id: 'pages.delete' })}</Button>
                        </div>
                      )}
                    </div>
                  ))
                }
              </div>
            ) : <div className="empty">暂无数据</div>
          }
        </Card>
      </Col>
    </Row>
  )
}

export default RuleGroupModalList

RuleGroupModalList.detaultProps = {
  actionType: "add"
}