<script lang="ts" setup>
import {IconUniVector} from '@tg/icons';
interface Props {
  errIcon?: Component
  withTheme?: boolean
}
defineOptions({
  name: 'AppImage',
})
withDefaults(defineProps<Props>(), {
  errIcon: IconUniVector,
  withTheme: false,
})
defineEmits(['loadImg'])

const { bool: showError, setTrue: setTrueShowError } = useBoolean(false)
</script>

<template>
  <BaseImage
    v-if="!showError"
    v-bind="$attrs"
    :with-theme="withTheme"
    @error-img="setTrueShowError"
    @load-img="$emit('loadImg')"
  />
  <slot v-else>
    <component
      :data-title="JSON.stringify($attrs)"
      class="err-icon"
      :is="errIcon"
    />
  </slot>
</template>

<style>
:root {
  --app-sport-image-error-icon-size: 10px;
}
</style>

<style lang="scss" scoped>
.err-icon {
  font-size: var(--app-sport-image-error-icon-size);
}
</style>
