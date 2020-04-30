import api from '../../../utils/api'

const app = getApp()

Page({

  data: {
    hasWritePhotosAlbumAuth: true
  },

  saler: {},

  device: {},

  save() {
    wx.canvasToTempFilePath({
      canvasId: 'post',
      success: (res) => {
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success: () => {
            wx.showModal({
              content: '名片海报已保存到手机相册',
              showCancel: false,
            })
          },
          fail: (res) => {
            if (res.errMsg === 'saveImageToPhotosAlbum:fail:auth denied') {
              this.setData({ hasWritePhotosAlbumAuth: false })
              wx.showToast({
                title: '需要授权才可保存海报',
                icon: 'none'
              })
            }
          }
        })
      }
    })
  },

  fetchPostData() {
    return new Promise((resolve) => {
      api.generatePoster().then((res) => {
        this.saler = res.data
        const downloadAvatar = new Promise((resolve) => {
          wx.downloadFile({
            url: this.saler.avatar,
            success: (res) => {
              this.saler.avatar = res.tempFilePath
              resolve()
            },
            fail: () => {
              this.saler.avatar = '/static/icon/avatar.png'
              resolve()
            }
          })
        })
        const downloadQrCode = new Promise((resolve) => {
          wx.downloadFile({
            url: this.saler.qrCode,
            success: (res) => {
              this.saler.qrCode = res.tempFilePath
              resolve()
            },
            fail: () => {
              resolve()
            }
          })
        })

        Promise.all([downloadAvatar, downloadQrCode]).then(() => {
          wx.hideLoading()
          resolve()
        })
      })
    })
  },

  handleArgs(...args) {
    return args.map(arg => this.device.windowWidth / 750 * arg)
  },

  draw() {
    this.fetchPostData().then(() => {
      const ctx = wx.createCanvasContext('post')

      // 绘制背景
      ctx.setFillStyle('rgb(255, 255, 255)')
      ctx.fillRect(0, 0, ...this.handleArgs(670, 940))

      // 绘制海报上半部分背景
      ctx.drawImage('/static/image/cardbg.png', ...this.handleArgs(0, 0, 670, 360))

      // 绘制销售头像
      ctx.drawImage(this.saler.avatar, ...this.handleArgs(480, 60, 150, 150))

      // 绘制销售文字信息
      ctx.setTextBaseline('top')
      ctx.setFillStyle('#2D3034')
      ctx.setFontSize(...this.handleArgs(40))
      ctx.fillText(this.saler.name, ...this.handleArgs(40, 60))
      ctx.setFillStyle('rgba(0,0,0,0.45)')
      ctx.setFontSize(...this.handleArgs(28))
      ctx.fillText(this.saler.position, ...this.handleArgs(40, 124))
      if (this.saler.phone1 || this.saler.phone2) {
        ctx.fillText(this.saler.phone1 || this.saler.phone2, ...this.handleArgs(40, 168))
        this.saler.email && ctx.fillText(this.saler.email, ...this.handleArgs(40, 212))
      } else {
        this.saler.email && ctx.fillText(this.saler.email, ...this.handleArgs(40, 168))
      }
      ctx.fillText(this.saler.corpName, ...this.handleArgs(40, 272))
      ctx.setFillStyle('rgb(0,0,0)')

      // 绘制海小程序码
      ctx.setFontSize(...this.handleArgs(28))
      ctx.setTextAlign('center')
      ctx.drawImage(this.saler.qrCode, ...this.handleArgs(155, 440, 360, 360))
      ctx.fillText('长按小程序码，进入我的名片', ...this.handleArgs(335, 832))

      // 开始绘制
      ctx.draw()
    })
  },

  settingResult(res) {
    if (res.detail.authSetting['scope.writePhotosAlbum'] === true) {
      this.setData({ hasWritePhotosAlbumAuth: true })
    }
  },

  onReady() {
    wx.showLoading({ title: '正在生成海报' })

    wx.getSystemInfo({
      success: (res) => {
        this.device = {
          windowWidth: res.windowWidth,
          windowHeight: res.windowHeight,
        }
        this.draw()
      }
    })

    wx.getSetting({
      success: (res) => {
        this.setData({ hasWritePhotosAlbumAuth: res.authSetting['scope.writePhotosAlbum'] === false ? false : true })
      }
    })
  },

})