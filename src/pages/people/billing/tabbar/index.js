import api from '../../../../utils/api.js'

const app = getApp()

Component({
  properties: {
    amount: {
      type: String,
      value: '0.00',
      observer: '_amount'
    },
    state: {
      type: Object,
      value: {
        isClosedOrder: false,
        isExistOrder: false,
      }
    },
    visible: {
      type: Boolean,
      value: true,
    }
  },

  data: {
    hasBindPhone: false,
  },

  methods: {
    _amount(newVal, oldVal) {
      this.setData({
        hasBindPhone: app.get('customer').bindphone ? true : false
      })
    },
    createEcOrder() {
      this.triggerEvent('createEcOrder')
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
    makePayment() {
      this.triggerEvent('makePayment')
    },
    contact() {
      const salerImAccountId = `bbs_${app.get('saler').wx_organization_id}_${app.get('saler').id}`
      app.dispatch('updateSalerImAccount', {
        wxUserId: app.get('saler').id,
        imAccountId: salerImAccountId,
      })
      wx.navigateTo({
        url: `/pages/im/index`,
      })
    },
    getPhoneNumber(e) {
      const customer = app.get('customer')
      if (e.detail.errMsg === 'getPhoneNumber:ok') {
        api.setUserInfo(customer.openid, Object.assign({}, e.detail, { salesToken: app.get('salesToken') })).then((res) => {
          // const customer = app.get('customer')
          // wx.setStorageSync('customer', Object.assign({}, customer, { bindphone: res.data.bindphone }))
          // this.setData({
          //   hasBindPhone: true,
          // })
        })
      }
      this.triggerEvent('createEcOrder')
    }
  }
})
