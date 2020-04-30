## Image 图片

### 使用指南
在 json 文件中配置cell组件
```json
"usingComponents": {
  "x-image": "path/to/mpx/image/index"
}
```

### 代码演示

#### 添加图片地址（记得添加可信域名哦）

```html
<x-image src="image.png"></x-image>
```

#### 指定图片高度和宽度

```html
<x-image src="image.png" width="600rpx" width="300rpx"></x-image>
```

#### 图片裁剪、缩放的模式 [查看详情][1]

```html
<x-image src="image.png" mode='scaleToFill'></x-image>
```

#### 指定图片圆角

```html
<x-image src="image.png" radius='100%'></x-image>
<x-image src="image.png" radius='36rpx'></x-image>
```

#### 点击预览图片

```html
<x-image src="image.png" preview></x-image>
```


### API

| 参数    | 说明                                | 类型      | 默认值       |
| ------- | ----------------------------------- | :-------: | :----------: |
| src     | 指定图片链接                        | `String`  | -            |
| width   | 指定图片宽度（不指定时为原图宽度）  | `String`  | `0rpx`       |
| height  | 指定图片高度（不指定时为原图高度）  | `String`  | `0rpx`       |
| radius  | 指定图片圆角（长度或者百分比）      | `String`  | `0rpx`       |
| mode    | 图片裁剪、缩放的模式 [查看详情][1] | `String`  | `aspectFill` |
| preview | 点击图片是否可预览                  | `Boolean` | `false`      |


### Event

| 事件名     | 说明                                                                                  | 参数  |
| ---------- | ------------------------------------------------------------------------------------- | :---: |
| bind:click | 点击图片（可获取到图片的信息）                                                        | -     |
| bind:load  | 图片载入完毕后，可以得到图片的高度和宽度（不建议在这里动态修改图片的width和height值） | -     |
| bind:error | 捕获图片加载错误信息                                                                  | -     |


[1]:https://developers.weixin.qq.com/miniprogram/dev/component/image.html