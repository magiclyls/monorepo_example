<script setup lang="ts" name="LotteryTabs">
import { nextTick, onMounted, ref } from 'vue'

interface Tabs {
  label: string
  value: number | string
}
interface Props {
  tabs: Tabs[]
  modelValue: string | number
}
const props = defineProps<Props>()
const emits = defineEmits(['update:modelValue', 'change'])

const tabRefs = ref<HTMLElement[]>([])
const containerRef = ref<HTMLElement | null>(null)
const redRef = ref<HTMLElement | null>(null)
const redPosition = ref()

async function setTab(value: string | number, index: number) {
  emits('update:modelValue', value)
  emits('change', value)
  await nextTick()
  scrollTabToCenter(index)
  updateRedPosition()
}

function scrollTabToCenter(index: number) {
  const container = containerRef.value
  const tabEl = tabRefs.value[index]
  if (!container || !tabEl)
    return

  const containerWidth = container.offsetWidth
  const tabCenter = tabEl.offsetLeft + tabEl.offsetWidth / 2
  const scrollLeft = tabCenter - containerWidth / 2

  container.scrollTo({
    left: scrollLeft,
    behavior: 'smooth',
  })
}

function updateRedPosition() {
  const index = props.tabs.findIndex(t => t.value === props.modelValue)
  const tabEl = tabRefs.value[index]
  if (!tabEl || !redRef.value)
    return
  const tabElWith = tabEl.offsetWidth
  const redRefWidth = redRef.value.offsetWidth
  const position = tabEl.offsetLeft + tabElWith / 2 - redRefWidth / 2
  redPosition.value = `${position}px`
}

onMounted(() => {
  nextTick(() => {
    const index = props.tabs.findIndex(t => t.value === props.modelValue)
    scrollTabToCenter(index)
    updateRedPosition()
  })
})
</script>

<template>
  <div>
    <div
      ref="containerRef"
      class="w-full flex items-center shrink-0 h-[30rem] overflow-x-auto relative scroll-smooth hide-scroll"
    >
      <div
        v-for="(item, index) in tabs"
        :key="item.value"
        :ref="el => tabRefs[index] = (el as HTMLElement)"
        class="tab-item leading-[17rem] flex items-center h-full relative whitespace-nowrap text-[12rem] cursor-pointer"
        :class="{
          'mr-[20rem]': index !== tabs.length - 1,
        }"
        @click="setTab(item.value, index)"
      >
        <span>
          {{ item.label }}
        </span>
      </div>
      <div
        ref="redRef"
        class="active-border absolute bottom-[2rem] h-[3rem] w-[20rem] rounded-full transition-all duration-300"
        :style="{ transform: `translateX(${redPosition})` }"
      />
    </div>
  </div>
</template>
