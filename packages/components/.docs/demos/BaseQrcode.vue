<script lang="ts" setup>
import QrcodeVue from 'qrcode.vue'

interface Props {
  // 待编码的字符串内容（例如 URL）
  value: string
  // 二维码尺寸，单位为像素，默认 128
  size?: number
  // 错误校正等级，可选 'L' | 'M' | 'Q' | 'H'，默认 'M'
  level?: 'L' | 'M' | 'Q' | 'H'
  // 背景颜色，默认白色
  bgColor?: string
  // 前景颜色，默认黑色
  fgColor?: string
}

const props = withDefaults(defineProps<Props>(), {
  size: 128,
  level: 'M',
  bgColor: '#ffffff',
  fgColor: '#000000',
})
</script>

<template>
  <div class="qr-code-container">
    <!-- 使用 qrcode.vue 组件渲染二维码 -->
    <QrcodeVue
      :value="props.value"
      :size="props.size"
      :level="props.level"
      :bg-color="props.bgColor"
      :fg-color="props.fgColor"
    />
  </div>
</template>

<style scoped lang="scss">
.qr-code-container {
  display: inline-block;
}
</style>
