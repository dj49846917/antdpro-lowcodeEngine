import { Button, Form, Input, Select, Space } from "antd"
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";

const LcFormItemGroup = ({ form, name }: any) => {

  return (
    <Form.List name={name}>
      {(fields, { add, remove }) => (
        <>
          {fields.map(field => (
            <Space
              key={field.key}
              align="baseline"
            >
              <Form.Item
                noStyle
                shouldUpdate={(prevValues, curValues) =>
                  prevValues.area !== curValues.area || prevValues.sights !== curValues.sights
                }
              >
                {() => (
                  <Form.Item
                    {...field}
                    label="Sight"
                    name={[field.name, 'sight']}
                    rules={[{ required: true, message: 'Missing sight' }]}
                  >
                    <Select
                      disabled={!form.getFieldValue('area')}
                      style={{ width: 130 }}
                    />
                  </Form.Item>
                )}
              </Form.Item>
              <Form.Item
                {...field}
                label="Price"
                name={[field.name, 'price']}
                rules={[{ required: true, message: 'Missing price' }]}
              >
                <Input />
              </Form.Item>

              <MinusCircleOutlined onClick={() => remove(field.name)} />
            </Space>
          ))}

          <Form.Item>
            <Button
              type="dashed"
              onClick={() => add()}
              block
              icon={<PlusOutlined />}
            >
              Add sights
            </Button>
          </Form.Item>
        </>
      )}
    </Form.List>
  )
}

export default LcFormItemGroup
