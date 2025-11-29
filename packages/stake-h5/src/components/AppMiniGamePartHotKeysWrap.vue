<script setup lang='ts'>
import { IconUniTips } from '@tg/icons'

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
      <div class="bg-tg-secondary-dark flex-row-12 border-tg-text-lightgrey flex border-[2px] rounded-[8px] border-dashed p-[12px]">
        <IconUniTips class="my-[3px] ml-[4px]" />
        <div class="text-tg-text-lightgrey text-[14px] leading-[1.5]">
          {{ t('mini_hot_key_tips') }}
        </div>
      </div>
    </div>
    <div class="bg-tg-secondary-dark w-full p-[16px]">
      <div class="h-[26.5px] w-full flex items-center justify-center">
        <BaseCheckBox
          v-model="isHotKeysEnabled" style="--tg-base-checkbox-box-width:24px;
        --tg-base-checkbox-label-font-size:14px;
        "
          @check="onCheck"
        >
          {{ t('mini_enable_hot_key') }}
        </BaseCheckBox>
      </div>
    </div>
  </div>
</template>

<style lang='scss' scoped>
.flex-col-16{
  > *:not(:first-child) {
    margin-top: var(--tg-spacing-16);
  }
}
.flex-row-12{
  > *:not(:first-child) {
    margin-left: var(--tg-spacing-12);
  }
}
</style>
