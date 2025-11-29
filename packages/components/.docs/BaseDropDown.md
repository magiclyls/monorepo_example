# BaseCollapse Component

## Props

| 参数         | 说明       | 类型      | 必填 | 默认值  |
| ------------ | ---------- | --------- | ---- | ------- |
| `modelValue` | `是否展开` | `boolean` | `否` | `false` |
| `title`      | `行数`     | `string`  | `否` | `--`    |
| `icon`       | `图标`     | `string`  | `否` | `''`    |
| `list`       | `列表项`   | `Array`   | `否` | `[]`    |

## Slots

默认插槽

## Emits

| 事件名称      | 说明                     |
| ------------- | ------------------------ |
| `change`      | `状态变化时触发`         |
| `clickHeader` | `点击头部时触发`         |
| `clickBtn`    | `点击头部展开按钮时触发` |
| `clickItem`   | `点击列表项时触发`       |

## 示例

<script setup>
import BaseCollapse from '../src/BaseDropDown.vue'
import { ref } from 'vue'
const choose = ref(false)
const handleClickHeader = () => {
    choose.value = !choose.value
}
const handleClickItem = (item,index) => {
    console.log(item,index)
}
</script>

<BaseCollapse title="体育" :choose="choose" @clickHeader="handleClickHeader" @clickItem="handleClickItem" icon="casino" :list="[
{
title: '篮球',
leftIcon: 'basketball',
rightIcon: 'label-hot',
},
{
title: '足球',
leftIcon: 'fifa',
rightIcon: 'label-hot',
},
{
title: '阳光',
leftIcon: 'light',
rightIcon: 'label-hot',
},
]">
</BaseCollapse>

## 代码

```vue
<script setup>
import BaseCollapse from './BaseDropDown.vue'

const choose = ref(false)

function handleClickHeader() {
  choose.value = !choose.value
}

function handleClickItem(item, index) {
  console.log(item, index)
}
</script>

<template>
  <BaseCollapse
    title="体育" icon="casino" :choose="choose" :list="[
      {
        title: '篮球',
        leftIcon: 'basketball',
        rightIcon: 'label-hot',
      },
      {
        title: '足球',
        leftIcon: 'fifa',
        rightIcon: 'label-hot',
      },
      {
        title: '阳光',
        leftIcon: 'light',
        rightIcon: 'label-hot',
      },
    ]" @click-header="handleClickHeader" @click-item="handleClickItem"
  />
</template>
```
