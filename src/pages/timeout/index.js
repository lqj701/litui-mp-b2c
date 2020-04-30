Page({

  refresh() {
    wx.reLaunch({
      url: '/' + this.data.url,
    })
  },

  onLoad: function (options) {
    const productId = wx.getStorageSync('productId')
    this.setData({ url: options.url + '?productId=' + productId})
  },
})