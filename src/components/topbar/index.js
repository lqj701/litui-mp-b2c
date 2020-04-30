import api from '../../utils/api.js'
import { timestamp, currentRoute } from '../../utils/tool'

const app = getApp()

Component({

  properties: {
    data: {
      type: Object,
      value: {
        productId: 0,
        name: '',
        avatar: '',
        position: ''
      }
    },
    unread: {
      type: Number,
      value: 0
    },
  },

  data: {
    visible: false,
    authVisible: null,
    appType: null,
    contactModalVisible: false,
    salerAvatar: '',
  },

  methods: {
    formSubmit(e) {
      if (e.detail.formId === 'the formId is a mock one') return
      const customerImAccount = app.get('customerImAccount')
      api.sendFormId([{
        account_id: customerImAccount.imAccountId,
        form_id: e.detail.formId,
        type: 1,
      }])
    },

    goto(e) {
      if (e.target.dataset.value === 'card') {
        wx.switchTab({ url: `/pages/people/card/index` })
      } else {
        if (app.globalData.env === 'wxwork') {
          wx.showModal({
            title: '提示',
            content: '此功能在企业微信环境下不支持。',
            showCancel: false
          })
          return
        }
        const salesImAccountId = `bbs_${app.get('saler').wx_organization_id}_${app.get('saler').id}`
        app.dispatch('updateSalerImAccount', {
          wxUserId: app.get('saler').id,
          name: this.data.data.name,
          imAccountId: salesImAccountId,
        })
        wx.navigateTo({ url: `/pages/im/index` })
      }
    },

    getPhoneNumber(e) {
      const customer = app.get('customer')
      const salesImAccountId = `bbs_${app.get('saler').wx_organization_id}_${app.get('saler').id}`
      app.dispatch('updateSalerImAccount', {
        wxUserId: app.get('saler').id,
        name: this.data.data.name,
        imAccountId: salesImAccountId,
      })
      if (app.globalData.env === 'wxwork') {
        wx.showModal({
          title: '提示',
          content: '此功能在企业微信环境下不支持。',
          showCancel: false
        })
        return
      } else {
        wx.navigateTo({ url: `/pages/im/index` })
      }
      if (e.detail.errMsg === 'getPhoneNumber:ok') {
        api.setUserInfo(customer.openid, Object.assign({}, e.detail, { salesToken: app.get('salesToken') }))
        this.setData({ authVisible: false })
        if (currentRoute() === 'pages/people/productDetail/index') {
          api.addInfo({
            openid: customer.openid,
            objectType: 'prod',
            objectId: this.data.data.productId,
            goalsType: 0,
            fromType: 0,
            action: 'consult',
            actionGoals: 'product',
            revisitLog: null
          })
        } else {
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
        }
        app.dispatch('updatePhoneAuthState', true)
      }
    },

    getPhoneNumberAnother(e) {
      if (e.detail.errMsg === 'getPhoneNumber:ok') {
        this.setData({ authVisible: false })
        app.dispatch('updatePhoneAuthState', true)
        const customer = app.get('customer')
        api.setUserInfo(customer.openid, Object.assign({}, e.detail, { salesToken: app.get('salesToken') }))
        if (currentRoute() === 'pages/people/productDetail/index') {
          api.addInfo({
            openid: customer.openid,
            objectType: 'prod',
            objectId: this.data.data.productId,
            goalsType: 0,
            fromType: 0,
            action: 'consult',
            actionGoals: 'product',
            revisitLog: null
          })
        } else {
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
        }
      }
    },

    hasPhoneNumber() {
      wx.showToast({ icon: 'none', title: '您已经留下电话，客户会马上与你沟通' })
    },

    showContactModal() {
      this.setData({
        contactModalVisible: true,
        salerAvatar: app.get('saler').avatar,
        hasBindphone: app.get('customer').bindphone ? true : false,
      })
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

    makePhoneCall() {
      const saler = app.get('saler')
      const customer = app.get('customer')
      const phoneNumber = saler.phone1 || saler.phone2 || ''
      if (phoneNumber) {
        wx.makePhoneCall({
          phoneNumber,
          success: () => {
            api.getCardDetail().then((res) => {
              api.addInfo({
                openid: customer.openid,
                objectType: 'card',
                objectId: res.data.bCardInfo.id,
                goalsType: 0,
                fromType: 0,
                action: 'call',
                actionGoals: 'tel',
                time_order: timestamp(),
                revisitLog: null
              })
            })
          },
        })
      } else {
        wx.showToast({
          icon: 'none',
          title: '对方还没有留手机号哦',
        })
      }
    },

    closeContactModal() {
      this.setData({ contactModalVisible: false })
    },
  },

  attached() {
    this.setData({
      visible: !!this.data.data && (!!this.data.data.name || !!this.data.data.avatar || !!this.data.data.position || !!this.data.data.unread),
      IM_ENABLE: app.globalData.IM_ENABLE
    })

    if (app.get('appType') === null) {
      app.event.on('receivedAppType', () => {
        this.setData({ appType: app.get('appType') })
      })
    } else {
      this.setData({ appType: app.get('appType') })
    }

    app.event.on('customerHasLogin', () => {
      this.setData({
        authVisible: !app.get('phoneAuthState'),
      })
    })
  }
})
