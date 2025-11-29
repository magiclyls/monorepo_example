<script setup lang='ts'>
interface Props {
  data: {
    [t: string]: any
    title: string
    content: string
  }
}
defineOptions({
  name: 'AppDialogNotice',
})
const props = defineProps<Props>()
console.log('🚀 ~ props:', props.data)
</script>

<template>
  <div class="bg min-h-[284px] w-full flex flex-col">
    <!-- <div class="mb-[16px] text-center text-[20px] font-[600]">
      {{ data.title[getCurrentLanguageForBackend()] }}
    </div> -->
    <!-- 文字 -->
    <div
      v-if="data.pop_up_type === 1" class="text p-[12px] leading-[1.4]"
      v-html="data.content"
    />
    <!-- 图片 -->
    <div style="--tg-base-img-style-radius: 0 0 4px 4px">
      <BaseImage
        v-if="data.pop_up_type === 2" class="h-full w-full" :url="data.image_url"
        is-network
      />
    </div>
  </div>
</template>

<style lang='scss' scoped>
.bg{
  background-color: var(--tg-secondary-dark);
  @include webTheme('green') {
    background: #02432D;
  }
}
.text{
  color: var(--tg-secondary-light);
  @include webTheme('green') {
    color:#3CB389
  }
}
</style>
