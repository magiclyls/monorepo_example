<script setup lang="ts">
import { provide, reactive } from 'vue'
import { ActivityLocaleSymbol, type ConfigProviderContext, configSymbol } from '../config'

const props = defineProps<ConfigProviderContext>()
const reactiveProps = reactive(props)

provide(configSymbol, reactiveProps)
provide(ActivityLocaleSymbol, props.locale)
</script>

<template>
  <slot />
</template>
