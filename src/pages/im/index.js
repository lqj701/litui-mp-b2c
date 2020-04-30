import api from '../../utils/api.js'
import webimHandler from '../../utils/imsdk/webim-handler'
import webim from '../../utils/imsdk/webim-wx'
import { timestamp, currentRoute } from '../../utils/tool'

const app = getApp()

Page({

  data: {
    inputMessage: '',
    historyMessage: [],
    scrollIntoMsgId: '',
    scrollWithAnimation: false,
    originSalesToken: '',
    loading: false,
  },

  fetchSalerImAccount() {
    return new Promise((resolve) => {
      const salerImAccount = app.get('salerImAccount')
      const salerOrgId = Number(salerImAccount.imAccountId.split('_')[1])
      // 获取销售的salesToken
      api.getSalesTokenByUserId(salerImAccount.wxUserId).then((res) => {
        app.dispatch('updateSalesToken', res.data.salesToken)
        // 获取销售的IM账号信息
        api.getImAccount(1, { orgId: salerOrgId, userIdOrOpenid: salerImAccount.wxUserId }).then((res) => {
          const result = res.data
          // 更新销售的IM账号信息
          app.dispatch('updateSalerImAccount', {
            wxUserId: result.imAccount.user_id_or_openid,
            imAccountId: result.imAccount.account_id,
            name: result.imAccount.account_name,
            orgId: result.imAccount.org_id,
            signPassword: result.imAccount.sign_password,
            avatar: result.imAccount.face_url,
            welcomeChat: result.welcomeChat,
          })
          resolve()
        })
      })
    })
  },

  randomMsgId() {
    return Math.round(Math.random() * 4294967296) // 消息随机数，用于去重
  },

  onInputMessage(e) {
    this.setData({
      inputMessage: e.detail.value,
    })
  },

  sendMessage(e) {
    this.send()
    if (e.detail.formId === 'the formId is a mock one') return
    const customerImAccount = app.get('customerImAccount')
    api.sendFormId([{
      account_id: customerImAccount.imAccountId,
      form_id: e.detail.formId,
      type: 1,
    }])
  },

  msgTimeFormat(msgs) {
    if (!msgs[0]) return msgs
    let time1, time2 = 0 // time1为当前计算时间,time2为上一个时间
    let count = 0

    for (let i = msgs.length - 1; i > 0; i--) {
      if (i === msgs.length - 1) {
        time1 = msgs[i].time
        time2 = msgs[i].time
      } else {
        time1 = msgs[i].time
        time2 = msgs[i + 1].time

        if (time2 - time1 <= 60000 && count <= 20) {
          // 最新消息离当前时间不到一分钟且连续消息少于20个
          msgs[i + 1].timeVisible = false
          count = count + 1
        } else if (time2 - time1 <= 60000 && count > 20) {
          // 最新消息离当前时间不到一分钟且连续消息多于20个
          msgs[i + 1].timeVisible = true
          count > 20 ? count = 0 : count = count
        } else {
          msgs[i + 1].timeVisible = true
          count = 0
        }
      }
    }

    return msgs
  },

  send() {
    if (!this.data.inputMessage) return

    const salerImAccount = app.get('salerImAccount')
    const customerImAccount = app.get('customerImAccount')
    const customer = app.get('customer')
    const random = this.randomMsgId()
    const msgTime = Math.round(timestamp() / 1000)
    const msg = {
      id: random,
      message: this.data.inputMessage,
      avatar: customer.avatar_url,
      from: 'customer',
      time: msgTime * 1000
    }
    const historyMessage = [...this.data.historyMessage, msg]

    webimHandler.onSendMsg({
      content: this.data.inputMessage,
      toId: salerImAccount.imAccountId,
      random,
      msgTime,
    })

    api.pushMsg({
      from_account_id: customerImAccount.imAccountId,
      to_account_id: salerImAccount.imAccountId,
      msg_seq: random,
      msg_send: msgTime * 1000,
      content: this.data.inputMessage
    })

    this.setData({
      scrollIntoMsgId: `msg${random}`,
      inputMessage: '',
      historyMessage: this.msgTimeFormat(historyMessage),
      scrollWithAnimation: true,
    })
  },

  fetchHistoryMsgs(cb) {

    const salerImAccount = app.get('salerImAccount')
    const options = {
      Peer_Account: salerImAccount.imAccountId,
      MaxCnt: 15,
      LastMsgTime: this.data.LastMsgTime || 0,
      MsgKey: this.data.MsgKey || '',
    }

    webim.getC2CHistoryMsgs(options, (resp) => {
      this.setData({
        LastMsgTime: resp.LastMsgTime,
        MsgKey: resp.MsgKey,
        moreMsgs: resp.Complete === 0,
      })

      const msgs = resp.MsgList.map((msg) => {
        return {
          id: msg.random,
          message: msg.elems[0].content.text,
          avatar: /^c/.test(msg.fromAccount) ? app.get('customer').avatar_url : salerImAccount.avatar,
          from: /^c/.test(msg.fromAccount) ? 'customer' : 'saler',
          time: msg.time * 1000,
        }
      })

      // 欢迎语
      if (resp.Complete === 1 && salerImAccount.welcomeChat) {
        msgs.unshift({
          id: this.randomMsgId(),
          message: salerImAccount.welcomeChat,
          avatar: salerImAccount.avatar,
          from: 'saler',
          time: null,
          isWelcome: true
        })
      }

      cb(msgs)
    }, (err) => {
      console.log(err)
    })
  },

  markMsgRead() {
    const historyMessage = JSON.parse(JSON.stringify(this.data.historyMessage))
    const reverseHistoryMessage = historyMessage.reverse()
    const lastSalerMsg = reverseHistoryMessage.find(msg => msg.from === 'saler')
    lastSalerMsg && api.markMsgRead(lastSalerMsg.id)
  },

  addInfoEntertalkingWindow() {
    const customer = app.get('customer')
    const salerImAccount = app.get('salerImAccount')
    if (!customer) return
    api.addInfo({
      openid: customer.openid,
      objectType: 'card',
      objectId: salerImAccount.wxUserId,
      goalsType: 0,
      fromType: 0,
      action: 'enter',
      actionGoals: 'talkingWindow',
      time_order: timestamp(),
      revisitLog: null
    })
  },

  onScrollToUpper() {
    if (!this.data.moreMsgs) return
    this.setData({ loading: true })
    this.fetchHistoryMsgs((msgs) => {
      this.setData({ loading: false, })
      if (!msgs.length) return
      const historyMessage = [...msgs, ...this.data.historyMessage]
      this.setData({
        scrollIntoMsgId: `msg${msgs[msgs.length - 1].id}`,
        historyMessage: this.msgTimeFormat(historyMessage),
        scrollWithAnimation: true,
      })
    })
  },

  onLoad() {
    // 保存原始 salesToken
    this.setData({
      originSalesToken: app.get('salesToken'),
      loading: true,
    })

    // 监听新消息
    app.event.on('onRecevingNewMessage', (data) => {
      if (data.unread.id !== app.get('salerImAccount').imAccountId || currentRoute() !== 'pages/im/index') return
      const oldHistoryMessage = this.data.historyMessage
      this.setData({
        historyMessage: [...oldHistoryMessage, data.msg],
        scrollIntoMsgId: `msg${data.msg.id}`,
        scrollWithAnimation: true,
      })
      this.markMsgRead()
    })

    this.fetchSalerImAccount().then(() => {
      // 首次拉取历史消息
      this.fetchHistoryMsgs((msgs) => {
        this.setData({ loading: false, })
        if (!msgs.length) return
        this.setData({
          scrollIntoMsgId: `msg${msgs[msgs.length - 1].id}`,
          historyMessage: this.msgTimeFormat(msgs),
          scrollWithAnimation: false,
        })
        if (currentRoute() === 'pages/im/index') {
          this.markMsgRead()
        }
      })

      this.addInfoEntertalkingWindow()
    })
  },

  onShow() {
    // this.addInfoEntertalkingWindow()
  },

  onHide() {
    app.dispatch('updateSalesToken', this.data.originSalesToken)
  },

  onUnload() {
    // 卸载页面(返回)时触发已阅读全部未读消息
    const salerImAccount = app.get('salerImAccount')
    app.dispatch('clearUnread', salerImAccount.imAccountId)
    // 恢复原salesToken
    app.dispatch('updateSalesToken', this.data.originSalesToken)
  }

})
