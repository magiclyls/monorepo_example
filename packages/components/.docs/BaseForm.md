# BaseForm Component

`BaseForm` 组件用于表单提交，结合 `vee-validate` 进行表单验证。

## Props

| 参数   | 说明     | 类型         | 必填 | 默认值 |
| ------ | -------- | ------------ | ---- | ------ |
| schema | 表单验证 | ObjectSchema | 否   | —      |

## Emits

| 事件名        | 说明                           | 回调参数                          |
| ------------- | ------------------------------ | --------------------------------- |
| submit        | 提交表单时触发                 | `(values: object)` 表单的值       |
| invalidSubmit | 提交表单时触发，表单验证不通过 | `(errors: object)` 表单的错误信息 |

## 示例

<script lang="ts" setup>
import { BaseForm, BaseInput, BaseLoading, BaseButton } from '../index.js';
import { ref } from 'vue';
import * as Yup from 'yup';

const schema = Yup.object().shape({
  username: Yup.string().required('用户名必须填写'),
  password: Yup.string().required('密码必须填写').min(6, '最小六位'),
  password2: Yup.string()
    .required()
    .oneOf([Yup.ref('password')], '不一样'),
})

function submit(values) {
  console.log(values)
}
</script>

<BaseForm :schema="schema" @submit="submit">
<BaseInput name="username" class="mt-4" required>
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

  <div class="mt-4">
    <BaseButton type="primary">Submit</BaseButton>
  </div>
</BaseForm>

```vue
<script lang="ts" setup>
import { ref } from 'vue'
import * as Yup from 'yup'
import { BaseButton, BaseForm, BaseInput, BaseLoading } from '../index.js'

const schema = Yup.object().shape({
  username: Yup.string().required('用户名必须填写'),
  password: Yup.string().required('密码必须填写').min(6, '最小六位'),
  password2: Yup.string()
    .required()
    .oneOf([Yup.ref('password')], '不一样'),
})

function submit(values) {
  console.log(values)
}
</script>

<BaseForm :schema="schema" @submit="submit">
  <BaseInput name="username" class="mt-4" required>
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

  <div class="mt-4">
    <BaseButton type="primary">Submit</BaseButton>
  </div>
</BaseForm>
```
