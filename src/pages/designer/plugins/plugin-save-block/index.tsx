import { IPublicModelPluginContext } from "@alilc/lowcode-types";
import { Form, Input, Modal } from "antd";
import { useRef, useState } from "react";
import { event, Node } from '@alilc/lowcode-engine';
import schemaApi from "@/services/schemaApi";
import html2canvas from "html2canvas";
import { IconFont } from "@/components/LcIcon";
import { mockId, uniqueId } from "@/pages/designer/utils";

const FormItem = Form.Item;
const SaveBlock = ({ node }: { node: Node }) => {
  const [visible, setVisible] = useState(false);
  const [form] = Form.useForm();
  const srcRef = useRef<string>();
  const [loading, setLoading] = useState<boolean>(false);

  const generateImage = async () => {
    const dom = node.getDOMNode();
    const canvas = await html2canvas?.(dom, { scale: 0.5 });
    srcRef.current = canvas.toDataURL();
  };

  const onSave = async () => {
    if (loading) {
      return;
    }
    try {
      await generateImage();
      const values = await form.validateFields();
      setLoading(true);
      await schemaApi.saveBlock({
        schema: JSON.stringify(reassignId(node.schema)),
        screenshot: srcRef.current,
        ...values
      });
      event.emit('BlockChanged');
      setVisible(false);
      form.resetFields();
      setLoading(false);
    } catch (e) {
      console.log(e)
      setLoading(false);
    }
  }

  return (
    <div className={"lc-borders-action"}>
      <IconFont type="icon-qukuai" style={{ fontSize: "16px" }} onClick={() => setVisible(true)} />
      <Modal
        open={visible}
        title={"保存为区块"}
        destroyOnClose={true}
        onCancel={() => setVisible(false)}
        onOk={onSave}
      >
        <Form form={form}>
          <FormItem
            required={true}
            label="英文类名"
            name="componentName"
          >
            <Input />
          </FormItem>
          <FormItem
            required={true}
            label="区块标题"
            name="title"
          >
            <Input />
          </FormItem>
        </Form>
      </Modal>
    </div>
  )
}

const SaveBlockAction = (ctx: IPublicModelPluginContext) => {
  return {
    async init() {
      ctx.material.addBuiltinComponentAction({
        name: 'block',
        content: SaveBlock,
        important: true,
      });
    },
  };
};
SaveBlockAction.pluginName = 'SaveBlockAction';
export default SaveBlockAction;


function reassignId(schema: any) {
  if (schema.props?.formItemProps) {
    schema.props.formItemProps.primaryKey = mockId();
  }
  return {
    ...schema,
    id: uniqueId('node_'),
  }
}
