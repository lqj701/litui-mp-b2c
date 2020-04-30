const app = getApp()

Component({
  properties: {
    ecProduct: {
      type: Object,
      value: {}
    },
    visible: {
      type: Boolean,
      value: true,
    }
  },
  methods: {
    goIm() {
      if (app.globalData.env === 'wxwork') {
        wx.showModal({
          title: '提示',
          content: '此功能在企业微信环境下不支持。',
          showCancel: false
        })
        return
      }
      const salerImAccountId = `bbs_${app.get('saler').wx_organization_id}_${app.get('saler').id}`
      app.dispatch('updateSalerImAccount', {
        wxUserId: app.get('saler').id,
        imAccountId: salerImAccountId,
      })
      wx.navigateTo({
        url: `/pages/im/index?ecProductId=${this.data.ecProduct.ecProductId}&ecProductName=${this.data.ecProduct.name}&ecProductPrice=${this.data.ecProduct.price}&ecProductImage=${this.data.ecProduct.image}`,
      })
    }
  }
})
