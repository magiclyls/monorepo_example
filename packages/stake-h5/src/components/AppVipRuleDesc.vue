<script lang="ts" setup>
defineOptions({
  name: 'AppVipRuleDesc',
})

const isInPromoVip = inject('isInPromoVip')
const route = useRoute()
const { vipRuleDetailData } = storeToRefs(useAppStore())
const { t } = useI18n()

const rules = computed(() => {
  if (vipRuleDetailData.value && vipRuleDetailData.value.value) {
    const arr = JSON.parse(vipRuleDetailData.value.value) as { q: string }[]
    return arr.filter(a => !!a.q).map(b => b.q.replace(/\n/g, '<br>'))
  }
  return []
})
</script>

<template>
  <div v-if="(route.path.includes('/vip') || isInPromoVip) && rules.length > 0" class="app-vip-rule-desc">
    <h6 class="text-tg-text-white text-[20px] font-semibold leading-[28px]">
      {{ t('vip_rules_des') }}
    </h6>
    <ul class="ml-[18px] mt-[16px] list-disc">
      <li
        v-for="item, i in rules" :key="i" class="text-tg-text-lightgrey mb-[16px] text-[16px] font-medium leading-[22px] last-of-type:mb-0"
        v-html="item"
      />
    </ul>
  </div>
</template>

<style>
:root {
  --app-vip-rule-desc-color: var(--tg-text-lightgrey);
}

[theme="white"] {
  --app-vip-rule-desc-color: #484848;
}
</style>

<style lang="scss" scoped>
.app-vip-rule-desc {
  width: 100%;
  border-radius: 8px;
}
</style>
