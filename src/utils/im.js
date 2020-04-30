import webimHandler from './imsdk/webim-handler.js'
import webim from './imsdk/webim-wx.js'
import api from './api.js'
import { imAccountMode, imSdkAppID, imAccountType } from '../config.js'
import { currentRoute } from '../utils/tool'
import regeneratorRuntime from "./regenerator-runtime";

const imConfig = {
  accountMode: imAccountMode,
  sdkAppID: imSdkAppID,
  accountType: imAccountType,
}

function fetchCustomerImAccount() {
  const appType = getApp().get('appType')
  return new Promise(async (resolve) => {
    const customer = getApp().get('customer')
    const imAccount = await api.getImAccount(2, { orgId: appType === 0 ? null : customer.orgId, userIdOrOpenid: customer.openid })
    const result = imAccount.data
    getApp().dispatch('updateCustomerImAccount', {
      imAccountId: result.imAccount.account_id,
      name: result.imAccount.account_name,
      avatar: result.imAccount.face_url,
      signPassword: result.imAccount.sign_password,
    })
    resolve()
  })
}

function initIM() {

  const { imAccountId, signPassword } = getApp().get('customerImAccount')

  webimHandler.init({
    accountMode: imConfig.accountMode,
    accountType: imConfig.accountType,
    sdkAppID: imConfig.sdkAppID,
    selType: webim.SESSION_TYPE.C2C
  })

  const loginInfo = {
    sdkAppID: imConfig.sdkAppID,
    ' ': imConfig.sdkAppID,
    accountType: imConfig.accountType,
    identifier: imAccountId,
    identifierNick: imAccountId,
    userSig: signPassword
  }

  const listeners = {
    onMsgNotify: (list) => {
      list.forEach(async (item) => {
        const salerOrgId = Number(item.fromAccount.split('_')[1])
        const salerUserId = Number(item.fromAccount.split('_')[2])

        const imAccount = await api.getImAccount(1, { orgId: salerOrgId, userIdOrOpenid: salerUserId })
        const result = imAccount.data
        const msg = {
          id: item.random,
          message: item.elems[0].content.text,
          avatar: result.imAccount.face_url,
          from: 'saler',
          time: item.time * 1000
        }
        getApp().dispatch('updateUnread', { unread: { id: item.fromAccount, count: 1 }, msg })
        if (currentRoute() !== 'pages/im/index') {
          // 获取未读消息的销售信息，触发弹窗事件
          getApp().event.trigger('showUnreadModal', { name: result.imAccount.account_name, id: result.imAccount.account_id })
        }

      })
    }
  }

  webimHandler.sdkLogin(loginInfo, listeners, { isLogOn: false })

  webimHandler.onLogin(async () => {
    console.log('im has login')
    getApp().dispatch('updateImLoginState', true)

    const customerImAccount = getApp().get('customerImAccount')
    const param = { toAccountId: customerImAccount.imAccountId, fromAccountIds: [] }

    const imUnread = await api.getImUnread(param)
    const result = imUnread.data
    const firstUnread = result.find(item => item.unreadCount > 0)
    const firstUnreadImAccountId = firstUnread && Number(firstUnread.fromAccountId.split('_')[2])
    const firstUnreadOrgId = firstUnread && Number(firstUnread.fromAccountId.split('_')[1])

    // 更新未读消息数
    result.forEach((item) => {
      getApp().dispatch('updateUnread', { unread: { id: item.fromAccountId, count: item.unreadCount } })
    })

    // 触发弹窗
    if (firstUnreadImAccountId && currentRoute() !== 'pages/im/index') {
      const imAccount = await api.getImAccount(1, { orgId: firstUnreadOrgId, userIdOrOpenid: firstUnreadImAccountId })
      const result = imAccount.data
      getApp().event.trigger('showUnreadModal', { name: result.imAccount.account_name, id: result.imAccount.account_id })
    }
  })
}

export default async function reducer() {
  if (getApp().get('imLoginState')) return
  await fetchCustomerImAccount()
  initIM()
}