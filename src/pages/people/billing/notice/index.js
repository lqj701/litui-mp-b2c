import { timestamp } from '../../../../utils/tool.js'

const DELIVER = [
  '申通快递',
  '圆通速递',
  '中通快递',
  '韵达快递',
  '天天快递',
  '百世快递',
  '顺丰速运',
  '邮政快递包裹',
  'EMS经济快递',
  'EMS',
  '邮政平邮',
  '德邦快递',
  '联昊通',
  '全峰快递',
  '全一快递',
  '城市100',
  '汇强快递',
  '广东EMS',
  '速尔',
  '飞康达速运',
  '宅急送',
  '联邦快递',
  '德邦物流',
  '中铁快运',
  '信丰物流',
  '龙邦速递',
  '天地华宇',
  '快捷速递',
  '新邦物流',
  '能达速递',
  '优速快递',
  '国通快递',
  '其他',
  '顺丰快递',
  'AAE',
  '安信达',
  '百福东方',
  'BHT',
  '邦送物流',
  '传喜物流',
  '大田物流',
  'D速快递',
  '递四方',
  '飞康达物流',
  '飞快达',
  '如风达',
  '风行天下',
  '飞豹快递',
  '港中能达',
  '广东邮政',
  '共速达',
  '汇通快运',
  '华宇物流',
  '恒路物流',
  '华夏龙',
  '海航天天',
  '海盟速递',
  '华企快运',
  '山东海红',
  '佳吉物流',
  '佳怡物流',
  '加运美',
  '京广速递',
  '急先达',
  '晋越快递',
  '捷特快递',
  '金大物流',
  '嘉里大通',
  '康力物流',
  '跨越物流',
  '龙邦物流',
  '蓝镖快递',
  '隆浪快递',
  '门对门',
  '明亮物流',
  '全晨快递',
  '全际通',
  '全日通',
  '如风达快递',
  '三态速递',
  '盛辉物流',
  '速尔物流',
  '盛丰物流',
  '上大物流',
  '赛澳递',
  '圣安物流',
  '穗佳物流',
  '优速物流',
  '万家物流',
  '万象物流',
  '新蛋奥硕物流',
  '香港邮政',
  '运通快递',
  '远成物流',
  '亚风速递',
  '一邦速递',
  '源伟丰快递',
  '元智捷诚',
  '越丰物流',
  '源安达',
  '原飞航',
  '忠信达快递',
  '芝麻开门',
  '银捷速递',
  '中邮物流',
  '中速快件',
  '中天万运',
  '河北建华',
  '乐捷递',
  '立即送',
  '通和天下',
  '微特派',
  '一统飞鸿',
  '郑州建华',
  '山西红马甲',
  '陕西黄马甲',
  '快速递',
  '安能物流',
  '新顺丰',
  '钱报速运',
  '日日顺',
  '神盾快运',
  '京华亿家',
  '南方传媒物流',
  '成都商报物流',
  '冻到家物流',
  '亚马逊物流',
  '京东快递',
  'e邮宝',
  '思迈',
  'UPS',
  '南京100',
  '民航快递',
  '贝海国际速递',
  'CJ物流',
  '央广购物',
  '易时联国际速递',
  '风先生',
  '耀启物流',
  '内蒙EMS',
  '小红帽',
  'PCA',
  '诚义物流',
  '秦远国际物流',
  '万家康快递',
  '澳邮中国快运',
  '一号线国际速递',
  'EWE国际物流',
  '爱送配送',
  'POSTNZ',
  'FASTGO',
  '天越物流',
  '德中物流',
  '行必达',
  'EFS快递',
  '中邮速递'
];

Component({
  properties: {
    order: {
      type: Object,
      value: {},
      observer: '_order'
    },
    snapshot: {
      type: Boolean,
      value: false,
    },
  },

  data: {
    title: '',
    detail: '',
    isPay: false,
    remainTime: '0小时0分0秒',
  },

  methods: {
    _order(newVal) {
      let order = newVal
      if (order === null) return
      switch (order.status) {
        case 0:
          this.remainTime(order.createdAt)
          this.setData({
            title: '待付款',
            isPay: false,
          })
          break
        case 1:
          this.setData({
            title: '待发货',
            detail: '商户正在打包商品，客官请稍等',
            isPay: true,
          })
          break
        case 2:
          let logistic = ''
          if (order.needed) {
            logistic = DELIVER[order.logisticWay] + ' ' + order.logisticNum
          } else {
            logistic = '此商品不需要物流，由商家亲自护送'
          }
          this.setData({
            title: '已发货',
            detail: `物流详情：${logistic}`,
            isPay: true,
          })
          break
        case 3:
          this.setData({
            title: '已关闭',
            detail: '订单已关闭，去看看其他商品吧',
            isPay: true,
          })
          break
        case 4:
          this.setData({
            title: '已完成',
            detail: '该订单已完成',
            isPay: true,
          })
          break
      }
    },
    remainTime(start) {
      clearInterval()
      setInterval(() => {
        const interval = 1000 * 60 * 60 * 2 // 2小时
        const currentTime = timestamp()
        const remainTime = interval - (currentTime - start)
        const hour = Math.floor(remainTime / (1000 * 60 * 60))
        const minute = Math.floor((remainTime - (hour * (1000 * 60 * 60))) / (1000 * 60))
        const second = Math.floor((remainTime - (hour * (1000 * 60 * 60)) - (minute * 1000 * 60)) / 1000)
        if (hour === 0 && minute === 0 && second === 0) {
          this.triggerEvent('orderClosed')
          clearInterval()
          return
        }
        this.setData({
          remainTime: `${hour}小时${minute}分${second}秒`
        })
      }, 1000)
    }
  },

  detached() {
    clearInterval()
  }
})
