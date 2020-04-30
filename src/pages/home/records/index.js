// import api from '../../../utils/api.js';
// import { formatTime } from '../../../utils/tool.js'

// const app = getApp()

// Page({
//   data: {
//     page: 1,
//     row: 20,
//     tradeRecordsList: [],
//     isEmptyList: true,
//     loading: false,
//     loadingComplete: false
//   },

//   getRecordsInfo: function () {
//     const customer = app.get('customer');

//     let data = {
//       page: this.data.page
//     }

//     let params = {
//       customer_id: customer.id,
//       page: this.data.page,
//       row: this.data.row
//     }

//     api.getTradeRecords(params).then((res) => {
//       let result = res.data;
//       if (res.code === 0) {
//         if (result.tradeRecords.length > 0) {
//           let lists = [];

//           let recordsData = result.tradeRecords.map((data, index) => {
//             return {
//               amount: (data.amount / 100).toFixed(2),
//               created_at: formatTime(data.created_at),
//               customer_id: data.customer_id,
//               id: data.id,
//               traded_at: data.traded_at,
//               type: data.type,
//               updated_at: data.updated_at
//             }
//           });

//           this.data.isEmptyList ? lists = recordsData : lists = this.data.tradeRecordsList.concat(recordsData)

//           if (recordsData.length < this.data.row) {
//             this.setData({
//               tradeRecordsList: lists,
//               loading: false,
//               loadingComplete: true
//             })
//           } else {
//             this.setData({
//               tradeRecordsList: lists,
//               loading: true
//             })
//           }
//         } else {
//           this.setData({
//             loadingComplete: true,
//             loading: false
//           })
//         }
//       }
//     })
//   },

//   //滚动到底部触发事件
//   onReachBottom: function () {

//     if (this.data.loading && !this.data.loadingComplete) {
//       this.setData({
//         page: this.data.page + 1,
//         isEmptyList: false
//       });

//       this.getRecordsInfo();
//     }
//   },

//   onLoad: function () {
//     this.getRecordsInfo();
//   }
// })
