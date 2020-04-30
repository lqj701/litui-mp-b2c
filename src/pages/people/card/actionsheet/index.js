const app = getApp()

Component({
  properties: {
    visible: {
      type: Boolean,
      value: false,
      observer(newVal) {
        newVal ? wx.hideTabBar() : setTimeout(() => wx.showTabBar(), 0.2)
      }
    },
  },

  methods: {
    hideActionSheet() {
      this.triggerEvent('hideActionSheet')
    },
    goPost() {
      wx.showTabBar()
      wx.navigateTo({
        url: '/pages/people/post/index',
      })
    }
  }
})
