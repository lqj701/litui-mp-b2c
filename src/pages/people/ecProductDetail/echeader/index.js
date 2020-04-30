const app = getApp()

Component({

  properties: {
    title: {
      type: String,
      value: '我的商城'
    }
  },

  methods: {
    goOrder() {
      if (app.globalData.env === 'wxwork') {
        wx.showModal({
          title: '提示',
          content: '此功能在企业微信环境下不支持。',
          showCancel: false
        })
        return
      }
      wx.navigateTo({
        url: '/pages/people/order/index',
      })
    },
    goCart() {
      if (app.globalData.env === 'wxwork') {
        wx.showModal({
          title: '提示',
          content: '此功能在企业微信环境下不支持。',
          showCancel: false
        })
        return
      }
      wx.navigateTo({
        url: '/pages/people/cart/index',
      })
    },
    showShareModal() {
      this.triggerEvent('showShareModal')
    }
  }
})
