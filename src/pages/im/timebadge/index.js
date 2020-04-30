import { formatTime, timestamp } from '../../../utils/tool.js'
import moment from '../../../utils/moment-with-locales.min.js'

Component({

  properties: {
    time: {
      type: Number,
      value: 0,
    }
  },

  data: {
    formatTime: 0
  },

  attached() {
    moment.locale('zh-cn')
    const date = new Date()
    const today = new Date(new Date().toLocaleDateString()).getTime() // 当日零时
    const currentTime = timestamp() // 当前时间
    const offset1 = currentTime - this.data.time // 与当前时间比较
    const offset2 = today - this.data.time // 与当日零时比较
    let time = 0
    if (offset1 / 60 / 1000 < 6) {
      time = moment(this.data.time).fromNow()
    } else if (offset2 < 0) {
      time = formatTime(this.data.time).split(' ')[1]
    } else {
      time = formatTime(this.data.time)
    }
    this.setData({ formatTime: time })
  }
})
