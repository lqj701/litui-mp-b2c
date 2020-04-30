Component({

  properties: {
    header: {
      type: String,
      value: ''
    },
    content: {
      type: Array,
      value: []
    },
    icon: {
      type: String,
      value: ''
    },
    iconPosition: {
      type: String,
      value: 'left',
    },
    action: {
      type: String,
      value: ''
    }
  },

  methods: {
    onClickItem(e) {
      this.triggerEvent('clickItem', e.currentTarget)
    },
    onClickAction(e) {
      console.log(e)
      this.triggerEvent('clickAction', e.currentTarget)
    },
    onSubmit(e) {
      this.triggerEvent('submit', e.detail)
    }
  }

})
