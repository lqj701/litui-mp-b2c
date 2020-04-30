import api from '../../../../utils/api.js'

Component({
  properties: {
    visible: {
      type: Boolean,
      value: false,
    },
    order: {
      type: Object,
      value: {},
    },
    address: {
      type: Object,
      value: {}
    }
  },

  methods: {
    makePayment() {
      this.triggerEvent('makePayment')
    },
    close() {
      wx.redirectTo({
        url: `/pages/people/billing/index?ecOrderId=${this.data.order.orderNum}`,
      })
    }
  }
})
