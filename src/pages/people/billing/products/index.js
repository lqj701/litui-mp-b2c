Component({
  properties: {
    products: {
      type: Array,
      value: [],
      observer: '_products'
    },
    amount: {
      type: String,
      value: '0.00',
    },
    order: {
      type: Object,
      value: {}
    },
    snapshot: {
      type: Boolean,
      value: false,
    }
  },

  data: {
    hasProduct: false,
  },

  methods: {
    _products(newVal) {
      if (!newVal) return
      if (newVal.length === 0) {
        this.setData({
          hasProduct: false
        })
      } else {
        this.setData({
          hasProduct: true
        })
      }
    },

    goto(e) {
      const productId = e.currentTarget.dataset.id
      wx.navigateTo({
        url: `/pages/people/ecProductDetail/index?ecProductId=${productId}`
      })
    },

    goCart() {
      getApp().globalData.cart = {}
      wx.redirectTo({
        url: `/pages/people/cart/index`
      })
    }
  }
})
