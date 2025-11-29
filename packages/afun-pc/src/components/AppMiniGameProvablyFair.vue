<script setup lang='ts'>
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
  { label: t('plinko_fairnesses_seed'), value: 'seed' },
  { label: t('plinko_fairnesses_verify'), value: 'verify' },
]
const isSeed = computed(() => tab.value === 'seed')
const isVerify = computed(() => tab.value === 'verify')
</script>

<template>
  <div>
    <div class="item-center flex justify-center">
      <BaseTab v-model="tab" :list="tabList" />
    </div>

    <!-- 种子 -->
    <AppMiniGameProvablyFairSeed v-if="isSeed" />
    <!-- 验证 -->
    <AppMiniGameProvablyFairVerify v-show="isVerify" :game-data="gameData" />
  </div>
</template>

<style lang='scss' scoped></style>
