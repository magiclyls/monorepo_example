<script setup lang='ts'>
import { PhBaseTabs } from '@tg/bccomponents'
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import AppMiniGameProvablyFairSeed from './AppMiniGameProvablyFairSeed.vue'
import AppMiniGameProvablyFairVerify from './AppMiniGameProvablyFairVerify.vue'

interface Props {
  tab?: 'seed' | 'verify'
  gameData?: {
    [k: string]: any
  }
}
defineOptions({
  name: 'AppMiniGameProvablyFair',
})
const props = withDefaults(defineProps<Props>(), {
  tab: 'seed',
})

const { t } = useI18n()

const tab = ref(props.tab)
const tabList = [
  { label: t('种子'), value: 'seed' },
  { label: t('验证'), value: 'verify' },
]
const isSeed = computed(() => tab.value === 'seed')
const isVerify = computed(() => tab.value === 'verify')
</script>

<template>
  <div>
    <div class="item-center flex justify-center mt-[20rem]">
      <PhBaseTabs v-model="tab" :list="tabList" :type="5" style="--tabs-wrap-padding-y: 6rem; --tabs-item-active-bg: #F23038; --tabs-item-active-color: #fff" />
    </div>
    <!-- 种子 -->
    <AppMiniGameProvablyFairSeed v-if="isSeed" />
    <!-- 验证 -->
    <AppMiniGameProvablyFairVerify v-show="isVerify" :game-data="gameData" />
  </div>
</template>
