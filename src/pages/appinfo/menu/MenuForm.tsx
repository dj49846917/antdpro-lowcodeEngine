import { Form, FormProps, Input, InputNumber, message, Select, Switch } from 'antd';
import { forwardRef, useContext, useImperativeHandle, useState, useEffect } from 'react';
import { usePages } from "@/pages/appinfo/menu/hooks";
import { ModalCtx } from "@/pages/appinfo/menu/context";
import menusManagementApi from "@/services/custom/appInfo/menu/service";
import { useIntl } from "@@/plugin-locale/localeExports";
import I18nInputComp from '@/components/I18nInputComp';
import { IconFont } from '@/components/LcIcon';
import { getBaseUrl } from '@/utils/utils';
import { Drequest } from "@/utils/request";

const layout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 16,
  },
};

const ossUrl = `${getBaseUrl()}/oss/file/viewCompatibleImage?fileUrl=common/materials/iconfont.json`;

const loadMap = {};
export function loadScript(jsList: string[]) {
  const key = JSON.stringify(jsList);
  if (loadMap[key]) {
    return loadMap[key];
  }
  const promise = new Promise((resolve) => {
    jsList.forEach((url, index, array) => {
      const ref = document.createElement("script");
      ref.type = "text/javascript";
      ref.src = url;
      ref.async = false;
      if (index === array.length - 1) {
        ref.onload = () => {
          resolve(true);
        };
      }
      document.body.appendChild(ref);
    });
  });
  loadMap[key] = promise;

  return promise;
}

const MenuForm = ({ }, ref: any) => {
  const [icons, setIcons] = useState([]);
  const intl = useIntl();
  const { state } = useContext(ModalCtx);
  const [form] = Form.useForm();
  useEffect(() => {
    Drequest.get(ossUrl).then((res) => {
      if (!res) {
        return
      }
      setIcons(res.glyphs.map((item) => {
        return {
          value: `icon-${item.font_class}`,
          label: <><IconFont type={`icon-${item.font_class}`} /> {item.name}</>,
          labelName: item.name
        };
      }))
    })
  }, [])
  const pages = usePages();
  const onSave = async () => {
    try {
      const values = await form.validateFields();
      await menusManagementApi.createMenu(values);
      return true;
    } catch (e: any) {
      message.error(e?.errorFields?.[0]?.errors?.[0]);
      return false;
    }
  }

  useImperativeHandle(ref, () => ({
    onSave
  }));

  const readOnlyProps: FormProps = state?.type === 'view' ? {
    disabled: true,
    requiredMark: false,
  } : {};
  return (
    <>
      <Form
        {...layout}
        form={form}
        name="menu"
        initialValues={state?.data}
        labelAlign='left'
        {...readOnlyProps}
      >
        <Form.Item
          name={'id'}
          hidden
        >
          <Input />
        </Form.Item>
        <Form.Item
          name={'parentId'}
          hidden
        >
          <Input />
        </Form.Item>
        <I18nInputComp
          form={form}
          name="name"
          label={intl.formatMessage({ id: 'pages.appInfo.menu.form.menu.name' })}
          rules={[
            {
              required: true,
              message: intl.formatMessage({ id: 'pages.appInfo.menu.form.menu.name.placeholder' })
            },
          ]}
        />
        <Form.Item
          name={'icon'}
          label={intl.formatMessage({ id: 'pages.appInfo.menu.form.menu.icon' })}
        >
          <Select
            options={icons}
            showSearch
            filterOption={(input, option: any) =>
              (option?.labelName ?? '').includes(input)
            }
          >
          </Select>
        </Form.Item>
        <Form.Item
          name='page'
          label={intl.formatMessage({ id: 'pages.appInfo.menu.form.menu.page' })}
          rules={[
            {
              required: false,
            },
          ]}
        >
          <Select
            options={pages}
            showSearch
            optionFilterProp='label'
          />
        </Form.Item>
        <Form.Item
          name='path'
          label={intl.formatMessage({ id: 'pages.appInfo.menu.form.menu.path' })}
        >
          <Input placeholder={intl.formatMessage({ id: 'pages.appInfo.menu.form.menu.path.placeholder' })} />
        </Form.Item>
        <Form.Item
          name='visible'
          valuePropName="checked"
          initialValue={true}
          label={intl.formatMessage({ id: 'pages.appInfo.menu.form.menu.visible' })}
        >
          <Switch />
        </Form.Item>
        <Form.Item
          name='order'
          label={intl.formatMessage({ id: 'pages.appInfo.menu.form.menu.order' })}
          rules={[
            {
              required: true,
            },
          ]}
        >
          <InputNumber />
        </Form.Item>
        {
          state?.data?.id && (
            <Form.Item
              name='creator'
              label={intl.formatMessage({ id: 'pages.appInfo.menu.form.menu.creator' })}
            >
              <Input />
            </Form.Item>
          )
        }
        {
          state?.data?.id && (
            <Form.Item
              name='date'
              label={intl.formatMessage({ id: 'pages.appInfo.menu.form.menu.date' })}
            >
              <Input />
            </Form.Item>
          )
        }
      </Form>
    </>
  );
};

export default forwardRef(MenuForm);
