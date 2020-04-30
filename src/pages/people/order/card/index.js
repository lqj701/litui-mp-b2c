import { formatTime } from '../../../../utils/tool.js'

Component({

  properties: {
    order: {
      type: Object,
      value: {},
      observer: '_order'
    }
  },

  data: {
    amount: '0.00',
    orderStatus: ''
  },

  methods: {
    _order(newVal) {
      let order = newVal
      switch (order.order.status) {
        case 0:
          this.setData({
            orderStatus: '待付款'
          })
          break
        case 1:
          this.setData({
            orderStatus: '待发货'
          })
          break
        case 2:
          this.setData({
            orderStatus: '已发货'
          })
          break
        case 3:
          this.setData({
            orderStatus: '已关闭'
          })
          break
        case 4:
          this.setData({
            orderStatus: '已完成'
          })
          break
        default:
          this.setData({
            orderStatus: '获取订单状态失败'
          })
      }

      order.order.createdAt = formatTime(order.order.createdAt)
      order.orderItemList.forEach((item) => {
        item.ecGoods.price = (item.ecGoods.price / 100).toFixed(2)
        item.ecGoods.ecGoodsImage = item.ecGoods.ecGoodsImage
      })
      this.setData({
        order: order,
        amount: (order.order.sum / 100).toFixed(2),
      })
    },
    makePayment() {
      // wx.navigateTo({
      //   url: `/pages/people/billing/index?ecOrderId=${this.data.order.order.orderNum}`,
      // })
    },
    goBilling() {
      wx.navigateTo({
        url: `/pages/people/billing/index?ecOrderId=${this.data.order.order.orderNum}`,
      })
    }
  },
})
