<script setup lang='ts'>
import QrcodeVue from 'qrcode.vue'

interface Props {
  url: string
  size?: number
  // disabled: boolean
}
defineOptions({
  name: 'BaseQrcode',
})
withDefaults(defineProps<Props>(), {
  size: 128,
  // disabled: false,
})

const { t } = useI18n()
const qrCodeOuter = ref()
const { width: currencySelectWidth } = useElementSize(qrCodeOuter)
function downloadClick() {
  const canvas = qrCodeOuter.value.querySelector('canvas')
  const url = canvas.toDataURL('image/png')
  const downloadLink = document.createElement('a')
  downloadLink.setAttribute('href', url)
  downloadLink.setAttribute('download', `${t('qr_code')}.png`)
  downloadLink.click()
}

defineExpose({ downloadClick })
</script>

<template>
  <div ref="qrCodeOuter" class="base-qrcode">
    <div class="wrap">
      <QrcodeVue :value="url" :size="size" />
    </div>
    <!-- <div
      v-if="disabled" class="mask text-sm font-medium text-tg-text-white"
      :style="{ width: `${size}px`, height: `${size + 2}px` }"
    >
      {{ t('message_is_invalidation') }}
    </div> -->
  </div>
</template>

<style lang='scss' scoped>
:root {
  --base-qrcode-warp-radius: var(--tg-radius-default);
}
.base-qrcode {
  display: flex;
}

.wrap {
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--tg-spacing-8);
  border-radius: var(--base-qrcode-warp-radius);
  // box-shadow: var(--tg-header-shadow);
  background-color: #fff;
}
.rea-qrcode {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--tg-spacing-8);
}
.mask {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--tg-spacing-8);
  border-radius: var(--tg-radius-default);
  box-shadow: var(--tg-header-shadow);
  background-color: rgba(0, 0, 0, 0.5);
  color: #fff;
  font-size: var(--tg-font-size-base);
  font-weight: 600;
  z-index: 2;
}
.rea-wrap {
  position: relative;
  z-index: 1;
}
</style>
