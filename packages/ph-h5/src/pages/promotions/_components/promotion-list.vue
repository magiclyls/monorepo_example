<script setup lang='ts'>
import { ApiMemberPromoList } from '@tg/apis'
import { PhBaseButton, PhBaseEmpty, PhBaseImage } from '@tg/bccomponents'
import { useActivityMenu } from '@tg/hooks'
import { useAppStore } from '@tg/stores'
import { storeToRefs } from 'pinia'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRequest } from 'vue-request'
import AppLoading from '~/components/AppLoading.vue'

defineOptions({ name: 'AppPromotions' })

const { isLogin } = storeToRefs(useAppStore())
const { t } = useI18n()
const { openActivity } = useActivityMenu()

const TIME_FORMAT = 'YYYY/MM/DD'
const currentCategoryId = ref('')

const {
  data: dataPromoList,
  loading: loadPromoList,
  runAsync: runAsyncPromoList,
  mutate,
} = useRequest(ApiMemberPromoList, {
  onSuccess(data) {
    dataPromoList.value = data
    mutate(data.filter((item) => {
      return item.images
    }).filter((item) => {
      if (item.display_mode === 1 && !isLogin.value)
        return false
      if (item.display_mode === 3)
        return false
      return true
    }))
  },
})

runAsyncPromoList({ category: '0', cate_id: currentCategoryId.value })
</script>

<template>
  <AppLoading v-if="loadPromoList" />
  <div v-else class="py-4 ">
    <div v-if="dataPromoList && dataPromoList.length > 0" class="grid grid-cols-1  gap-y-[12rem] @lg:grid-cols-3 @sm:grid-cols-2 font-[500]">
      <div v-for="item of dataPromoList || []" :key="item.id" class="bg-white rounded-[8rem] border border-solid border-[#EBEBEB] cursor-pointer flex flex-col py-[6rem] gap-[6rem]" @click="openActivity(item, 1)">
        <div class="text-[#0D2245] leading-[14rem]  px-[8rem]">
          {{ item.name }}
        </div>
        <div class="h-[130rem]">
          <PhBaseImage loading="eager" width="100%" is-network :url="item.images" />
        </div>
        <div class="px-[8rem] flex justify-between items-center">
          <span class="text-[#6D7693] ">{{ item.start_at_tz }}-{{ item.end_at_tz }}</span>
          <PhBaseButton class="read-btn" @click="openActivity(item, 1)">
            {{ t('阅读更多') }}
          </PhBaseButton>
        </div>
      </div>
    </div>
    <PhBaseEmpty v-else :description="t('暂无活动')">
      <template #icon>
        <PhBaseImage url="/ph-h5/png/uni-table-empty.png" />
      </template>
    </PhBaseEmpty>
  </div>
</template>

<style lang='scss' scoped>
  .read-btn {
  --ph-base-button-padding-y: 6rem;
  --ph-base-button-padding-x: 6rem;
  --ph-base-button-border-radius: 6rem;
  --ph-base-button-line-height: 16rem;
  --ph-base-button-font-size: 12rem;
  --ph-base-button-font-weight: 500;
}
</style>
