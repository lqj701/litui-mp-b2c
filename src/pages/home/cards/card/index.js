import api from '../../../../utils/api.js'

const app = getApp()

Component({

  properties: {
    card: {
      type: Object,
      value: {
        id: 0,
        name: '',
        position: '',
        phone: '',
        company: '',
        avatar: '',
        getDate: '',
        getWay: 0,
        unread: 0,
        wxUserId: 0,
        source: '',
        isValid: true,
        orgId: 0,
      },
    },
  },

  data: {
    maskVisible: null,
  },

  methods: {
    readCard() {
      if (!this.data.card.isValid && app.get('appType' === 0)) return
      wx.showLoading({ title: '匹配数据中', mask: false })
      app.dispatch('updateSaler', {
        id: this.data.card.wxUserId,
        wx_organization_id: this.data.card.orgId,
      })
      api.getSalesToken(this.data.card.id).then((res) => {
        app.dispatch('updateSalesToken', res.data)
        getApp().globalData.isFirstSetTabbar = true
        wx.reLaunch({ url: `/pages/people/card/index` })
      })
    },
  },

  attached() {
    this.setData({
      maskVisible: app.get('appType') !== 1
    })
  }

})
