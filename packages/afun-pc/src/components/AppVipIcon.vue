<script lang="ts" setup>
interface Props {
  level: string
}
defineOptions({
  name: 'AppVipIcon',
})
defineProps<Props>()
</script>

<template>
  <BaseImage width="16px" style="min-width: 16px" :is-network="true" :url="`/images/vip/${level}.webp`" />
</template>

<style lang="scss" scoped></style>
