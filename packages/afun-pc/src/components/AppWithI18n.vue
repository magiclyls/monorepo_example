<script lang="ts" setup>
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
    <i18n-t :keypath="keypath" tag="span" class="flex gap-[4px]">
      <slot />
    </i18n-t>
  </span>
</template>
