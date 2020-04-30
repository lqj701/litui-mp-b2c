import store from './store/index'
import Event from './event/index'

export function InitApp(appConf) {

  const { environment } = wx.getSystemInfoSync()

  // 数据存储
  appConf.get = function (options) {
    return store.get(options)
  }
  appConf.dispatch = function (...options) {
    store.dispatch(...options)
  }

  // 消息机制
  appConf.event = new Event()

  // 全局变量
  // IM_ENABLE  true代表单小程序和企业小程序都可以用IM，false代表单小程序不可用IM
  appConf.globalData = {
    cart: {},
    isSetEc: {},
    isFirstSetTabbar: true,
    ecListener: null,
    ecAddress: null,
    IM_ENABLE: true,
    env: environment ? 'wxwork' : 'mp'
  }

  return appConf
}

export function InitPage(pageConf) {
  return pageConf
}