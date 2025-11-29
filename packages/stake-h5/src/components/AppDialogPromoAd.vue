<script setup lang="ts">
import { IconUniClose } from '@tg/icons'

interface Props {
  data: {
    ty?: number
    state?: number
    pid?: string
    [key: string]: any
  }
}
defineOptions({
  name: 'AppDialogPromoAd',
})
const props = withDefaults(defineProps<Props>(), {
})

const closeDialog = inject('closeDialog', () => { })
const { openActivity } = useActivityMenu()
const { isLogin } = storeToRefs(useAppStore())
const { setCloseAllDialog } = useDialogState()

// 点击节流
const openThrottleActivity = throttle((item: any) => {
  // closeDialog()
  openActivity(item)
  setCloseAllDialog(true)
}, 1.2 * 1000, {
  leading: true,
  trailing: false,
})

function handleClose() {
  closeDialog()
}
</script>

<template>
  <div class="center fixed left-0 top-0 h-[100%] w-[100%]" @click="handleClose">
    <div class="margin-auto relative h-[386px] w-[332px] flex items-center justify-center">
      <div class="flex items-center justify-center">
        <BaseImage width="332px" is-network :url="`/images/promo/pop/${getCurrentLanguageForBackend()}/${data.ty}.webp`" @click.stop="openThrottleActivity(data)" />
      </div>
      <div
        class="center theme-close absolute right-[14px] top-[0] h-[18px] w-[18px] cursor-pointer rounded-full"
        @click="handleClose"
      >
        <IconUniClose class="text-[12px]" />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.theme-close{
  border:1px solid #B1BAD3;
  --tg-icon-color:#B1BAD3;
  @include webTheme('white') {
    border:1px solid #c1c1c1;
    --tg-icon-color:#c1c1c1;
  }
  @include webTheme('green') {
    border:1px solid #5ECEA6;
    --tg-icon-color:#5ECEA6;
  }
}
</style>
