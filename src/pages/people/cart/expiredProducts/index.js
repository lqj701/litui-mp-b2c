Component({
  properties: {
    products: {
      type: Array,
      value: [],
      observer: '_products'
    }
  },

  data: {
    visible: false,
  },

  methods: {
    _products(newVal) {
      if (newVal.length > 0) {
        let _products = newVal
        _products.forEach((item) => {
          switch (item.goodsStatus) {
            case 1:
              item.goodsStatus = '不支持在线交易'
              break
            case 2:
              item.goodsStatus = '商品不存在'
              break
            case 3:
              item.goodsStatus = '商品下架'
              break
            case 4:
              item.goodsStatus = '商品规格不存在'
              break
            case 5:
              item.goodsStatus = '商品售罄'
              break
            default:
              item.goodsStatus = '意外失效'
              break
          }
        })
        this.setData({
          visible: true,
          products: _products
        })
      } else {
        this.setData({
          visible: false,
        })
      }
    },
    clearExpiredProducts() {
      this.triggerEvent('clearExpiredProducts')
    },
    goto(e) {
      wx.navigateTo({
        url: '/pages/people/ecProductDetail/index?ecProductId=' + e.currentTarget.dataset.productid
      })
    }
  }
})
