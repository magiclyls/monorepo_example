<script setup lang="ts">
import { ApiMemberGameCate,ApiMemberGameCateGames } from '@tg/apis'
import { throttle, toLower } from 'lodash'
import { getEnv } from '@tg/utils';

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

defineOptions({
  name: 'AppCasinoCateList',
})
const props = defineProps<Props>()
const emit = defineEmits(['fetchEnd', 'fetchStart'])
const casinoStore = useCasinoStore()
const { globleDisplay_num} = storeToRefs(casinoStore)

const { VITE_CASINO_HOME_PAGE_SIZE } = getEnv()
const { t } = useI18n()
const appStore = useAppStore()
const { theme } = storeToRefs(appStore)
const { push } = useLocalRouter()
const { openNotify } = useNotify()
const paginationConfig = reactive({
  page: 1,
  page_size: VITE_CASINO_HOME_PAGE_SIZE,
})

// 当前场馆id
const nowVenueId = ref('')

const params = computed(() => {
  return {
    cid: props.detail.cid,
    ty: props.detail.ty,
  }
})
const memberGameCateGamesParams = computed(() => {
  return {
    ...params.value,
    sort: EnumCasinoSortType.hot,
    ...paginationConfig,
  }
})

const { data, runAsync, loading } = useRequest(ApiMemberGameCate)
const { data: moreList, runAsync: runMoreMemberGameCateGames, loading: moreLoading } = useRequest(ApiMemberGameCateGames)
const display_num = computed(()=>{
  if(data.value?.display_num) {
    return data.value.display_num
  } else {
    return  globleDisplay_num.value
  }

})
const componentList = computed(() => {
  // if (data.value && data.value.lnavs) {
  //   const list = data.value.lnavs.map((a) => {
  //     let platform_id = a.platform_id
  //     if (toLower(a.name) === 'new' || toLower(a.name) === 'hot')
  //       platform_id = toLower(a.name)
  // if (data.value && data.value.lnavs) {
  //   const list = data.value.lnavs.map((a) => {
  //     let platform_id = a.platform_id
  //     if (toLower(a.name) === 'new' || toLower(a.name) === 'hot')
  //       platform_id = toLower(a.name)

  //     let component = null
  //     if (a.ty === 6 || a.ty === 7)
  //       component = defineAsyncComponent(() => import('~/components/AppCasinoMultiLine.vue'))
  //     let component = null
  //     if (a.ty === 6 || a.ty === 7)
  //       component = defineAsyncComponent(() => import('~/components/AppCasinoMultiLine.vue'))

  //     else
  //       component = defineAsyncComponent(() => import('~/components/AppCasinoCateList.vue'))
  //     else
  //       component = defineAsyncComponent(() => import('~/components/AppCasinoCateList.vue'))

  //     return {
  //       ...a,
  //       platform_id,
  //       path: `/casino/group/category?cid=${a.cid}&ty=${a.ty ?? props.detail.ty}`,
  //       gameList: a.nav_games?.map((b, i) => {
  //         return {
  //           item_nums: a.item_nums && a.item_nums.length > 0 ? a.item_nums[i] ?? 4 : 4,
  //           list: toRaw(b),
  //         }
  //       }),
  //       component,
  //     }
  //   })
  //   return list
  // }
  return [] as ComponentItem[]
})

const currentObject = computed(() => {
  const _0 = componentList.value.find(item => item.platform_id === nowVenueId.value)
  return _0 as any
})

const notifyThrottle = throttle(() => {
  openNotify({
    type: 'info',
    message: t('no_game_info_tip'),
  })
}, 5 * 1000, { leading: true, trailing: false })

const isProvider = computed(() => props.detail.cid === '5')
const isLottery = computed(() => data.value?.id === '703')

const total = computed(() => data.value ? data.value.total : 0)

// 当前的分类
const tabs = computed(() => {
  if (data.value && data.value.lnavs) {
    const list = data.value.lnavs.map((a) => {
      let platform_id = a.platform_id
      if (toLower(a.name) === 'new' || toLower(a.name) === 'hot')
        platform_id = toLower(a.name)

      return {
        ...a,
        platform_id,
      }
    })
    return list
  }
  return []
})

// 单行数据
const list = computed(() => {
  if (!(data.value && data.value.games && data.value.games.length))
    return []

  const renderList: any = data.value.games

  if (moreList.value?.d && moreList.value.d.length)
    renderList.push(...moreList.value.d)

  return renderList
})
// 多行数据
const litems = computed(() => {
  if (data.value && data.value.litems) {
    return data.value.litems.map((a) => {
      return {
        ...a,
        path: `/casino/group/category?cid=${a.cid}&ty=${a.ty ?? props.detail.ty}`, // props.ty
      }
    })
  }
  return []
})
// 游戏供应商数据 平铺
const providerList = computed(() => {
  if (data.value && data.value.venue && !!data.value.venue.pc)
    return data.value.venue.pc[0]

  return []
})

function _push() {
  // if (props.detail.cid === '6')
  //   push(`/casino/group/provider?vid=801&ty=${props.detail.ty}`)

  if (props.detail.cid === '5')
    push(`/casino/collection/provider?ty=${props.detail.ty}`)

  else
    push(`/casino/group/category?cid=${props.detail.cid}&ty=${props.detail.ty}`)
}

function goPage(item: any) {
  if (item.maintained === '2')
    return
  push(`/casino/group/provider?vid=${item.id}&ty=${props.detail.ty}`)
}

function getNextData() {
  paginationConfig.page++
  runMoreMemberGameCateGames({ ...memberGameCateGamesParams.value })
  runMoreMemberGameCateGames({ ...memberGameCateGamesParams.value })
}

function judgeGameEmpty(res: any) {
  if (isProvider.value && res.venue)
    return
  if (res.lnavs && res.lnavs.length) {
    if (res.lnavs.filter((item: any) => item.nav_games && item.nav_games.length).length === 0)
      notifyThrottle()
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
    if (name === 'new' || name === 'hot')
      nowVenueId.value = name

    else
      nowVenueId.value = res.lnavs?.[0]?.platform_id

    judgeGameEmpty(res)
  })
})
</script>

<template>
  <AppLoading v-if="loading" full-screen />
  <div v-else class="list-wrap">
    <AppGameVenueTabs v-if="tabs.length" v-model:active="nowVenueId" class="mt-[8px]" show-hot :list="tabs" />
    <template v-if="componentList.length === 0 && litems.length === 0">
      <div class="mb-10 flex items-center justify-between">
        <BaseButton
          type="text" size="none"
          @click="_push"
        >
          <div class="title">
            <AppImage
              v-if="detail.icon" class="icon-img flex-shrink-0"
              :url="detail.icon"
              loading="eager"
              is-cloud with-theme
            />
            <span class="whitespace-nowrap">{{ detail.name }}</span>
          </div>
        </BaseButton>
        <div class="right-wrap flex">
          <BaseButton
            v-if="total"
            type="square-line" class="h-28"
            style="--tg-base-button-color:var(--tg-text-lightgrey);--tg-base-button-padding-x:18px; --tg-base-button-font-size:16px;--tg-base-button-square-line-border-color:var(--tg-border-color-grey-light);"
            @click="_push"
          >
            <span class="theme-all">{{ t('finance_other_tab_all') }}</span>
            <span class="total ml-5">{{ total }}</span>
          </BaseButton>
        </div>
      </div>
      <!-- 平铺 -->
      <AppCardList v-if="isProvider" :list="providerList" is-provider :display-num="display_num">
        <template #default="{ item }">
          <BaseProviderItem
            :url="item.icon"
            :maintained="item.maintained"
            @click="goPage(item)"
          />
        </template>
      </AppCardList>

      <!-- 普通的游戏列表 -->
      <AppCardList v-show="!isLottery" :list="list" :display-num="display_num" />
      <AppGameLotteryList v-show="isLottery" :list="list" />

      <AppPercentage v-if="list.length && !isLottery" :total="total" :percentage="list?.length" class="mt-24" />
      <div v-show="total > VITE_CASINO_HOME_PAGE_SIZE" class="load-more">
        <BaseButton
          v-show="list && list?.length < total" size="md" bg-style="red" :loading="moreLoading"
          class="theme-more"
          @click="getNextData"
        >
          <div>
            {{ $t('load_more') }}
          </div>
        </BaseButton>
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
      <template
        v-for="item in litems"
        :key="item.name"
      >
        <template v-if="theme === 'greenblack'">
          <AppSliderMultiLineWg
            v-if="item.nav_games && item.nav_games.length"
            :total="item.total"
            :icon="item.icon"
            :title="item.name"
            :data="item.nav_games && item.nav_games.length ? item.nav_games : []"
            :cid="item.cid"
            :ty="item.ty"
            :pid="item.platform_id"
            :path="item.path"
            use-cloud-img
          />
        </template>
        <template v-else>
          <AppSliderMultiLine :display-num="globleDisplay_num"
            v-if="item.nav_games && item.nav_games.length"
            :total="item.total"
            :icon="item.icon"
            :title="item.name"
            :data="item.nav_games && item.nav_games.length ? item.nav_games : []"
            :cid="item.cid"
            :ty="item.ty"
            :pid="item.platform_id"
            :path="item.path"
            use-cloud-img
          />
        </template>
      </template>
    </template>
  </div>
</template>

<style lang="scss" scoped>
.theme-more {
  @include webTheme('green') {
    --tg-base-button-style-bg: #055434;
  }
}

.theme-all {
  @include webTheme('green') {
    font-size: 16px;
    color: #FFFFFF;
  }
}

.list-wrap {
  margin-top: var(--tg-spacing-10);

  .title {
    font-size: var(--tg-font-size-base);
    color: var(--tg-text-white);
    display: flex;
    align-items: center;
    height: var(--tg-spacing-35);
    --app-sport-image-error-icon-size: 28px;

    @include webTheme('green') {
      --app-sport-image-error-icon-size: 28px;
    }

    @include webTheme('new-default') {
      --app-sport-image-error-icon-size: 28px;
    }

    @include webTheme('greenblack') {
      color: #fff;
    }

    &:hover {
      --tg-icon-color: var(--tg-text-white);
    }

    .icon-img {
      width: 28px;
      height: 28px;

      @include webTheme('green') {
        width: 28px;
        height: 28px;
      }

      @include webTheme('new-default') {
        width: 28px;
        height: 28px;
      }
    }

    span {
      font-size: var(--tg-font-size-md);
      font-weight: var(--tg-font-weight-semibold);
      margin-left: var(--tg-spacing-8);
      line-height: 1.5;
    }
  }
}

.load-more {
  margin-top: var(--tg-spacing-24);
  display: flex;
  justify-content: center;
  text-align: center;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  button {
    width: 184px;
    height: 44px;
  }
}

.search-icon2 {
  :deep(.app-svg-icon) {
    font-size: 18px !important;
  }
}

.search-icon3 {
  :deep(.app-svg-icon) {
    font-size: 14px !important;
  }
}

.total {
  color: var(--tg-text-green);

  @include webTheme('green') {
    font-size: 16px;
    color: #eca30c;
  }

  @include webTheme('greenblack') {
    color: #28FFBB;
  }
}
</style>
