Page({

  copy() {
    wx.setClipboardData({
      data: JSON.stringify(this.data),
      success: () => {
        wx.showToast({ title: '复制成功' })
      }
    })
  },

  openDebug() {
    wx.setEnableDebug({
      enableDebug: true
    })
  },

  canIUpdate() {
    const updateManager = wx.getUpdateManager()
    updateManager.onCheckForUpdate((res) => {
      wx.showToast({ title: '获取成功' })
      this.setData({
        hasUpdate: res.hasUpdate
      })
    })
  },

  getuserinfo(e) {
    console.log(e)
  },

  onClick(e) {
    console.log(e)
  },

  submit(e) {
    console.log(e)
  },

  onShow() {
    wx.hideLoading()
    let systemInfo, networkType = null
    systemInfo = wx.getSystemInfoSync()
    wx.getNetworkType({
      success: (res) => {
        this.setData({
          networkType: res.networkType
        })
      }
    })

    this.setData({
      systemInfo: systemInfo,
      networkType: networkType,
      appId: wx.getAccountInfoSync().miniProgram.appId
    })
  },

})