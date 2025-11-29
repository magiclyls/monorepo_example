<script setup lang="ts">
import { watch } from 'vue'

interface Props {
  modelValue: boolean
  maskClose?: boolean
  hasWrapper?: boolean
}
defineOptions({ name: 'LotteryPopup' })
const props = withDefaults(defineProps<Props>(), {
  maskClose: true,
  hasWrapper: false,
})
const emits = defineEmits(['update:modelValue'])

function onClose() {
  emits('update:modelValue', false)
}

watch(
  () => props.modelValue,
  (val) => {
    if (!props.hasWrapper)
      return
    if (val) {
      document.body.style.overflow = 'hidden'
    }
    else {
      document.body.style.overflow = ''
    }
  },
)
</script>

<template>
  <teleport to="body">
    <Transition name="popup-animal">
      <div v-show="modelValue" :class="[hasWrapper ? 'popup-wrapper' : '']" @click="maskClose && onClose">
        <Transition name="popup-container">
          <div v-if="modelValue" class="fixed w-full bottom-0 z-200 min-h-[20rem] max-h-[80%] flex flex-col" :class="{ 'shadow-[0_5rem_20rem_0_rgba(37,37,60,0.36)] rounded-[6rem]': !hasWrapper }" @click.stop>
            <div class="scroll-y" style="overscroll-behavior-y: contain">
              <slot />
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </teleport>
</template>

<style>
:root {
  --bc-base-popup-label-desc-font-size: 16rem;
}
</style>

<style scoped lang="scss">
.popup-animal-enter-active,
.popup-animal-leave-active {
  transition: background-color 0.4s;
}

.popup-animal-enter-from,
.popup-animal-leave-to {
  background-color: rgba(16, 18, 18, 0);
}

.popup-container-enter-active,
.popup-container-leave-active {
  transition: transform 0.4s;
}

.popup-container-enter-from,
.popup-container-leave-to {
  transform: translateY(100%);
}

.popup-container-enter-to,
.popup-container-leave-from {
  transform: translateY(0);
}

.popup-wrapper {
  background-color: rgba(16, 18, 18, 0.8);
  width: 100%;
  height: 100%;
  max-width: var(--pc-max-width);
  position: fixed;
  z-index: 200;
  top: 0;
  left: 50%;
  transform: translate(-50%, 0);

  &-container {
    background-color: transparent;
  }
}

.popup-title {
  position: absolute;
  top: 0;
  width: 100%;
  justify-content: center;
  align-items: center;
  font-weight: 600;
  height: 48rem;
  font-size: 14rem;
  display: flex;
  flex: none;
  color: white;
}

.scroll-container {
  display: flex;
  flex-direction: column;
  min-height: auto;
}
</style>
