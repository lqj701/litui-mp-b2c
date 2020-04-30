import { formatTime } from '../../../../utils/tool.js'

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
    }
  },

  data: {
    ecOrderId: '',
    createdTime: '',
    paidTime: '',
  },

  methods: {
    _order(newVal) {
      if (newVal === null) return
      this.setData({
        ecOrderId: newVal.orderNum,
        createdTime: newVal.createdAt ? formatTime(newVal.createdAt) : '',
        paidTime: newVal.paidAt ? formatTime(newVal.paidAt) : '',
      })
    }
  }

})
