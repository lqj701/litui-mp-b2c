// 主业务接口

import { request } from './wx.js'
import { HOST, IMHOST, PAY_GATEWAY } from '../config.js'

const api = {

  // 用户登录
  customerLogin: (code, data) => request.post(`${HOST}/auth/${code}/login`, data),

  // 获取小程序码参数
  decodeAuthToken: (authToken) => request.get(`${HOST}/auth/mp/qrcode/${authToken}/parse`),

  // 查询用户是否设置过个人信息
  getUserInfo: (userId) => request.post(`${HOST}/auth/${userId}/user/info`),

  // 设置个人信息
  setUserInfo: (userId, data) => request.post(`${HOST}/auth/${userId}/user/set`, data),

  // 通过 userid 查询 salesToken
  getSalesTokenByUserId: data => request.get(`${HOST}/api/mp/wxUser/get?wx_user_id=${data}`),

  // C端用户数据解密
  decode: (userId, data) => request.post(`${HOST}/auth/${userId}/decrypt`, data),

  // 查询salesToken
  getSalesToken: (b_card_id) => request.post(`${HOST}/api/mp/bCard/getSalesToken`, { b_card_id }),

  // 更新最后浏览，用于名片列表排序
  updateLastView: (openid) => request.post(`${HOST}/api/mp/bCard/updateLastView`, { openid }),

  // 获得名片列表
  getCardList: (data) => request.post(`${HOST}/api/mp/bCard/getCardList`, data),

  // 获得默认名片列表
  getDefaultCardList: (page, row, wxOrganizationId) => request.get(`${HOST}/api/mp/bCard/getDefaultCardList?wxOrganizationId=${wxOrganizationId}&page=${page}&row=${row}`),

  // 查看名片详情
  getCardDetail: () => request.post(`${HOST}/api/mp/bCard/viewCard`),

  // 名片浏览、点赞、转发事件
  updateCard: (openid, event) => request.post(`${HOST}/api/mp/bCard/event`, { openid, event }),

  // 查询是否点赞过名片
  getCardSupportState: (openid, b_card_id) => request.get(`${HOST}/api/mp/bCard/haveSupported`, { openid, b_card_id }),

  // 根据 openid 获取 customerId
  getCustomerByOpenid: (openid) => request.get(`${HOST}/api/mp/bCard/getCustomerByOpenid?openid=${openid}`),

  // 获取销售产品列表
  getProductList: (page, row) => request.get(`${HOST}/api/mp/product/getProducts`, { page, row }),

  // 获取产品详情
  getProductDetail: (productId) => request.get(`${HOST}/api/mp/product/getDetail`, { productId }),

  // 产品浏览、点赞、转发事件
  updateProduct: (productId, event) => request.get(`${HOST}/api/mp/product/event`, { productId, event }),

  // 查询是否点赞过商品
  getProductSupportState: (openid, productId) => request.get(`${HOST}/api/mp/product/haveSupported`, { openid, productId }),

  // 查看官网
  getWebSite: (data) => request.get(`${HOST}/api/mp/website/query?wxOrganizationId=${data}`),

  // 添加情报
  addInfo: (data) => request.post(`${HOST}/api/mp/information/add`, { objectType: data.objectType, objectId: data.objectId, goalsType: data.goalsType, fromType: data.fromType, openid: data.openid, action: data.action, actionGoals: data.actionGoals, time_order: data.time_order, revisitLog: data.revisitLog, extre: data.extre }),

  // 标记消息已读
  markMsgRead: (msgSeq) => request.post(`${IMHOST}/im/msg/status`, { msgSeq }),

  // 发送消息
  pushMsg: (data) => request.post(`${IMHOST}/im/msg`, data),

  // 发送模板ID
  sendFormId: (data) => request.post(`${IMHOST}/im/mp/form`, data),

  // 查询 im 信息
  getImAccount: (accountType, data) => request.post(`${IMHOST}/im/${accountType}/user/info`, data),

  // 获取im未读消息数
  getImUnread: (data) => request.post(`${IMHOST}/im/msg/unread`, data),

  // 获取余额
  getRedpacketBalance: (customerId) => request.get(`${HOST}/api/mp/redpacket/getAccount?customer_id=${customerId}`),

  // 发红包
  sendRedpacket: (data) => request.post(`${HOST}/api/mp/redpacket/send`, data),

  // 收红包
  receiveRedpacket: (data) => request.get(`${HOST}/api/mp/redpacket/receive?redpacket_order=${data.redpacket_order}&customer_id=${data.customer_id}`),

  // 查询是否收过红包
  canReceive: (data) => request.get(`${HOST}/api/mp/redpacket/canReceive?redpacket_order=${data.redpacket_order}&customer_id=${data.customer_id}`),

  // 红包记录
  redpacketRecord: (data) => request.get(`${HOST}/api/mp/redpacket/record?redpacket_order=${data.redpacket_order}&customer_id=${data.customer_id}&page=${data.page}&row=${data.row}`),

  // 提现
  withdraw: (data) => request.post(`${HOST}/api/mp/redpacket/withdraw`, data),

  // 转发红包
  forwardRedpacket: (data) => request.post(`${HOST}/api/mp/redpacket/forward`, data),

  // 红包支付网关
  redpacketGateway: (data) => request.post(PAY_GATEWAY, data),

  // 红包提现网关
  redpacketWithdrawGateway: (data) => request.post(PAY_GATEWAY, data),

  //交易记录
  getTradeRecords: (data) => request.post(`${HOST}/api/mp/redpacket/getTradeRecords`, data),

  // 通过salesToken查询销售数据
  getSaler: () => request.post(`${HOST}/api/mp/bCard/getWxUserBySalesToken`),

  // 商城产品列表
  getEcProductList: (data) => request.get(`${HOST}/api/mp/ecProduct/list?page=${data.page}&row=${data.row}`),

  // 商城产品详情
  getEcProductDetail: (data) => request.get(`${HOST}/api/mp/ecProduct/get?id=${data}`),

  // check商城商品信息是否变化
  checkEcProduct: (data) => request.get(`${HOST}/api/mp/ecProduct/check?${data}`),

  // 提交商城订单
  createEcOrder: (data) => request.post(`${HOST}/api/ec/mp/createOrder`, data),

  // 获取客户收货地址
  getCustomerAddress: (data) => request.get(`${HOST}/api/ec/mp/customerAddress/queryCustomerAddress?wxOrganizationId=${data.wxOrganizationId}&openId=${data.openId}`),

  // 查询客户默认收货地址
  getCustomerDefaultAddress: (data) => request.get(`${HOST}/api/ec/mp/customerAddress/selectEnableCustomerAddress?wxOrganizationId=${data.wxOrganizationId}&openId=${data.openId}`),

  // 新增客户收货地址
  addCustomerAddress: (data) => request.post(`${HOST}/api/ec/mp/customerAddress/addCustomerAddress`, data),

  // 删除客户收货地址
  deleteCustomerAddress: (data) => request.post(`${HOST}/api/ec/mp/customerAddress/deleteCustomerAddress`, data),

  // 更新客户收货地址
  updateCustomerAddress: (data) => request.post(`${HOST}/api/ec/mp/customerAddress/updateCustomerAddress`, data),

  // 设为默认收货地址
  enableCustomerAddress: (data) => request.post(`${HOST}/api/ec/mp/customerAddress/enableCustomerAddress`, data),

  // 查询订单详情
  getOrder: (data) => request.get(`${HOST}/api/ec/mp/getOrder?orderNum=${data.orderNum}&customerWxUserId=${data.customerWxUserId}`),

  // 查询订单历史
  getOrderList: (data) => request.get(`${HOST}/api/ec/mp/getOrderList?customerWxUserId=${data.customerWxUserId}&status=${data.status}&page=${data.page}&row=${data.row}`),

  // 商城付款
  ecPay: (data) => request.post(`${HOST}/api/pay/mp/pay`, data),

  // 获得GoodsId
  getGoodsIdByProductId: (data) => request.get(`${HOST}/api/ec/mp/getGoodsIdByProductId?productId=${data}`),

  // 添加购物车
  addCart: (data) => request.post(`${HOST}/api/ec/mp/addCart`, data),

  // 删除购物车
  deleteCart: (data) => request.post(`${HOST}/api/ec/mp/deleteCart`, data),

  // 更新购物车
  updateCart: (data) => request.post(`${HOST}/api/ec/mp/updateCart`, data),

  // 购物车列表有效商品
  getCartListValid: (data) => request.get(`${HOST}/api/ec/mp/getCartListValid?customerWxUserId=${data}&page=1&row=99`),

  // 购物车列表无效商品
  getCartListInValid: (data) => request.get(`${HOST}/api/ec/mp/getCartListInValid?customerWxUserId=${data}&page=1&row=99`),

  // 购物车结算
  billing: (data) => request.post(`${HOST}/api/ec/mp/billing`, data),

  // 生成海报
  generatePoster: () => request.get(`${HOST}/api/mp/poster/generate`),

  // 查询是单小程序还是企业小程序
  isPublicMp: () => request.get(`${HOST}/auth/isPublicMp`),

  // 获取默认官网
  queryDefaultWebsite: () => request.get(`${HOST}/api/mp/website/queryDefault`),

}

export default api
