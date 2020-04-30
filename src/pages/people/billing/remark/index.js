Component({

  properties: {
    snapshot: {
      type: Boolean,
      value: false,
    },
    remark: {
      type: String,
      value: '',
    },
  },

  data: {
    inputValue: '',
  },

  methods: {
    onInput(e) {
      this.setData({
        inputValue: e.detail.value
      })
    },
    onBlur() {
      this.triggerEvent('inputComplete', { remark: this.data.inputValue })
    }
  }
})
