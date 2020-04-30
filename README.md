# 励推小程序

## 简介

励推小程序分为企业小程序版本和独立小程序版本，拥有名片展示，即时通讯，商城购物等功能。

## 启动项目

`git clone ssh://gitlab@gitlab.ikcrm.com:40022/ikd/litui-mp-b2c.git`

`npm install`

`npm run dev`

用微信开发者工具新建项目，项目路径为 /dist（appid 可在开发者工具 -> 详情 中修改）

## 开发须知

优先阅读小程序开发文档，小程序文档里没有的尽量不用，尽可能不造轮子以保证小程序性能。

## 小程序配置

### 企业小程序

| 环境    | 名称                   | appid              | 账号                 |
| ------- | ---------------------- | ------------------ | -------------------- |
| Dev     | 爱客名片               | wxe2d8e74ad41fc8a8 | 18428362926@163.com  |
| Test    | CS名片                 | wx620c46d3eacf003b | denghuang@ikcrm.com  |
| Staging | 爱客名片               | wx0828ab517e1e9fcc | litui003@163.com     |
| Prod    | 爱励推名片(励推微名片) | wx212a11ae3f0952d8 | 18428362926@sohu.com |

### 单小程序

| 环境    | 名称         | appid              | 账号                  |
| ------- | ------------ | ------------------ | --------------------- |
| Dev     | 上海励销名片 | wx5af7ee7e555e80d6 | d1842834@yeah.net     |
| Test    | 深圳励推名片 | wxe3fd6d37ef65f913 | 15000249334@126.com   |
| Staging | 杭州励销名片 | wx27a18b5be4912fb8 | d15000249334@yeah.net |
| Prod    | 励推名片     | wxacc7a7294c461fbf | denghuang@aliyun.com  |


## 常用api链接

- 项目配置
  - [项目配置文件 project.config.json](https://developers.weixin.qq.com/miniprogram/dev/devtools/projectconfig.html)

- 解决问题
  - [开发者社区](https://developers.weixin.qq.com/community/develop)