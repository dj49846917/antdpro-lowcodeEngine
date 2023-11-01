import { Spin, notification } from 'antd'
import { CSSProperties, ReactNode, useEffect } from 'react'
import BpmnViewer from 'bpmn-js';
import './index.less';
import MoveCanvasModule from 'diagram-js/lib/navigation/movecanvas'


type IProps = {
  systemType: 'publish' | 'preview',     // 预览类型(默认为发布)
  loading: boolean,                      // loading状态(默认为false)
  fileContent: string,                   // bpmn文件的字符串
  currentMarker: string[],               // 当前节点
  doneMarker: string[],                  // 已处理节点
  containerStyle: CSSProperties,         // 容器的样式
  children?: ReactNode,
  onClick: Function
}

function ProgressPreview(props: IProps) {
  useEffect(() => {
    if (props.fileContent) {
      renderBpmn(props.fileContent)
    }
  }, [props.fileContent])

  const renderBpmn = (file: string) => {
    const viewer = new BpmnViewer({
      container: '#canvas',
      additionalModules: [MoveCanvasModule]
    });
    viewer.importXML(file).then(res => {
      success(viewer)
      viewer.get('canvas').zoom('fit-viewport');
    })

  }

  const success = (obj: any) => {
    obj.on('selection.changed', (e: any) => {
      props.onClick(e.newSelection)
    })

    var canvas = obj.get('canvas')
    if (props.systemType === 'publish') { // 预览
      const ElementRegistry = obj.get("elementRegistry")
      const elements = ElementRegistry.getAll()
      let currentCount = 0
      let doneCount = 0
      if (Array.isArray(props.currentMarker) && props.currentMarker.length > 0) {
        elements.forEach((item: { id: string; }) => {
          props.currentMarker.forEach(it => {
            if (item.id === it) {
              currentCount++
            }
          })
        })
      }
      if (Array.isArray(props.doneMarker) && props.doneMarker.length > 0) {
        elements.forEach((item: { id: string; }) => {
          props.doneMarker.forEach(it => {
            if (item.id === it) {
              doneCount++
            }
          })
        })
      }

      // 通过数量判断确认数据是否合法
      if (currentCount !== props.currentMarker.length) {
        notification.error({
          message: '请注意',
          description: "数据异常，当前节点信息不存在"
        })
        return
      }
      if (doneCount !== props.doneMarker.length) {
        notification.error({
          message: '请注意',
          description: "数据异常，处理过的节点信息不存在"
        })
        return
      }
      if (props.currentMarker.length > 0) {
        props.currentMarker.forEach(item => {
          canvas.addMarker(item, 'highlightNow');
        })
      }
      if (props.doneMarker.length > 0) {
        props.doneMarker.forEach(item => {
          canvas.addMarker(item, 'highlight');
        })
      }
    }
  }

  return (
    <Spin spinning={props.loading}>
      <div id='canvas' style={props.containerStyle}></div>
      {props.children}
    </Spin>
  )
}

export default ProgressPreview

ProgressPreview.defaultProps = {
  loading: false,
  systemType: "preview",
  doneMarker: [],
  currentMarker: [],
  containerStyle: { height: "100vh" },
  onClick: () => { }
}