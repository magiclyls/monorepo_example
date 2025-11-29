# BaseLoading 加载组件

`BaseLoading` 是一个基础的加载动画组件，支持三种模式 (`green`, `white`, `black`)，适用于不同的主题场景。

## 组件示例

<script setup>
import BaseLoading from '../src/BaseLoading.vue'
</script>

<BaseLoading />
<BaseLoading mode="white" />
<BaseLoading mode="black" />

```vue
<template>
  <BaseLoading />
  <BaseLoading mode="white" />
  <BaseLoading mode="black" />
</template>
```

## Props

| 参数 | 说明             | 类型   | 可选值                    | 默认值  |
| ---- | ---------------- | ------ | ------------------------- | ------- |
| mode | 选择加载动画颜色 | String | `green`, `white`, `black` | `green` |

## Slots

该组件不支持 `slots`。

## Emits

该组件无事件 (`emits`)。
