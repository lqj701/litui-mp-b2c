Page({

  goBilling() {
    wx.redirectTo({
      url: `/pages/people/billing/index?ecOrderId=${this.data.ecOrderId}`,
    })
  },

  onLoad: function (options) {
    wx.hideLoading()
    this.setData({
      result: options.result,
      ecOrderId: options.ecOrderId,
      amount: options.amount,
    })
  },

})