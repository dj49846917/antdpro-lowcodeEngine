import { Constant } from '@/constant';
import { revertLocales } from '@/pages/progress/editor/common';
import { LangListType, NodeNameItemType } from '@/pages/progress/type';
import progressApi from '@/services/custom/appInfo/progress';
import { isEmptyObject } from '@/utils/utils';
import { Button, Form, Input } from 'antd'
import { FormInstance, Rule } from 'antd/lib/form';
import { useEffect, useState } from 'react';
import { useIntl } from 'umi';
import InputModal from './InputModal';
import './index.less';

type Props = {
  name: string,
  rules?: Rule[];
  className?: string,
  form: FormInstance<any>,
  label: React.ReactNode;
  isTextArea?: boolean,
  placeholder?: string,
  rows?: number
}

function I18nInputComp(props: Props) {
  const [i18nVisible, setI18nVisible] = useState(false)
  const [langList, setLangList] = useState<LangListType>({})
  const [dataSource, setDataSource] = useState<NodeNameItemType[]>([])
  const intl = useIntl();

  useEffect(() => {
    getLangList()
  }, [])

  const getLangList = async () => {
    const result = await progressApi.getLangList()
    if (result && result.success) {
      const obj: LangListType = {}
      result.data.forEach((item: { languageCode: string; languageName: string; }) => {
        obj[item.languageCode] = {
          text: item.languageName,
          status: item.languageCode
        }
      })
      setLangList(obj)
    }
  }

  const openModal = () => {
    const fieldName = props.form.getFieldValue(props.name)
    if (fieldName && !isEmptyObject(langList)) {
      let name = {}
      try {
        name = JSON.parse(fieldName)
      } catch (error) {
        name = { [localStorage.getItem(Constant.LANG_STORAGE) as string]: fieldName }
      }
      props.form.setFieldsValue({
        [props.name]: JSON.stringify(name),
      })
      const str = revertLocales(JSON.stringify(name), langList)
      setDataSource(JSON.parse(str))
    }
    setI18nVisible(true)
  }

  return (
    <>
      <Form.Item
        label={props.label}
        rules={props.rules}
        className="inlineItem"
      >
        <Form.Item
          name={props.name}
          noStyle
          rules={props.rules}
        >
          {props.isTextArea ? <Input.TextArea rows={props.rows} disabled placeholder={props.placeholder} /> : <Input disabled placeholder={props.placeholder} />}
        </Form.Item>
        <Button
          onClick={() => openModal()}
        >{intl.formatMessage({ id: 'app.settings.security.set' })}</Button>
      </Form.Item>
      <InputModal langList={langList} visible={i18nVisible} changeVisible={setI18nVisible} form={props.form} langDataSource={dataSource} changeDataSource={setDataSource} />
    </>
  )
}

export default I18nInputComp