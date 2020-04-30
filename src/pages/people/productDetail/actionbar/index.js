import api from '../../../../utils/api'
import regeneratorRuntime from "../../../../utils/regenerator-runtime";

const app = getApp()

Component({

  properties: {
    data: {
      type: Object,
      value: {
        support: 0,
        forward: 0,
        openId: null,
        supportState: false,
        shareDefaultValue: ''
      }
    },
    supportState: {
      type: Boolean,
      value: false,
      observer(newVal) {
        this.setData({
          likeIcon: newVal ? '/static/icon/like-active.svg' : '/static/icon/like.svg',
          supportTextColor: newVal ? '#4a8cf2' : 'rgba(0, 0, 0, 0.45)'
        })
      }
    }
  },

  data: {
    likeIcon: '/static/icon/like.svg',
    supportTextColor: 'rgba(0, 0, 0, 0.45)',
    editShare: false,
    shareValue: '',
  },

  methods: {
    formSubmit(e) {
      if (e.detail.formId === 'the formId is a mock one') return
      const customerImAccount = app.get('customerImAccount')
      api.sendFormId([{
        account_id: customerImAccount.imAccountId,
        form_id: e.detail.formId,
        type: 1,
      }])
    },
    support() {
      this.triggerEvent('support')
    },
    showShareModal() {
      this.triggerEvent('showShareModal')
    }
  },
})
