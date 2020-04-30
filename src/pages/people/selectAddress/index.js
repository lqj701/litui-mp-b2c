import api from '../../../utils/api.js'

const app = getApp()

Page({

  data: {
    address: [],
    isNull: false,
  },

  selectAddress(e) {
    app.dispatch('updateBillingAddress', this.data.address.find(item => item.id === e.detail.id))
    wx.navigateBack()
  },

  setDefault(e) {
    const param = {
      customerAddressId: e.detail.id,
      wxOrganizationId: app.get('customer').orgId,
      enable: true,
    }
    api.enableCustomerAddress(param).then(() => {
      this.getCustomerAddress()
    })
  },

  editAddress(e) {
    app.dispatch('updateSelectedAddress', this.data.address.find(item => e.detail.id === item.id))
    wx.navigateTo({
      url: `/pages/people/editAddress/index?update=true`,
    })
  },

  deleteAddress(e) {
    const addressId = e.detail.id
    wx.showModal({
      title: '提示',
      content: '确定要删除这个地址吗？',
      success: (e) => {
        if (e.confirm) {
          api.deleteCustomerAddress({ customerAddressId: addressId, wxOrganizationId: app.get('customer').orgId }).then(() => {
            this.getCustomerAddress().then(() => {
              if (this.data.address.length === 0 || (getApp().globalData.ecAddress && addressId === getApp().globalData.ecAddress.id)) {
                getApp().globalData.ecAddress = null
              }
            })
          })
        }
      }
    })
  },

  addAddress() {
    if (this.data.address.length < 10) {
      wx.navigateTo({
        url: '/pages/people/editAddress/index',
      })
    } else {
      wx.showToast({
        title: '最多保存10个收货地址',
        icon: 'none',
      })
    }
  },

  getCustomerAddress() {
    const customer = app.get('customer')
    const param = {
      wxOrganizationId: customer.orgId,
      openId: customer.openid,
    }
    return new Promise((resolve) => {
      api.getCustomerAddress(param).then((res) => {
        let result = res.data
        if (result.length === 0) {
          this.setData({ isNull: true })
          resolve()
          return
        } else {
          this.setData({ isNull: false })
        }
        const defaultAddress = result.find(item => item.enable === true)
        const defaultAddressIndex = result.findIndex(item => item.enable === true)
        result.unshift(defaultAddress)
        result.splice(defaultAddressIndex + 1, 1)
        this.setData({
          address: result
        })
        resolve()
      })
    })
  },

  onLoad: function () {
    this.getCustomerAddress()
  },

  onShow: function () {
    this.getCustomerAddress()
  },

})