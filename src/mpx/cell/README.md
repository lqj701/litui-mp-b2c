## Cell 容器

### 使用指南
在 json 文件中配置cell组件
```json
"usingComponents": {
  "x-cell": "path/to/mpx/cell/index"
}
```

### 代码演示

#### 自定义容器背景色

```html
<x-cell background="#eee">
  <view>hello world</view>
</x-cell>

<x-cell background="url('/static/image/home.png')">
  <view>hello world</view>
</x-cell>
```

#### 自定义容器尺寸

```html
<x-cell width='750rpx' height='calc(100vh - 100rpx)'></x-cell>
```

#### 弹性布局方向

```html
<x-cell direction='column'></x-cell>
<x-cell direction='row'></x-cell>
```

#### 子元素排布规则

```html
<x-cell alignItems='center'></x-cell>
<x-cell justifyContent='space-evenly'></x-cell>
```

### API

| 参数           | 说明                                                 | 类型     | 默认值       |
| -------------- | ---------------------------------------------------- | :------: | :----------: |
| background     | 指定容器的背景。颜色`#eee`或是图片`url{'image.png'}` | `String` | `#fff`       |
| width          | 指定容器宽度                                         | `String` | `750rpx`     |
| height         | 指定容器高度                                         | `String` | -            |
| direction      | 指定容器子元素排布方向                               | `String` | `column`     |
| alignItems     | 指定容器子元素对齐方式                               | `String` | `center`     |
| justifyContent | 指定容器子元素之间的空间分配                         | `String` | `flex-start` |
