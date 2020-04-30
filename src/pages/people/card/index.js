import login from '../../../utils/login.js'
import api from '../../../utils/api.js'
import { timestamp } from '../../../utils/tool'
import regeneratorRuntime from "../../../utils/regenerator-runtime";

const app = getApp()

Page(login({

  data: {
    authVisible: false,
    hongbaoVisible: false,
    actionSheetVisible: false,
    unreadModalVisible: false,
    contactModalVisible: false,
    gohomeVisible: false,
  },

  card: null,

  getCardData() {
    return new Promise(async (resolve) => {
      const customer = app.get('customer')
      const res = await api.getCardDetail()
      if (res.code === 101129) {
        wx.redirectTo({
          url: '/pages/expired/index'
        })
        resolve()
      }
      let result = res.data
      let information = {
        openId: customer.openid,
        bCardId: result.bCardInfo.id,
        avatar: result.wxUser.avatar,
        name: result.wxUser.name,
        position: result.wxUser.position,
        company: result.corpWebsite ? result.corpWebsite.name : ''
      }
      let cardInfo = {
        bCardId: result.bCardInfo.id,
        browsed: result.bCardInfo.browsed_num || 0,
        support: result.bCardInfo.support_num || 0,
        forward: result.bCardInfo.forward_num || 0,
        supportState: false,
      }
      let detail = {
        bCardId: result.bCardInfo.id,
        name: result.wxUser.name,
        phone1: result.wxUser.phone1,
        phone2: result.wxUser.phone2,
        email: result.wxUser.email,
        weixinid: result.wxUser.weixinid,
        company: result.corpWebsite ? result.corpWebsite.name : null, // 从未设置官网时corpWebsite返回null
        address: result.corpWebsite ? result.corpWebsite.address : null, // 从未设置官网时corpWebsite返回null
        position: result.wxUser.position,
      }
      let signature = result.bCardInfo.signature
      let product = {
        openId: customer.openid,
        bCardId: result.bCardInfo.id,
        id: result.mainProduct.id,
        image: result.productImage,
        name: result.mainProduct.name,
        price: result.mainProduct.price_uncertain ? '面议' : '¥ ' + (result.mainProduct.price / 100).toFixed(2),
        introduce: result.wxUserProduct && result.wxUserProduct.introduce ? result.wxUserProduct.introduce : (result.mainProduct.product_introduce || '这个人很懒，没有写商品简介...')
      }
      let photo = result.cardImages.map(value => value.url)

      this.setData({
        information,
        cardInfo,
        detail,
        signature,
        product,
        photo,
      })

      this.card = result

      app.dispatch('updateSaler', result.wxUser)

      resolve()
    })
  },

  addInfoReadCard() {
    const customer = app.get('customer')
    api.addInfo({
      openid: customer.openid,
      objectType: 'card',
      objectId: this.card.bCardInfo.id,
      goalsType: 0,
      fromType: 0,
      action: 'read',
      actionGoals: 'bcard',
      time_order: timestamp(),
      revisitLog: ''
    })
  },

  addInfoForwardCard() {
    const customer = app.get('customer')
    api.addInfo({
      openid: customer.openid,
      objectType: 'card',
      objectId: this.card.bCardInfo.id,
      goalsType: 0,
      fromType: 0,
      action: 'forward',
      actionGoals: 'bcard',
      time_order: timestamp(),
      revisitLog: null
    })
  },

  async getCardSupportState() {
    if (app.globalData.env === 'wxwork') return
    const customer = app.get('customer')
    const cardSupportState = await api.getCardSupportState(String(customer.openid), Number(this.data.cardInfo.bCardId))
    this.setData({
      supportState: cardSupportState.data,
    })
  },

  gohome() {
    wx.redirectTo({
      url: `/pages/home/cards/index`,
    })
  },

  showActionSheet() {
    wx.hideTabBar({
      complete: () => {
        this.setData({
          actionSheetVisible: true
        })
      }
    })
  },

  hideActionSheet() {
    this.setData({ actionSheetVisible: false })
  },

  showContactModal() {
    this.setData({ contactModalVisible: true })
  },

  unreadModalCancel() {
    this.setData({ unreadModalVisible: false })
  },

  unreadModalComfirm() {
    this.setData({ unreadModalVisible: false })
    wx.navigateTo({ url: '/pages/im/index' })
  },

  formSubmit(e) {
    if (e.detail.formId === 'the formId is a mock one') return
    const customerImAccount = app.get('customerImAccount')
    api.sendFormId([{
      account_id: customerImAccount.imAccountId,
      form_id: e.detail.formId,
      type: 1,
    }])
  },

  makePhoneCall() {
    const phoneNumber = this.card.wxUser.phone1 || this.card.wxUser.phone2 || ''
    const customer = app.get('customer')
    if (phoneNumber) {
      wx.makePhoneCall({
        phoneNumber,
        complete: () => {
          api.addInfo({
            openid: customer.openid,
            objectType: 'card',
            objectId: this.card.bCardInfo.id,
            goalsType: 0,
            fromType: 0,
            action: 'call',
            actionGoals: 'tel',
            time_order: timestamp(),
            revisitLog: null
          })
        }
      })
    } else {
      wx.showToast({
        icon: 'none',
        title: '对方还没有留手机号哦',
      })
    }
  },

  async getPhoneNumber(e) {
    if (e.detail.errMsg === 'getPhoneNumber:ok') {
      const customer = app.get('customer')
      app.dispatch('updatePhoneAuthState', true)
      await api.setUserInfo(customer.openid, Object.assign({}, e.detail, { salesToken: app.get('salesToken') }))
      this.setData({ phoneAuthState: true })
      api.addInfo({
        openid: customer.openid,
        objectType: 'epr',
        objectId: null,
        goalsType: 0,
        fromType: 0,
        action: 'empower',
        actionGoals: 'tel',
        revisitLog: null
      })
    }
  },

  hasPhoneNumber() {
    wx.showToast({ icon: 'none', title: '您已经留下电话，客户会马上与你沟通' })
  },

  closeContactModal() {
    this.setData({ contactModalVisible: false })
  },

  async onLoad(options, authVisible) {
    const customer = app.get('customer')
    const salesToken = app.get('salesToken')
    const hasRedpacket = options.redpacket
    this.setData({
      salesToken,
      hasBindphone: app.get('customer').bindphone ? true : false,
      gohomeVisible: app.globalData.env !== 'wxwork'
    })

    // 从im推送服务进入
    if (options.salesImAccountId) {
      const salerOrgId = Number(options.salesImAccountId.split('_')[1])
      const salerUserId = Number(options.salesImAccountId.split('_')[2])
      app.event.off('showUnreadModal')
      app.dispatch('updateSalerImAccount', {
        imAccountId: options.salesImAccountId,
        wxUserId: salerUserId,
      })
      const imAccount = await api.getImAccount(1, { orgId: salerOrgId, userIdOrOpenid: salerUserId })
      const result = imAccount.data
      this.setData({
        unreadModalVisible: true,
        unreadModalTitle: '未读消息',
        unreadModalContent: `${result.imAccount.account_name}向你发送了消息`,
      })
    }

    if (hasRedpacket) {
      const res = await api.canReceive({ redpacket_order: options.orderId, customer_id: customer.id })
      if (res.code === -2) {
        wx.redirectTo({
          url: `/pages/home/hongbaoDetail/index?orderId=${options.orderId}&redpacketId=${options.redpacketId}&customerId=${customer.id}&myPacketAmount=&myPacketTime=&salesToken=${salesToken}`,
        })
        return
      }
    }

    await this.getCardData()

    this.setData({ authVisible })

    if (authVisible) {
      wx.hideTabBar()
    }

    this.addInfoReadCard()
    this.getCardSupportState()
    wx.hideLoading()

    customer && api.updateCard(customer.openid, 'view')
  },

  async onShow() {
    const customer = app.get('customer')

    if (customer.openid && this.card) {
      this.addInfoReadCard()
      await api.updateCard(customer.id, 'view')
      this.getCardData()
    }

    getApp().globalData.ecListener = () => {
      if (getApp().globalData.isSetEc && getApp().globalData.isFirstSetTabbar) {
        wx.setTabBarItem({
          index: 1,
          text: '商城',
          iconPath: '/static/ec_grey.png',
          selectedIconPath: '/static/ec_blue.png'
        })
      }
      getApp().globalData.isFirstSetTabbar = false
    }

    if (this.data.unreadModalVisible || this.data.contactModalVisible) {
      wx.hideTabBar()
    }
  },

  onHide() {
    this.hideActionSheet()
  },

  onShareAppMessage() {
    const customer = app.get('customer')
    api.updateCard(customer.id, 'forward')
    this.addInfoForwardCard()
    this.setData({ ['cardInfo.forward']: this.data.cardInfo.forward + 1 })
    return {
      title: `${this.card.wxUser.name}的名片，请点击惠存`,
      path: `/pages/people/card/index?salesToken=${this.data.salesToken}&getWay=1`,
      imageUrl: this.card.wxUser.avatar,
    }
  }
}))