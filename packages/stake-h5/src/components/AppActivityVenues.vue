<script lang="ts" setup>
interface Props {
  title: string
  platFormIds: string[]
  defaultTab: string
}
defineOptions({
  name: 'AppActivityVenues',
})
const props = defineProps<Props>()
const router = useLocalRouter()
const casinoStore = useCasinoStore()
const { allPlatformList } = storeToRefs(casinoStore)
const { rebateTypeArr } = useRebateData()
const { bool: isFirst, setFalse: isFirstFalse, setTrue: isFirstTrue } = useBoolean(false)
/** 活动配置 */
const ArrayPlatFormIds = ref(props.platFormIds)
/** 活动场馆 */
/** 0、场馆筛选 */
const allActiVenuesList = computed(() => {
  if (!allPlatformList.value)
    return []
  if (!ArrayPlatFormIds.value)
    return []
  return allPlatformList.value.filter(item => ArrayPlatFormIds.value.includes(item.id))
})
/** 1、分组 */
const groupVenues = computed(() => {
  if (!allActiVenuesList.value)
    return []
  return allActiVenuesList.value.reduce((acc, cur) => {
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
  return sortGroupVenues.value.map(([key, item]) => {
    return {
      sortID: rebateTypeArr.filter((a: { value: string }) => a.value === key)?.[0]?.sortID,
      label: rebateTypeArr.filter((a: { value: string }) => a.value === key)?.[0]?.label,
      value: rebateTypeArr.filter((a: { value: string }) => a.value === key)?.[0]?.value,
      icon: rebateTypeArr.filter((a: { value: string }) => a.value === key)?.[0]?.icon,
      imageList: item.map((a: { logo: any; venue_id: any; name: any }) => {
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
  return venuesTabList.value.sort((a, b) => Number.parseInt(a.sortID) - Number.parseInt(b.sortID))
})
const curVenuesVal = ref(customVenuesTabList.value[0]?.value ?? props.defaultTab)

function handleItemClick(id: any, item: any) {
  if (id === undefined || item === undefined)
    return false
  else if (isFlutterApp())
    sendMsgToFlutterApp(SendFlutterAppMessage.OPEN_BACK_CASH_MODAL, { platform_id: id, item })
  else if (+curVenuesVal.value === 4)
    router.push(`/sports/${id}`)
  else
    router.push(`/casino/group/provider?vid=${id}`)
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
    <BaseSquareTab
      v-model="curVenuesVal"
      :has-cloud-img="false" :list="customVenuesTabList"
      style="--tg-base-square-tab-padding-y:6px;--tg-base-square-tab-mobile-justify:flex-start;--tg-base-square-tab-icon-size:16px;--tg-base-square-tab-dot-width:14px"
      @change="onTabChange"
    />
  </div>
  <div v-if="isFirst" class="center dialog-loading-min-height">
    <BaseLoading />
  </div>
  <div v-show="!isFirst" class="grid grid-cols-3 gap-x-[7px] gap-y-[7px] pb-[12px] pt-[7px] @md:gap-x-[16px] @md:gap-y-[16px]">
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
  @include webTheme('green') {
    --tg-icon-color: #3CB389;
    --tg-text-green-sub: #fff;
    --tg-text-white: #FFEFB0;
    // --icon-color: #efd538;

  }
}
</style>
