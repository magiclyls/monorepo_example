<script lang="ts" setup>
import { computed, ref, watch } from 'vue'
import BaseCollapseItem from './BaseCollapseItem.vue'

interface Props {
  modelValue?: boolean
  title?: string
  icon?: string
  list?: {
    title: string
    leftIcon: string
    rightIcon: string
  }[]
  choose?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  icon: '',
  title: '',
  list: [] as any,
  choose: false,
})

const emit = defineEmits(['update:modelValue', 'change', 'clickHeader', 'clickBtn', 'clickItem'])

const localValue = ref(props.modelValue)

const chooseIndex = ref()

const defaultChooseStyle = {
  titleColor: 'rgb(36 238 137)',
  bgColor: 'linear-gradient(90deg, #23ee8833, #23ee8800), rgba(255, 255, 255, .05)',
}

const chooseStyle = computed(() => {
  return props.choose ? defaultChooseStyle : {}
})

watch(localValue, (newValue: boolean) => {
  emit('update:modelValue', newValue)
  emit('change')
})

function handleClickHeader() {
  emit('clickHeader')
}

function handleClickBtn() {
  emit('clickBtn')
}

function handleChange() {
  chooseIndex.value = null
  emit('change')
}

function handleClickItem(item: any, index: number) {
  chooseIndex.value = index
  emit('clickItem', item, index)
}
</script>

<template>
  <div class="collapse-group">
    <BaseCollapseItem
      v-model="localValue" :title="title" :arrow="{
        showArrowBg: true,
        arrowPosition: 'up',
      }" :choose-style="chooseStyle" show-hover-bg @change="handleChange" @click-header="handleClickHeader"
      @click-btn="handleClickBtn"
    >
      <template #icon>
        <component :is="icon" class="base-icon" />
      </template>

      <div class="list-wrapper">
        <BaseCollapseItem
          v-for="(item, index) in list" :key="index" :choose-style="chooseIndex === index ? defaultChooseStyle : {}"
          :title="item.title" :show-arrow="false" show-hover-bg disabled
          @click-header="handleClickItem(item, index)"
        >
          <template #icon>
            <component :is="item.leftIcon" class="base-icon" />
          </template>

          <template #extra>
            <component :is="item.rightIcon" class="base-icon" />
          </template>
        </BaseCollapseItem>
      </div>
    </BaseCollapseItem>
  </div>
</template>

<style>
:root {
  --collapse-icon-size: 1.5rem;
}
</style>

<style scoped>
.collapse-group {
  --collapse-title-color: #fff;
  --collapse-border: none !important;
  --collapse-content-padding: 0;
  --collapse-header-padding: 0.5rem;
  .base-icon {
    font-size: var(--collapse-icon-size);
  }
}

.list-wrapper {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  padding: 0.25rem 0 0 0;
}
</style>
