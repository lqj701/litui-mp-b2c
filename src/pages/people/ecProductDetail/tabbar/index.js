import api from '../../../../utils/api.js'

const app = getApp()

Component({
  properties: {
    text: {
      type: String,
      value: '立即购买',
      observer() {
        this.setData({
          hasBindPhone: app.get('phoneAuthState') ? true : false
        })
      },
    },
    easyBuy: {
      type: Boolean,
      value: true,
    },
    product: {
      type: Object,
      value: {},
    }
  },

  data: {
    tabbarRightClassName: 'tabbar-right',
    hasBindPhone: false,
  },

  methods: {
    goEcList() {
      wx.switchTab({ url: '/pages/people/product/index' })
    },
    showActionSheet() {
      // 商品没有发生变化
      this.triggerEvent('showActionSheet')
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
      this.triggerEvent('showActionSheet', { page: 'cart' })
    },
    goBilling() {
      if (app.globalData.env === 'wxwork') {
        wx.showModal({
          title: '提示',
          content: '此功能在企业微信环境下不支持。',
          showCancel: false
        })
        return
      }
      this.triggerEvent('showActionSheet', { page: 'billing' })
    },
    onClickRightImBtn() {
      if (app.globalData.env === 'wxwork') {
        wx.showModal({
          title: '提示',
          content: '此功能在企业微信环境下不支持。',
          showCancel: false
        })
        return
      }
      if (this.data.text === '立即沟通') {
        this.addInfo()
        const salerImAccountId = `bbs_${app.get('saler').wx_organization_id}_${app.get('saler').id}`
        app.dispatch('updateSalerImAccount', {
          wxUserId: app.get('saler').id,
          imAccountId: salerImAccountId,
        })
        wx.navigateTo({
          url: '/pages/im/index',
        })
      }
    },
    onClickLeftImBtn() {
      if (app.globalData.env === 'wxwork') {
        wx.showModal({
          title: '提示',
          content: '此功能在企业微信环境下不支持。',
          showCancel: false
        })
        return
      }
      const salerImAccountId = `bbs_${app.get('saler').wx_organization_id}_${app.get('saler').id}`
      this.addInfo()
      app.dispatch('updateSalerImAccount', {
        wxUserId: app.get('saler').id,
        imAccountId: salerImAccountId,
      })
      wx.navigateTo({ url: `/pages/im/index?productId=${this.data.product.id}` })
    },
    formSubmit(e) {
      if (e.detail.formId === 'the formId is a mock one') return
      const customerImAccount = app.get('customerImAccount')
      api.sendFormId([{
        account_id: customerImAccount.imAccountId,
        form_id: e.detail.formId,
        type: 1,
      }])
    },
    getPhoneNumber(e) {
      if (app.globalData.env === 'wxwork') {
        wx.showModal({
          title: '提示',
          content: '此功能在企业微信环境下不支持。',
          showCancel: false
        })
        return
      }
      const customer = app.get('customer')
      const salerImAccountId = `bbs_${app.get('saler').wx_organization_id}_${app.get('saler').id}`
      app.dispatch('updateSalerImAccount', {
        wxUserId: app.get('saler').id,
        imAccountId: salerImAccountId,
      })
      if (e.detail.errMsg === 'getPhoneNumber:ok') {
        api.setUserInfo(customer.openid, Object.assign({}, e.detail, { salesToken: app.get('salesToken') })).then((res) => {
          app.dispatch('updateCustomer', res.data)
          this.setData({
            hasBindPhone: true,
          })
          this.addInfo()
        })
      }
      wx.navigateTo({ url: `/pages/im/index?productId=${this.data.product.id}` })
    },
    addInfo() {
      const customer = app.get('customer')
      api.addInfo({
        openid: customer.openid,
        objectType: 'ec',
        objectId: this.data.product.id,
        goalsType: 0,
        fromType: 0,
        action: 'consult',
        actionGoals: 'ecGoods',
        revisitLog: null,
        extre: this.data.product.name,
      })
    }
  },
})
