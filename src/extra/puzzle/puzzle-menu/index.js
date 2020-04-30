Component({
  properties: {
    status: {
      type: String,
      value: 'init',
      observer: (newVal) => {
        switch (newVal) {
          case 'init':
            break
          default:
            break
        }
      }
    },
    score: {
      type: String,
      value: '0分0秒00'
    }
  },

  methods: {
    start() {
      this.triggerEvent('start')
    },
    rank() {
      wx.showModal({
        title: '排行榜',
        content: '暂无数据'
      })
    },
    unlock() {
      wx.showModal({
        title: '解锁美图',
        content: '暂不开放此功能'
      })
    },
    sponsor() {
      wx.previewImage({
        urls: ['https://i.loli.net/2018/09/23/5ba750a006972.jpg']
      })
    },
  }
})