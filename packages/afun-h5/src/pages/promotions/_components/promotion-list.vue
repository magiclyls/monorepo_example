<script setup lang='ts'>
import { ApiMemberPromoList } from '@tg/apis'
import { AfunBaseButton, AfunBaseEmpty, AfunBaseImage } from '@tg/bccomponents'
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
    <div v-if="dataPromoList && dataPromoList.length > 0" class="grid grid-cols-1  gap-y-[12px] @lg:grid-cols-3 @sm:grid-cols-2 font-[600] text-[14px]">
      <div v-for="item of dataPromoList || []" :key="item.id" class="bg-[#213743] rounded-[4px] border border-solid border-[#213743] cursor-pointer flex flex-col py-[6px] gap-[6px]" @click="openActivity(item, 1)">
        <div class="text-[#FFFFFF] leading-[20px] text-[14px] px-[8px]">
          {{ item.name }}
        </div>
        <AfunBaseImage loading="eager" width="100%" is-network :url="item.images" />
        <div class="px-[8px] flex justify-between items-center">
          <span class="text-[#B1BAD3] text-[12px]"><!-- {{ item.start_at_tz }}-{{ item.end_at_tz }} --></span>
          <AfunBaseButton class="read-btn" style="--afun-base-button-font-size:14px;" @click="openActivity(item, 1)">
            {{ t('阅读更多') }}
          </AfunBaseButton>
        </div>
      </div>
    </div>
    <AfunBaseEmpty v-else class="mt-[100px]" img="/m/afun-h5/png/uni-table-empty.png" :description="t('暂无活动')" />
  </div>
</template>

<style lang='scss' scoped>
  .read-btn {
  --afun-base-button-padding-y: 6px;
  --afun-base-button-padding-x: 6px;
  --afun-base-button-border-radius: 4px;
  --afun-base-button-line-height: 16px;
  --afun-base-button-font-size: 12px;
  --afun-base-button-font-weight: 500;
}
</style>
