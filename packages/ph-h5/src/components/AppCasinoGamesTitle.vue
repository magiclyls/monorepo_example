<script setup lang="ts">
import { IconUniArrowBack, IconUniArrowrightLine } from '@tg/icons'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'

interface Props {
  title: string
  total: number
  path?: string
  arrow?: boolean
  isNextAactive?: boolean
  isPrevAactive?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  path: '',
  arrow: false,
  isNextAactive: false,
  isPrevAactive: false,
})
const emit = defineEmits(['next', 'prev'])
const router = useRouter()
const { t } = useI18n()

function toPath() {
  if (props.path === 'provider')
    return
  router.push(props.path)
}
</script>

<template>
  <div class="w-full flex items-center">
    <div class="h-[24rem] flex-1 flex items-center">
      <span class="mr-[7rem] inline-block h-full w-[3px] bg-[#F23038]" />
      <span class="text-[16rem] font-[600] leading-[19rem] text-[#0D2245]" @click="toPath">{{ title }}</span>
    </div>
    <div v-if="path" class="h-[24rem] text-[12rem] font-[500] px-[8rem] flex items-center cursor-pointer rounded-[4rem] common-border" @click="toPath">
      <span class="capitalize mr-[4rem]">{{ t('全部') }}</span>
      <span class="text-[#F23038]">{{ total }}</span>
    </div>
    <div v-if="arrow" class="ml-[6rem] h-[24rem] px-[8rem] flex items-center cursor-pointer rounded-[4rem] common-border" @click="isPrevAactive && emit('prev')">
      <IconUniArrowBack class="text-[#0D2245]" :class="{ diabled: !isPrevAactive }" />
    </div>
    <div v-if="arrow" class="ml-[6rem] h-[24rem] px-[8rem] flex items-center cursor-pointer rounded-[4rem] common-border" @click="isNextAactive && emit('next')">
      <IconUniArrowrightLine class="text-[#0D2245]" :class="{ diabled: !isNextAactive }" />
    </div>
  </div>
</template>

<style scoped>
.common-border {
  border: 1px solid #e4e4e4;
}
.diabled {
  color: #6d7693;
}
</style>
