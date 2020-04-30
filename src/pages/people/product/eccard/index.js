Component({
  properties: {
    data: {
      type: Object,
      value: {}
    }
  },

  methods: {
    goto() {
      wx.navigateTo({
        url: `/pages/people/ecProductDetail/index?ecProductId=${this.data.data.id}`
      })
    }
  }
})
