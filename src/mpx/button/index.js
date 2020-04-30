Component({

  properties: {
    loading: {
      type: Boolean,
      value: false,
      observer(newVal) {
        this.setData({
          loadingClass: newVal ? 'x-button--loading' : ''
        })
      }
    },
    needFormId: {
      type: Boolean,
      value: false
    },
    openType: {
      type: String,
      value: ''
    },
    type: {
      type: String,
      value: 'default',
      observer(newVal) {
        if (!newVal && typeof newVal !== string) return
        this.setData({
          typeClass: `x-button--${newVal}`
        })
      }
    },
    size: {
      type: String,
      value: 'normal',
      observer(newVal) {
        if (!newVal && typeof newVal !== string) return
        this.setData({
          sizeClass: `x-button--${newVal}`
        })
      }
    },
    borderless: {
      type: Boolean,
      value: false,
      observer(newVal) {
        this.setData({
          borderClass: newVal ? 'x-button--borderless' : ''
        })
      }
    },
    disabled: {
      type: Boolean,
      value: false,
      observer(newVal) {
        this.setData({
          disabledClass: newVal ? 'x-button--disabled' : ''
        })
      }
    }
  },

  data: {
    loadingClass: '',
    typeClass: '',
    sizeClass: '',
    borderClass: '',
    disabledClass: ''
  },

  methods: {
    onClick(e) {
      if (this.data.disabled || this.data.loading) return
      this.triggerEvent('click', e.detail)
    },
    getuserinfo(e) {
      this.triggerEvent('getuserinfo', e.detail)
    },
    getphonenumber(e) {
      this.triggerEvent('getphonenumber', e.detail)
    },
    submit(e) {
      this.triggerEvent('submit', e.detail)
    }
  }

})
