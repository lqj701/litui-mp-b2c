import login from '../../../utils/login.js'
import api from '../../../utils/api.js'
import { timestamp } from '../../../utils/tool.js'
import regeneratorRuntime from "../../../utils/regenerator-runtime";

const app = getApp()

Page(login({

  data: {
    product: null,
    supportState: false,
    editShare: false,
    shareValue: '',
    shareDefaultValue: ''
  },

  getProductSupportState(productId) {
    if (app.globalData.env === 'wxwork') return
    const customer = app.get('customer')
    return new Promise(async (resolve) => {
      const productSupportState = await api.getProductSupportState(customer.openid, productId)
      this.setData({ supportState: productSupportState.data })
      resolve()
    })
  },

  getProduct(productId) {
    return new Promise(async (resolve, reject) => {
      const customer = app.get('customer')
      const productDetail = await api.getProductDetail(productId)
      if (productDetail.code === 101129) {
        wx.redirectTo({
          url: '/pages/expired/index'
        })
        reject()
      }
      const result = productDetail.data
      const product = {
        id: result.product.id || 0,
        name: result.product.name || '',
        introduce: result.introduce || result.product.product_introduce || '这个人很懒，没有写商品简介...',
        price: result.product.price_uncertain ? '面议' : '¥ ' + (result.product.price / 100).toFixed(2),
        support: result.product.support_num || 0,
        coverImages: result.imageShow || [],
        images: result.imageDetail || []
      }

      const topbarData = {
        productId: result.product.id || 0,
        name: result.wxUser.name || '',
        avatar: result.wxUser.avatar || '',
        position: result.wxUser.position || '',
        unread: result.wxUser.unread || 0
      }

      const actionbar = {
        openId: customer.openid,
        forward: result.product.forward_num || 0,
        support: result.product.support_num || 0,
      }

      this.setData({
        salesData: result.wxUser,
        product,
        topbarData,
        actionbar,
      })

      app.dispatch('updateSaler', result.wxUser)
      resolve()
    })
  },

  showShareModal() {
    this.setData({
      editShare: true,
      shareValue: ''
    })
  },

  closeShare() {
    this.setData({
      editShare: false,
      shareValue: ''
    })
    wx.nextTick(() => {
      this.triggerEvent('onEditShare', '')
    })
  },

  handleShareInput(e) {
    this.setData({
      shareValue: e.detail.value
    })
  },

  async onSupport() {
    const customer = app.get('customer')

    this.setData({
      ['actionbar.support']: this.data.supportState ? this.data.actionbar.support - 1 : this.data.actionbar.support + 1,
      ['product.support']: this.data.supportState ? this.data.actionbar.support - 1 : this.data.actionbar.support + 1,
      supportState: !this.data.supportState
    })

    await api.updateProduct(this.data.product.id, this.data.supportState ? 'support' : 'unsupport')
    api.addInfo({
      openid: customer.openid,
      objectType: 'prod',
      objectId: this.data.product.id,
      goalsType: 0,
      fromType: 0,
      action: this.data.supportState ? 'click' : 'cancel',
      actionGoals: 'support',
      time_order: timestamp(),
      revisitLog: null
    })

  },

  addInfoReadProduct() {
    const customer = app.get('customer')
    api.addInfo({
      openid: customer.openid,
      objectType: 'prod',
      objectId: this.data.product.id,
      goalsType: 0,
      fromType: 0,
      action: 'read',
      actionGoals: 'product',
      time_order: timestamp(),
      revisitLog: null
    })
  },

  addInfoForwardProduct() {
    const customer = app.get('customer')
    api.addInfo({
      openid: customer.openid,
      objectType: 'prod',
      objectId: this.data.product.id,
      goalsType: 0,
      fromType: 0,
      action: 'forward',
      actionGoals: 'product',
      time_order: timestamp(),
      revisitLog: null
    })
  },

  async onLoad(options, authVisible) {
    const { productId } = options

    if (getApp().globalData.isSetEc) {
      wx.switchTab({ url: '/pages/people/card/index' })
      return
    }

    this.setData({
      authVisible,
      salesToken: app.get('salesToken')
    })

    await this.getProduct(Number(productId))
    wx.hideLoading()
    this.addInfoReadProduct()

    this.getProductSupportState(Number(productId))

    const card = await api.getCardDetail()
    this.setData({
      shareDefaultValue: `我在${card.data.wxOrganization.corp_name || card.data.wxOrganization.corp_full_name}找到了${this.data.product.name}，你不想来看看吗？`
    })
  },

  async onShow() {
    const customer = app.get('customer')

    if (customer.id && this.data.product) {
      this.addInfoReadProduct()
      this.getProduct(this.data.product.id)
    }

    setTimeout(() => {
      if (getApp().globalData.isSetEc) {
        wx.switchTab({ url: '/pages/people/card/index' })
        return
      }
    }, 1000)
  },

  onShareAppMessage(res) {
    api.updateProduct(this.data.product.id, 'forward')
    this.setData({
      ['actionbar.forward']: this.data.actionbar.forward + 1,
    })
    this.addInfoForwardProduct()
    const title = res.from === 'button'
      ? this.data.shareValue || this.data.shareDefaultValue
      : `${this.data.product.name || ''}，点击了解更多`
    return {
      title: title,
      path: `pages/people/productDetail/index?salesToken=${this.data.salesToken}&getWay=1&productId=${this.data.product.id}`,
      imageUrl: this.data.product.coverImages[0],
    }
  }
}))