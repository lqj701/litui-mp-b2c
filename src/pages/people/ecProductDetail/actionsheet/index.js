import api from '../../../../utils/api.js'
import { timestamp } from '../../../../utils/tool'

const app = getApp()

Component({
  properties: {
    visible: {
      type: Boolean,
      value: false,
      observer: '_visible'
    },
    product: {
      type: Object,
      value: {
        ecProductId: 0,
        price: '',
        total: 0,
        name: '',
        image: ''
      },
      observer: '_product'
    },
    page: {
      type: String,
      value: '',
    }
  },

  data: {
    actionSheetClassName: 'actionSheet actionSheet--hide',
    actionSheetMaskClassName: 'actionSheet-mask',
    actionSheetWrapperClassName: 'actionSheet-wrapper',
    specItemClassName: 'spec-item',
    selectGoodsCover: '',
    selectGoodsName: '',
    selectGoodsPrice: 0,
    count: 1,
    selectValueRemainNum: 0,
    selectGoodsId: 0,
  },

  methods: {
    _visible(newVal) {
      this.setData({
        actionSheetClassName: newVal ? 'actionSheet' : 'actionSheet actionSheet--hide',
        actionSheetMaskClassName: newVal ? 'actionSheet-mask actionSheet-mask--fadeIn' : 'actionSheet-mask actionSheet-mask--fadeOut',
        actionSheetWrapperClassName: newVal ? 'actionSheet-wrapper actionSheet-wrapper--unfold' : 'actionSheet-wrapper actionSheet-wrapper--fold',
      })
    },

    _product(newVal) {
      let product = newVal
      let selectGoodsCover = ''
      let selectGoodsName = ''
      let selectGoodsPrice = 0
      let selectValueRemainNum = 0
      let selectGoodsId = 0
      if (JSON.stringify(product) === '{}') return
      if (product.ecGoodsList.length === 1) {
        // 如果只有一个规格
        product.ecGoodsList[0].active = true
        selectGoodsCover = product.ecGoodsList[0].ecGoodsImage || product.showImages[0]
        selectGoodsName = product.ecGoodsList[0].value
        selectGoodsPrice = product.ecGoodsList[0].price
        selectValueRemainNum = product.ecGoodsList[0].remainNum
        selectGoodsId = product.ecGoodsList[0].ecGoodsId
      } else {
        // 如果有多个规格
        product.ecGoodsList.forEach((item) => {
          item.active = false
          selectGoodsName = product.name
          selectValueRemainNum += item.remainNum
          if (selectGoodsPrice === 0 || selectGoodsPrice > item.price) {
            selectGoodsPrice = item.price
          }
        })
        selectGoodsCover = product.showImages[0]
      }
      this.setData({
        selectGoodsCover,
        selectGoodsName,
        selectGoodsPrice,
        product,
        selectValueRemainNum,
        selectGoodsId,
      })
    },

    // 隐藏 actionsheet
    hideActionSheet() {
      this.triggerEvent('hideActionSheet')
    },

    // 选择一个规格
    selectValue(e) {
      const ecGoodsId = e.currentTarget.dataset.id
      let ecGoodsList = this.data.product.ecGoodsList
      let selectValueRemainNum = 0
      let selectGoodsCover = ''
      let selectGoodsPrice = 0
      let selectGoodsName = ''
      let count = this.data.count

      // check所点规格是否有库存
      let canIClick = true
      ecGoodsList.forEach((item) => {
        if (item.ecGoodsId === Number(ecGoodsId)) {
          if (item.remainNum === 0) {
            canIClick = false
          }
        }
      })

      if (!canIClick) return

      if (ecGoodsList.length > 1) {
        // 如果有多个规格
        ecGoodsList.forEach((item) => {
          if (item.ecGoodsId === ecGoodsId) {
            item.active = true
            selectValueRemainNum = item.remainNum
            selectGoodsCover = item.ecGoodsImage
            selectGoodsPrice = item.price
            selectGoodsName = item.value
            if (this.data.count > item.remainNum) {
              count = item.remainNum
            }
          } else {
            item.active = false
          }
        })
        this.setData({
          ['product.ecGoodsList']: ecGoodsList,
          selectValueRemainNum,
          selectGoodsId: ecGoodsId,
          selectGoodsCover,
          selectGoodsPrice,
          selectGoodsName,
          count,
        })
      }
    },

    // 确认 加入购物车或者立即购买
    confirm() {
      if (app.globalData.env === 'wxwork') {
        wx.showModal({
          title: '提示',
          content: '此功能在企业微信环境下不支持。',
          showCancel: false
        })
        return
      }
      // 如果没有选择规格
      if (!this.data.selectGoodsId) {
        wx.showToast({ title: '请选择一个规格', icon: 'none', duration: 1000 })
        return
      }

      // 已选择规格且可以直接购买
      if (this.data.page === 'billing') {
        getApp().globalData.cart = {}
        this.data.product.ecGoodsList.forEach((item) => {
          if (item.ecGoodsId === this.data.selectGoodsId) {
            getApp().globalData.cart[this.data.selectGoodsId] = Object.assign({}, item, { count: this.data.count, ecProductName: this.data.product.name, ecProductId: this.data.product.id })
          }
        })
        wx.navigateTo({
          url: `/pages/people/billing/index`,
        })
      }

      // 已选择规格且可以添加购物车
      if (this.data.page === 'cart') {
        const customer = app.get('customer')
        api.addInfo({
          openid: customer.openid,
          objectType: 'ec',
          objectId: this.data.selectGoodsId,
          goalsType: 0,
          fromType: 0,
          action: 'put',
          actionGoals: 'cart',
          time_order: timestamp(),
          revisitLog: null,
          extre: this.data.product.name + '(' + this.data.selectGoodsName + ')'
        })
        const param = {
          customerWxUserId: app.get('customer').customer_wx_user_id,
          ecGoodsId: this.data.selectGoodsId,
          count: this.data.count,
        }
        api.addCart(param).then((res) => {
          switch (res.code) {
            case 0:
              wx.showToast({ title: '已成功添加至购物车', icon: 'none', duration: 1000 })
              this.triggerEvent('hideActionSheet')
              break
            case 141000:
              wx.showToast({ title: "商城已关闭,不能购买", icon: 'none', duration: 1000 })
              this.triggerEvent('update', { actionSheetVisible: true })
              break
            case 141001:
              wx.showToast({ title: "暂不支持在线交易，请与商家沟通", icon: 'none', duration: 1000 })
              this.triggerEvent('update', { actionSheetVisible: true })
              break
            case 141002:
              wx.showToast({ title: "商品已下架", icon: 'none', duration: 1000 })
              this.triggerEvent('update', { actionSheetVisible: true })
              break
            case 141003:
              wx.showToast({ title: "商品已售罄", icon: 'none', duration: 1000 })
              this.triggerEvent('update', { actionSheetVisible: true })
              break
            case 141004:
              wx.showToast({ title: "商品规格不存在，请重新选购", icon: 'none', duration: 1000 })
              this.triggerEvent('update', { actionSheetVisible: true })
              break
            case 141005:
              wx.showToast({ title: "规格无库存", icon: 'none', duration: 1000 })
              this.triggerEvent('update', { actionSheetVisible: true })
              break
            case 141006:
              wx.showToast({ title: "商品无法购买", icon: 'none', duration: 1000 })
              this.triggerEvent('update', { actionSheetVisible: true })
              break
            default:
              wx.showToast({ title: "添加商品失败，请重试", icon: 'none', duration: 1000 })
              break
          }
        })
      }

    },

    // 数量+1
    addCount() {
      if (this.data.count < this.data.selectValueRemainNum) {
        this.setData({ count: this.data.count + 1 })
      }
    },

    // 数量-1
    minusCount() {
      if (this.data.count > 1) {
        this.setData({ count: this.data.count - 1 })
      }
    }
  }
})
