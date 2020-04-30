export const model = {

  /**
   * 更新客户信息
   * @param {object} [store] states or actions
   * @param {boolean} customer 客户信息
   */
  updateCustomer({ state }, customer) {
    if (typeof customer !== 'object' || JSON.stringify(customer) === '{}') return
    Object.keys(customer).forEach(key => {
      if (customer[key]) {
        state.customer[key] = customer[key]
      }
    })
  },

  /**
   * 更新销售信息
   * @param {object} [store] states or actions
   * @param {boolean} saler 销售信息
   */
  updateSaler({ state }, saler) {
    if (typeof saler !== 'object' || JSON.stringify(saler) === '{}') return
    state.saler = Object.assign({}, state.saler, saler)
  },

  /**
   * 更新游客状态
   * @param {object} [store] states or actions
   * @param {boolean} isVisitor 是否为游客
   */
  updateVisitor({ state }, isVisitor) {
    state.isVisitor = isVisitor
  },

  /**
   * 更新 salesToken
   * @param {object} [store] states or actions
   * @param {string} salesToken salesToken
   */
  updateSalesToken({ state, action }, salesToken) {
    if (typeof salesToken !== 'string' || salesToken === '') return
    // 有 salesToken 时就意味着游客有了名片，此时刷新状态是为了让官网页可以显示tabbar
    action.updateVisitor(false)
    state.salesToken = salesToken
  },

  /**
   * 更新 authToken
   * @param {object} [store] states or actions
   * @param {string} authToken authToken
   */
  updateAuthToken({ state }, authToken) {
    if (typeof authToken !== 'string' || authToken === '') return
    state.authToken = authToken
  },

  /**
   * 更新getWay
   * @param {object} [store] states or actions
   * @param {number} getWay 更新getWay 
   */
  updateGetWay({ state }, getWay) {
    if (typeof getWay !== 'number' || getWay === NaN) return
    state.getWay = getWay
  },

  /**
   * 更新未读消息
   * @param {object} [store] states or actions
   * @param {object} options 
   * @param {object} options.msg 新到的消息
   * @param {object} options.unread
   * @param {string} options.unread.id 销售的im id
   * @param {number} options.unread.count 未读消息数
   */
  updateUnread({ state }, options) {
    const { id, count } = options.unread
    if (!id || !count) return
    state.unread.has(id) ? state.unread.set(id, state.unread.get(id) + count) : state.unread.set(id, count)
    getApp().event.trigger('onRecevingNewMessage', options)
  },

  /**
   * 清空未读消息数
   * @param {object} [store] states or actions
   * @param {string} [salerImAccountId] 销售的imAccountId
   */
  clearUnread({ state }, salerImAccountId) {
    if (salerImAccountId) {
      state.unread.delete(salerImAccountId)
      getApp().event.trigger('clearUnreadMessage', salerImAccountId)
    } else {
      state.unread.clear()
      getApp().event.trigger('clearUnreadMessage')
    }
  },

  /**
   * 更新销售 im 信息
   * @param {object} [store] states or actions
   * @param {object} newVal 销售的im信息
   */
  updateSalerImAccount({ state }, newVal) {
    state.salerImAccount = Object.assign({}, state.salerImAccount, newVal)
  },

  /**
   * 更新客户 im 信息
   * @param {object} [store] states or actions
   * @param {object} newVal 客户的im信息
   */
  updateCustomerImAccount({ state }, newVal) {
    state.customerImAccount = Object.assign({}, state.customerImAccount, newVal)
  },

  /**
   * 更新 im 登录状态
   * @param {object} [store] states or actions
   * @param {boolean} imLoginState im 登录状态
   */
  updateImLoginState({ state }, imLoginState) {
    state.imLoginState = imLoginState
  },

  /**
   * 更新用户授权状态
   * @param {object} [store] states or actions
   * @param {boolean} userAuthState 用户授权状态
   */
  updateUserAuthState({ state }, userAuthState) {
    state.userAuthState = userAuthState
  },

  /**
   * 更新手机号授权状态
   * @param {object} [store] states or actions
   * @param {boolean} phoneAuthState 手机号授权状态
   */
  updatePhoneAuthState({ state }, phoneAuthState) {
    state.phoneAuthState = phoneAuthState
  },

  /**
   * 更新小程序来源
   * @param {object} [store] states or actions
   * @param {string} refer 小程序来源
   */
  updateRefer({ state }, refer) {
    state.refer = refer
  },

  /**
   * 更新交易使用的地址
   * @param {object} [store] states or actions
   * @param {object} billingAddress 交易使用的地址
   */
  updateBillingAddress({ state }, billingAddress) {
    state.billingAddress = billingAddress
  },

  /**
   * 更新选中的地址
   * @param {object} [store] states or actions
   * @param {object} selectedAddress 选中的地址
   */
  updateSelectedAddress({ state }, selectedAddress) {
    state.selectedAddress = selectedAddress
  },

  /**
   * 更新小程序类型
   * @param {object} [store] states or actions
   * @param {string} appType 小程序类型
   */
  updateAppType({ state }, appType) {
    state.appType = appType
  },

  /**
   * 是否需要更新销售信息
   * @param {object} [store] states or actions
   * @param {string} data 
   */
  needRefreshSaler({ state }, data) {
    state.needRefreshSaler = data
  },

}

