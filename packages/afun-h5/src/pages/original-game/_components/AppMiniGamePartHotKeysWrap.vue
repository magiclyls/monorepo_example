<script setup lang='ts'>
import { AfunBaseCheckbox } from '@tg/bccomponents'
import { IconUniTips } from '@tg/icons'
import { Local, STORAGE_MINI_GAME_HOTKEYS_ENABLED } from '@tg/utils'
import { useI18n } from 'vue-i18n'
import { useMiniGameGlobalStateHotKeys } from '../composables'

defineOptions({
  name: 'AppMiniGamePartHotKeysWrap',
})
const { t } = useI18n()
const { isHotKeysEnabled } = useMiniGameGlobalStateHotKeys()

function onCheck(val: boolean) {
  Local.set(STORAGE_MINI_GAME_HOTKEYS_ENABLED, val)
}
</script>

<template>
  <div>
    <div class="flex-col-16 flex flex-col p-[16px]">
      <slot />
      <div class="bg-tg-secondary-dark flex-row-12 border-tg-text-lightgrey flex border-2 rounded-[8px] border-dashed p-[12px]">
        <IconUniTips class="my-[3px] ml-[4px] text-[#9DABC9]" />
        <div class="text-tg-text-lightgrey text-[14px] leading-[1.5]">
          {{ t('快捷键提示') }}
        </div>
      </div>
    </div>
    <div class="bg-tg-secondary-dark w-full p-[16px]">
      <div class="h-[26.5px] w-full flex items-center justify-center">
        <AfunBaseCheckbox
          v-model="isHotKeysEnabled"
          style="--tg-base-checkbox-label-color:#0d2245; --tg-base-checkbox-label-font-size:14px"
          @check="onCheck"
        >
          {{ t('启用快捷键') }}
        </AfunBaseCheckbox>
      </div>
    </div>
  </div>
</template>

<style lang='scss' scoped>
.flex-col-16 {
  > *:not(:first-child) {
    margin-top: 16px;
  }
}
.flex-row-12 {
  > *:not(:first-child) {
    margin-left: 12px;
  }
}
</style>
