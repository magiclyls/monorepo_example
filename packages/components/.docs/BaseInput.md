# BaseInput Component

`BaseInput` 组件是一个通用的输入框组件，支持多种属性，结合 `vee-validate` 进行表单验证。

## Props

| 参数        | 说明                         | 类型               | 必填 | 默认值  |
| ----------- | ---------------------------- | ------------------ | ---- | ------- |
| name        | 输入框的名称                 | `string`           | 是   | —       |
| type        | 输入框的类型                 | `string`           | 否   | `text`  |
| inputmode   | 输入模式                     | `string`           | 否   | `text`  |
| modelValue  | 输入框的值                   | `string \| number` | 否   | —       |
| placeholder | 输入框的占位符               | `string`           | 否   | —       |
| required    | 是否为必填字段(触发原生提示) | `boolean`          | 否   | `false` |
| search      | 是否显示搜索图标             | `boolean`          | 否   | `false` |

## Slots

| 插槽名     | 说明           |
| ---------- | -------------- |
| left-icon  | 输入框头部内容 |
| right-icon | 输入框尾部内容 |

## Emits

| 事件名            | 说明                 | 回调参数                                 |
| ----------------- | -------------------- | ---------------------------------------- |
| update:modelValue | 当输入值更改时触发   | `(value: string \| number)` 输入框的新值 |
| change            | 当输入框输入内容触发 | `(value: Event)` input 回调值            |

## 示例

<script setup>
import BaseInput from '../src/BaseInput.vue'
</script>

<BaseInput name="username" class="mt-4" required search />
<BaseInput name="username" class="mt-4" required search>
  <template #left-icon>
    L
  </template>
</BaseInput>
<BaseInput name="password" type="password" class="mt-4" required />
<BaseInput name="password2" type="password" class="mt-4" required>
  <template #right-icon>
    R
  </template>
</BaseInput>

```vue
<BaseInput name="username" class="mt-4" required search />

<BaseInput name="username" class="mt-4" required search>
  <template #left-icon>
    L
  </template>
</BaseInput>

<BaseInput name="password" type="password" class="mt-4" required />

<BaseInput name="password2" type="password" class="mt-4" required>
  <template #right-icon>
    R
  </template>
</BaseInput>
```

## 使用说明

- `BaseInput` 组件支持通过 `required` 属性来控制是否必填。
- 使用 `vee-validate` 进行表单验证时，可以方便地进行规则设置。
