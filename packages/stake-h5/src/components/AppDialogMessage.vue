<script setup lang='ts'>
import { isString } from 'lodash'

interface Props {
  data: {
    [t: string]: any
    title: any
    msg: string
  }
}
defineOptions({
  name: 'AppDialogMessage',
})
const props = defineProps<Props>()

const dataHtml = computed(() => {
  if (typeof props.data.msg === 'string')
    return props.data.msg?.replaceAll('\n', '<br/>')
  /* else
    return props.data.content[getCurrentLanguageForBackend()]?.replaceAll('\n', '<br/>') */
})
</script>

<template>
  <div class="dialog-message">
    <div v-if="data.title" class="title">
      {{ isString(data.title) ? data.title : data.title[getCurrentLanguageForBackend()] }}
    </div>
    <div
      class="text"
      v-html="dataHtml"
    />
  </div>
</template>

<style lang='scss' scoped>
.dialog-message {
  min-height: 305px;
  padding: 0 var(--tg-spacing-16) var(--tg-spacing-16);

  .title {
    font-size: var(--tg-font-size-lg);
    font-weight: var(--tg-font-weight-semibold);
    color: var(--tg-text-white);
    text-align: center;
    margin-bottom: var(--tg-spacing-16);
  }

  .text {
    font-size: var(--tg-font-size-default);
    color: var(--tg-text-lightgrey);
    line-height: 1.4;
  }
}
</style>
