Component({
  properties: {
    address: {
      type: Object,
      value: {},
      observer: '_address'
    }
  },

  data: {

  },

  methods: {
    _address(newVal, oldVal) { },
    setDefault(e) {
      this.triggerEvent('setDefault', { id: e.target.dataset.id })
    },
    editAddress(e) {
      this.triggerEvent('editAddress', { id: e.target.dataset.id })
    },
    deleteAddress(e) {
      this.triggerEvent('deleteAddress', { id: e.target.dataset.id })
    },
    selectAddress(e) {
      this.triggerEvent('selectAddress', { id: e.target.dataset.id })
    }
  }
})
