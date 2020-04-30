import api from '../../utils/api.js'

const app = getApp()

Component({

  data: {
    visible: true,
    content: '',
  },

  methods: {
    getAuth(e) {
      const customer = app.get('customer')
      const wxUserInfo = e.detail
      wx.setStorageSync('wxUserInfo', wxUserInfo)
      wx.showTabBar({ animation: true })
      app.dispatch('updateUserAuthState', true)
      this.setData({ visible: false })
      if (wxUserInfo.errMsg === 'getUserInfo:ok' && customer) {
        api.setUserInfo(customer.openid, Object.assign({}, e.detail, { salesToken: app.get('salesToken') })).then((res) => {
          app.dispatch('updateCustomer', res.data)
        })
      }
    },

    formSubmit(e) {
      if (e.detail.formId === 'the formId is a mock one') return
      const customerImAccount = app.get('customerImAccount')
      if (customerImAccount) {
        api.sendFormId([{
          account_id: customerImAccount.imAccountId,
          form_id: e.detail.formId,
          type: 1,
        }])
      }
    },
  },

  attached() {
    this.setData({
      content: app.get('customer').firstOpen ? '恭喜您，解锁了一张新名片' : '需要授权才能立即查看哦'
    })
  },

})
