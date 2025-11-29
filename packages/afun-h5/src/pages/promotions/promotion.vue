<script setup lang='ts'>
import type { IComponentsList } from '@tg/types'
import { computed, defineAsyncComponent, provide, ref } from 'vue'
import { useRoute } from 'vue-router'
import AppLoading from '~/components/AppLoading.vue'
import AppPageLayout from '~/components/AppPageLayout.vue'

defineOptions({ name: 'AppPromotion' })

const route = useRoute()
const title = ref('')
const id = computed(() => route.params.id.toString())

const componentList: IComponentsList = {
  'agent-month-reward': defineAsyncComponent(() => import('./_components/agent-month-reward.vue')),
  'agent-day-reward': defineAsyncComponent(() => import('./_components/agent-day-reward.vue')),
  'auspicious-award': defineAsyncComponent(() => import('./_components/auspicious-award.vue')),
  'back-cash': defineAsyncComponent(() => import('./_components/back-cash.vue')),
  'betting-rewards': defineAsyncComponent(() => import('./_components/betting-rewards.vue')),
  'customize': defineAsyncComponent(() => import('./_components/customize.vue')),
  'dollar-waves': defineAsyncComponent(() => import('./_components/dollar-waves.vue')),
  'every-eight': defineAsyncComponent(() => import('./_components/every-eight.vue')),
  'fixed-recharge': defineAsyncComponent(() => import('./_components/fixed-recharge.vue')),
  'invite-friends': defineAsyncComponent(() => import('./_components/invite-friends.vue')),
  'invite-friends-record': defineAsyncComponent(() => import('./_components/invite-friends-record.vue')),
  'invite': defineAsyncComponent(() => import('./_components/invite.vue')),
  'member-appreciation': defineAsyncComponent(() => import('./_components/member-appreciation.vue')),
  'mysterious-mine': defineAsyncComponent(() => import('./_components/mysterious-mine.vue')),
  'mystery-box': defineAsyncComponent(() => import('./_components/mystery-box.vue')),
  'old-signin-rewards': defineAsyncComponent(() => import('./_components/old-signin-rewards.vue')),
  'recharge': defineAsyncComponent(() => import('./_components/recharge.vue')),
  'signin-rewards': defineAsyncComponent(() => import('./_components/signin-rewards.vue')),
  'wallet-payment-deposit': defineAsyncComponent(() => import('./_components/wallet-payment-deposit.vue')),
  'weekly-giveaway': defineAsyncComponent(() => import('./_components/weekly-giveaway.vue')),
  'word-collection-roulette': defineAsyncComponent(async () => {
    const { ActivityCollection } = await import('@tg/activity/core')
    return ActivityCollection
  }),
}
const currentComponent = computed(() => componentList[id.value])

function setTitle(v: string) {
  title.value = v
}

provide('setTitle', setTitle)
</script>

<template>
  <AppPageLayout :title="title">
    <Suspense timeout="0">
      <component :is="currentComponent" />
      <template #fallback>
        <AppLoading />
      </template>
    </Suspense>
  </AppPageLayout>
</template>

<style lang='scss' scoped>

</style>
