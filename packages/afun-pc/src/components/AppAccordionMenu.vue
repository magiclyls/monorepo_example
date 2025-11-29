<script lang="ts" setup>
import type { MenuItem } from '~/composables/useApiMenuData'

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
  if (show)
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
      arrow-size="small"
      @click-head="handleClickHead"
      @click-item="handleClickItem"
      @radio-change="radioChangeValue"
    >
      <template #default="{ menuItem: info }">
        <AppMenuItem :menu-item="info" @click="() => handleClickItem(info)" />
      </template>
    </BaseAccordion>
    <AppMenuItem
      v-else
      :menu-item="menuItem" @click="() => handleClickItem(menuItem)"
    />
  </section>
</template>

<style lang="scss" scoped>
.tg-app-accordion-menu {
  --tg-base-radio-style-color: var(--tg-text-white);
  @include webTheme('green') {
    --tg-base-radio-style-color: var(--tg-text-green-sub);
    --base-accordion-accordion-content-background-color:#02432D;
  }
  --tg-base-accordion-arrow-active: var(--tg-sub-deepblue);
}
</style>
