<script setup lang="ts">
import type { RoutePaths } from '../index'
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { useLocalRouter } from '../hooks/useLocalRouter'

defineOptions({
  inheritAttrs: false,
})

const props = withDefaults(defineProps<{
  to: RoutePaths
  replace?: boolean
  disabled?: boolean
}>(), {
  disabled: false,
  replace: false,
})

const { currentLang } = useLocalRouter()

const isExternalLink = computed(
  () => props.to.startsWith('http'),
)
</script>

<template>
  <a
    v-if="isExternalLink"
    v-bind="$attrs"
    class="router-link"
    target="_blank"
    rel="noopener noreferrer"
    :href="disabled ? 'javascript:void(0)' : to"
    :tabindex="disabled ? -1 : undefined"
    :aria-disabled="disabled"
  >
    <slot />
  </a>
  <RouterLink
    v-else
    v-slot="{ isActive, href, navigate }"
    v-bind="$props"
    :to="`${currentLang}${props.to}`"
    custom
  >
    <a
      v-bind="$attrs"
      :href="href"
      class="router-link"
      :class="{
        'router-link-active': isActive,
        'router-link-disabled': disabled,
      }"
      @click="navigate"
    >
      <slot />
    </a>
  </RouterLink>
</template>

<style scoped>
.router-link {
  transform: translate(0);
  display: block;
}
</style>
