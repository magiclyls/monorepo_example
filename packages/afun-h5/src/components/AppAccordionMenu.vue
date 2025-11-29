<script lang="ts" setup>
import type { MenuItem } from '@tg/types'
import { Local, STORAGE_MENU_EXPAND_DOMID } from '@tg/utils'
import { ref, watch } from 'vue'
import { useApiMenuData } from '~/hooks/useApiMenuData'
import AppStakeMenuItem from './AppStakeMenuItem.vue'
import BaseAccordion from './BaseAccordion.vue'

interface Props {
  menuItem: MenuItem
  timeStamp?: number
}
defineOptions({
  name: 'AppAccordionMenu',
})
const props = withDefaults(defineProps<Props>(), {
  timeStamp: 0,
})

const emit = defineEmits(['closeOtherMenu'])

const baseAccor = ref()

const timestamp = ref(0)

const curDomId = ref(Local.get(STORAGE_MENU_EXPAND_DOMID)?.value)

function handleClickHead(data: any, show: boolean) {
  if (show && props.menuItem.domId !== 'static-menu-language')
    Local.set(STORAGE_MENU_EXPAND_DOMID, props.menuItem.domId)
  else
    Local.set(STORAGE_MENU_EXPAND_DOMID, '')

  timestamp.value = new Date().getTime()
  emit('closeOtherMenu', timestamp.value)
  if (data && data.accordHeadClick)
    data.accordHeadClick()
}

const { menuItemClick } = useApiMenuData()

function handleClickItem(item: any) {
  menuItemClick(item)
}

function radioChangeValue(val: string | number) {
  if (props.menuItem.radioChange)
    props.menuItem.radioChange(val)
}

watch(() => props.timeStamp, (val) => {
  if (val !== timestamp.value)
    baseAccor.value?.close()
})
</script>

<template>
  <section class="tg-app-accordion-menu" :class="[menuItem.className]">
    <BaseAccordion
      v-if="menuItem.list && menuItem.list.length"
      ref="baseAccor"
      :dom-id="menuItem.domId"
      :menu-info="menuItem"
      :auto-show="(curDomId === void 0) ? false : curDomId === menuItem.domId"
      arrow-size="big"
      @click-head="handleClickHead"
      @click-item="handleClickItem"
      @radio-change="radioChangeValue"
    >
      <template #default="{ menuItem: info }">
        <AppStakeMenuItem :menu-item="info" @click="() => handleClickItem(info)" />
      </template>
    </BaseAccordion>
    <AppStakeMenuItem
      v-else
      :menu-item="menuItem" @click="() => handleClickItem(menuItem)"
    />
  </section>
</template>

<style lang="scss" scoped>
.tg-app-accordion-menu {
  --tg-base-radio-style-color: #fff;
  --tg-base-accordion-arrow-active: #105eb5;
}
</style>
