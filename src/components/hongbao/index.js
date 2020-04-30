import api from '../../utils/api.js'

const app = getApp()

Component({

  properties: {
    salesData: {
      type: Object,
      value: {
        avatar: '',
        name: '',
        remark: '',
      }
    },
    orderId: {
      type: String,
      value: ''
    },
    redpacketId: {
      type: String,
      value: ''
    },
    auth: {
      type: Boolean,
      value: false,
    },
    hongbaoVisible: {
      type: Boolean,
      value: false,
    }
  },

  data: {
    newVisible: true,
    expiredVisible: false,
    expiredText: '',
  },

  methods: {
    close() {
      this.setData({ hongbaoVisible: false })
      wx.showTabBar({ animation: true })
    },
    open() {
      api.receiveRedpacket({ redpacket_order: this.data.orderId, customer_id: app.get('customer').id })
        .then((res) => {

          api.addInfo({
            objectType: 'redpacket',
            objectId: this.data.redpacketId,
            goalsType: 0,
            fromType: 0,
            fromId: app.get('customer').id,
            action: res.code === 0 ? 'gain' : 'read',
            actionGoals: 'redpacket',
            revisitLog: null,
          })

          if (res.code === -3) {
            //该红包已经过期
            this.setData({
              newVisible: false,
              expiredVisible: true,
              expiredText: '红包已过期',
            })
          } else if (res.code === -2) {
            //该用户已经抢过红包
            this.setData({
              newVisible: false,
              expiredVisible: true,
              expiredText: '您已经抢过红包了',
            })
          } else if (res.code === -1) {
            // 红包已被抢完
            this.setData({
              newVisible: false,
              expiredVisible: true,
              expiredText: '来晚了，红包领完了',
            })
          } else {
            // 抢到
            this.setData({
              amount: res.data.amount,
              time: res.data.time,
            })
            this.goto()
          }

        })
    },
    goto() {
      wx.setStorageSync('hasRedpacket', false)
      const customer = app.get('customer')
      const salesToken = app.get('salesToken')
      wx.redirectTo({
        url: `/pages/home/hongbaoDetail/index?orderId=${this.data.orderId}&redpacketId=${this.data.redpacketId}&customerId=${customer.id}&myPacketAmount=${this.data.amount}&myPacketTime=${this.data.time}&salesToken=${salesToken}`,
      })
    },
    getAuth(e) {
      const customer = app.get('customer')
      const wxUserInfo = e.detail
      wx.setStorageSync('wxUserInfo', wxUserInfo)
      if (wxUserInfo.errMsg === 'getUserInfo:ok' && customer) {
        api.setUserInfo(customer.openid, Object.assign({}, e.detail, { salesToken: app.get('salesToken') })).then((res) => {
          app.dispatch('updateUserAuthState', true)
          api.receiveRedpacket({ redpacket_order: this.data.orderId, customer_id: app.get('customer').id })
            .then((res) => {

              api.addInfo({
                objectType: 'redpacket',
                objectId: this.data.redpacketId,
                goalsType: 0,
                fromType: 0,
                fromId: app.get('customer').id,
                action: res.code === 0 ? 'gain' : 'read',
                actionGoals: 'redpacket',
                revisitLog: null,
              })

              if (res.code === -3) {
                //该红包已经过期
                this.setData({
                  newVisible: false,
                  expiredVisible: true,
                  expiredText: '红包已过期',
                })
              } else if (res.code === -2) {
                //该用户已经抢过红包
                this.setData({
                  newVisible: false,
                  expiredVisible: true,
                  expiredText: '您已经抢过红包了',
                })
              } else if (res.code === -1) {
                // 红包已被抢完
                this.setData({
                  newVisible: false,
                  expiredVisible: true,
                  expiredText: '来晚了，红包领完了',
                })
              } else {
                // 抢到
                this.setData({
                  amount: res.data.amount,
                  time: res.data.time,
                })
                this.goto()
              }
            })
        })
      }
    },
  },

})
