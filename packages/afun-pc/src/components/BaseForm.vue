<script setup lang='ts'>
interface Props {
  disabled?: boolean
}
defineOptions({
  name: 'BaseForm',
})
const props = defineProps<Props>()

const formDisabled = computed(() => props.disabled)

provide('formDisabled', formDisabled)
</script>

<template>
  <div>
    <slot />
  </div>
</template>

<style lang='scss' scoped>

</style>
