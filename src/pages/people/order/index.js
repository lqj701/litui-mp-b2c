import api from '../../../utils/api.js'

const app = getApp()

Page({

  data: {
    activeTab: '0',
    tabToStatus: 5,
    tab0Page: 1,
    tab1Page: 1,
    tab2Page: 1,
    tab3Page: 1,
    tab0Row: 20,
    tab1Row: 20,
    tab2Row: 20,
    tab3Row: 20,
    tab0HasNext: 1,
    tab1HasNext: 1,
    tab2HasNext: 1,
    tab3HasData: 1,
    tab0Data: [],
    tab1Data: [],
    tab2Data: [],
    tab3Data: [],
    onFetch: false,
  },

  makePayment() {
    wx.requestPayment({
      timeStamp: '',
      nonceStr: '',
      package: '',
      signType: '',
      paySign: '',
      success: () => {
        wx.navigateTo({
          url: `/pages/people/paymentResult/index?result=success`,
        })
      },
      fail: () => {
        wx.navigateTo({
          url: `/pages/people/paymentResult/index?result=fail`,
        })
      }
    })
  },

  tabToStatus() {
    switch (this.data.activeTab) {
      case '0':
        this.setData({
          tabToStatus: 5 // 全部
        })
        break
      case '1':
        this.setData({
          tabToStatus: 0 // 待付款
        })
        break
      case '2':
        this.setData({
          tabToStatus: 1 // 待发货
        })
        break
      case '3':
        this.setData({
          tabToStatus: 2 // 已发货／待收货
        })
        break
      default:
        this.setData({
          tabToStatus: 5 // 全部
        })
        break
    }
  },

  getOrderList() {
    if (this.data.onFetch) return
    this.setData({ onFetch: true })
    wx.showLoading({ title: '加载中' })
    return new Promise((resolve) => {
      const param = {
        customerWxUserId: app.get('customer').customer_wx_user_id,
        status: this.data.tabToStatus,
        page: this.data[`tab${this.data.activeTab}Page`],
        row: this.data[`tab${this.data.activeTab}Row`],
      }
      api.getOrderList(param).then((res) => {
        let result = res.data
        let orderList = result.orderList
        let oldList = this.data[`tab${this.data.activeTab}Data`]

        if (oldList === []) {
          this.setData({
            [`tab${this.data.activeTab}Data`]: orderList,
            [`tab${this.data.activeTab}HasNext`]: res.data.hasNext,
          })
        } else {
          this.setData({
            [`tab${this.data.activeTab}Data`]: [...oldList, ...orderList],
            [`tab${this.data.activeTab}HasNext`]: res.data.hasNext,
          })
        }

        wx.hideLoading()
        this.setData({ onFetch: false })
        resolve()
      })
    })
  },

  switchTab(e) {
    this.setData({
      activeTab: e.detail.index
    })
    this.setData({
      [`tab${this.data.activeTab}Data`]: [],
      [`tab${this.data.activeTab}HasNext`]: 1,
      [`tab${this.data.activeTab}Page`]: 1,
    })
    this.tabToStatus()
    this.getOrderList()
  },

  scrolltolower() {
    if (this.data[`tab${this.data.activeTab}HasNext`]) {
      this.setData({
        [`tab${this.data.activeTab}Page`]: this.data[`tab${this.data.activeTab}Page`] + 1,
      })
      this.getOrderList()
    }
  },

  onShow: function () {
    this.setData({
      [`tab${this.data.activeTab}Data`]: [],
      [`tab${this.data.activeTab}HasNext`]: 1,
      [`tab${this.data.activeTab}Page`]: 1,
    })
    this.getOrderList()
  },

})