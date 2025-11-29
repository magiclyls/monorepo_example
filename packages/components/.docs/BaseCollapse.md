# BaseCollapse 手风琴组件

展开/收起内容区域的交互组件，支持动画过渡和无障碍访问。

## 基本用法

```vue
<script setup>
import { ref } from 'vue'
const isOpen = ref(false)
</script>

<template>
  <BaseCollapse v-model="isOpen" title="标题文字">
    <p>这里是可折叠的内容区域</p>
  </BaseCollapse>
</template>
```

## Props

| 属性名     | 类型      | 默认值  | 说明                            |
| ---------- | --------- | ------- | ------------------------------- |
| modelValue | `boolean` | -       | 控制展开状态的v-model绑定       |
| title      | `string`  | -       | 标题文字（必填）                |
| disabled   | `boolean` | `false` | 是否禁用状态                    |
| duration   | `number`  | `300`   | 动画持续时间（毫秒）            |
| icon       | `string`  | -       | 标题左侧图标路径（SVG d属性值） |

## Events

| 事件名            | 参数               | 说明               |
| ----------------- | ------------------ | ------------------ |
| update:modelValue | `(value: boolean)` | 展开状态变更时触发 |

## Slots

| 名称    | 作用域 | 说明               |
| ------- | ------ | ------------------ |
| default | -      | 折叠内容区域       |
| icon    | -      | 自定义标题左侧图标 |

## 样式类名

| 类名           | 说明             |
| -------------- | ---------------- |
| bc-collapse    | 容器根元素       |
| trigger        | 触发按钮         |
| header-content | 标题内容容器     |
| icon           | 默认图标样式     |
| title          | 标题文字样式     |
| arrow          | 展开箭头容器     |
| arrow-icon     | 展开箭头图标     |
| content        | 折叠内容容器     |
| content-inner  | 折叠内容内层容器 |

## 无障碍访问

<script setup>
import BaseCollapse from '../src/BaseCollapse.vue'
</script>
<BaseCollapse title="体育" :isOpen="true">
    <div class="flex items-center">
        <div class="flex-none center">icon</div>
        <span class="ml-3 flex-1">体育</span>
    </div>
    <div class="flex items-center">
        <div class="flex-none center sm:size-10">icon</div>
        <span class="ml-3 flex-1">体育</span>
    </div>
</BaseCollapse>
