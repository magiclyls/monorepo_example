<script setup lang="ts">
import type { TTheme } from '@tg/types'

interface Props {
  /**
   * 在此模板渲染的元素
   */
  template: TTheme[] | TTheme
}
defineOptions({
  name: 'BaseTemplate',
})

const props = defineProps<Props>()
const appStore = useAppStore()
const { theme } = storeToRefs(appStore)

const isShow = computed(() => {
  if (Array.isArray(props.template))
    return props.template.includes(theme.value)
  else
    return props.template === theme.value
})
</script>

<template>
  <template v-if="isShow">
    <slot />
  </template>
</template>

<style scoped lang="scss">

</style>
