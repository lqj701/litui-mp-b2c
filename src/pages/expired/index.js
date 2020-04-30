Page({

  gohome() {
    wx.redirectTo({
      url: `/pages/home/cards/index`,
    })
  },

  onReady() {
    wx.setNavigationBarTitle({ title: '该名片已失效' })
    wx.hideLoading()
  }

})
