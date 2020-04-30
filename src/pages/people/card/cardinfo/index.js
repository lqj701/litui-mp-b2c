import api from '../../../../utils/api'
import { timestamp } from '../../../../utils/tool.js'
import regeneratorRuntime from "../../../../utils/regenerator-runtime";

const app = getApp()

Component({
  properties: {
    cardInfo: {
      type: Object,
      value: {
        bCardId: null,
        browsed: 0,
        support: 0,
        forward: 0,
      },
    },
    supportState: {
      type: Boolean,
      value: false,
      observer(newVal) {
        this.setData({
          supportIcon: newVal ? '/static/icon/like-active.svg' : '/static/icon/like.svg'
        })
      }
    },
  },

  data: {
    supportIcon: '/static/icon/like.svg',
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
    share(e) {
      this.showActionSheet()
      if (e.detail.formId === 'the formId is a mock one') return
      const customerImAccount = app.get('customerImAccount')
      api.sendFormId([{
        account_id: customerImAccount.imAccountId,
        form_id: e.detail.formId,
        type: 1,
      }])
    },
    showActionSheet() {
      this.triggerEvent('showActionSheet')
    },
    async like() {
      const customer = app.get('customer')
      this.setData({
        supportState: !this.data.supportState,
      })
      this.setData({
        ['cardInfo.support']: this.data.supportState ? this.data.cardInfo.support + 1 : this.data.cardInfo.support - 1,
      })
      await api.updateCard(customer.openid, this.data.supportState ? 'support' : 'unsupport')
      api.addInfo({
        openid: customer.openid,
        objectType: 'card',
        objectId: this.data.cardInfo.bCardId,
        goalsType: 0,
        fromType: 0,
        action: this.data.supportState ? 'click' : 'cancel',
        actionGoals: 'support',
        time_order: timestamp(),
        revisitLog: null
      })
    }
  },

})
