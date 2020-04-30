import { InitApp as Init } from './utils/init'
import api from './utils/api'
import webim from './utils/imsdk/webim-wx.js'
import imLogin from './utils/im'
import { currentRoute } from './utils/tool'
import regeneratorRuntime from "./utils/regenerator-runtime";

App(Init({

  onLaunch(options) {
    console.log('App onLaunch options', options)

    wx.showLoading({ title: '小程序登录中', mask: false })
    wx.hideTabBar()

    setTimeout(async () => {
      const isPublicMp = await api.isPublicMp()
      this.dispatch('updateAppType', isPublicMp.data ? 0 : 1)
      this.event.trigger('receivedAppType')
    }, 0);

    options.query.salesImAccountId && this.dispatch('updateRefer', 'im')
    options.query.scene && this.dispatch('updateAuthToken', options.query.scene)
    options.query.salesToken && this.dispatch('updateSalesToken', options.query.salesToken)
    options.query.getWay && this.dispatch('updateGetWay', Number(options.query.getWay))

    this.event.on('showUnreadModal', (data) => {
      if (this.get('refer') === 'im') return
      wx.showModal({
        title: '未读消息',
        content: `${data.name}向你发送了消息`,
        confirmText: '查看',
        success: (res) => {
          this.dispatch('updateSalerImAccount', {
            wxUserId: Number(data.id.split('_')[2]),
            name: data.name,
            imAccountId: data.id,
          })
          res.confirm && wx.navigateTo({ url: `/pages/im/index` })
        },
      })
      this.event.off('showUnreadModal')
    })
    this.event.on('customerHasLogin', () => {
      if (this.globalData.env !== 'wxwork' && (this.get('appType') === 1 || this.globalData.IM_ENABLE)) {
        imLogin()
      } else {
        this.event.on('receivedAppType', () => {
          if (this.globalData.env !== 'wxwork' && (this.get('appType') === 1 || this.globalData.IM_ENABLE)) {
            imLogin()
          }
        })
      }
      this.event.off('customerHasLogin')
    })

  },

  onShow(options) {
    console.log('App onShow options', options)

    if ((options.query.scene && (options.query.scene !== this.get('authToken'))) || (options.query.salesToken && (options.query.salesToken !== this.get('salesToken')))) {
      wx.showLoading({ title: '小程序登陆中', mask: false })
      this.dispatch('needRefreshSaler', true)
    }

    options.query.scene && this.dispatch('updateAuthToken', options.query.scene)
    options.query.salesToken && this.dispatch('updateSalesToken', options.query.salesToken)
    options.query.getWay && this.dispatch('updateGetWay', Number(options.query.getWay))
    !this.get('isVisitor') && (this.globalData.env !== 'wxwork' && this.get('userAuthState') || this.globalData.env === 'wxwork') ? wx.showTabBar() : wx.hideTabBar()

    if (this.globalData.env !== 'wxwork' && (this.get('appType') === 1 || this.globalData.IM_ENABLE)) {
      this.get('customer').openid && imLogin()
    } else {
      this.event.on('receivedAppType', () => {
        if ((this.globalData.env !== 'wxwork' && (this.get('appType') === 1 || this.globalData.IM_ENABLE)) && this.get('customer').openid) {
          imLogin()
        }
      })
    }
  },

  onHide() {
    if (currentRoute() !== 'pages/im/index' && (this.globalData.env !== 'wxwork' && (this.get('appType') === 1 || this.globalData.IM_ENABLE))) {
      this.dispatch('clearUnread')
      this.dispatch('updateImLoginState', false)
      webim.logout(() => { console.log('im has logout') })
    }
  },

  onError(e) {
    console.log(e)
  },
}))
