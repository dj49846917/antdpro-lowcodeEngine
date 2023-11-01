// import DAppCard from "@/components/DAppCard";
// import LcIcon from "@/components/LcIcon";
// import { Constant } from "@/constant";
// import { ENU_IMG } from "@/constant/img";
// import progressApi from "@/services/custom/appInfo/progress";
// import appApi from "@/services/custom/application";
// import dashboardApi from "@/services/custom/dashboard";
// import { DicType } from "@/types/common";
// import { ConstantKeyToContentValue } from "@/utils/utils";
// import { notification, Popconfirm } from "antd";
// import { useEffect, useState } from "react";
// import { useIntl, useModel, history } from "umi";
// import { AppListType } from "../application/type";
// import './index.less';
// import { StatisticsProcessNumber } from "./type";
// type Props = {}


// function Dashboard({ }: Props) {
//   const { initialState } = useModel('@@initialState');
//   const intl = useIntl();
//   const [appList, setAppList] = useState<AppListType[]>([])
//   const [dicList, setDicList] = useState<DicType[]>([])
//   const [processNum, setProcessNum] = useState<StatisticsProcessNumber>()
//   useEffect(() => {
//     getApplist()
//     getDic()
//     getProcessNum()
//   }, [])

//   // 查询数据字典
//   const getDic = async () => {
//     const params = {
//       parentId: ["app_status"]
//     }
//     const result = await progressApi.getDicList(params)
//     if (result && result.success) {
//       setDicList(result.data)
//     }
//   }

//   // 查询我的应用列表
//   const getApplist = async () => {
//     const params = {
//       createUser: localStorage.getItem(Constant.USER_INFO_STORAGE) as string
//     }
//     const result = await dashboardApi.getListDetail(params)
//     if (result && result.success) {
//       setAppList(result.data)
//     }
//   }

//   // 查询流程数据汇总
//   const getProcessNum = async () => {
//     const params = {
//       userId: localStorage.getItem(Constant.USER_INFO_STORAGE) as string
//     }
//     const result = await dashboardApi.statisticsProcess(params)
//     if (result && result.success) {
//       console.log("resullt", result)
//       setProcessNum(result.data)
//     }
//   }

//   const deleteApp = async (item: any) => {
//     const params = {
//       id: item.appId
//     }
//     const result = await appApi.deleteApplication(params)
//     if (result && result.success) {
//       notification.success({
//         message: intl.formatMessage({ id: 'pages.delete.success' })
//       })
//       getApplist()
//     }
//   }


//   return (
//     <div className="d-container">
//       <div className="d-dashboard">{intl.formatMessage({ id: 'pages.dashboard.workbench' })}</div>
//       {/* {
//         initialState?.currentUser?.fullName ? (
//           <div className="d-user">
//             <span>{initialState?.currentUser?.fullName}, {intl.formatMessage({ id: 'pages.dashboard.back' })}</span>
//             <img src={ENU_IMG.hand} className="d-user-icon" />
//           </div>
//         ) : null
//       } */}
//       <div className="d-action">
//         <div className="d-action-item">
//           <div className="d-action-item-left">
//             <span className="d-action-name">{intl.formatMessage({ id: 'pages.dashboard.workbench' })}</span>
//             <span className="d-action-num">{processNum?.pending}</span>
//           </div>
//           <img src={ENU_IMG.willdo} className="d-action-item-right" />
//         </div>
//         <div className="d-action-item">
//           <div className="d-action-item-left">
//             <span className="d-action-name">{intl.formatMessage({ id: 'pages.dashboard.done' })}</span>
//             <span className="d-action-num">{processNum?.handled}</span>
//           </div>
//           <img src={ENU_IMG.done} className="d-action-item-right" />
//         </div>
//         <div className="d-action-item">
//           <div className="d-action-item-left">
//             <span className="d-action-name">{intl.formatMessage({ id: 'pages.dashboard.initiation' })}</span>
//             <span className="d-action-num">{processNum?.created}</span>
//           </div>
//           <img src={ENU_IMG.launch} className="d-action-item-right" />
//         </div>
//         <div className="d-action-item">
//           <div className="d-action-item-left">
//             <span className="d-action-name">{intl.formatMessage({ id: 'pages.dashboard.tell' })}</span>
//             <span className="d-action-num">{processNum?.notify}</span>
//           </div>
//           <div className="d-action-item-right">
//             <img src={ENU_IMG.zhihui} />
//           </div>
//         </div>
//       </div>
//       <div className="d-main">
//         <div className="d-app">
//           <div className="d-app-title">{intl.formatMessage({ id: 'pages.dashboard.app' })}</div>
//           <div className="d-app-content">
//             {
//               appList && appList.length > 0 && appList.map(item => (
//                 <DAppCard
//                   key={item.appId}
//                   item={item}
//                   dicList={dicList}
//                   deleteApp={(row) => deleteApp(row)}
//                 />
//               ))
//             }
//           </div>
//           {
//             appList && appList.length > 12 ? (
//               <div className="d-app-more">
//                 <span>{intl.formatMessage({ id: 'pages.dashboard.allApp' })}</span>
//                 <img src={ENU_IMG.arrow} />
//               </div>
//             ) : null
//           }
//         </div>
//         {/* <div className="d-process">
//           <div className="d-app-title">{intl.formatMessage({ id: 'pages.dashboard.myprocess' })}</div>
//           <div className="d-process-content">
//             <div className="d-process-title">
//               <span>{intl.formatMessage({ id: 'pages.dashboard.process' })}</span>
//               <span>{intl.formatMessage({ id: 'pages.table.action' })}</span>
//             </div>
//             <div className="d-process-item">
//               <span>流程流程流程流程流程</span>
//               <img src={ENU_IMG.arrow} />
//             </div>
//           </div>
//           <div className="d-app-more">
//             <span>{intl.formatMessage({ id: 'pages.dashboard.allProcess' })}</span>
//             <img src={ENU_IMG.arrow} />
//           </div>
//         </div> */}
//       </div>
//     </div>
//   )
// }

// export default Dashboard


import Preview from "@/components/Preview";

function DashBoard() {
  return <Preview pageId="071066850307862528" />
}

export default DashBoard