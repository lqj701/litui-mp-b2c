## Modal 弹出框

### 使用指南
在 json 文件中配置modal组件
```json
"usingComponents": {
  "x-modal": "path/to/mpx/modal/index"
}
```

### 代码演示

```html
<x-modal visible='false'>
  <view>hello world</view>
</x-modal>
```

### API

| 参数    | 说明                   | 类型      | 默认值  |
| ------- | ---------------------- | :-------: | :-----: |
| visible | 控制弹出框的显示和隐藏 | `Boolean` | `false` |

### Event

| 事件名 | 说明 | 参数  |
| ------ | ---- | :---: |


### 外部样式类

暂不支持
