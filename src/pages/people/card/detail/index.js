import api from '../../../../utils/api'
import { timestamp } from '../../../../utils/tool';

const app = getApp()

Component({
  properties: {
    detail: {
      type: Object,
      value: {},
      observer(newVal) {
        if (newVal === null) return
        let listContent = []
        Object.keys(newVal).forEach((value, index) => {
          switch (value) {
            case 'phone1':
              newVal.phone1 && listContent.push({ id: index, title: '电话：', detail: newVal.phone1, icon: '/static/icon/phone.svg' })
              break
            case 'phone2':
              newVal.phone2 && listContent.push({ id: index, title: '电话：', detail: newVal.phone2, icon: '/static/icon/phone.svg' })
              break
            case 'email':
              newVal.email && listContent.push({ id: index, title: '邮箱：', detail: newVal.email, icon: '/static/icon/email.svg' })
              break
            case 'weixinid':
              newVal.weixinid && listContent.push({ id: index, title: '微信：', detail: newVal.weixinid, icon: '/static/icon/wechat.svg' })
              break
            case 'company':
              newVal.company && listContent.push({ id: index, title: '公司：', detail: newVal.company, icon: '/static/icon/company.svg' })
              break
            case 'address':
              newVal.address && listContent.push({ id: index, title: '地址：', detail: newVal.address, icon: '/static/icon/home.svg' })
              break
            default:
              break
          }
        })
        this.setData({
          visible: listContent.length,
          listContent
        })
      }
    },
  },

  data: {
    visible: false,
    listContent: []
  },

  methods: {
    onClickItem(e) {
      const item = e.detail.dataset.item
      switch (item.title) {
        case '电话：':
          wx.makePhoneCall({
            phoneNumber: item.detail,
            success: () => {
              this.addInfo('call', 'tel')
            }
          })
          break
        case '邮箱：':
        case '微信：':
          wx.setClipboardData({
            data: item.detail,
            success: () => {
              wx.showToast({ title: '复制成功' })
              this.addInfo('copy', item.title === '邮箱：' ? 'email' : 'weixin')
            }
          })
          break
        case '地址：':
          this.addInfo('read', 'address')
          wx.navigateTo({ url: `/pages/map/index?company=${this.data.detail.company}&address=${this.data.detail.address}` })
          break
        case '电话':
          break
        default:
          break
      }
    },
    onClickAction() {
      wx.addPhoneContact({
        firstName: this.data.detail.name,
        mobilePhoneNumber: this.data.detail.phone1,
        workPhoneNumber: this.data.detail.phone2,
        email: this.data.detail.email,
        weChatNumber: this.data.detail.weixinid,
        organization: this.data.detail.company,
        title: this.data.detail.position,
        success: () => {
          this.addInfo('save', 'bcard')
        }
      })
    },
    onSubmit(e) {
      if (e.detail.formId === 'the formId is a mock one') return
      const customerImAccount = app.get('customerImAccount')
      api.sendFormId([{
        account_id: customerImAccount.imAccountId,
        form_id: e.detail.formId,
        type: 1,
      }])
    },
    addInfo(action, actionGoals) {
      api.addInfo({
        openid: app.get('customer').openid,
        objectType: 'card',
        objectId: this.data.detail.bCardId,
        goalsType: 0,
        fromType: 0,
        action,
        actionGoals,
        time_order: timestamp(),
        revisitLog: null
      })
    },
  },

})
