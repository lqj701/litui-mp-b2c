const qqmapkey = 'OSABZ-GYACU-WPLVH-4KNBY-YLLUJ-QRBVL'

Page({
  data: {
    markers: []
  },

  onLoad(options) {
    this.mapCtx = wx.createMapContext('map')
    wx.setNavigationBarTitle({
      title: options.company || '公司地址'
    })
    this.setData({
      company: options.company,
      address: options.address
    })
    wx.request({
      url: `https://apis.map.qq.com/ws/geocoder/v1/?address=${options.address}&output=json&key=${qqmapkey}`,
      success: (res) => {
        const data = res.data
        if (data.message === 'query ok') {
          this.setData({
            markers: [{
              iconPath: '/static/icon/home-active.svg',
              id: 0,
              latitude: data.result.location.lat,
              longitude: data.result.location.lng,
              width: 36,
              height: 36
            }]
          })
          this.mapCtx.includePoints({
            padding: [50],
            points: [{
              latitude: data.result.location.lat,
              longitude: data.result.location.lng,
            }]
          })
        } else {
          wx.showToast({
            title: '地球上还没有这个地方哦QAQ',
            icon: 'none',
            duration: 2500,
            mask: true,
            complete: () => {
              setTimeout(() => {
                wx.navigateBack({ delta: 1 })
              }, 2500)
            }
          })
        }
      },
      fail: () => {
        wx.showToast({
          title: '地球上还这个地方哦QAQ',
          icon: 'none',
          duration: 2500,
          mask: true,
          complete: () => {
            setTimeout(() => {
              wx.navigateBack({ delta: 1 })
            }, 2500)
          }
        })
      }
    })
  },

  onShareAppMessage() {
    return {
      title: `${this.data.company}的地址`,
      path: `pages/map/index?salesToken=${app.get('salesToken')}&getWay=1&address=${this.data.address}&company=${this.data.company}`,
    }
  }
})