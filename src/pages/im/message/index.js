const app = getApp()

Component({

  properties: {
    data: {
      type: Object,
      value: {
        id: '',
        message: '',
        avatar: '',
        from: '',
        time: '',
      }
    },
    ecProduct: {
      type: Object,
      value: {}
    }
  },

  data: {
    visible: false,
    isCustomer: false,
  },

  methods: {
    copy() {
      wx.setClipboardData({ data: this.data.data.message })
    }
  },

  attached() {
    this.setData({
      visible: !!this.data.data.id,
      isCustomer: this.data.data.from === 'customer' || false,
      contentClass: this.data.data.from === 'customer' ? 'content pull-right content-green' : 'content',
    })
  }
})
