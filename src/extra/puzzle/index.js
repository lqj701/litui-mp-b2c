Page({

  data: {
    status: 'init',
    score: ''
  },

  timer: null,

  start() {
    let a = 0
    this.setData({
      status: 'init'
    })
    this.setData({
      status: 'start'
    })
    let ms = 0, s = 0, m = 0 // 十毫秒 秒 分
    this.timer = setInterval(() => {
      ms += 1
      if (ms >= 100) {
        ms = 0
        s += 1
        if (s >= 60) {
          m += 1
          s = 0
          ms = 0
        }
      }
      this.setData({
        score: `${m}分${s}秒${ms}`
      })
    }, 10)
  },

  finished() {
    clearInterval(this.timer)
    this.setData({
      status: 'finished'
    })
  },

})