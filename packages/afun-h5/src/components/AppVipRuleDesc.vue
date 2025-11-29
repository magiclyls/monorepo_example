<script lang="ts" setup>
import { useVipStore } from '@tg/stores'
import { storeToRefs } from 'pinia'
import { computed, inject } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'

defineOptions({
  name: 'AppVipRuleDesc',
})

const isInPromoVip = inject('isInPromoVip', false)
const route = useRoute()
const { vipRuleDetailData } = storeToRefs(useVipStore())
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
  <div v-if="(route.path.includes('/vip') || isInPromoVip) && rules.length > 0" class="w-full">
    <h6 class="text-[#fff] text-[16px] font-semibold leading-[22px]">
      {{ t('规则说明') }}
    </h6>
    <ul class="ml-[18px] mt-[16px] list-disc">
      <li
        v-for="item, i in rules" :key="i" class="text-[#B1BAD3] mb-[16px] text-[14px] font-[600] leading-[22px] last-of-type:mb-0"
        v-html="item"
      />
    </ul>
  </div>
</template>

<style>
:root {
  --app-vip-rule-desc-color: #6d7693;
}
</style>

<style lang="scss" scoped>

</style>
