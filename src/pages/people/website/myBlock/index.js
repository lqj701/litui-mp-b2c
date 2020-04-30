import api from '../../../../utils/api'
import { timestamp } from '../../../../utils/tool'

const app = getApp()

Component({
  properties: {
    data: {
      type: Array,
      value: []
    },
    info: {
      type: Object,
      value: {
        websiteId: null,
        company: '',
      }
    },
    visible: {
      type: Boolean,
      value: false
    }
  },

  methods: {
    makePhoneCall(e) {
      const phoneNumber = e.currentTarget.dataset.value
      const customer = app.get('customer')
      wx.makePhoneCall({
        phoneNumber: phoneNumber,
        complete: (res) => {
          api.addInfo({
            openid: customer.openid,
            objectType: 'web',
            objectId: this.data.info.websiteId,
            goalsType: 0,
            fromType: 0,
            action: 'call',
            actionGoals: 'tel',
            time_order: timestamp(),
            revisitLog: null
          })
        }
      })
    },
    copy(e) {
      const customer = app.get('customer')
      const { type, value } = e.currentTarget.dataset
      wx.setClipboardData({
        data: value,
        success: () => {
          wx.showToast({ title: '复制成功' })
        },
        complete: () => {
          api.addInfo({
            openid: customer.openid,
            objectType: 'web',
            objectId: this.data.info.websiteId,
            goalsType: 0,
            fromType: 0,
            action: 'copy',
            actionGoals: type,
            time_order: timestamp(),
            revisitLog: null
          })
        }
      })
    },
    goto(e) {
      const customer = app.get('customer')
      const { address } = e.currentTarget.dataset
      api.addInfo({
        openid: customer.openid,
        objectType: 'web',
        objectId: this.data.info.websiteId,
        goalsType: 0,
        fromType: 0,
        action: 'read',
        actionGoals: 'address',
        time_order: timestamp(),
        revisitLog: null
      })
      wx.navigateTo({ url: `/pages/map/index?company=${this.data.info.company}&address=${address}` })
    },
    videoErr(e) {
      // wx.showToast({
      //   title: '视频无法播放',
      //   icon: 'none',
      // })
    }
  },

})
