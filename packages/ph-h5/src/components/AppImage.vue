<script lang="ts" setup>
import { BaseImage } from '@tg/bccomponents'
import { useBoolean } from '@tg/hooks'
import { IconUniVector } from '@tg/icons'

interface Props {
  url: string
}
defineOptions({
  name: 'AppImage',
})
defineProps<Props>()
defineEmits(['loadImg'])

const { bool: showError, setTrue: setTrueShowError } = useBoolean(false)
</script>

<template>
  <BaseImage
    v-if="!showError" v-bind="$attrs" :url="url" is-network
    @error-img="setTrueShowError" @load-img="$emit('loadImg')"
  />
  <slot v-else>
    <IconUniVector :data-title="JSON.stringify($attrs)" class="err-icon" />
  </slot>
</template>

<style>
:root {
  --ss-sport-image-error-icon-size: 10rem;
}
</style>

<style lang="scss" scoped>
.err-icon {
  font-size: var(--ss-sport-image-error-icon-size);
}
</style>
