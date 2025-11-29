<script lang="ts" setup>
import { BaseI18nT } from '@tg/bccomponents'
import { ActivityLocaleSymbol } from '../../config/index'

withDefaults(defineProps<{
  keypath: string
}>(), {})
</script>

<template>
  <BaseI18nT
    :keypath="keypath"
    :locale-symbol="ActivityLocaleSymbol"
  >
    <slot />
  </BaseI18nT>
</template>
