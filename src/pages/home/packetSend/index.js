import api from '../../../utils/api.js'
import { wxPayment } from '../../../utils/wx.js';
import { PAY_GATEWAY } from '../../../config.js';

Page({
  data: {
    command: null,
    num: null,
    message: '',
    service: '0.00',
    total: '0.00',
    disableSendPacket: true,
  },

  //输入总金额
  commandInput: function (e) {
    let command = e.detail.value;
    let re = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/;
    let service = 0
    //计算服务费 1%
    if (command == '') {
      service = '0.00'
    } else if (command >= 0.01 && command <= 1) {
      service = '0.01'
    } else {
      service = Math.ceil((Number(command) / 100).toFixed(3) * 100) / 100
    }

    if (re.test(command) || command == '') {
      this.setData({
        service: service,
      })
    }

    //计算金额
    let nums = new Number(command) + new Number(this.data.service);
    let total = nums.toFixed(2);

    if (command != "") {
      if (re.test(command)) {
        this.setData({
          command: command,
          total: total,
          disableSendPacket: false
        })
      }
    }

    if (command === null || command === '' || !re.test(command)) {
      this.setData({
        total: '0.00',
        disableSendPacket: true
      })
    }
  },

  //红包个数
  numInput: function (e) {
    let _this = this;

    let command = _this.data.command;
    _this.setData({
      num: e.detail.value,
    })
  },

  //文本输入
  messageInput: function (e) {
    let _this = this;

    _this.setData({
      message: e.detail.value
    })
  },

  bindSendPacketClick: function (e) {
    let formId = e.detail.formId
    let _this = this;

    let re = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/;
    let command = _this.data.command;
    let num = _this.data.num;
    let siglePacket = command / num;
    let regNum = re.test(num);

    let string = '';

    if (num === null || num === '') {
      string = '请输入红包个数';
      _this.pop(string);
    } else if (num == 0) {
      string = '红包个数不能为0哦';
      _this.pop(string);
    } else if (!regNum) {
      string = '红包个数格式不正确哦';
      _this.pop(string);
    } else if (command > 1000) {
      string = '最多发1000元红包哦';
      _this.pop(string);
    } else if (siglePacket < 0.01 || siglePacket == 0) {
      string = '每个红包至少0.01元';
      _this.pop(string);
    } else {
      _this.makePayment(formId);
    }
  },

  //弹出对话框的方法
  pop: function (string) {
    wx.showModal({
      title: '提示',
      content: string,
      confirmText: '确定',
      showCancel: false,
    })
  },

  makePayment: function (formId) {
    wx.showLoading({ title: '处理中', mask: true })
    let params = {
      customer_id: app.get('customer').id,
      form_id: formId,
      amount: this.data.command,
      serviceCharge: this.data.service,
      count: this.data.num,
      message: this.data.message || '恭喜发财, 大吉大利',
      success_url: PAY_GATEWAY
    }

    api.sendRedpacket(params)
      .then((res) => {

        if (res.code !== 0) {
          wx.hideLoading()
          this.pop(res.message);
          return
        }

        this.setData({
          orderId: res.data.redpacket.redpacket_order,
          redpacketId: res.data.redpacket.id,
        })

        api.redpacketGateway(res.data.order)
          .then((res) => {

            if (res.code !== 0) {
              wx.hideLoading()
              this.pop(res.message);
              return
            }

            const paymentParam = {
              timeStamp: res.data.credential.wx_lite.timeStamp,
              nonceStr: res.data.credential.wx_lite.nonceStr,
              package: res.data.credential.wx_lite.package,
              signType: res.data.credential.wx_lite.signType,
              paySign: res.data.credential.wx_lite.paySign,
            }

            wx.hideLoading()
            // this.goPacket()
            wxPayment(paymentParam).then((res) => {
              this.goPacket()
            })

          })
      })

  },

  goPacket: function () {
    wx.navigateTo({
      url: `/pages/home/hongbaoDetail/index?orderId=${this.data.orderId}&redpacketId=${this.data.redpacketId}&customerId=${app.get('customer').id}&firstView=true`,
    })
  },

})