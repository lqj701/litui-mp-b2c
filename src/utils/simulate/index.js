import simulate from './simulate'
import { HOST, IMHOST, PAY_GATEWAY } from '../../config'

export default function (url, data) {
  let result = null
  console.log(url)

  switch (true) {
    // 用户登录
    case /login/.test(url):
      result = simulate({
        code: 0,
        message: "success",
        data: {
          country: "China",
          mpName: "爱客名片",
          unionid: "",
          gender: 1,
          city: "Pudong New District",
          customer_wx_user_id: null,
          weixinid: "",
          phone2: "",
          created_at: 1528771760000,
          language: "zh_CN",
          source: 0,
          orgId: 1,
          phone1: "",
          province: "Shanghai",
          updated_at: 1530238288000,
          im_password: "",
          nickname: "TechOtaku",
          id: 25,
          isSet: true,
          openid: "oQprx5GMpIvu72zRwMYIZr3czDjM",
          is_visitor: null,
          bindphone: "",
          wx_organization_id: 1,
          im_password_expired_at: null,
          set_info: true,
          firstOpen: null,
          avatar_url: "https://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTIp74WkwE6OChOtfzAnkC8G0DuQMdc1blcU7G5iaIchguEicNlP3tVxwicxuJxfkyVibjV93UIayys7hg/132",
          im_account: ""
        }
      })
      break
    // 购物车列表
    case /getCartList/.test(url):
      result = simulate({
        code: 0,
        message: "success",
        data: {
          ecCartList: [
            {
              ecCart: {
                count: 2,
                createdAt: 1531101496000,
                customerWxUserId: 1,
                ecGoodsId: 1,
                id: 1,
                updatedAt: 1531101496000
              },
              ecGoods: {
                createdAt: 1529391060000,
                ecGoodsImage: "",
                ecProductId: 1,
                id: 1,
                onSale: false,
                price: 110,
                skuNumber: "",
                updatedAt: 1529391060000
              },
              ecProduct: {
                canBuy: true,
                createdAt: 1529391059000,
                ecProductName: "小郝",
                ecShopId: 1,
                id: 1,
                onSale: true,
                onSaleAt: 1530169854000,
                spuNumber: "",
                updatedAt: 1531102456000
              },
              goodsStatus: 0  // 0: 商品没有失效 1：不支持在线交易；2：商品不存在；3：商品下架；4：商品规格不存在；5：商品售罄
            }
          ],
          hasNext: 0,
          page: 1,
          row: 99,
          total: 1
        }
      }, { ecCartList: 10 })
      break
    // 默认名片
    case /getDefaultCardList/.test(url):
      result = simulate({
        code: 0,
        message: "success",
        data: {
          customerCardDtoList: [{
            access_token: "",
            avatar: "http://p.qlogo.cn/bizmail/RjNmHic6V7hkWYzW7Ht3QUmERAYI66N2MrwqdiauWSPdPHthArswa6zg/100",
            corp_name: "ww",
            get_time: null,
            get_way: "",
            id: 96,
            im_account: "bs_140",
            name: "游美清",
            phone1: "",
            phone2: "",
            position: "",
            wx_user_id: 140
          }],
          total: 1,
          hasNext: 0,
          page: 1,
          row: 20
        }
      }
        , { ecCartList: 10 })
      break
    default:
      result = '不匹配哦'
      break
  }

  return new Promise((resolve) => {
    resolve(result)
  })
}