<script setup lang="ts">
import { ApiMemberGameCate, ApiMemberGameCateGames } from '@tg/apis'
import { AfunBaseImage, BaseAspectRatio } from '@tg/bccomponents'
import { useCasinoStore } from '@tg/stores'
import { EnumOriginalLotteryVenue } from '@tg/types'
import { throttle, toLower } from 'lodash'
import { computed, defineAsyncComponent, onMounted, ref, toRaw } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRequest } from 'vue-request'
import { useRouter } from 'vue-router'
import AppCasinoGameList from '~/components/AppCasinoGameList.vue'
import AppCasinoGamesTitle from '~/components/AppCasinoGamesTitle.vue'
import AppCasinoMultiLine from '~/components/AppCasinoMultiLine.vue'
import AppGameLotteryList from '~/components/AppGameLotteryList.vue'
import AppGameVenueTabs from '~/components/AppGameVenueTabs.vue'
import AppLoading from '~/components/AppLoading.vue'

import { Message } from '~/utils'

interface ComponentItem {
  cid: string
  name: string
  icon: string
  ty: string | number
  platform_id: string
  // 热门推荐
  isHot?: boolean
}

interface Props {
  detail: ComponentItem
}

const props = withDefaults(defineProps<Props>(), {})
const router = useRouter()
const { t } = useI18n()
const CasinoStore = useCasinoStore()
const notifyThrottle = throttle(() => {
  Message.info(t('暂无游戏内容'))
}, 5 * 1000, { leading: true, trailing: false })

// 当前场馆id
const nowVenueId = ref('')

const params = computed(() => {
  return {
    cid: props.detail.cid,
    ty: props.detail.ty,
  }
})
const { data, runAsync, loading } = useRequest(ApiMemberGameCate, {
  onSuccess: (res, params) => {
    judgeGameEmpty(res)
  },
})
const { data: moreList, runAsync: runMoreMemberGameCateGames, loading: moreLoading } = useRequest(ApiMemberGameCateGames)

const isProvider = computed(() => props.detail.cid === '5')
const isLottery = computed(() => data.value?.id === EnumOriginalLotteryVenue.originalLottery)

const total = computed(() => data.value ? data.value.total : 0)

// 游戏供应商数据 平铺
const providerList = computed(() => {
  if (data.value && data.value.venue && !!data.value.venue.pc)
    return data.value.venue.pc[0]
  return []
})

// 单个游戏数据
const list = computed(() => {
  if (!(data.value && data.value.games && data.value.games.length))
    return []

  const renderList: any = data.value.games
  // const renderList: any = data.value.games.filter((item) => {
  //   if (nowVenueId.value === '') {
  //     return item
  //   }
  //   else {
  //     return item.platform_id === nowVenueId.value
  //   }
  // })

  if (moreList.value?.d && moreList.value.d.length)
    renderList.push(...moreList.value.d)

  return renderList
})

// 多行数据  litems 下面可能是两个数组  代表每一行
const litems = computed(() => {
  if (data.value && data.value.litems) {
    const list = data.value.litems.map((a) => {
      return {
        ...a,
        path: `/group/category/${a.cid}?cid=${a.cid}&ty=${a.ty ?? props.detail.ty}`,
        gameList: a.nav_games?.map((b, i) => {
          const newList = toRaw(b).filter((item) => {
            if (nowVenueId.value === '') {
              return item
            }
            else {
              return item.platform_id === nowVenueId.value
            }
          })
          return {
            item_nums: a.item_nums && a.item_nums.length > 0 ? a.item_nums[i] ?? 4 : 4,
            list: newList,
          }
        }),
      }
    })
    return list
  }
  return []
})

// 当前的分类
const tabs = computed(() => {
  if (data.value && data.value.lnavs) {
    const list = data.value.lnavs.map((a) => {
      let platform_id = a.platform_id
      if (toLower(a.name) === 'new' || toLower(a.name) === 'hot') {
        platform_id = toLower(a.name)
      }
      return {
        ...a,
        platform_id,
      }
    })
    return list
  }
  return []
})

const componentList = computed(() => {
  if (data.value && data.value.lnavs) {
    const list = data.value.lnavs.map((a) => {
      let platform_id = a.platform_id
      if (toLower(a.name) === 'new' || toLower(a.name) === 'hot') {
        platform_id = toLower(a.name)
      }
      let component = null
      if (a.ty === 6 || a.ty === 7) {
        component = defineAsyncComponent(() => import('~/components/AppCasinoMultiLine.vue'))
      }
      else {
        component = defineAsyncComponent(() => import('~/components/AppGameSingleTypeDetails.vue'))
      }
      return {
        ...a,
        platform_id,
        path: `/group/category/${a.cid}?cid=${a.cid}&ty=${a.ty ?? props.detail.ty}`,
        gameList: a.nav_games?.map((b, i) => {
          return {
            item_nums: a.item_nums && a.item_nums.length > 0 ? a.item_nums[i] ?? 4 : 4,
            list: toRaw(b),
          }
        }),
        component,
      }
    })
    return list
  }
  return []
})

const currentObject = computed(() => {
  // console.log(list.filter(item=>item.platform_id === nowVenueId.value),'listfilter');
  const _0 = componentList.value.find(item => item.platform_id === nowVenueId.value)
  return _0 as any
})

// 场馆列表
const sums = computed(() => {
  if (!(data.value && data.value.sums && data.value.sums.length))
    return []

  if (litems.value.length > 0) {
    const all_nav_games: any[] = []
    litems.value.forEach((item1) => {
      item1.nav_games?.forEach((item2) => {
        item2?.forEach((item3) => {
          all_nav_games.push(item3)
        })
      })
    })
    return data.value.sums.filter((item1) => {
      return all_nav_games.find(item2 => item2.platform_id === item1.platform_id)
    })
  }

  return data.value.sums
})

function _push() {
  if (props.detail.cid === '5')
    return (`/group/all-provider?ty=1`)

  else
    return (`/group/category/${props.detail.cid}?cid=${props.detail.cid}&ty=${props.detail.ty}`)
}

function toProvider(item: any) {
  if (item.maintained === '2')
    return
  router.push(`/group/provider/${item.id}?vid=${item.id}&ty=${props.detail.ty}`)
}

function judgeGameEmpty(res: any) {
  if (isProvider.value && res.venue) {
    return ''
  }
  else if (res.lnavs && res.lnavs.length) {
    return ''
  }
  else if (res.litems && res.litems.length) {
    if (res.litems.filter((item: any) => item.nav_games && item.nav_games.length).length === 0)
      notifyThrottle()
  }
  else if (!(res.games && res.games.length)) {
    notifyThrottle()
  }
}

onMounted(() => {
  runAsync({ ...params.value }).then((res) => {
    const name = toLower(res.lnavs?.[0]?.name)
    if (name === 'new' || name === 'hot') {
      nowVenueId.value = name
    }
    else {
      nowVenueId.value = res.lnavs?.[0]?.platform_id
    }
  })
})
</script>

<template>
  <div v-if="loading">
    <AppLoading :height="300" />
  </div>
  <div v-else class="pb-[0]">
    <AppGameVenueTabs v-if="tabs.length" v-model:active="nowVenueId" class="mt-[8px]" show-hot :list="tabs" />
    <!-- 提供商 -->
    <div v-if="isProvider" class="mt-[12px]">
      <AppCasinoGamesTitle class="mb-[8px]" :title="detail.name" :icon="detail.icon" :total="providerList.length" :path="_push()" />
      <div class="grid gap-x-[var(--ph-game-gap-x)] gap-y-[var(--ph-game-gap-y)] grid-cols-3 ">
        <div v-for="item in providerList" :key="item.name" class="overflow-hidden rounded-[6px] cursor-pointer">
          <BaseAspectRatio ratio="312/124">
            <AfunBaseImage class="h-full w-full" is-network :url="item.icon" @click="toProvider(item)" />
          </BaseAspectRatio>
        </div>
      </div>
    </div>
    <div v-else class="mt-[12px]">
      <!-- 平铺 -->
      <template v-if="componentList.length === 0 && litems.length === 0">
        <AppCasinoGamesTitle class="mb-[8px]" :title="detail.name" :icon="detail.icon" :total="total" :path="_push()" />
        <!-- 普通的游戏列表 -->
        <AppCasinoGameList v-if="list.length > 0 && !isLottery" :list="list" />
        <AppGameLotteryList v-else-if="list.length > 0 && isLottery" :list="list" />
        <div
          v-if="list.length < total" class="bg-[#fff] mt-[8px] rounded-[6px] center h-[32px]"
          @click="router.push(_push())"
        >
          {{ t('所有游戏') }}
        </div>
      </template>
      <!-- 新的二级菜单 -->
      <template v-else-if="componentList.length > 0">
        <div v-show="currentObject">
          <KeepAlive>
            <component :is="currentObject?.component" :detail="currentObject" />
          </KeepAlive>
        </div>
      </template>
      <!-- 多行样式 -->
      <template v-else-if="litems.length > 0">
        <AppCasinoMultiLine
          v-for="item in litems" :key="item.ty + item.cid" :detail="item"
          class="mb-[16px] last:mb-0"
        />
      </template>
    </div>
  </div>
</template>

<style scoped lang="scss"></style>
