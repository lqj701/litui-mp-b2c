Component({
  properties: {
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
    _count(newVal, oldVal) {
      this.setData({
        countLeftClassName: newVal <= 1 ? 'count-left' : 'count-left count-left--active',
        countRightClassName: 'count-right count-right--active',
      })
    },
    add() {
      this.triggerEvent('addCount')
    },
    minus() {
      this.triggerEvent('minusCount')
    }
  }
})
