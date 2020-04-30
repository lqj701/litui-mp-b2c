import login from '../../../utils/login.js'
import api from '../../../utils/api.js'

const app = getApp()

Page(login({

  data: {
    remainTime: 0,
    billingAddress: null,
    onEcPay: false,
    tabbarVisible: true,
  },

  // 监听备注完成
  onInputComplete(e) {
    this.setData({ remark: e.detail.remark })
  },

  // 获取收获地址
  getCustomerDefaultAddress() {
    const billingAddress = app.get('billingAddress')
    if (JSON.stringify(billingAddress) !== '{}') {
      this.setData({ billingAddress })
    } else {
      const customer = app.get('customer')
      const param = {
        wxOrganizationId: customer.orgId,
        openId: customer.openid
      }
      api.getCustomerDefaultAddress(param).then((res) => {
        this.setData({ billingAddress: res.data })
        app.dispatch('updateBillingAddress', res.data)
      })
    }
  },

  // 订单结束
  orderClosed() {
    this.getOrder()
  },

  // 提交订单表单prepayId
  payFormSubmit(prepayid) {
    const customerImAccount = app.get('customerImAccount')
    api.sendFormId([{
      account_id: customerImAccount.imAccountId,
      form_id: prepayid,
      type: 2,
    }])
  },

  // 订单支付
  makePayment() {
    if (this.data.onEcPay) return

    this.setData({ onEcPay: true })

    const param = {
      openid: app.get('customer').openid,
      out_trade_no: this.data.order.orderNum,
      total_fee: Number(this.data.order.actualMoney) * 100
    }
    api.ecPay(param).then((res) => {
      if (res.code === 0) {
        const result = res.data
        this.payFormSubmit(result.package.split('=')[1])
        wx.requestPayment({
          timeStamp: String(result.timeStamp),
          nonceStr: result.nonceStr,
          package: result.package,
          signType: result.signType,
          paySign: result.sign,
          success: (res) => {
            if (res.errMsg === 'requestPayment:ok') {
              const customer = app.get('customer')
              this.data.productsData.forEach((item) => {
                api.addInfo({
                  openid: customer.openid,
                  objectType: 'ec',
                  objectId: null,
                  goalsType: 0,
                  fromType: 0,
                  action: 'buy',
                  actionGoals: 'ecGoods',
                  revisitLog: null,
                  extre: item.ecProductName + '(' + item.value + ')'
                })
              })
            }
          },
          fail: (res) => {
            console.log(res.errMsg)
          },
          complete: () => {
            this.setData({ onEcPay: false })
            wx.redirectTo({
              url: `/pages/people/billing/index?ecOrderId=${this.data.order.orderNum}`,
            })
          }
        })
      } else {
        wx.redirectTo({
          url: `/pages/people/paymentResult/index?result=fail&amount=${this.data.order.actualMoney}&ecOrderId=${this.data.order.orderNum}`,
        })
      }
    })
  },

  // 更新商品信息
  update(cb = null) {
    let requestProductsIdList = new Set()
    let oldCart = this.data.productsData
    let requestList = []
    let products = []
    let expiredProducts = [] // 失效商品总列表
    let cannotBuyList = [] // 不能在线支付的商品列表
    let notOnSaleList = [] // 下架的商品列表
    let notOnSaleGoodsList = [] // 下架的商品规格列表
    let notRemainList = [] // 售罄商品列表
    let notEnoughRemainList1 = [] // 足够库存的商品列表  保留本地数据
    let notEnoughRemainList2 = [] // 足够库存的商品列表  新数据

    const requestLatestProduct = (id) => {
      return new Promise((resolve) => {
        api.getEcProductDetail(id).then((res) => {
          resolve(res.data)
        })
      })
    }

    // 所有不同的 productId
    this.data.productsData.forEach((item) => {
      requestProductsIdList.add(item.ecProductId)
    })

    requestProductsIdList.forEach((item) => {
      requestList.push(requestLatestProduct(item))
    })

    Promise.all(requestList).then((res) => {
      let temp = []
      res.forEach((item) => {
        temp.push(item)
      })

      if (temp[0].ecShop.enable === false) {
        wx.showToast({
          title: '对不起，商城已关闭',
          icon: 'none',
          mask: true,
          duration: 1000,
          complete: () => {
            setTimeout(() => {
              wx.switchTab({ url: '/pages/people/card/index' })
            }, 1000)
          }
        })
        return
      }

      temp.forEach((tempItem) => {
        tempItem.product.ecGoodsList.forEach((tempGoodsItem) => {
          tempGoodsItem.price = (tempGoodsItem.price / 100).toFixed(2)
        })
      })

      oldCart.forEach((oldCartItem) => {
        let hasOldCartItem = false
        temp.forEach((tempItem) => {
          // 如果商品规格已下架
          let _hasOldCartItem = tempItem.product.ecGoodsList.find(item => Number(item.ecGoodsId) === Number(oldCartItem.ecGoodsId))
          if (_hasOldCartItem) {
            hasOldCartItem = true
          }
          if (tempItem.product.onSale === false) {
            // 如果商品已下架
            tempItem.product.ecGoodsList.forEach((tempGoodsItem) => {
              if (Number(oldCartItem.ecGoodsId) === tempGoodsItem.ecGoodsId) {
                expiredProducts.push(Object.assign({}, oldCartItem, tempGoodsItem, { goodsStatus: 3 }))
                notOnSaleList.push(Object.assign({}, oldCartItem, tempGoodsItem, { goodsStatus: 3 }))
              }
            })
          } else if (tempItem.product.canBuy === false) {
            // 如果商品不支持在线交易
            tempItem.product.ecGoodsList.forEach((tempGoodsItem) => {
              if (Number(oldCartItem.ecGoodsId) === tempGoodsItem.ecGoodsId) {
                cannotBuyList.push(Object.assign({}, oldCartItem, tempGoodsItem, { goodsStatus: 1 }))
                expiredProducts.push(Object.assign({}, oldCartItem, tempGoodsItem, { goodsStatus: 1 }))
              }
            })
          } else {
            tempItem.product.ecGoodsList.forEach((tempGoodsItem) => {
              if (Number(oldCartItem.ecGoodsId) === tempGoodsItem.ecGoodsId) {
                // 如果规格售罄
                if (tempGoodsItem.remainNum < 1) {
                  notRemainList.push(Object.assign({}, oldCartItem, tempGoodsItem, { goodsStatus: 5 }))
                  expiredProducts.push(Object.assign({}, oldCartItem, tempGoodsItem, { goodsStatus: 5 }))
                } else if (tempGoodsItem.remainNum < oldCartItem.count) {
                  // 如果规格没有足够库存
                  notEnoughRemainList1.push(Object.assign({}, oldCartItem, tempGoodsItem, { goodsStatus: 6 }))  // 保留本地数据
                  notEnoughRemainList2.push(Object.assign({}, tempGoodsItem, { goodsStatus: 6, count: tempGoodsItem.remainNum }))  // 新数据
                } else {
                  products.push(Object.assign({}, oldCartItem, tempGoodsItem, { goodsStatus: 1 }))
                }
              }
            })
          }
        })
        if (!hasOldCartItem) {
          notOnSaleGoodsList.push(Object.assign({}, oldCartItem, { goodsStatus: 4 }))
          expiredProducts.push(Object.assign({}, oldCartItem, { goodsStatus: 4 }))
        }
      })

      const setData = () => {
        const amount = products.reduce((pre, cur) => pre + Number(cur.price) * Number(cur.count))

        this.setData({
          productsData: products,
          expiredProductsData: expiredProducts, // 失效商品总列表
          cannotBuyList, // 不能在线支付的商品列表
          notOnSaleList, // 下架的商品列表
          notOnSaleGoodsList, // 下架的商品规格列表
          notRemainList, // 没有库存的商品列表
          notEnoughRemainList1, // 足够库存的商品列表
          notEnoughRemainList2, // 足够库存的商品列表
          tabbarVisible: products.length === 0 ? false : true,
          amount: amount.toFixed(2),
        })
      }

      if (cannotBuyList.length > 0) {
        //暂不支持在线交易
        let nameList = ''
        cannotBuyList.forEach(item => nameList += item.ecProductName + '(' + item.value + ')' + ' ')
        wx.showToast({
          title: '商品 ' + nameList + '暂不支持在线交易',
          icon: 'none',
          mask: true,
          duration: 1000,
        })
      } else if (notOnSaleList.length > 0) {
        //下架的商品列表
        let nameList = ''
        notOnSaleList.forEach(item => nameList += item.ecProductName + '(' + item.value + ')' + ' ')
        wx.showToast({
          title: '商品 ' + nameList + '已下架',
          icon: 'none',
          mask: true,
          duration: 1000,
        })
      } else if (notOnSaleGoodsList.length > 0) {
        //下架的商品规格列表
        let nameList = ''
        notOnSaleGoodsList.forEach(item => nameList += item.ecProductName + '(' + item.value + ')' + ' ')
        wx.showToast({
          title: '商品 ' + nameList + '不存在',
          icon: 'none',
          mask: true,
          duration: 1000,
        })
      } else if (notEnoughRemainList1.length > 0) {
        //库存不足的商品列表
        let nameList = ''
        notEnoughRemainList1.forEach(item => nameList += item.ecProductName + '(' + item.value + ')' + ' ')
        wx.showModal({
          title: '提示',
          content: '商品 ' + nameList + '库存不足',
          confirmText: '继续',
          confirmColor: '#4A8CF2',
          success: (res) => {
            if (res.confirm) {
              products = [...products, ...notEnoughRemainList2]
              setData()
            }
            if (res.cancel) {
              expiredProducts = [...notEnoughRemainList1]
              setData()
            }
          },
        })
      } else if (notRemainList.length > 0) {
        //售罄的商品列表
        let nameList = ''
        notRemainList.forEach(item => nameList += item.ecProductName + '(' + item.value + ')' + ' ')
        wx.showToast({
          title: '商品 ' + nameList + '已售罄',
          icon: 'none',
          mask: true,
          duration: 1000,
        })
      }
    });
  },

  // 创建订单
  createEcOrder() {

    wx.showLoading({
      title: '处理中',
      mask: true,
    })

    // 创建订单
    const action = () => {
      const customer = app.get('customer')
      console.log(this.data.productsData)
      const param = {
        itemDto: this.data.productsData.map(item => ({ ecGoodsId: item.ecGoodsId, count: item.count })),
        customerWxUserId: customer.customer_wx_user_id,
        consignee: this.data.billingAddress.consignee,
        phone: this.data.billingAddress.phone,
        country: this.data.billingAddress.country,
        province: this.data.billingAddress.province,
        city: this.data.billingAddress.city,
        area: this.data.billingAddress.area,
        address: this.data.billingAddress.address,
        remark: this.data.remark || null,
      }
      api.createEcOrder(param).then((res) => {

        const result = res.data
        if (res.code === 0) {
          result.order.actualMoney = (result.order.actualMoney / 100).toFixed(2)
          this.setData({
            showEcPay: true,
            order: result.order,
          })
          this.data.productsData.forEach((item) => {
            api.addInfo({
              openid: customer.openid,
              objectType: 'ec',
              objectId: null,
              goalsType: 0,
              fromType: 0,
              action: 'submit',
              actionGoals: 'order',
              revisitLog: null,
              extre: item.ecProductName + '(' + item.value + ')'
            })
          })
        } else {
          // 如果商品信息有变化
          this.update()
        }
        wx.hideLoading()
      })
    }

    // check是否有收货地址
    if (!this.data.billingAddress) {
      wx.showToast({
        title: '您还没有添加收货地址哦',
        icon: 'none',
      })
      return
    }


    let param = ''
    this.data.productsData.forEach((item) => {
      param += `${item.ecGoodsId}=${(item.price * 100).toFixed(0)}&`
    })
    // check订单商品状态
    api.checkEcProduct(param).then((res) => {
      if (res.code !== 0) {
        wx.hideLoading()
        wx.showModal({
          title: '提示',
          content: res.message,
          confirmText: '继续',
          confirmColor: '#4A8CF2',
          success: (res) => {
            if (res.confirm) {
              this.update()
            }
            if (res.cancel) {
              this.update()
            }
          },
        })
      } else {
        // 开始提交订单
        action()
      }
    })
  },

  // 获取订单快照
  getOrder() {
    wx.showLoading({ title: '加载中' })
    return new Promise((resolve) => {
      const param = {
        orderNum: this.data.ecOrderId,
        customerWxUserId: app.get('customer').customer_wx_user_id,
      }
      api.getOrder(param).then((res) => {
        const result = res.data
        result.order.actualMoney = (result.order.actualMoney / 100).toFixed(2)
        result.order.sum = (result.order.sum / 100).toFixed(2)
        const products = result.orderItemList.map((item) => {
          return {
            count: item.orderItem.count,
            ecProductId: item.ecProduct.id,
            ecGoodsImage: item.ecGoods.ecGoodsImage || item.ecProductImageList[0],
            ecProductName: item.ecProduct.ecProductName,
            value: item.value,
            price: (item.ecGoods.price / 100).toFixed(2),
          }
        })

        let tabbarData = {
          isExistOrder: true,
          isClosedOrder: result.order.status === 0 ? false : true,
        }

        this.setData({
          order: result.order,
          productsData: products,
          billingAddress: result.logistic,
          amount: result.order.sum,
          noticeData: Object.assign({}, result.order, result.logistic),
          tabbarData: tabbarData,
          snapshot: true,
          remark: result.order.remark,
        })
        wx.hideLoading()
        resolve()
      })
    })
  },

  onLoad: function (options) {

    wx.hideLoading()
    if (options.ecOrderId) {
      // 从消息推送进入
      this.setData({ ecOrderId: options.ecOrderId })
      this.getOrder()
    } else {
      // 从小程序进入
      this.getCustomerDefaultAddress()

      const products = []
      Object.keys(getApp().globalData.cart).forEach((key) => {
        products.push(Object.assign({}, getApp().globalData.cart[key], { ecGoodsId: key }))
      })

      let amount = 0
      products.forEach((item) => {
        amount = amount + item.price * item.count
      })

      this.setData({
        productsData: products,
        amount: amount.toFixed(2),
        tabbarData: { isExistOrder: false, isClosedOrder: false, },
        noticeVisible: false,
        snapshot: false,
      })
    }
  },

  onShow() {
    if (app.get('customer').openid && !this.data.snapshot) {
      this.getCustomerDefaultAddress()
    }
    if (this.data.snapshot) {
      this.getOrder()
    }
  },

  onUnload() {
    getApp().globalData.cart = {}
  }

}))