import React from 'react';
import { ILowCodePluginContext, material, project } from '@ali/lowcode-engine';
import { NumberPicker } from '@alifd/next';
import MobileSVG from './icons/mobile';
import PadSVG from './icons/pad';
import PcSVG from './icons/pc';
import './index.less';

const isNewEngineVersion = !!material;

const devices = [
  { key: 'phone' },
  { key: 'tablet' },
  { key: 'desktop' },
];

interface SimulatorPaneProps {
  device: string;
  devices: string[];
}

export class SimulatorPane extends React.Component<SimulatorPaneProps> {
  static displayName = 'SimulatorPane';

  constructor(props: SimulatorPaneProps) {
    super(props);
    this.state = {
      actived: props.device,
      devices: props.devices || devices,
      currentWidth: null
    };
    if (isNewEngineVersion) {
      project.onSimulatorRendererReady(() => {
        const currentWidth = document.querySelector('.lc-simulator-canvas')?.clientWidth || this.state.currentWidth || 0;
        this.setState({
          currentWidth
        });
      });
    } else {
      project.onRendererReady(() => {
        const currentWidth = document.querySelector('.lc-simulator-canvas')?.clientWidth || this.state.currentWidth || 0;
        this.setState({
          currentWidth
        });
      });
    }
  }

  change = (device: string) => {
    const simulator = project.simulator;
    // 切换画布
    // https://yuque.alibaba-inc.com/docs/share/4caeac57-e920-4a5b-b4b2-2f514cdd8d49?#
    simulator?.set('device', device);
    document.querySelector('.lc-simulator-canvas').style.width = null;
    setTimeout(() => {
      const currentWidth = document.querySelector('.lc-simulator-canvas')?.clientWidth || this.state.currentWidth || 0;
      this.setState({
        actived: device,
        currentWidth
      });
    }, 0);
  }

  renderItemSVG(device: string) {
    switch (device) {
      case 'desktop':
        return <PcSVG />;
      case 'phone':
        return <MobileSVG />;
      case 'tablet':
        return <PadSVG />;
      default:
        return <PcSVG />;
    }
  }

  render() {
    const currentWidth = this.state.currentWidth || 0;
    return (
      <div className="lp-simulator-pane">
        {
          this.state.devices.map((item, index) => {
            return (
              <span
                key={item.key}
                className={`lp-simulator-pane-item ${this.state.actived === item.key ? 'actived' : ''}`}
                onClick={this.change.bind(this, item.key)}
              >
                {this.renderItemSVG(item.key)}
              </span>
            )
          })
        }
        <div className='lp-simulator-width-setter'>
          <NumberPicker
            className="lp-simulator-width-input"
            addonTextAfter="px"
            value={currentWidth}
            placeholder="请输入"
            onChange={(value) => {
              this.setState({
                currentWidth: value
              });
            }}
            onPressEnter={(event) => {
              const value = event?.target?.value;
              document.querySelector('.lc-simulator-canvas').style.width = `${value}px`
              this.setState({
                currentWidth: value
              });
            }}
          />
        </div>
      </div>
    );
  }
}

const SimulatorResizerPlugin = (ctx: ILowCodePluginContext, options: any) => {
  const simulatorResizerRef = React.createRef<SimulatorPane>();

  return {
    name: 'SimulatorPane',
    // 插件的初始化函数，在引擎初始化之后会立刻调用
    async init() {
      // 往引擎增加工具条
      ctx.skeleton.add({
        area: 'top',
        name: 'SimulatorPane',
        type: 'Widget',
        props: {
          description: '切换画布尺寸',
          align: "center",
        },
        content: (
          <SimulatorPane
            device={options.device}
            devices={options.devices}
            ref={simulatorResizerRef}
          />
        ),
      });
    }
  };
};
SimulatorResizerPlugin.pluginName = 'SimulatorResizerPlugin'
SimulatorResizerPlugin.meta = {
  preferenceDeclaration: {
    title: '画布设备设置',
    properties: [
      {
        key: 'device',
        type: 'string',
        description: '选择设备',
      },
      {
        key: 'devices',
        type: 'array',
        description: '设备列表',
      },
    ],
  },
}
export default SimulatorResizerPlugin;
