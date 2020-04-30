## List 列表

### 使用指南
在 json 文件中配置list组件
```json
"usingComponents": {
  "x-list": "path/to/mpx/list/index"
}
```

### 代码演示

#### 纯列表展示

```html
<x-list content='{{content}}' />
```

#### 指定列表的标题／图标位置／按钮

```html
<x-list header='排名' content='{{content}}' action='保存' iconPosition='right' />
```

#### 点击列表项

```html
<x-list header='排名' content='{{content}}' action='保存' bind:clickItem='onClickItem' />
```

#### 点击列表按钮

```html
<x-list header='排名' content='{{content}}' action='保存' bind:clickAction='onClickAction' />
```

### API

| 参数         | 说明                                                                            | 类型     | 默认值 |
| ------------ | ------------------------------------------------------------------------------- | :------: | :----: |
| header       | 列表标题                                                                        | `String` | -      |
| content      | 列表内容（不指定则不显示），数组每项应包含 标题`title` 详情`detail` 图标`icon` | `Array`  | -      |
| action       | 列表按钮（不指定则不显示）                                                      | `String` | -      |
| iconPosition | 图标的显示位置 `left` `right`                                                   | `String` | `left` |


### Event

| 事件名           | 说明                           | 参数  |
| ---------------- | ------------------------------ | :---: |
| bind:clickItem   | 点击列表项，返回该项的详情     | -     |
| bind:clickAction | 点击按钮，返回该列表的所有数据 | -     |