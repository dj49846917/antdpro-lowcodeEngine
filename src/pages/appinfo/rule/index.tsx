import progressApi from '@/services/custom/appInfo/progress';
import { DicType } from '@/types/common';
import { Tree } from 'antd'
import { DataNode } from 'antd/lib/tree';
import { useEffect, useState } from 'react';
import { useIntl } from 'umi';
import BusinessId from './BusinessId';
import './index.less'
import RuleGroup from './RuleGroup';
import RuleList from './RuleList';

type Props = {}
function Rule(props: Props) {
  const intl = useIntl();
  const [dicList, setDicList] = useState<DicType[]>([]);
  const [selectedKeys, setSelectedKeys] = useState<string[]>([intl.formatMessage({ id: 'pages.app.rule.menu.ruleGroup' })]);

  const treeData: DataNode[] = [
    {
      title: intl.formatMessage({ id: 'pages.app.rule.menu.ruleGroup' }),
      key: intl.formatMessage({ id: 'pages.app.rule.menu.ruleGroup' }),
    },
    {
      title: intl.formatMessage({ id: 'pages.app.rule.menu.rule' }),
      key: intl.formatMessage({ id: 'pages.app.rule.menu.rule' }),
    },
    {
      title: intl.formatMessage({ id: 'pages.app.rule.menu.businessId' }),
      key: intl.formatMessage({ id: 'pages.app.rule.menu.businessId' }),
    },
  ];

  useEffect(() => {
    getDicArr()
  }, [])

  const getDicArr = async () => { // 查询数据字典
    const params = {
      parentId: ["rule_type", "active_flag"]
    }
    const result = await progressApi.getDicList(params)
    if (result && result.success) {
      setDicList(result.data)
    }
  }

  const onSelect = (selectedKeysValue: React.Key[], info: any) => {
    setSelectedKeys(selectedKeysValue as string[]);
  };

  const renderComp = () => {
    switch (selectedKeys[0]) {
      case treeData[0].title:
        return <RuleGroup dicList={dicList} />
      case treeData[1].title:
        return <RuleList dicList={dicList} />
      default:
        return <BusinessId dicList={dicList} />
    }
  }

  return (
    <div className='d-app-rule'>
      <div className='menu'>
        <div className='header'>{intl.formatMessage({ id: 'menu.rule' })}</div>
        <Tree
          className='tree'
          onSelect={onSelect}
          selectedKeys={selectedKeys}
          treeData={treeData}
        />
      </div>
      <div className='content'>
        <div className="d-title">{selectedKeys[0]}</div>
        {renderComp()}
        {/* {selectedKeys[0] === treeData[1].title ? <RuleList dicList={dicList} /> : <RuleGroup dicList={dicList} />} */}
      </div>
    </div>
  )
}
export default Rule