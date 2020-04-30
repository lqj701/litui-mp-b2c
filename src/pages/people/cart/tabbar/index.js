Component({
  properties: {
    state: {
      type: String,
      value: 'billing'
    },
    selectAll: {
      type: Boolean,
      value: false
    },
    amount: {
      type: String,
      value: 0,
      observer: '_amount'
    },
    selectProducts: {
      type: Array,
      value: [],
      observer: '_selectProducts'
    }
  },

  data: {
    billingClassName: 'billing billing--close',
    editClassName: 'edit edit--close'
  },

  methods: {
    _selectProducts(newVal) {
      if (newVal.length > 0) {
        if (this.data.state === 'billing') {
          this.setData({
            billingClassName: 'billing'
          })
        }
        if (this.data.state === 'edit') {
          this.setData({
            editClassName: 'edit'
          })
        }
      } else {
        this.setData({
          billingClassName: 'billing billing--close',
          editClassName: 'edit edit--close',
        })
      }
    },
    _amount(newVal) {
      if (!newVal) return
      this.setData({
        amount: Number(newVal).toFixed(2)
      })
    },
    selectAll() {
      this.triggerEvent('selectAll')
    },
    deleteProducts() {
      if (this.data.editClassName === 'edit') {
        wx.showModal({
          title: '提示',
          content: '确定要删除所选商品吗？',
          confirmText: '确定',
          confirmColor: '#4A8CF2',
          success: (res) => {
            if (res.confirm) {
              this.triggerEvent('deleteProducts')
            }
          }
        })
      }
    },
    billing() {
      if (this.data.billingClassName === 'billing') {
        this.triggerEvent('billing')
      }
    }
  }
})
