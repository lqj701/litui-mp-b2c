import { wxLogin } from '../utils/wx.js'
import api from '../utils/api.js'
import { currentRoute } from './tool.js';
import regeneratorRuntime from "./regenerator-runtime";

function getPageInstance() {
  var pages = getCurrentPages();
  return pages[pages.length - 1];
}

function decodeAuthToken(authToken) {
  return new Promise(async (resolve) => {
    const decodeAuthToken = await api.decodeAuthToken(authToken)
    getApp().dispatch('updateSalesToken', decodeAuthToken.data.salesToken)
    getApp().dispatch('updateGetWay', Number(decodeAuthToken.data.getWay))
    resolve()
  })
}

function globalLogin(options) {
  return new Promise(async (resolve) => {
    const authToken = getApp().get('authToken')
    const needRefreshSaler = getApp().get('needRefreshSaler')
    if (getApp().get('customer').nickname && !needRefreshSaler) {
      resolve()
    }
    if (options.scene && !options.salesToken) {
      await decodeAuthToken(authToken)
    }
    const { code } = await wxLogin()
    const salesToken = getApp().get('salesToken')
    const getWay = getApp().get('getWay')
    const customerLogin = await api.customerLogin(code, { salesToken, getWay: Number(getWay), qyWxEnvironment: getApp().globalData.env === 'wxwork' })
    if (customerLogin.code === 0) {
      (!options.salesToken && getApp().globalData.env === 'wxwork' && !getApp().get('salesToken')) && getApp().dispatch('updateSalesToken', customerLogin.data.salesToken) // 分享中没有携带 salesToken 且在企业微信中时...
      customerLogin.data.nickname && getApp().dispatch('updateUserAuthState', true)
      customerLogin.data.bindphone && getApp().dispatch('updatePhoneAuthState', true)
      getApp().dispatch('updateCustomer', customerLogin.data)
      getApp().event.trigger('customerHasLogin')
      if (getApp().globalData.isFirstSetTabbar) {
        getApp().globalData.isSetEc = customerLogin.data.isSet ? true : false
      }
      getApp().globalData.ecListener && getApp().globalData.ecListener()
      resolve()
    }
  })
}

export default function login(pageObj) {
  const { onLoad } = pageObj

  pageObj.onLoad = async (options) => {
    await globalLogin(options)
    const currentPage = currentRoute()
    const appType = getApp().get('appType')
    const isInTabbarPage = currentPage === 'pages/people/card/index' || currentPage === 'pages/people/product/index' || currentPage === 'pages/people/website/index'

    if (appType === 1 && getApp().globalData.isSetEc && isInTabbarPage) {
      wx.setTabBarItem({
        index: 1,
        text: '商城',
        iconPath: '/static/ec_grey.png',
        selectedIconPath: '/static/ec_blue.png'
      })
      getApp().globalData.isFirstSetTabbar = false
    } else {
      wx.setTabBarItem({
        index: 1,
        text: '产品',
        iconPath: '/static/product_grey.png',
        selectedIconPath: '/static/product_blue.png'
      })
      getApp().globalData.isFirstSetTabbar = false
    }

    wx.setNavigationBarTitle({ title: getApp().get('customer').mpName || '' })
    const hasMpAuth = getApp().get('userAuthState') || getApp().globalData.env === 'wxwork'
    hasMpAuth ? wx.showTabBar() : wx.hideTabBar()
    wx.showLoading({ title: '智能搜索中', mask: false })
    const currentInstance = getPageInstance()
    const salesToken = getApp().get('salesToken')
    salesToken && api.getSaler(salesToken).then(res => getApp().dispatch('updateSaler', res.data.wxUser))
    onLoad.call(currentInstance, options, !hasMpAuth)
  }

  return pageObj
}
