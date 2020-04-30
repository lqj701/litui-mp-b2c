## Button 按钮

### 使用指南
在 json 文件中配置button组件
```json
"usingComponents": {
  "x-button": "path/to/mpx/button/index"
}
```

> 问：为什么不在button中内置icon？
> 答：奇葩产品有时候会让icon放置在button中的任意一个位置，所以组件把icon内置固定在左边或右边可能并没什么卵用。。


### 代码演示

#### 按钮类型
支持`default`、`primary`两种类型，默认为`default`

```html
<x-button type="default">默认按钮</x-button>
<x-button type="primary">主要按钮</x-button>
```

#### 不显示边框

```html
<x-button type="default" borderless>默认按钮</x-button>
```

#### 按钮尺寸
支持`normal`、`small`两种尺寸，默认为`normal`

```html 
<x-button size="normal">普通按钮</x-button>
<x-button size="small">小型按钮</x-button>
```

#### 禁用状态
通过`disabled`属性来禁用按钮，此时按钮不可点击

```html
<x-button disabled>禁用状态</x-button>
```

#### 获取 formid
通过`needFormId`属性来指定按钮可以获取formid

```html
<x-button needFormId bind:submit='submit'>FormId</x-button>
```

#### 微信开放能力
通过`openType`属性实现微信开放能力（提示：企业小程序才可以获取到手机号哦）

```html
<x-button openType='getUserInfo' bind:getuserinfo='getuserinfo'>获取用户信息</x-button>
<x-button openType='getPhoneNumber' bind:getphonenumber='getphonenumber'>获取用户手机号</x-button>
```

### API

| 参数       | 说明                                   | 类型      | 默认值    |
| ---------- | -------------------------------------- | :-------: | :-------: |
| type       | 按钮类型，可选值为 `primary` `warning` | `String`  | `default` |
| size       | 按钮尺寸，可选值为 `normal` `small`    | `String`  | `normal`  |
| needFormId | 是否需要 FormId                       | `Boolean` | `false`   |
| borderless | 是否显示边框                          | `Boolean` | `true`    |
| disabled   | 是否禁用                               | `Boolean` | `false`   |
| openType   | 微信开放能力                           | `String`  | -         |

### Event

| 事件名              | 说明                                     | 参数  |
| ------------------- | ---------------------------------------- | :---: |
| bind:click          | 点击按钮且按钮状态不为加载或禁用时触发   | -     |
| bind:getuserinfo    | 用户点击该按钮时，会返回获取到的用户信息 | -     |
| bind:getphonenumber | 获取用户手机号回调                       | -     |
| bind:submit         | 获取formid                               | -     |


### 外部样式类

暂不支持
