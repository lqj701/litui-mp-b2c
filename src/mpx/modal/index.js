Component({

  properties: {
    visible: {
      type: Boolean,
      value: false,
      observer(newVal) {
        newVal ? wx.hideTabBar() : wx.showTabBar()
      }
    },
  },

})
