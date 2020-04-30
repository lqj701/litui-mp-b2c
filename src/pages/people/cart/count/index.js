Component({
  properties: {
    ecGoodsId: {
      type: Number,
      value: 0,
    },
    count: {
      type: Number,
      value: 1,
      observer: '_count'
    },
    total: {
      type: Number,
      value: 0,
    }
  },

  data: {
    countLeftClassName: 'count-left',
    countRightClassName: 'count-right count-right--active',
  },

  methods: {
    _count(newVal) {
      this.setData({
        countLeftClassName: newVal <= 1 ? 'count-left' : 'count-left count-left--active',
        countRightClassName: 'count-right count-right--active',
      })
    },
    add() {
      this.triggerEvent('addCount', { id: this.data.ecGoodsId }, { bubbles: true, composed: true })
    },
    minus() {
      this.triggerEvent('minusCount', { id: this.data.ecGoodsId }, { bubbles: true, composed: true })
    }
  }
})
