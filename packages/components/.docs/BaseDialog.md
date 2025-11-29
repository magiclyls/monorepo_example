# BaseDialog 对话框组件

基础的对话框组件，支持自定义头部、内容和底部。

## 属性

| 属性名              | 说明                               | 类型      | 默认值  |
| ------------------- | ---------------------------------- | --------- | ------- |
| `v-model`           | `控制对话框显示/隐藏`              | `boolean` | `false` |
| `title`             | `对话框标题`                       | `string`  | -       |
| `showHeader`        | `是否显示头部`                     | `boolean` | `true`  |
| `showBack`          | `是否显示返回按钮`                 | `boolean` | `false` |
| `showClose`         | `是否显示关闭按钮`                 | `boolean` | `true`  |
| `loading`           | `是否显示加载状态`                 | `boolean` | `false` |
| `closeOnClickModal` | `是否可以通过点击遮罩层关闭对话框` | `boolean` | `true`  |
| `loadingSize`       | `加载图标的大小(px)`               | `number`  | `24`    |
| `top`               | `对话框距离顶部的距离`             | `string`  | `15vh`  |
| `appendToBody`      | `是否将对话框插入至 body 元素`     | `boolean` | `false` |
| `width`             | `对话框的宽度`                     | `string ` | `30rem` |

## 事件

| 事件名  | 说明                 | 回调参数 |
| ------- | -------------------- | -------- |
| `close` | `点击关闭按钮时触发` | -        |
| `back`  | `点击返回按钮时触发` | -        |

## 插槽

| 插槽名         | 说明                 |
| -------------- | -------------------- |
| `default`      | `对话框的内容`       |
| `header-left`  | `自定义头部左侧内容` |
| `header-right` | `自定义头部右侧内容` |

## 示例

<script setup>
import { ref } from 'vue'
import BaseDialog from "../src//BaseDialog.vue";

const dialogVisible = ref(false)
function showDialog() {
  dialogVisible.value = true
}

function handleClose() {
  console.log('关闭')
}

function handleBack() {
  console.log('返回')
}
</script>

<button @click="showDialog" style="background:#fff;color:#000">
点我打开对话框
</button>
<BaseDialog
v-model="dialogVisible" title="标题" show-header show-back show-close loading @close="handleClose"
@back="handleBack" >

<div>这是一个基础对话框的内容</div>
<div>这是一个基础对话框的内容</div>
<div>这是一个基础对话框的内容</div>
<div>这是一个基础对话框的内容</div>
<div>这是一个基础对话框的内容</div>
<template #header-left>
<button>左侧插槽</button>
</template>
<template #header-right>
<button>右侧插槽</button>
</template>
</BaseDialog>

## 基础用法

```vue
<script setup>
import { ref } from 'vue'
import BaseDialog from './components/BaseDialog.vue'

const dialogVisible = ref(false)
function showDialog() {
  dialogVisible.value = true
}

function handleClose() {
  console.log('关闭')
}

function handleBack() {
  console.log('返回')
}
</script>

<template>
  <div>
    <button @click="showDialog">
      打开对话框
    </button>
    <BaseDialog
      v-model="dialogVisible" title="标题" show-header show-back show-close loading @close="handleClose"
      @back="handleBack"
    >
      <div>这是一个基础对话框的内容</div>
      <div>这是一个基础对话框的内容</div>
      <div>这是一个基础对话框的内容</div>
      <div>这是一个基础对话框的内容</div>
      <div>这是一个基础对话框的内容</div>
      <template #header-left>
        <button>左侧插槽</button>
      </template>
      <template #header-right>
        <button>右侧插槽</button>
      </template>
    </BaseDialog>
  </div>
</template>
```
