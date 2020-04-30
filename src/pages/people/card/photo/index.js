Component({

  properties: {
    photo: {
      type: Array,
      value: [],
      observer(newVal) {
        newVal.length > 0 ? this.setData({ visible: true }) : this.setData({ visible: false })
      }
    }
  },

  data: {
    visible: false,
  }

})
