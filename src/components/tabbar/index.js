import { currentRoute } from '../../utils/tool'

Component({

  data: {
    isCards: true,
    isMe: false,
  },

  methods: {
    goto(e) {
      let page = currentRoute()
      console.log(e)
      wx.redirectTo({
        url: `/pages/home/${e.currentTarget.dataset.page}/index`,
        success: () => {
          this.setData({
            isCards: page === 'pages/home/cards/index',
            isMe: page === 'pages/home/me/index',
          })
        }
      })
    },
  },

  attached() {
    let page = currentRoute()
    this.setData({
      isCards: page === 'pages/home/cards/index',
      isMe: page === 'pages/home/me/index',
    })
  }
})
