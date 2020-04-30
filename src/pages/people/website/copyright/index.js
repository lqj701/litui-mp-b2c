Component({

  methods: {
    extra() {
      wx.getClipboardData({
        success: (res) => {
          const targetPath = res.data
          wx.navigateTo({ url: `/extra/${targetPath}/index` })
        }
      })
    }
  }

})
