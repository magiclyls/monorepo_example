# BaseButton 按钮组件

通用交互按钮组件，支持多种类型、状态、尺寸和图标集成。

## 功能特性

- 三种按钮类型：主要（primary）、次要（secondary）、文字（text）
- 三种尺寸：小（small）、中（medium）、大（large）
- 加载状态指示
- 禁用状态控制
- 支持自定义图标
- 完善的ARIA无障碍支持
- 灵活的内容插槽
- 原生按钮类型支持（button/submit/reset）

## 基本用法

```vue
<script setup>
import { ref } from 'vue'
const isLoading = ref(false)
</script>

<template>
  <BaseButton
    type="primary"
    size="medium"
    :loading="isLoading"
    @click="isLoading = !isLoading"
  >
    点击加载
  </BaseButton>
</template>
```

## Props

| 属性名      | 类型                                     | 默认值      | 说明                       |
| ----------- | ---------------------------------------- | ----------- | -------------------------- |
| type        | `'primary'` \| `'secondary'` \| `'text'` | `'primary'` | 按钮类型                   |
| size        | `'small'` \| `'medium'` \| `'large'`     | `'medium'`  | 按钮尺寸                   |
| loading     | `boolean`                                | `false`     | 是否显示加载状态           |
| disabled    | `boolean`                                | `false`     | 是否禁用按钮               |
| icon        | `string`                                 | -           | 图标类名（当使用图标库时） |
| htmlType    | `'button'` \| `'submit'` \| `'reset'`    | `'button'`  | 原生button类型             |
| loaderStyle | `CSSProperties`                          | -           | 加载指示器的自定义样式     |

## Events

| 事件名 | 参数         | 说明           |
| ------ | ------------ | -------------- |
| click  | `MouseEvent` | 点击按钮时触发 |

## Slots

| 名称    | 作用域 | 说明           |
| ------- | ------ | -------------- |
| default | -      | 按钮文本内容   |
| icon    | -      | 自定义图标内容 |

## 样式类名

| 类名                 | 说明                       |
| -------------------- | -------------------------- |
| bc-button            | 按钮根元素                 |
| bc-button\_\_loader  | 加载指示器元素             |
| bc-button\_\_content | 内容容器（包含图标和文本） |
| bc-button\_\_icon    | 默认图标样式               |

## 无障碍访问

组件实现以下ARIA特性：

- `aria-busy`: 指示加载状态
- `aria-disabled`: 指示禁用状态
- 键盘操作支持（Enter/Space触发点击）
- 焦点环样式可见性

## 注意事项

1. 加载状态优先级高于禁用状态
2. 图标与加载指示器互斥显示
3. 文字类型按钮建议配合hover样式使用
4. 禁用状态下不触发任何事件
