Component({
  properties: {
    address: {
      type: Object,
      value: {},
      observer: '_address'
    },
    snapshot: {
      type: Boolean,
      value: false,
    }
  },

  data: {
    hasDefaultAddress: true,
  },

  methods: {
    _address(newVal) {
      let address = newVal
      if (address !== {} && address !== null) {
        this.setData({
          hasDefaultAddress: true,
        })
      } else {
        this.setData({
          hasDefaultAddress: false,
        })
      }
    },
    goto() {
      wx.navigateTo({
        url: '/pages/people/selectAddress/index',
      })
    }
  }
})
