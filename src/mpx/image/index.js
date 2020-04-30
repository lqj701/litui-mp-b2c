Component({
  properties: {
    width: {
      type: String,
      value: '0rpx'
    },
    height: {
      type: String,
      value: '0rpx'
    },
    radius: {
      type: String,
      value: '0rpx'
    },
    src: {
      type: String,
      value: ''
    },
    preview: {
      type: Boolean,
      value: false
    },
    mode: {
      type: String,
      value: 'aspectFill'
    }
  },

  data: {
    showClass: ''
  },

  methods: {
    onClick(e) {
      this.triggerEvent('click', e.detail)
      if (this.data.preview) {
        wx.previewImage({
          urls: [this.data.src]
        })
      }
    },
    onLoad(e) {
      this.triggerEvent('load', e.detail)
      this.setData({
        width: this.data.width === '0rpx' ? `${e.detail.width}rpx` : this.data.width,
        height: this.data.height === '0rpx' ? `${e.detail.height}rpx` : this.data.height,
        showClass: 'x-image--show',
      })
    },
    onError(e) {
      this.triggerEvent('error', e.detail)
    }
  }
})
