import api from '../../../utils/api.js'

const app = getApp()

Page({

  data: {
    tabbarState: 'billing',
    productsData: [],
    selectProducts: [],
    selectAll: false,
    amount: 0,
  },

  getCartListValid() {
    return new Promise((resolve) => {
      const customer = app.get('customer')
      api.getCartListValid(customer.customer_wx_user_id).then((res) => {
        const result = res.data
        let productsData = []
        result.ecCartList.forEach((item) => {
          item.ecGoods.price = (item.ecGoods.price / 100).toFixed(2)
          productsData.push(Object.assign({}, item.ecGoods, { count: item.ecCart.count, select: false, value: item.value, ecProductName: item.ecProduct.ecProductName }))
        })
        this.setData({
          productsData,
        })
        resolve()
      })
    })
  },

  getCartListInValid() {
    return new Promise((resolve) => {
      const customer = app.get('customer')
      api.getCartListInValid(customer.customer_wx_user_id).then((res) => {
        const result = res.data.ecCartList
        let expiredProductsData = []
        result.forEach((item) => {
          item.ecGoods.price = (item.ecGoods.price / 100).toFixed(2)
          expiredProductsData.push(Object.assign({}, item.ecGoods, { count: item.ecCart.count, goodsStatus: item.ecCart.goodsStatus, value: item.value, ecProductName: item.ecProduct.ecProductName }))
        })
        this.setData({
          expiredProductsData: expiredProductsData,
        })
        resolve()
      })
    })
  },

  onSelectProduct(e) {
    const goodsId = e.detail.goodsId
    let productsData = this.data.productsData
    let selectProducts = this.data.selectProducts
    let selectAll = null

    productsData.forEach((item) => {
      if (item.id === goodsId) {
        item.select = true
      }
    })

    const findIndex = selectProducts.findIndex(item => item === goodsId)
    if (findIndex !== -1) {
      selectProducts.splice(findIndex, findIndex + 1)
      productsData.forEach((item) => {
        if (item.id === goodsId) {
          item.select = false
        }
      })
    } else {
      selectProducts = [...this.data.selectProducts, goodsId]
      productsData.forEach((item) => {
        if (item.id === goodsId) {
          item.select = true
        }
      })
    }

    if (productsData.length === selectProducts.length) {
      selectAll = true
    } else {
      selectAll = false
    }

    this.setData({
      selectProducts: selectProducts,
      productsData: productsData,
      selectAll: selectAll,
    })

    this.setData({
      amount: this.calculateAmount(),
    })
  },

  selectAll() {
    let productsData = this.data.productsData
    let selectProducts = this.data.selectProducts
    let selectAll = null

    if (this.data.selectAll) {
      selectAll = false
      productsData.forEach((item) => {
        item.select = false
      })
      selectProducts = []
    } else {
      selectAll = true
      productsData.forEach((item) => {
        item.select = true
        selectProducts.push(item.id)
      })
    }

    this.setData({
      selectProducts: selectProducts,
      productsData: productsData,
      selectAll: selectAll,
    })

    this.setData({
      amount: this.calculateAmount(),
    })
  },

  editProducts() {
    let productsData = this.data.productsData

    productsData.forEach((item) => {
      item.select = false
    })

    this.setData({
      tabbarState: this.data.tabbarState === 'billing' ? 'edit' : 'billing',
      selectProducts: [],
      productsData: productsData,
      selectAll: false,
      amount: 0,
    })
  },

  deleteCart(ecGoodsId) {
    return new Promise((resolve) => {
      const customer = app.get('customer')
      const param = {
        customerWxUserId: customer.customer_wx_user_id,
        ecGoodsId: ecGoodsId
      }
      api.deleteCart(param).then(() => {
        resolve()
      })
    })
  },

  deleteProducts() {
    const ecGoodsId = this.data.selectProducts
    this.deleteCart(ecGoodsId).then(() => {
      this.getCartListValid()
      this.getCartListInValid()
      this.setData({
        amount: 0,
        selectProducts: [],
        selectAll: false,
      })
    })
  },

  clearExpiredProducts() {
    let expiredProducts = this.data.expiredProductsData, ecGoodsId = []
    expiredProducts.forEach((item) => {
      ecGoodsId.push(item.id)
    })
    this.deleteCart(ecGoodsId).then(() => {
      this.getCartListValid().then(() => {
        if (this.data.productsData.length > 0 && this.data.selectAll) {
          this.selectAll()
        }
      })
      this.getCartListInValid()
    })
  },

  addCount(e) {
    const _goodsId = e.detail.id
    let productsData = this.data.productsData

    productsData.forEach((item) => {
      if (item.id === _goodsId) {
        item.count += 1
        const param = {
          customerWxUserId: app.get('customer').customer_wx_user_id,
          ecGoodsId: _goodsId,
          count: item.count
        }
        api.updateCart(param)
      }
    })

    this.setData({
      productsData,
      amount: this.calculateAmount(),
    })
  },

  minusCount(e) {
    const _goodsId = e.detail.id
    let productsData = this.data.productsData

    productsData.forEach((item) => {
      if (item.id === _goodsId) {
        item.count = item.count > 1 ? item.count - 1 : 1
        const param = {
          customerWxUserId: app.get('customer').customer_wx_user_id,
          ecGoodsId: _goodsId,
          count: item.count
        }
        api.updateCart(param)
      }
    })

    this.setData({
      productsData,
      amount: this.calculateAmount(),
    })
  },

  billing() {
    if (this.data.selectProducts.length === 0) return
    getApp().globalData.cart = {}
    this.data.selectProducts.forEach((selectGoodsId) => {
      this.data.productsData.forEach((item) => {
        if (item.id === selectGoodsId) {
          getApp().globalData.cart[selectGoodsId] = Object.assign({}, item)
        }
      })
    })
    wx.navigateTo({
      url: '/pages/people/billing/index'
    })
  },

  calculateAmount() {
    let amount = 0
    this.data.selectProducts.forEach((selectGoodsId) => {
      this.data.productsData.forEach((goods) => {
        if (goods.id === selectGoodsId) {
          amount += Number(goods.price) * Number(goods.count)
        }
      })
    })
    return amount
  },

  onLoad: function () {
    this.getCartListValid().then(() => {
      if (this.data.productsData.length > 0) {
        this.selectAll()
      }
    })
    this.getCartListInValid()
  },

  onUnload: function () {

  },

})