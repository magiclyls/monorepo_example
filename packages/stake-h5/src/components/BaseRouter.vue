<script setup lang="ts">
import type { CustomRouteType } from '~/utils/custom-router'

interface Props {
  routes: CustomRouteType[]
  /** 是否缓存路由组件 */
  keepAlive?: boolean
}
defineOptions({
  name: 'BaseRouter',
})
const props = withDefaults(defineProps<Props>(), {
  keepAlive: true,
})
const customRouter = reactive(new CustomRouter(props.routes))

provide('customRouter', customRouter)
</script>

<template>
  <!-- 路由历史记录：{{ customRouter.history }}
  <br>
  当前路由路径：{{ customRouter.currentPath }} -->
  <slot name="layout" />
  <KeepAlive :include="customRouter.history">
    <component :is="customRouter.currentComponent" />
  </KeepAlive>
  <!-- <component :is="customRouter.currentComponent" v-else /> -->
</template>

<style lang="scss" scoped>
</style>
