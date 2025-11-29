<script lang="ts" setup>
import { AfunBaseTabs } from '@tg/bccomponents'
import { useBoolean, useRebateData } from '@tg/hooks'
import { useCasinoStore } from '@tg/stores'
import { SendFlutterAppMessage } from '@tg/types'
import { isFlutterApp, sendMsgToFlutterApp } from '@tg/utils'
import { storeToRefs } from 'pinia'
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import AppLoading from '~/components/AppLoading.vue'
import BaseProviderItem from './BaseProviderItem.vue'

interface Props {
  title: string
  platFormIds: string[]
  defaultTab: string
}
defineOptions({
  name: 'AppActivityVenues',
})
const props = defineProps<Props>()
const router = useRouter()
const casinoStore = useCasinoStore()
const { venueList } = storeToRefs(casinoStore)
const { rebateTypeArr } = useRebateData()
const { bool: isFirst, setFalse: isFirstFalse, setTrue: isFirstTrue } = useBoolean(false)
/** 活动配置 */
const ArrayPlatFormIds = ref(props.platFormIds)
/** 活动场馆 */
/** 0、场馆筛选 */
const allActiVenuesList = computed(() => {
  if (!venueList.value)
    return []
  if (!ArrayPlatFormIds.value)
    return []
  return venueList.value.filter((item: any) => ArrayPlatFormIds.value.includes(item.id))
})
/** 1、分组 */
const groupVenues = computed(() => {
  if (!allActiVenuesList.value)
    return []
  return allActiVenuesList.value.reduce((acc: any, cur: any) => {
    if (!acc[cur.game_type])
      acc[cur.game_type] = []

    acc[cur.game_type].push(cur)
    return acc
  }, {} as Record<string, any[]>)
})

/** 2、分组后排序 */
const sortGroupVenues = computed(() => {
  if (!groupVenues.value)
    return []
  return Object.entries(groupVenues.value).sort((b, a) => Number.parseInt(a[0]) - Number.parseInt(b[0]))
})

/** 3、按game_type分组排序 */
const venuesTabList = computed(() => {
  if (!sortGroupVenues.value)
    return []
  return sortGroupVenues.value.map(([key, item]: [string, any]) => {
    return {
      sortID: rebateTypeArr.filter((a: { value: string }) => a.value === key)?.[0]?.sortID,
      label: rebateTypeArr.filter((a: { value: string }) => a.value === key)?.[0]?.label,
      value: rebateTypeArr.filter((a: { value: string }) => a.value === key)?.[0]?.value,
      icon: rebateTypeArr.filter((a: { value: string }) => a.value === key)?.[0]?.icon,
      imageList: item.map((a: { logo: any, venue_id: any, name: any }) => {
        return {
          url: a.logo,
          value: a.venue_id,
          title: a.name,
        }
      }),
    }
  })
})
/** 4、按照自定义排序 */
const customVenuesTabList = computed(() => {
  if (!venuesTabList.value)
    return []
  return venuesTabList.value.slice().sort((a: any, b: any) => Number.parseInt(a.sortID) - Number.parseInt(b.sortID))
})
const curVenuesVal = ref(customVenuesTabList.value[0]?.value ?? props.defaultTab)

function handleItemClick(id: any, item: any) {
  if (id === undefined || item === undefined)
    return false
  else if (isFlutterApp())
    sendMsgToFlutterApp(SendFlutterAppMessage.OPEN_BACK_CASH_MODAL, { platform_id: id, item })
  else if (+curVenuesVal.value === 4)
    router.push(`/sports`)
  else
    router.push(`/group/provider/${id}?vid=${id}`)
}

function onTabChange() {
  isFirstTrue()
  setTimeout(() => {
    isFirstFalse()
  }, 300)
}
</script>

<template>
  <div class="text-tg-text-white my-[16px] text-[18px] font-[600]">
    {{ title }}
  </div>
  <div class="green-tab">
    <AfunBaseTabs v-model="curVenuesVal" :type="7" :list="customVenuesTabList" @change="onTabChange" />
  </div>
  <div v-if="isFirst" class="center dialog-loading-min-height">
    <AppLoading />
  </div>
  <div v-show="!isFirst" class="grid grid-cols-3 gap-x-[7px] gap-y-[7px] pb-[12px] pt-[7px]">
    <template v-for="venue in customVenuesTabList" :key="venue.value">
      <template v-if="venue.value === curVenuesVal">
        <div v-for="item in venue.imageList" :key="item.title">
          <BaseProviderItem
            :url="item.url"
            @click="handleItemClick(item.value, item)"
          />
        </div>
      </template>
    </template>
  </div>
</template>

<style lang="scss" scoped>
.dialog-loading-min-height {
  min-height: 120px;
}
.green-tab {
  color: #3cb389;
  --tg-text-green-sub: #fff;
  --tg-text-white: #ffefb0;
}
</style>
