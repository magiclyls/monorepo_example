<script setup lang="ts">
import type { ObjectSchema } from 'yup'
import { Form } from 'vee-validate'
import { onMounted } from 'vue'

interface Props {
  schema: ObjectSchema<any>
}

defineOptions({
  name: 'BaseForm',
})

defineProps<Props>()

const emits = defineEmits(['submit', 'invalidSubmit'])

async function submit(values: any) {
  emits('submit', values)
}

function invalidSubmit(error: any) {
  emits('invalidSubmit', error)
}

onMounted(() => {
  document.querySelectorAll('form')?.forEach((form) => {
    form?.removeAttribute('novalidate')
  })
})
</script>

<template>
  <Form :validation-schema="schema" @submit="submit" @invalid-submit="invalidSubmit">
    <slot />
  </Form>
</template>

<style scoped lang="scss">

</style>
