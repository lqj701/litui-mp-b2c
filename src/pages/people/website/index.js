import login from '../../../utils/login.js'
import api from '../../../utils/api.js'
import { timestamp } from '../../../utils/tool.js'

const app = getApp()

Page(login({

  data: {
    websiteData: null,
    isReady: false,
    isNull: false,
    topbarVisible: true,
  },

  queryDefaultWebsite() {
    return new Promise((resolve) => {
      api.queryDefaultWebsite().then((res) => {
        const result = res.data
        let blockData = result.blockList ? result.blockList.map((data, index) => {
          let block = JSON.parse(data.content)
          block.type = data.type
          block.id = index
          return block
        }) : null
        const blockInfo = result.corpWebsite ? {
          websiteId: result.corpWebsite.id || 0,
          company: result.corpWebsite.name || '',
        } : null
        const informationData = result.corpWebsite ? {
          image: result.corpWebsite.cover_image_url || '',
          name: result.corpWebsite.name || '',
          introduce: result.corpWebsite.introduce || '这个人很懒，没有写官网简介...'
        } : null
        let informationVisible = false
        let blockVisible = false
        if (result.corpWebsite && (result.corpWebsite.name || result.corpWebsite.cover_image_url || result.corpWebsite.introduce)) {
          informationVisible = informationData && (informationData.name || informationData.image || informationData.introduce)
          blockVisible = (blockData && blockData[0]) ? true : false
        }

        this.setData({
          websiteData: result,
          blockData: blockData,
          blockInfo: blockInfo,
          informationData: informationData,
          informationVisible: informationVisible,
          blockVisible: blockVisible,
          isNull: (result.corpWebsite && (result.corpWebsite.name || result.corpWebsite.cover_image_url || result.corpWebsite.introduce)) ? false : true,
        })

        resolve()
      })
    })
  },

  getWebsiteData() {
    return new Promise((resolve, reject) => {
      const saler = app.get('saler')
      const customer = app.get('customer')
      api.getWebSite(saler.wx_organization_id || customer.wx_organization_id).then((res) => {
        if (res.code === 101129) {
          wx.redirectTo({
            url: '/pages/expired/index'
          })
          reject()
        }
        const result = res.data
        let blockData = result.blockList ? result.blockList.map((data, index) => {
          let block = JSON.parse(data.content)
          block.type = data.type
          block.id = index
          return block
        }) : null
        const blockInfo = result.corpWebsite ? {
          websiteId: result.corpWebsite.id || 0,
          company: result.corpWebsite.name || '',
        } : null
        const informationData = result.corpWebsite ? {
          image: result.corpWebsite.cover_image_url || '',
          name: result.corpWebsite.name || '',
          introduce: result.corpWebsite.introduce || '这个人很懒，没有写官网简介...'
        } : null
        let topbarData = {}
        if (result.wxUser) {
          topbarData = {
            name: result.wxUser.name || '',
            avatar: result.wxUser.avatar || '',
            position: result.wxUser.position || '',
            unread: result.wxUser.unread || 0
          }
        }

        let informationVisible = false
        let blockVisible = false
        if (result.corpWebsite && (result.corpWebsite.name || result.corpWebsite.cover_image_url || result.corpWebsite.introduce)) {
          informationVisible = informationData && (informationData.name || informationData.image || informationData.introduce)
          blockVisible = (blockData && blockData[0]) ? true : false
        }

        this.setData({
          websiteData: result,
          topbarData: topbarData,
          blockData: blockData,
          blockInfo: blockInfo,
          informationData: informationData,
          informationVisible: informationVisible,
          blockVisible: blockVisible,
          isNull: (result.corpWebsite && (result.corpWebsite.name || result.corpWebsite.cover_image_url || result.corpWebsite.introduce)) ? false : true,
        })

        app.dispatch('updateSaler', result.wxUser)
        resolve()
      })
    })
  },

  addInfoReadWebsite() {
    const customer = app.get('customer')
    if (this.data.websiteData.corpWebsite) {
      api.addInfo({
        openid: customer.openid,
        objectType: 'web',
        objectId: this.data.websiteData.corpWebsite.id,
        goalsType: 0,
        fromType: 0,
        action: 'read',
        actionGoals: 'coreWeb',
        time_order: timestamp(),
        revisitLog: null
      })
    }
  },

  addInfoForwardWebsite() {
    const customer = app.get('customer')
    if (this.data.websiteData.corpWebsite) {
      api.addInfo({
        openid: customer.openid,
        objectType: 'web',
        objectId: this.data.websiteData.corpWebsite.id,
        goalsType: 0,
        fromType: 0,
        action: 'forward',
        actionGoals: 'coreWeb',
        time_order: timestamp(),
        revisitLog: null
      })
    }
  },

  onLoad(options, authVisible) {
    this.setData({
      authVisible: authVisible,
      salesToken: app.get('salesToken')
    })
    if (app.get('isVisitor')) {
      wx.hideTabBar()
      wx.hideShareMenu()
      this.setData({
        topbarVisible: false,
        authVisible: false,
      })
    }
    if (app.get('appType') === 0 && app.get('isVisitor')) {
      this.queryDefaultWebsite().then(() => {
        this.setData({
          isReady: true,
        })
        wx.hideLoading()
      })
    } else {
      this.getWebsiteData().then(() => {
        this.setData({
          isReady: true,
        })
        wx.hideLoading()
        !app.get('isVisitor') && this.addInfoReadWebsite()
      })
    }
  },

  onShow() {
    const customer = app.get('customer')

    if (customer.id && !!this.data.websiteData) {
      !app.get('isVisitor') && this.addInfoReadWebsite()
      this.getWebsiteData()
    }

    if (app.get('isVisitor')) {
      wx.hideTabBar()
      wx.hideShareMenu()
    }
  },

  onShareAppMessage() {
    this.addInfoForwardWebsite()
    return {
      title: `${this.data.websiteData.corpWebsite.name}的官网，点击了解更多`,
      path: `/pages/people/website/index?salesToken=${this.data.salesToken}&getWay=1`,
      imageUrl: this.data.websiteData.coverImage,
    }
  }
}))