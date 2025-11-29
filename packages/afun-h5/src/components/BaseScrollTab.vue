<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'

interface Props {
  list: Array<{ name: string, [key: string]: any }>
  gap?: string
}

withDefaults(defineProps<Props>(), {
  gap: '12px',
})
const emit = defineEmits(['update:active', 'change'])
const scrollDown = ref(false)
function change($event: MouseEvent, item: Record<string, any>) {
  scrollIntoView($event.target)
  emit('change', item.value)
  emit('update:active', item.value)
}

function scrollIntoView(ele: any) {
  if (!ele)
    return
  ele.scrollIntoView({
    behavior: 'smooth',
    block: 'nearest',
    inline: 'center',
  })
}

let lastScrollTop = 0
function handleScroll() {
  const current = window.scrollY

  if (current > lastScrollTop) {
    if (current >= 50) {
      scrollDown.value = true
    }
  }
  else if (current < lastScrollTop) {
    scrollDown.value = false
  }

  lastScrollTop = current
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<template>
  <div class="overflow-hidden ">
    <div class="hide-scroll items-center flex gap-[12px] overflow-x-auto whitespace-nowrap" :class="[gap && `gap-[${gap}]`]">
      <slot
        v-for="(item, index) in list"
        :item="item"
        :index="index"
        :on-click="change"
      />
    </div>
  </div>
</template>
