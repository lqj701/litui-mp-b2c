import login from '../../../utils/login.js'
import api from '../../../utils/api.js'
import { timestamp } from '../../../utils/tool'
import regeneratorRuntime from "../../../utils/regenerator-runtime";

const app = getApp()

Page(login({

  data: {
    product: {},
    shareValue: '',
    shareDefaultValue: '',
    editShare: false
  },

  getEcProductDetail(ecProductId, actionSheetVisible = false) {
    return new Promise(async (resolve) => {
      const ecProductDetail = await api.getEcProductDetail(ecProductId)
      const result = ecProductDetail.data
      let price = 0
      result.product.ecGoodsList.forEach((goods) => {
        goods.price = (goods.price / 100).toFixed(2)
        if (price === 0 || price > goods.price) {
          price = goods.price
        }
      })
      const coverData = {
        name: result.product.name,
        price: price,
        coverImages: result.product.showImages,
      }
      let remainTotal = 0
      result.product.ecGoodsList.forEach((item) => {
        remainTotal += item.remainNum
      })
      const introduceData = result.product.detailImages
      const tabbarText = result.product.onSale ? (result.product.canBuy && result.ecShop.openPay ? (remainTotal > 0 ? '立即购买' : '商品已售罄') : '立即沟通') : '此商品已下架'
      const chatData = {
        ecProductId: result.product.id,
        image: result.product.showImages[0],
        name: result.product.name,
        price: price,
      }

      const easyBuy = (result.product.onSale && result.product.canBuy && result.ecShop.openPay) ? (remainTotal > 0 ? true : false) : false
      this.setData({
        ecHeader: result.ecShop.shopName,
        product: result.product,
        coverData,
        introduceData,
        tabbarText,
        chatData,
        chatVisible: false,
        actionSheetVisible,
        easyBuy,
        ecGoodsList: result.product.ecGoodsList
      })
      resolve()
    })
  },

  addInfoReadEcProduct() {
    const customer = app.get('customer')
    api.addInfo({
      openid: customer.openid,
      objectType: 'ec',
      objectId: this.data.product.id,
      goalsType: 0,
      fromType: 0,
      action: 'read',
      actionGoals: 'ecGoods',
      time_order: timestamp(),
      revisitLog: null,
      extre: this.data.product.name,
    })
  },

  showActionSheet(e) {
    this.setData({
      actionSheetVisible: true,
      actionSheetPage: e.detail.page
    })
  },

  onHideActionSheet() {
    this.setData({
      actionSheetVisible: false,
    })
  },

  update({ actionSheetVisible }) {
    this.getEcProductDetail(this.data.product.id, actionSheetVisible)
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

  async onLoad(options, authVisible) {
    wx.hideLoading()
    if (!getApp().globalData.isSetEc) {
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
    }
    const { ecProductId } = options
    this.setData({
      authVisible: authVisible,
      ecProductId: ecProductId,
    })
    await this.getEcProductDetail(ecProductId)
    this.addInfoReadEcProduct()

    const card = await api.getCardDetail()
    this.setData({
      shareDefaultValue: `我在${card.data.wxOrganization.corp_name || card.data.wxOrganization.corp_full_name}找到了${this.data.product.name}，你不想来看看吗？`
    })
  },

  onShow() {
    const customer = app.get('customer')
    this.data.ecProductId && this.getEcProductDetail(this.data.ecProductId)
    this.data.product.name && customer && this.addInfoReadEcProduct()

    setTimeout(() => {
      if (!getApp().globalData.isSetEc) {
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
      }
    }, 1000)
  },

  onShareAppMessage(res) {
    const customer = app.get('customer')
    api.addInfo({
      openid: customer.openid,
      objectType: 'ec',
      objectId: this.data.product.id,
      goalsType: 0,
      fromType: 0,
      action: 'forward',
      actionGoals: 'ecGoods',
      revisitLog: null,
      extre: this.data.product.name,
    })
    const title = res.from === 'button'
      ? this.data.shareValue || this.data.shareDefaultValue
      : `${this.data.product.name}，立即购买`
    return {
      title: title,
      path: `pages/people/ecProductDetail/index?salesToken=${app.get('salesToken')}&getWay=1&ecProductId=${this.data.product.id}`,
      imageUrl: this.data.coverData.coverImages[0],
    }
  }
}))