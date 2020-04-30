import api from '../../../utils/api.js'

const app = getApp()

Page({

  data: {
    region: ['', '', ''],
    province: '',
    city: '',
    area: '',
    saveClassName: 'save',
    consignee: '',
    phone: '',
    address: '',
    isUpdate: false,
  },

  onRegionChange(e) {
    const region = e.detail.value
    this.setData({
      province: region[0],
      city: region[1],
      area: region[2],
    })
    this.setData({
      saveClassName: (this.data.province && this.data.area && this.data.consignee && this.data.phone && this.data.address) ? 'save save--active' : 'save',
    })
  },

  onInputConsignee(e) {
    this.setData({
      consignee: e.detail.value,
    })
    this.setData({
      saveClassName: (this.data.province && this.data.area && this.data.consignee && this.data.phone && this.data.address) ? 'save save--active' : 'save',
    })
  },

  onInputPhone(e) {
    this.setData({
      phone: e.detail.value,
    })
    this.setData({
      saveClassName: (this.data.province && this.data.area && this.data.consignee && this.data.phone && this.data.address) ? 'save save--active' : 'save',
    })
  },

  onInputAddress(e) {
    this.setData({
      address: e.detail.value,
    })
    this.setData({
      saveClassName: (this.data.province && this.data.area && this.data.consignee && this.data.phone && this.data.address) ? 'save save--active' : 'save',
    })
  },

  addCustomerAddress() {
    if (this.data.province && this.data.area && this.data.consignee && this.data.phone && this.data.address) {
      const customer = app.get('customer')
      const param = {
        wxOrganizationId: customer.orgId,
        openId: customer.openid,
        consignee: this.data.consignee,
        phone: this.data.phone,
        country: '中国',
        province: this.data.province,
        city: this.data.city,
        area: this.data.area,
        address: this.data.address,
      }
      api.addCustomerAddress(param).then((res) => {
        wx.navigateBack()
      })
    }
  },

  updateCustomerAddress() {
    if (this.data.province && this.data.area && this.data.consignee && this.data.phone && this.data.address) {
      const customer = app.get('customer')
      const param = {
        customerAddressId: this.data.id,
        wxOrganizationId: customer.orgId,
        consignee: this.data.consignee,
        phone: this.data.phone,
        country: '中国',
        province: this.data.province,
        city: this.data.city,
        area: this.data.area,
        address: this.data.address,
      }
      api.updateCustomerAddress(param).then((res) => {
        wx.navigateBack()
      })
    }
  },

  onLoad(options) {
    if (options.update) {
      this.setData({ isUpdate: true, })
      const selectedAddress = app.get('selectedAddress')
      this.setData({
        id: selectedAddress.id,
        province: selectedAddress.province,
        city: selectedAddress.city,
        area: selectedAddress.area,
        consignee: selectedAddress.consignee,
        phone: selectedAddress.phone,
        address: selectedAddress.address,
      })
    }
    wx.hideLoading()
  },

})