<script lang="ts" setup name="AppHomeLayout">
import type { defineAsyncComponent } from 'vue'
import { LotteryLoading } from '@tg/bccomponents'
import { IconLotBack } from '@tg/icons'
import { useLocalRouter } from '../hooks/useLocalRouter'
import { isIFrame } from '../utils/tool'
import AppGlobalMqtt from './AppGlobalMqtt.vue'

type AsyncComp = ReturnType<typeof defineAsyncComponent>

interface Props {
  title: string
  type?: 'gradient' | 'bg'
  router?: 'back' | 'exit'
  comp: AsyncComp
}

const props = withDefaults(defineProps<Props>(), {
  type: 'gradient',
  route: 'back',
})
const { exit, back } = useLocalRouter()

function onBack() {
  if (props.router === 'exit') {
    exit()
    return
  }
  back()
}
</script>

<template>
  <div class="h-full">
    <div class="top-0 left-0 sticky z-99 w-full center">
      <div class="lottery-home-bar-height relative w-[var(--pc-max-width)] center lottery-home-bar-bg">
        <div class="absolute text-[18rem] center text-white cursor-pointer left-[10rem] top-[50%] -translate-y-[50%]" @click="onBack">
          <IconLotBack />
        </div>
        <span class="text-[18rem] font-normal text-white">{{ title }}</span>
      </div>
    </div>
    <div :class="{ 'lottery-home-gradient': type === 'gradient' }">
      <Suspense>
        <component :is="comp" />
        <template #fallback>
          <div class="flex items-center justify-center min-h-[200rem]">
            <LotteryLoading :style="{ '--lottery-loading-color': props.type === 'gradient' ? '#fff' : '' }" />
          </div>
        </template>
      </Suspense>
      <AppGlobalMqtt v-if="!isIFrame()" />
    </div>
  </div>
</template>

<style>

</style>

<!-- <style scoped lang="scss">
.lottery-home {
  background: linear-gradient(180deg, #e22727 -3.42%, #ff4343 35.95%, rgba(255, 255, 255, 0.5) 94.06%);
  background-size: 100% 238rem;
  background-repeat: no-repeat;
}
</style> -->
