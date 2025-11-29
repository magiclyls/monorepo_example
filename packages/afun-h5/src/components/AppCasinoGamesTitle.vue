<script setup lang="ts">
import { AfunBaseImage } from '@tg/bccomponents'
import { IconUniArrowBack, IconUniArrowrightLine } from '@tg/icons'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'

interface Props {
  title: string
  icon?: string
  total: number
  path?: string
  arrow?: boolean
  isNextAactive?: boolean
  isPrevAactive?: boolean
  isProvider?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  path: '',
  arrow: false,
  isNextAactive: false,
  isPrevAactive: false,
  isProvider: false,
})
const emit = defineEmits(['next', 'prev'])
const router = useRouter()
const { t } = useI18n()

function toPath() {
  if (!props.path)
    return
  router.push(props.path)
}
</script>

<template>
  <div class="w-full flex items-center">
    <div class="h-[27px] flex-1 flex items-center">
      <!-- <span class="mr-[7px] inline-block h-full w-[3px] bg-[#F23038]" /> -->
      <AfunBaseImage class="mr-[8px] h-[16px]" width="auto" is-network :url="icon" />
      <span class="text-[18px] font-[600] text-[#fff]" @click="toPath">{{ title }}</span>
    </div>
    <div v-if="path && !isProvider" class="h-[27px] center font-[600] px-[8px] flex items-center cursor-pointer rounded-[4px] common-border" @click="toPath">
      <span class="capitalize mr-[6px]">{{ t('全部') }}</span>
      <span class="text-[#24EE89]">{{ total }}</span>
    </div>
    <div v-if="arrow" class="ml-[6px] h-[27px] px-[8px] flex items-center cursor-pointer rounded-[4px] common-border" @click="isPrevAactive && emit('prev')">
      <IconUniArrowBack class="text-[#B1BAD3]" :class="{ diabled: !isPrevAactive }" />
    </div>
    <div v-if="arrow" class="ml-[6px] h-[27px] px-[8px] flex items-center cursor-pointer rounded-[4px] common-border" @click="isNextAactive && emit('next')">
      <IconUniArrowrightLine class="text-[#B1BAD3]" :class="{ diabled: !isNextAactive }" />
    </div>
  </div>
</template>

<style scoped>
.common-border {
  border: 1px solid #304554;
}
.diabled {
  color: #677386;
}
</style>
