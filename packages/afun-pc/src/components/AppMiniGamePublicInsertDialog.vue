<script setup lang='ts'>
import { IconUniClose } from '@tg/icons'
interface Props {
  title: string
  icon: string
}
defineOptions({
  name: 'AppMiniGamePublicInsertDialog',
})
defineProps<Props>()

const emit = defineEmits(['close'])

function closeDialog() {
  setTimeout(() => {
    emit('close')
  }, 0)
}

provide('closeDialog', closeDialog)
</script>

<template>
  <teleport to="#tg-original-game-public-wrap">
    <div
      class="bg-tg-dialog-mask absolute left-0 top-0 z-[999] h-full w-full flex justify-center overflow-hidden rounded-[8px] p-[16px] @[800px]:items-center"
      @click.self="emit('close')"
    >
      <div
        class="tg-insert-dialog-box shadow-tg-shadow-inset-dialog bg-tg-primary relative h-fit max-h-full max-w-[500px] w-full overflow-y-scroll rounded-[8px]"
      >
        <div class="flex justify-between p-[16px]">
          <div class="flex items-center">
            <component :is="icon" />
            <span class="text-tg-text-white ml-[8px] font-semibold leading-[1.5]">{{ title }}</span>
          </div>
          <BaseButton size="none" type="text" @click="emit('close')">
            <IconUniClose />
          </BaseButton>
        </div>

        <slot />
      </div>
    </div>
  </teleport>
</template>

<style lang='scss' scoped>
.tg-insert-dialog-box{
  animation: tg-dialog-move-in 0.3s ease forwards;
}
.bg-tg-primary{
  @include webTheme('green'){
    background-color: #076237;
  }
}
@keyframes tg-dialog-move-in {
  from{
    transform: translateY(20px);
    opacity: 0;
  }
  to{
    transform: translateY(0px);
    opacity: 1;
  }
}
</style>
