declare module 'bpmn-js';

declare module "*.bpmn" {
    const content: any;
    export default content;
  }