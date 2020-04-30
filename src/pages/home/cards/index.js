import login from '../../../utils/login.js'
import { InitPage as Init } from '../../../utils/init'
import { formatTime } from '../../../utils/tool.js'
import api from '../../../utils/api.js'
import regeneratorRuntime from "../../../utils/regenerator-runtime";

const app = getApp()

Page(login({

  data: {
    row: 50,
    page: 1,
    hasNext: 1,
    cardList: [],
    isNull: false,
    showDefaultCard: false,
  },

  async goInfo() {
    if (app.get('appType') === 0) {
      wx.switchTab({ url: `/pages/people/website/index` })
    } else {
      const customer = app.get('customer')
      const getWebSite = await api.getWebSite(customer.orgId)
      const result = getWebSite.data
      if (result.corpWebsite && (result.corpWebsite.name || result.corpWebsite.cover_image_url || result.corpWebsite.introduce)) {
        wx.switchTab({ url: `/pages/people/website/index` })
      } else {
        wx.navigateTo({ url: `/pages/home/info/index` })
      }
    }
  },

  getCardList() {
    if (this.data.hasNext) {
      return new Promise(async (resolve) => {
        const customer = app.get('customer')
        const param = app.get('appType') === 0
          ? { openid: customer.openid, page: this.data.page, row: this.data.row }
          : { openid: customer.openid, page: this.data.page, row: this.data.row, wxOrganizationId: customer.orgId }
        const cardList = await api.getCardList(param)
        const result = cardList.data
        if (result.customerCardDtoList.length > 0) {
          let cardList = result.customerCardDtoList.map((data) => {
            let getWay = ''
            switch (Number(data.get_way)) {
              case 0:
                getWay = '通过小程序码'
                break
              case 1:
                getWay = '通过分享名片'
                break
              case 2:
                getWay = '通过群分享名片'
                break
              case 3:
                getWay = '通过分享红包'
                break
              case 4:
                getWay = '通过默认名片'
                break
              default:
                getWay = data.source_name ? '' : '通过分享名片'
            }
            return {
              id: data.id,
              wxUserId: data.wx_user_id,
              name: data.name || '',
              position: data.position || '',
              phone: data.phone1 || data.phone2 || '',
              company: data.corp_name || '',
              avatar: data.avatar || '',
              getDate: formatTime(data.get_time) || '',
              getWay: getWay,
              imAccount: `bbs_${data.id}`,
              unread: 0,
              source: data.source_name,
              isValid: data.is_valid === false ? false : true,
              orgId: data.wx_organization_id
            }
          })

          this.setData({
            cardList,
            page: this.data.page + 1,
            hasNext: result.hasNext,
            isNull: !cardList[0],
          })

          resolve()
        } else if (app.get('appType') === 0) {
          this.setData({
            cardList: [],
          })
          resolve()
        } else {
          app.dispatch('updateGetWay', 4)
          const defaultCardList = await api.getDefaultCardList(this.data.page, this.data.row, customer.orgId)
          if (app.get('appType') === 1) {
            const result = defaultCardList.data
            let cardList = result.customerCardDtoList.map((data) => {
              data.get_way = '通过默认名片'
              return {
                id: data.id,
                wxUserId: data.wx_user_id,
                name: data.name || '',
                position: data.position || '',
                phone: data.phone1 || data.phone2 || '',
                company: data.corp_name || '',
                avatar: data.avatar || '',
                getDate: formatTime(data.get_time) || '',
                getWay: data.get_way,
                imAccount: `bbs_${data.id}`,
                unread: 0,
                source: data.source_name,
                isValid: data.is_valid === false ? false : true,
              }
            })

            this.setData({
              cardList,
              page: this.data.page + 1,
              hasNext: result.hasNext,
              isNull: !cardList[0],
              showDefaultCard: true,
            })
          }

          resolve()
        }
      })
    }
  },

  async onLoad() {

    if (app.globalData.env === 'wxwork') {
      wx.switchTab({ url: `/pages/people/card/index` })
      return
    }

    app.event.on('onRecevingNewMessage', (data) => {
      const { id } = data.unread
      const salerUnread = app.get('unread').get(id)
      const salerUserId = Number(id.split('_')[2])
      let cardList = this.data.cardList
      cardList.forEach((card, index) => {
        if (card.wxUserId === salerUserId) {
          const unread = salerUnread > 99 ? '99+' : salerUnread
          cardList[index].unread = unread
        }
      })
      this.setData({ cardList })
    })

    app.event.on('clearUnreadMessage', (salerImAccountId) => {
      if (!salerImAccountId) return
      let cardList = this.data.cardList
      cardList.forEach((card) => {
        if (card.wxUserId === Number(salerImAccountId.split('_')[2])) {
          card.unread = 0
        }
      })
      this.setData({ cardList })
    })

    await this.getCardList()

    if (this.data.cardList && this.data.cardList.length > 0) {
      this.setData({ isReady: true })
      wx.hideLoading()
      const IM_ENABLE = app.globalData.IM_ENABLE
      const appType = app.get('appType')
      const can_i_use_im = !(!IM_ENABLE && appType === 0)
      if (can_i_use_im) {
        let cardList = this.data.cardList
        const unread = app.get('unread')
        cardList.forEach((card) => {
          unread.forEach((value, key) => {
            if (card.wxUserId === Number(key.split('_')[2])) {
              card.unread = value > 99 ? '99+' : value
            }
          })
          this.setData({ cardList })
        })
      }
    } else {
      wx.hideLoading()
      app.dispatch('updateVisitor', true)
      this.setData({ isNull: true })
    }

  },

  onReachBottom() {
    this.getCardList()
  },

}))