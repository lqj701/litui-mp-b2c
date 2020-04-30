import api from '../../../../utils/api'
import regeneratorRuntime from "../../../../utils/regenerator-runtime";

const app = getApp()

Component({
  properties: {
    information: {
      type: Object,
      value: {
        customerId: 0,
        bCardId: 0,
        avatar: '',
        name: '',
        position: '',
        company: ''
      },
    },
  },

  data: {
    appType: null,
  },

  methods: {
    share(e) {
      this.triggerEvent('showActionSheet')
      if (e.detail.formId === 'the formId is a mock one') return
      const customerImAccount = app.get('customerImAccount')
      api.sendFormId([{
        account_id: customerImAccount.imAccountId,
        form_id: e.detail.formId,
        type: 1,
      }])
    },
    im(e) {
      if (e.detail.formId === 'the formId is a mock one') return
      const customerImAccount = app.get('customerImAccount')
      api.sendFormId([{
        account_id: customerImAccount.imAccountId,
        form_id: e.detail.formId,
        type: 1,
      }])
    },
    goto() {
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
        name: this.data.information.name,
        imAccountId: salerImAccountId,
      })
      wx.navigateTo({ url: `/pages/im/index` })
    },
    async getPhoneNumber(e) {
      if (e.detail.errMsg === 'getPhoneNumber:ok') {
        const customer = app.get('customer')
        app.dispatch('updatePhoneAuthState', true)
        await api.setUserInfo(customer.openid, Object.assign({}, e.detail, { salesToken: app.get('salesToken') }))
        api.addInfo({
          openid: customer.openid,
          objectType: 'epr',
          objectId: null,
          goalsType: 0,
          fromType: 0,
          action: 'empower',
          actionGoals: 'tel',
          revisitLog: null
        })
        this.setData({
          phoneAuthState: true
        })
      }
      this.goto()
    },
    showContactModal() {
      this.triggerEvent('showContactModal')
    }
  },

  attached() {
    app.event.on('customerHasLogin', () => {
      this.setData({
        phoneAuthState: app.get('phoneAuthState')
      })
    })

    this.setData({
      IM_ENABLE: app.globalData.IM_ENABLE
    })

    if (app.get('appType') === null) {
      app.event.on('receivedAppType', () => {
        this.setData({ appType: app.get('appType') })
      })
    } else {
      this.setData({ appType: app.get('appType') })
    }

  }

})
