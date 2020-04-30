const app = getApp()

Component({
  properties: {
    product: {
      type: Object,
      value: {},
      observer(newVal) {
        if (!newVal) return
        const isSetEc = app.globalData.isSetEc
        const isFirstSetTabbar = app.globalData.isFirstSetTabbar
        this.setData({
          visible: newVal.id && !isSetEc && !isFirstSetTabbar
        })
      }
    },
  },

  data: {
    visible: false,
  },

  methods: {
    goto() {
      wx.navigateTo({ url: `/pages/people/productDetail/index?productId=${this.data.product.id}` })
    }
  },

})
