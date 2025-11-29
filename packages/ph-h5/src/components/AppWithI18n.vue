<script lang="ts" setup>
import { I18nT } from 'vue-i18n'

interface Props {
  keypath: string
}
defineOptions({
  name: 'AppWithI18n',
})
defineProps<Props>()
</script>

<template>
  <span>
    <I18nT :keypath="keypath" tag="span" class="flex gap-4">
      <slot />
    </I18nT>
  </span>
</template>
