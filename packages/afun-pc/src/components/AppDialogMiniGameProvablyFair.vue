<script setup lang='ts'>
import { IconUniClose, IconUniScales } from '@tg/icons'
defineOptions({
  name: 'AppDialogMiniGameProvablyFair',
})
const emit = defineEmits(['close'])

const { t } = useI18n()
</script>

<template>
  <div
    class="bg-tg-dialog-mask absolute left-0 top-0 z-[999] h-full w-full flex justify-center overflow-hidden rounded-[8px] p-[16px] @[800px]:items-center"
    @click.self="emit('close')"
  >
    <div
      class="shadow-tg-shadow-inset-dialog bg-tg-primary relative h-fit max-h-full max-w-[500px] w-full overflow-y-scroll rounded-[8px]"
    >
      <div class="flex justify-between p-[16px]">
        <div class="flex items-center">
          <IconUniScales />
          <span class="text-tg-text-white ml-[8px] font-semibold leading-[1.5]">{{ t('fairness') }}</span>
        </div>
        <BaseButton size="none" type="text" @click="emit('close')">
          <IconUniClose />
        </BaseButton>
      </div>

      <AppMiniGameProvablyFair />
    </div>
  </div>
</template>

<style lang='scss' scoped></style>
