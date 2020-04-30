## Icon 图标

### 使用指南
在 json 文件中配置icon组件
```json
"usingComponents": {
  "x-icon": "path/to/mpx/icon/index"
}
```

> 问：为什么不用iconfont引入？
> 答：没有专业设计师所以图标不完整，自定义链接反而会比较便捷

### 代码演示

#### 指定图标链接

```html
<x-icon src="wechat.svg" />
```

#### 指定图标尺寸

```html
<x-icon src="wechat.svg" size="32rpx" />
```

### API

| 参数 | 说明      | 类型     | 默认值  |
| ---- | --------- | :------: | :-----: |
| src  | 按钮链接 | `String` | -       |
| size | 按钮尺寸  | `String` | `32rpx` |