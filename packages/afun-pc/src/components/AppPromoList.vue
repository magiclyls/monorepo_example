<script lang="ts" setup>
import { ApiMemberPromoList } from '@tg/apis'

const { openActivity } = useActivityMenu()

const { t } = useI18n()
const currentCategoryId = ref('')
const firstLoading = ref(true)
const { isMobile } = storeToRefs(useWindowStore())
const appStore = useAppStore()
const { isLogin } = storeToRefs(appStore)

/* const {
  data: dataCategoryList,
  loading: loadCategoryList,
  runAsync: runAsyncCategoryList,
  mutate: mutateCate,
} = useRequest(ApiMemberPromoCategory, {
  onSuccess(data) {
    data = data || []
    mutateCate([{
      id: '',
      lang: '',
      name: t('finance_other_tab_all'),
      sorting: 0,
      updated_at: 0,
      updated_name: '',
      updated_uid: '',
    }, ...data])
    const firstCateId = ''
    if (currentCategoryId.value === undefined)
      currentCategoryId.value = firstCateId
  },
}) */
const {
  data: dataPromoList,
  loading: loadPromoList,
  runAsync: runAsyncPromoList,
  mutate,
} = useRequest(ApiMemberPromoList, {
  onSuccess(data) {
    firstLoading.value = false
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

/* const currentCategory = computed(() => {
  return dataCategoryList.value?.find(item => item.id === currentCategoryId.value)
}) */
/* const cateListOptions = computed(() => {
  return dataCategoryList.value?.map((item) => {
    return {
      label: item.name,
      value: item.id,
      text: item.name,
    }
  }) || []
}) */

/* function changeType(item: CategoryItem) {
  currentCategoryId.value = item.id
} */

let stopWatch1: any = null
onActivated(() => {
  stopWatch1 = watch([currentCategoryId, isLogin], ([newValue]) => {
    runAsyncPromoList({ category: '0', cate_id: newValue })
  })
  if (firstLoading.value)
    runAsyncPromoList({ category: '0', cate_id: currentCategoryId.value })

  // runAsyncCategoryList()
})
onDeactivated(() => {
  if (stopWatch1) {
    stopWatch1()
    stopWatch1 = null
  }
})
</script>

<template>
  <AppLoading v-if="firstLoading" />
  <div v-else class="my-[16px] flex" :class="[isMobile ? 'flex-col' : '']">
    <!-- paoluo老板要求去掉分类 -->
    <!--     <template v-if="Number(dataCategoryList?.length) > 1">
        <div v-if="isMobile" class="theme-activity-type mb-[16px] flex items-center justify-between">
          <span class="text-tg-text-white text-sm font-semibold">
            {{ t('activity_type') }}
          </span>
          <BaseSelect
            v-model="currentCategoryId"
            style="--tg-base-select-popper-style-padding-y: 11px;"
            popper :options="cateListOptions"
          />
        </div>
        <div v-else class="bg1 category mr-[22px] flex flex-col gap-[10px] rounded-[5px] pb-[6px]">
          <BaseButton
            v-for="item in dataCategoryList" :key="item.id" :class="{
              'primary': currentCategoryId === item.id,
              'text-active': currentCategoryId === item.id,
            }" class="btn-default h-[34px] flex items-center" style="--tg-base-button-justify-content:space-around;--tg-spacing-button-padding-vertical-xs:3px;--tg-spacing-button-padding-horizontal-xs:5px;" @click="changeType(item)"
          >
            <span
              class="line-clamp-2 max-w-[44px] break-all text-[12px]"
            >{{ item.name }}</span>
          </BaseButton>
        </div>
      </template> -->
    <div class="flex-1">
      <!-- <AppLoading v-if="loadPromoList" /> -->
      <div class="grid grid-cols-1 gap-x-[24px] gap-y-[16px] grid-container">
        <div v-for="item of dataPromoList" :key="item.id" class="cursor-pointer" @click="openActivity(item, 1)">
          <div class="theme-card relative overflow-hidden">
            <!-- <div
          v-if="item.ty !== 5" class="absolute left-0 top-0 z-[1] rounded-ee rounded-ss px-[12px] text-[9px] leading-[12px] font-[600]"
          :class="[item.state === 1 ? 'text-tg-text-black bg-tg-text-green' : 'text-tg-secondary-light bg-tg-text-placeholder']"
        >
          {{ formatState(item.state) }}
        </div>
        <div v-else class="text-tg-text-black bg-tg-text-green absolute left-0 top-0 z-[1] rounded-ee rounded-ss px-[12px] text-[9px] leading-[12px] font-[600]">
          {{ t('see_now') }}
        </div> -->
            <BaseAspectRatio ratio="384/143">
              <BaseImage loading="eager" width="100%" is-network :url="item.images" />
            </BaseAspectRatio>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
/* sm (>=640px) 时两列 */
@media (min-width: 640px) {
  .grid-container {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* lg (>=1024px) 时三列 */
@media (min-width: 1024px) {
  .grid-container {
    grid-template-columns: repeat(3, 1fr);
  }
}

[theme='green'] {
  --tg-base-select-popper-active-color: #5ecea6;
}
</style>

<style lang="scss" scoped>
.category {
  --tg-font-size-base: 18px;
  .secondary {
    --tg-icon-color: #05080a;
  }
  @include webTheme('green') {
    background-color: transparent;
    --tg-base-button-style-bg: #055434;
    --tg-base-button-color: #42bc91;
  }
}
/* .text-active{
  color:#05080A;
  @include webTheme('greenblack') {
    color: var(--tg-text-black-secondary);
  }

} */
.bg1 {
  background-color: #1a2c37;
  @include webTheme('white') {
    background-color: transparent;
  }
}
.btn-default:not(.primary) {
  @include webTheme('white') {
    background-color: var(--tg-secondary-grey);
    color: var(--tg-secondary-light);
  }
}
.theme-activity-type {
  @include webTheme('white') {
    --tg-text-white: #111111;
    --tg-base-select-popper-label-color: #111111;
    --tg-icon-color: #555555;
    --tg-base-select-popper-bg-color: #f5f5f5;
  }
}
.theme-card {
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
  @include webTheme('white') {
    border-radius: 4px;
  }
}
</style>
