Component({

  properties: {
    signature: {
      type: String,
      value: '',
      observer(newVal) {
        newVal ? this.setData({ visible: true }) : this.setData({ visible: false })
      }
    },
  },

  data: {
    visible: false,
  }

})
