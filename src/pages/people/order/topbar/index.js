Component({
  properties: {
    activeTab: {
      type: Number,
      value: 0,
      observer: '_activeTab'
    }
  },

  data: {
    nav0ClassName: 'nav nav--active',
    nav1ClassName: 'nav',
    nav2ClassName: 'nav',
    nav3ClassName: 'nav',
    preActiveTab: 0,
  },

  methods: {
    _activeTab(newVal) {
      this.setData({
        [`nav${newVal}ClassName`]: 'nav nav--active',
        [`nav${this.data.preActiveTab}ClassName`]: 'nav',
      })
    },
    switchTab(e) {
      if (e.target.dataset.index !== String(this.data.activeTab)){
        this.setData({
          preActiveTab: this.data.activeTab
        })
        this.triggerEvent('switchTab', { index: e.target.dataset.index })
      }
    }
  }
})
