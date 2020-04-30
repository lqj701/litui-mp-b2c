import { environment } from '../config.js'
import simulate from './simulate/index.js'
import { currentRoute } from '../utils/tool'

export function wxLogin() {
  return new Promise((resolve, reject) => {
    if (getApp().globalData.env === 'wxwork') {
      wx.qy.login({
        success: (res) => {
          resolve(res)
        }
      })
    } else {
      wx.login({
        success: (res) => {
          resolve(res)
        }
      })
    }
  })
}

export function wxPayment(data) {
  return new Promise((resolve, reject) => {
    wx.requestPayment({
      timeStamp: data.timeStamp,
      nonceStr: data.nonceStr,
      package: data.package,
      signType: data.signType,
      paySign: data.paySign,
      success: (res) => {
        resolve(res)
      },
      fail: (err) => {
        reject(err)
      },
      complete: (res) => {
        console.log(res)
      }
    })
  })
}

export const request = {

  get(url, data) {
    if (environment === 'mock') {
      return simulate(url, data)
    } else {
      return new Promise((resolve, reject) => {
        const salesToken = getApp().get('salesToken')
        const customer = getApp().get('customer')
        wx.request({
          url,
          method: 'GET',
          data,
          header: {
            Miniprogram: 'true',
            Authorization: salesToken ? `Token salesToken=${salesToken}` : '',
            'App-Type': 'false',
          },
          success: (res) => {
            if (res.statusCode !== 200 || res.data.code === 500) {
              wx.redirectTo({ url: `/pages/timeout/index?url=${currentRoute()}` })
              reject()
            }
            if (res.data.code === 101126 || res.data.code === 101127) {
              wx.redirectTo({ url: `/pages/expired/index` })
              reject()
            }
            console.group('%cGET REQUEST', 'color: #fff;background: #eee;padding: 4px;line-height: 16px;')
            console.log('url: ', url)
            console.log('user: ', { salesToken, customerId: customer.id })
            console.log('params: ', data)
            console.log('result: ', res.data)
            console.groupEnd()
            resolve(res.data)
          }
        })
      })
    }
  },

  post(url, data) {
    if (environment === 'mock') {
      return simulate(url, data)
    } else {
      return new Promise((resolve, reject) => {
        const salesToken = getApp().get('salesToken')
        const customer = getApp().get('customer')
        wx.request({
          url,
          method: 'POST',
          data,
          header: {
            Miniprogram: 'true',
            Authorization: salesToken ? `Token salesToken=${salesToken}` : '',
            'App-Type': 'false',
          },
          success: (res) => {
            if (res.statusCode !== 200 || res.data.code === 500) {
              wx.redirectTo({ url: `/pages/timeout/index?url=${currentRoute()}` })
              reject()
            }
            if (res.data.code === 101126 || res.data.code === 101127) {
              wx.redirectTo({ url: `/pages/expired/index` })
              reject()
            }
            console.group('%cPOST REQUEST', 'color: #fff;background: #eee;padding: 4px;line-height: 16px;')
            console.log('url: ', url)
            console.log('user: ', { salesToken, customerId: customer.id })
            console.log('params: ', data)
            console.log('result: ', res.data)
            console.groupEnd()
            resolve(res.data)
          }
        })
      })
    }
  },

}