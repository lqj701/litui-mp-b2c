import login from '../../../utils/login.js'
import api from '../../../utils/api.js'
import { timestamp } from '../../../utils/tool.js'
import regeneratorRuntime from "../../../utils/regenerator-runtime";

const app = getApp()

Page(login({

  data: {
    productListData: [],
    ecProductListData: [],
    page: 1,
    row: 5,
    hasNext: 1,
    hasEcNext: 1,
    ecPage: 1,
    ecRow: 50,
    unread: 0,
    isNull: false,
    onFetch: false,
    loadingText: '加载中',
    loadingClassName: 'loading loading--hide',
  },


  /////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////

  goto(e) {
    const productId = e.currentTarget.dataset.value
    wx.navigateTo({ url: `/pages/people/productDetail/index?productId=${productId}` })
  },

  getProductListData(lifecycle) {
    if (this.data.onFetch || !this.data.hasNext) return
    this.setData({
      loadingText: '加载中',
      loadingClassName: this.data.page > 1 ? 'loading' : 'loading loading--hide',
      scrollTop: 0,
    })
    this.setData({ onFetch: true })
    return new Promise(async (resolve, reject) => {
      const productList = await api.getProductList(this.data.page, this.data.row)
      if (productList.code === 101129) {
        wx.redirectTo({
          url: '/pages/expired/index'
        })
        reject()
      }
      const result = productList.data
      let products = result.products.map((data, index) => {
        return {
          id: data.product.id || '',
          name: data.product.name || '',
          price: data.product.price_uncertain ? '面议' : '¥ ' + (data.product.price / 100).toFixed(2),
          introduce: data.introduce || data.product.product_introduce || '这个人很懒，没有写商品简介...',
          support: data.product.support_num || 0,
          image: data.image[0] ? (data.image[0].image_url || '') : ''
        }
      })
      const topbarData = {
        name: result.wxUser.name || '',
        avatar: result.wxUser.avatar || '',
        position: result.wxUser.position || '',
        productId: null,
      }

      if (lifecycle === 'onShow') {
        this.setData({
          productListData: products,
          topbarData,
          hasNext: result.hasNext,
          page: 2,
          isNull: !products[0] && (this.data.page === 1),
          loadingText: this.data.page > 2 ? '加载中' : '',
        })
      } else {
        this.setData({
          productListData: [...this.data.productListData, ...products],
          topbarData,
          hasNext: result.hasNext,
          page: this.data.page + 1,
          isNull: !products[0] && (this.data.page === 1),
          loadingText: result.hasNext ? '加载中' : '没了',
          loadingClassName: this.data.page > 1 ? 'loading' : 'loading loading--hide',
        })
      }

      app.dispatch('updateSaler', result.wxUser)
      this.setData({ onFetch: false })
      resolve()
    })
  },

  addInfoReadProducts() {
    const customer = app.get('customer')
    api.addInfo({
      openid: customer.openid,
      objectType: 'card',
      objectId: null,
      goalsType: 0,
      fromType: 0,
      action: 'read',
      actionGoals: 'productList',
      time_order: timestamp(),
      revisitLog: null
    })
  },

  addInfoForwardProducts() {
    const customer = app.get('customer')
    api.addInfo({
      openid: customer.openid,
      objectType: 'card',
      objectId: null,
      goalsType: 0,
      fromType: 0,
      action: 'forward',
      actionGoals: 'productList',
      time_order: timestamp(),
      revisitLog: null
    })
  },

  /////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////

  getEcProductListData(lifecycle) {

    return new Promise(async (resolve) => {
      if (this.data.onFetch || !this.data.hasEcNext) {
        wx.hideLoading()
        resolve()
        return
      }
      this.setData({ onFetch: true })
      const param = { page: this.data.ecPage, row: this.data.ecRow }
      const ecProductList = await api.getEcProductList(param)
      const result = ecProductList.data

      if (!result || !result.products) {
        wx.hideLoading()
        this.setData({
          isNull: true,
          ecHeader: result.ecShop.shopName,
        })
        return
      }

      let products = []
      result.products.forEach((product) => {
        if (product.onSale) {
          product.minPrice = (Number(product.minPrice) / 100).toFixed(2)
          products.push(product)
        }
      })

      this.setData({
        ecHeader: result.ecShop.shopName,
      })

      if (lifecycle === 'onShow') {
        this.setData({
          ecProductListData: products,
          hasEcNext: result.hasNext,
          ecPage: 2,
          isNull: !products[0] && (this.data.page === 1),
        })
      } else {
        this.setData({
          ecProductListData: [...this.data.ecProductListData, ...products],
          hasEcNext: result.hasNext,
          ecPage: this.data.ecPage + 1,
          isNull: !products[0] && (this.data.page === 1),
        })
      }

      this.setData({
        ecShop: result.ecShop
      })

      this.setData({ onFetch: false })
      resolve()
    })
  },

  addInfoReadEcProducts() {
    const customer = app.get('customer')
    api.addInfo({
      openid: customer.openid,
      objectType: 'ec',
      objectId: this.data.ecShop.id,
      goalsType: 0,
      fromType: 0,
      action: 'read',
      actionGoals: 'ecShop',
      time_order: timestamp(),
      revisitLog: null
    })
  },

  addInfoForwardEcProducts() {
    const customer = app.get('customer')
    api.addInfo({
      openid: customer.openid,
      objectType: 'ec',
      objectId: this.data.ecShop.id,
      goalsType: 0,
      fromType: 0,
      action: 'forward',
      actionGoals: 'ecShop',
      time_order: timestamp(),
      revisitLog: null
    })
  },

  /////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////

  async onLoad(options, authVisible) {
    wx.hideLoading()
    this.setData({
      isSetEc: app.globalData.isSetEc,
      authVisible: authVisible,
      salesToken: app.get('salesToken'),
    })
    const isSetEc = app.globalData.isSetEc
    const appType = app.get('appType')

    if (appType === 1 && isSetEc) {
      await this.getEcProductListData('onLoad')
      this.data.ecShop && this.addInfoReadEcProducts()
      wx.hideLoading()
    } else {
      await this.getProductListData('onLoad')
      this.addInfoReadProducts()
      wx.hideLoading()
    }
  },

  async onShow() {
    const customer = app.get('customer')
    const isSetEc = app.globalData.isSetEc
    const isFirstSetTabbar = app.globalData.isFirstSetTabbar
    const appType = app.get('appType')

    if (JSON.stringify(customer) !== '{}' || app.globalData.env === 'wxwork') {
      if (appType === 1 && isSetEc) {
        this.setData({
          hasEcNext: 1,
          ecPage: 1,
          ecProductListData: [],
        })
        await this.getEcProductListData('onShow')
        this.addInfoReadEcProducts()
        wx.hideLoading()
        app.globalData.isFirstSetTabbar = false
      } else if (appType === 1 && !isSetEc && isFirstSetTabbar) {
        wx.showToast({
          title: '对不起，商城已关闭',
          icon: 'none',
          mask: true,
          success: () => {
            setTimeout(() => {
              wx.switchTab({ url: '/pages/people/card/index' })
            }, 3000)
          }
        })
      } else {
        this.setData({
          hasNext: 1,
          page: 1,
          productListData: [],
        })
        await this.getProductListData('onShow')
        //发送情报
        this.addInfoReadProducts()
      }
    }
  },

  onHide() {
    this.setData({
      productListData: [],
      ecProductListData: [],
    })
  },

  scrolltolower() {
    const isSetEc = app.globalData.isSetEc
    if (isSetEc) {
      this.getEcProductListData()
    } else {
      this.getProductListData()
    }
  },

  onShareAppMessage(res) {
    const salesToken = app.get('salesToken')
    if (app.globalData.isSetEc) {
      this.addInfoForwardEcProducts()
      return {
        title: `${app.get('saler').name}的商城，千万商品任您挑选`,
        path: `pages/people/product/index?salesToken=${salesToken}&getWay=1`,
      }
    } else {
      this.addInfoForwardProducts()
      return {
        title: `${app.get('saler').name || ''}的产品`,
        path: `pages/people/product/index?salesToken=${salesToken}&getWay=1`,
      }
    }
  }
}))