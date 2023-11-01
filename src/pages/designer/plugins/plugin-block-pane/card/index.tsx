import './index.less';
import { IconFont } from "@/components/LcIcon";
import type { SnippetMeta } from '../transform';
import ComponentSvg from '../../../../../../public/icons/component.svg';
import schemaApi from "@/services/schemaApi";
import { event } from "@alilc/lowcode-engine";

const BlockCard = (props: Omit<SnippetMeta, 'componentName' | 'schema'>) => {
  const { id, title, screenshot = ComponentSvg } = props;

  const onDel = async () => {
    await schemaApi.delBlock(id as string);
    event.emit('BlockChanged');
  }

  return <div
    className='block-card snippet'
    data-id={id}
  >
    <IconFont
      type="icon-a-shanchu2x"
      onClick={onDel}
    />
    <div className='block-card-screenshot'>
      <img src={screenshot}/>
    </div>
    <span>
      {title}
    </span>
  </div>;
};

export default BlockCard;
