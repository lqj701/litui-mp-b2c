Component({
  properties: {
    products: {
      type: Array,
      value: [],
      observer: '_product'
    },
    selectProducts: {
      type: Array,
      value: []
    },
  },

  data: {
    state: '编辑',
  },

  methods: {
    _product(newVal) {
    },
    select(e) {
      const goodsId = e.currentTarget.dataset.id
      this.triggerEvent('select', { goodsId: goodsId })
    },
    editProducts(e) {
      this.setData({
        state: this.data.state === '编辑' ? '完成' : '编辑',
      })
      this.triggerEvent('editProducts', { products: this.data.selectProducts })
    },
    gotoProduct(e) {
      const ecproductid = e.currentTarget.dataset.ecproductid
      wx.navigateTo({
        url: `/pages/people/ecProductDetail/index?ecProductId=${ecproductid}`
      })
    }
  }
})
