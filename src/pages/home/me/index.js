// import login from '../../../utils/login.js'
// import api from '../../../utils/api.js'

// const app = getApp()

// Page(login({

//   data: {
//     isReady: false,
//   },

//   getRedpacketBalance() {
//     const customer = app.get('customer')

//     api.getRedpacketBalance(customer.id).then((res) => {

//       let result = res.data
//       let informationData = {
//         avatar: customer.avatar_url || '',
//         name: customer.nickname || '',
//       }
//       let menuData = (result.balance / 100).toFixed(2) || '0.00'

//       wx.setStorageSync('redpacketOwnerToken', result.salesToken || '')

//       this.setData({
//         informationData: informationData,
//         menuData: menuData,
//         menuVisible: true,
//         sendVisible: result.haveBinded,
//       })

//       this.setData({ isReady: true })

//     })
//   },

//   onLoad: function (options) {
//     wx.hideLoading()
//     this.getRedpacketBalance()
//   },

//   onShow: function () {
//     if (app.get('customer').id) {
//       this.getRedpacketBalance()
//     }
//   },

// }))