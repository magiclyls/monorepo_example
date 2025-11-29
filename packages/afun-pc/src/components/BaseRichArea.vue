<script lang="ts" setup>
interface Props {
  content: string
}
defineOptions({
  name: 'BaseRichArea',
})
defineProps<Props>()
</script>

<template>
  <div class="tg-rich-area leading-[1.5]" v-html="content" />
</template>

<style lang="scss" scoped>
</style>
