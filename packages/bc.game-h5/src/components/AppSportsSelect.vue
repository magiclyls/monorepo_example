<script setup lang='ts'>
import type { EnumSportsOddsType } from '@tg/stores'
import { BaseIcon } from '@tg/bccomponents'
import { useSportsStore } from '@tg/stores'
import { onClickOutside } from '@vueuse/core'
import { storeToRefs } from 'pinia'
import { computed, nextTick, ref, useTemplateRef } from 'vue'
import BaseSportsScrollbar from '~/components/BaseSportsScrollbar.vue'

defineOptions({ name: 'AppSportsSelect' })

const sportsSelectRef = useTemplateRef('sportsSelectRef')
const sportsStore = useSportsStore()
const { sportsOddsType, AllOddsTypes } = storeToRefs(sportsStore)

const isLayerOpen = ref(false)

const typeList = computed(() => AllOddsTypes.value.filter(a => a.value !== sportsOddsType.value))

function clickHandler(type: EnumSportsOddsType) {
  if (type === void 0 || type === sportsOddsType.value)
    return

  sportsStore.setSportsOddsType(type)
  nextTick(() => {
    closeLayer()
  })
}
function toggleSelect() {
  isLayerOpen.value = !isLayerOpen.value
}
function closeLayer() {
  isLayerOpen.value = false
}

onClickOutside(sportsSelectRef, closeLayer)
</script>

<template>
  <div ref="sportsSelectRef" class="w-[168px] z-[2]">
    <div class=" relative text-[12px]">
      <div class="label" @click="toggleSelect">
        {{ sportsOddsType }}
        <div
          class="text-[16px] flex item-center justify-center w-[16px] h-[16px] duration-300"
          :class="[isLayerOpen ? 'rotate-[-180deg]' : '']"
        >
          <BaseIcon name="uni-triangle" />
        </div>
      </div>
      <BaseSportsScrollbar v-if="isLayerOpen" class="layer">
        <div
          v-for="item in typeList" :key="item.value" class="text-[12px] font-semibold leading-[16px] select-none capitalize mb-[8px] last-of-type:mb-0"
          @click="clickHandler(item.value)"
        >
          {{ item.value }}
        </div>
      </BaseSportsScrollbar>
    </div>
  </div>
</template>

<style lang='scss' scoped>
.label {
  color: #ffffff;
  width: 100%;
  cursor: pointer;
  height: 32px;
  display: flex;
  padding: 0 12px 0 16px;
  position: relative;
  background: #292d2e;
  box-sizing: border-box;
  align-items: center;
  font-weight: 600;
  line-height: 32px;
  user-select: none;
  border-radius: 16px;
  justify-content: space-between;
}
.layer {
  top: 36px;
  left: 0;
  color: #ffffff;
  width: 100%;
  padding: 8px 16px;
  position: absolute;
  background: #292d2e;
  box-sizing: border-box;
  max-height: 96px;
  border-radius: 10px;
  margin-bottom: 8px;

  &::before {
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    content: '';
    z-index: -1;
    position: absolute;
    box-shadow: 0px 5px 16px rgba(0, 0, 0, 0.16);
    border-radius: inherit;
  }

  &::after {
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    content: '';
    position: absolute;
    background: linear-gradient(#292d2e, rgba(0, 0, 0, 0) 16px, rgba(0, 0, 0, 0) calc(100% - 16px), #292d2e);
    border-radius: inherit;
    pointer-events: none;
  }
}
</style>
