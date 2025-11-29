<script setup lang="ts">
interface Props {
}
defineOptions({
  name: 'AppAnimateRoute',
})

const props = withDefaults(defineProps<Props>(), {
})
const router = useLocalRouter()
const { brandConfig } = storeToRefs(useBrandStore())

const transitionName = ref<'slide-push' | 'slide-back' | ''>('')
const useAnimateRoute = computed(() => {
  const allowTemps = [2, 4, 6] as any
  return allowTemps.includes(brandConfig.value?.tpl)
})

router.beforeEach((to, from) => {
  const toDepth = to.meta.depth ?? ((to.fullPath.split('/').length - 2) || 0)
  const fromDepth = from.meta.depth ?? ((from.fullPath.split('/').length - 2) || 0)
  if (toDepth > fromDepth)
    transitionName.value = 'slide-push' // 推屏进场
  else if (toDepth < fromDepth)
    transitionName.value = 'slide-back' // 推屏返回
  else
    transitionName.value = ''
  console.log('router:', fromDepth, toDepth, transitionName.value)
})
</script>

<template>
  <div
    class="relative h-full w-full overflow-hidden"
  >
    <Transition :name="useAnimateRoute && transitionName">
      <slot />
    </Transition>
  </div>
</template>

<style scoped lang="scss">
.router-animate-container{
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  background-color: var(--tg-body-bg-colon);
  z-index: var(--tg-z-index-top);

}
$duration: .2s;
/* 进入动画（新组件从右侧推入） */
.slide-push-enter-active {
  transition: transform $duration ease;
}
.slide-push-enter-from {
  transform: translateX(100%);
}
.slide-push-enter-to {
  transform: translateX(0%);
}

/* 推屏返回动画 */
.slide-back-leave-active {
  @extend .router-animate-container;
  transition: transform $duration ease;
}
.slide-back-leave-from {
  transform: translateX(0%);
}
.slide-back-leave-to {
  transform: translateX(100%);
}
</style>
