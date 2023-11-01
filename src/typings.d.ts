declare module 'slash2';
declare module '*.css';
declare module '*.less';
declare module '*.scss';
declare module '*.sass';
declare module '*.svg';
declare module '*.png';
declare module '*.mp4';
declare module '*.jpg';
declare module '*.jpeg';
declare module '*.gif';
declare module '*.bmp';
declare module '*.tiff';
declare module 'omit.js';
declare module 'numeral';
declare module '@antv/data-set';
declare module 'mockjs';
declare module 'react-fittext';
declare module 'bizcharts-plugin-slider';
declare module 'bpmn-js/lib/Modeler';
declare module 'bpmn-js-properties-panel';
declare module 'bpmn-js-properties-panel/lib/provider/camunda';
declare module 'diagram-js/lib/navigation/movecanvas';
declare module 'uuid';
declare module '!!raw-loader!*';

// preview.pro.ant.design only do not use in your production ;
// preview.pro.ant.design Dedicated environment variable, please do not use it in your project.
declare let ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION: 'site' | undefined;

declare const REACT_APP_ENV: 'test' | 'local' | 'dev' | 'prod' | 'pre' | false;


declare interface UmiPageLocation {
    hash: string;
    pathname: string;
    query: Record<string, string | number | any>;
    search: string;
    state: Record<string, any>;
}
declare interface UmiPageMatch {
    isExact: boolean;
    params: Record<string, string>;
    path: string;
    url: string;
}
declare interface UmiPageProps {
    location: UmiPageLocation;
    children: React.ReactElement;
    match: UmiPageMatch;
}
