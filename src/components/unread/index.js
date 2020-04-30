const app = getApp()

Component({

  data: {
    hidden: true,
    unread: 0,
  },

  created() {
    // 监听新的未读消息
    app.event.on('onRecevingNewMessage', (data) => {
      const { id } = data.unread
      const saler = app.get('saler')
      const salerImAccountId = `bbs_${saler.wx_organization_id}_${saler.id}`
      if (!id || !salerImAccountId) return
      if (saler.id && id === salerImAccountId) {
        const count = app.get('unread').get(salerImAccountId)
        this.setData({
          unread: count > 99 ? '99+' : count,
          hidden: count > 0 ? false : true,
        })
      }
    })

    // 监听阅读未读消息
    app.event.on('clearUnreadMessage', () => {
      this.setData({
        unread: 0,
        hidden: true,
      })
    })
  },

  attached() {
    const saler = app.get('saler')
    const salerImAccountId = `bbs_${saler.wx_organization_id}_${saler.id}`
    const count = app.get('unread').get(salerImAccountId)
    if (count > 0) {
      this.setData({
        unread: count > 99 ? '99+' : count,
        hidden: count > 0 ? false : true,
      })
    }
  }

})
