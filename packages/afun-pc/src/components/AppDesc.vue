<script setup lang="ts">
// @ts-nocheck
import type { GameDetails } from '@tg/types'
import type { Column } from '@tg/types'
import { ApiMemberBigWinnerList, ApiMemberFavDelete, ApiMemberFavInsert, ApiMemberLuckyWinnerList } from '@tg/apis'
import { toFixed } from '~/utils/number'
import { IconUniCup1, IconUniHidden, IconUniArrowDown, IconUniFavorites, IconChessStar } from '@tg/icons'

interface Props {
  name: string
  platName: string
  vid?: string
  showContent?: boolean
  isOriginalGame?: boolean
  gameId?: string
  gameType?: string
  gameDetails?: GameDetails
}
defineOptions({
  name: 'AppDesc',
})
const props = withDefaults(defineProps<Props>(), {
  showContent: true,
})

const { isMobile } = storeToRefs(useWindowStore())
const route = useRoute()
const { t } = useI18n()
const { push } = useLocalRouter()
const { allPlatformList } = storeToRefs(useCasinoStore())
const { query } = useRoute()
const { bool: isFavorite } = useBoolean(+(props.gameDetails?.is_fav ?? 0) === 1)
const { bool: showContent, toggle: toggleShowContent } = useBoolean(props.showContent)
const id = ref(props.gameDetails ? props.gameDetails.id : '')
const {
  widthBoundaryXs,
  appContentWidth,
} = storeToRefs(useWindowStore())

const tab = ref('1')
const tabList = computed(() => {
  const arr = [
    { value: '1', label: t('big_winner') },
    { value: '0', label: t('lucky_winner') },
  ]
  if (!isMobile.value && !route.path.includes('casino/original-game'))
    arr.push({ value: '2', label: t('description') })

  return arr
})
const columns = ref<Column[]>([
  {
    title: t('ranking'),
    width: '10%',
    dataIndex: 'rank',
    slot: 'rank',
    align: 'left',
    skeWidth: '30px',
  },
  {
    title: t('gamer'),
    width: '20%',
    dataIndex: 'username',
    slot: 'player',
    align: 'center',
    skeWidth: '30px',
  },
  {
    title: t('date'),
    width: '20%',
    dataIndex: 'created_at',
    slot: 'bet_time',
    align: 'center',
    skeWidth: '50px',
  },
  {
    title: t('menu_title_settings_bets'),
    width: '20%',
    dataIndex: 'bet_amount',
    slot: 'betMoney',
    align: 'center',
    skeWidth: '50px',
  },
  {
    title: t('multiple_count'),
    width: '10%',
    dataIndex: 'factor',
    slot: 'factor',
    align: 'center',
    skeWidth: '50px',
  },
  {
    title: t('sports_payment_amount'),
    width: '20%',
    dataIndex: 'pay_amount',
    slot: 'payAmount',
    align: 'right',
    skeWidth: '50px',
  },
])

// 添加收藏
const { run: runFavInsert } = useRequest(() => ApiMemberFavInsert(id.value), {
  onSuccess() {
    isFavorite.value = true
  },
})
// 删除收藏
const { run: runFavDelete } = useRequest(() => ApiMemberFavDelete(id.value), {
  onSuccess() {
    isFavorite.value = false
  },
})

// 大赢家数据
const { data: bigWinnerData, run: runBigWinner } = useRequest(() => ApiMemberBigWinnerList({
  page: 1,
  page_size: 3,
  game_code: props.gameId || query.code?.toString() || query.game_id?.toString(),
  game_class: props.gameType || query.type?.toString() || query.game_class?.toString(),
}), {
  manual: false,
})
// 幸运赢家数据
const { data: luckyWinnerData, run: runLuckyWinner } = useRequest(() => ApiMemberLuckyWinnerList({
  page: 1,
  page_size: 3,
  game_code: props.gameId || query.code?.toString() || query.game_id?.toString(),
  game_class: props.gameType || query.type?.toString() || query.game_class?.toString(),
}), {
  manual: false,
})

const isBigWinner = computed(() => tab.value === '1')
const isLuckyWinner = computed(() => tab.value === '0')
const list = computed(() => {
  if (isBigWinner.value && bigWinnerData.value)
    return bigWinnerData.value.data || []

  else if (isLuckyWinner.value && luckyWinnerData.value)
    return luckyWinnerData.value.data || []

  return []
})
const luckyFactor = computed(() => list.value[0]?.factor)
const luckyWinner = computed(() => list.value[0]?.username)
const isXs = computed(() => appContentWidth.value <= widthBoundaryXs.value)
const gameProviderName = computed(() => {
  return allPlatformList.value?.find(
    a => a.id === props.gameDetails?.platform_id,
  )?.name ?? '-'
})

function checkPlatGameList() {
  if (props.isOriginalGame)
    push('/casino/group/category?cid=6&ty=1') // ${query.ty ? `&ty=${query.ty}` : ''}
  else
    push(`/casino/group/provider?vid=${props.vid}${query.ty ? `&ty=${query.ty}` : ''}`)
}

function onClickFavorite() {
  if (isFavorite.value)
    return runFavDelete()
  runFavInsert()
}

const prefixTitle = computed(() => props.name?.charAt(0).toUpperCase() + props.name?.slice(1))

usePageTitle({
  prefix: prefixTitle,
})

watch(() => props.name, () => {
  runBigWinner()
  runLuckyWinner()
})

watchEffect(() => {
  isFavorite.value = +(props.gameDetails?.is_fav ?? 0) === 1
})

watch(isMobile, () => {
  if (isMobile.value && tab.value === '2')
    tab.value = '1'
})
</script>

<template>
  <div
    class="app-desc margin-auto home-container"
    :style="{ padding: isMobile ? 'var(--tg-spacing-24) 16px' : 'var(--tg-spacing-24)' }"
  >
    <div class="desc-title">
      <div class="title-left">
        <span class="game-name">{{ name }}</span>
        <span class="plat-name" @click="checkPlatGameList">
          {{ platName }}
        </span>
      </div>
      <div class="title-right">
        <div v-if="!isXs && list && list.length" class="r-status">
          <IconUniCup1 />
          <span v-if="list && list.length">{{ application.numberToLocaleString(Number(luckyFactor ?? 0)) }}x</span>
          <div v-if="luckyWinner" class="player">
            {{ luckyWinner }}
          </div>
          <VTooltip v-else placement="top">
            <div class="cursor-help">
              <IconUniHidden />
              <span>{{ t('hidden_user') }}</span>
            </div>
            <template #popper>
              <div class="tiny-menu-item-title">
                {{ t('user_turn_on_hidden') }}
              </div>
            </template>
          </VTooltip>
        </div>
        <div class="r-arrow" :class="[showContent ? 'down' : 'left']" @click="toggleShowContent">
          <IconUniArrowDown />
        </div>
      </div>
    </div>
    <!-- 包裹过渡 -->
    <div v-show="showContent" class="wrap">
      <div class="desc-tab">
        <BaseTab
          v-model="tab" :list="tabList" :center="false"
          style="--tg-tab-style-wrap-bg-color: var(--tg-primary-main);"
        />
      </div>
      <div class="scroll-x winner-content">
        <BaseTable v-if="tab !== '2'" class="theme-table" :columns="columns" :data-source="list" :skeleton-row="3">
          <template #rank="{ record, index }">
            <div v-if="index < 3" class="rank-icon">
              <component :is="`IconUniRank${index + 1}`" />
            </div>
            <div v-else>
              {{ index + 1 }}th
            </div>
          </template>

          <template #player="{ record }">
            <VTooltip placement="top">
              <div class="cursor-help">
                <IconUniHidden /> <span>{{ t('hidden_user') }}</span>
              </div>
              <template #popper>
                <div class="tiny-menu-item-title">
                  {{ t('user_turn_on_hidden') }}
                </div>
              </template>
            </VTooltip>
          </template>

          <template #bet_time="{ record }">
            <div>
              {{ timeToFormatByBoss(record.created_at) }}
            </div>
          </template>

          <template #betMoney="{ record }">
            <div class="img-text-align img-text-align-center">
              <AppAmount
                :amount="record.bet_amount" :show-icon="false" :currency-type="getCurrencyConfigByCode(record.currency_id)?.name"
                style="--tg-app-amount-font-weight:var(--tg-font-weight-normal);"
              />
            </div>
          </template>

          <template #payAmount="{ record }">
            <div class="img-text-align img-text-align-right">
              <AppAmount
                :amount="record.pay_amount" :currency-type="getCurrencyConfigByCode(record.currency_id)?.name"
                style="--tg-app-amount-font-weight:var(--tg-font-weight-normal);"
              />
            </div>
          </template>

          <template #factor="{ record }">
            {{ `${application.numberToLocaleString(Number(record.factor ?? 0))}x` }}
          </template>
        </BaseTable>
        <div v-if="tab === '2'">
          <div class="mobile-header">
            <div class="img-wrap">
              <div v-if="gameDetails?.img" class="img">
                <BaseImage :url="gameDetails?.img" is-cloud />
              </div>
            </div>
            <div class="info-wrap">
              <div class="main-info">
                <div class="flex">
                  <span class="game-name">
                    {{ gameDetails?.name }}
                  </span>
                  <div
                    class="icon-button ml-[11px] flex items-center text-[18px]"
                    :class="{ 'is-isFavorite': isFavorite }"
                    @click="onClickFavorite"
                  >
                    <component :is="`${isFavorite ? 'IconUniFavorites' : 'IconChessStar'}`" />
                  </div>
                </div>
                <BaseButton type="text" size="none">
                  <span
                    class="game-provider"
                    @click="push(`/casino/group/provider?vid=${vid}`)"
                  >
                    {{ gameProviderName }}
                  </span>
                </BaseButton>
                <span v-if="+(gameDetails?.rtp || 0) > 0" class="rtp-style">RTP：{{ toFixed(gameDetails?.rtp || 0, 2) }}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.app-desc-base-image {
  --tg-base-img-style-radius: var(--tg-radius-xs);
}
.theme-table {
  --tg-table-odd-background: var(--tg-secondary-grey);
  @include webTheme('white') {
    --tg-table-odd-background: #fff;
  }
}
.app-desc {
  background-color: var(--tg-secondary-dark);
  color: var(--tg-text-white);
  border-radius: var(--tg-radius-md);
  margin-top: var(--tg-spacing-14);
  @include webTheme('white') {
    border-radius: 4px;
    background: #f5f5f5;
    color: #111111;
    --tg-tab-style-color: #111111;
    --tg-table-th-color: #555555;
    --tg-text-lightgrey: #555555;
    --tg-table-td-font-weight: 400;
  }
  @include webTheme('green') {
    background-color: #055434;
  }

  .desc-title {
    font-weight: var(--tg-font-weight-semibold);
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 32.5px;

    .title-left {
      width: 100%;
      overflow: hidden;
      display: flex;
      // gap: var(--tg-spacing-8);

      .game-name {
        max-width: 100%;
        display: inline;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        text-transform: capitalize;
        margin-right: var(--tg-spacing-8);
      }

      .plat-name {
        max-width: 100%;
        display: inline;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        color: var(--tg-text-lightgrey);
        text-transform: capitalize;
        @include webTheme('white') {
          color: #555555;
        }
        @include webTheme('green') {
          color: #3cb389;
        }

        &:hover {
          color: var(--tg-text-white);
        }
      }
    }

    .title-right {
      display: flex;
      justify-content: right;
      align-items: center;

      .r-status {
        background-color: var(--tg-secondary-main);
        color: var(--tg-text-lightgrey);
        display: flex;
        align-items: center;
        justify-content: space-around;
        height: 32px;
        font-size: var(--tg-font-size-xs);
        border-radius: var(--tg-radius-3xl);
        padding: 0 var(--tg-spacing-16);
        margin-right: var(--tg-spacing-10);

        > span {
          margin: 0 var(--tg-spacing-8);
        }
      }

      .r-arrow {
        padding: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 17.5px;
        cursor: pointer;

        > svg {
          transition: var(--tg-transition);
        }

        &:hover {
          --tg-icon-color: var(--tg-text-white);
        }

        &.left {
          svg {
            transform: rotate(90deg);
          }
        }
      }

      .player {
        font-size: var(--tg-font-size-default);
      }
    }
  }

  .wrap {
    animation: down 0.2s linear;
    overflow: hidden;

    @keyframes down {
      0% {
        transform: translateY(-10px);
        opacity: 0;
      }

      100% {
        transform: translateY(0px);
        opacity: 1;
      }
    }

    .desc-tab {
      max-width: 360px;
      margin-top: var(--tg-spacing-12);
    }

    .desc-content {
      margin-top: var(--tg-spacing-16);

      .c-img {
        width: 150px;
        height: 200px;

        &.float-left {
          float: left;
          margin-right: var(--tg-spacing-16);
        }

        margin: 0 auto var(--tg-spacing-20);
      }

      .c-text {
        .text-tags {
          display: flex;
          flex-wrap: wrap;

          p {
            background-color: var(--tg-secondary-main);
            color: var(--tg-text-lightgrey);
            padding: var(--tg-spacing-2) var(--tg-spacing-8);
            margin: var(--tg-spacing-8) var(--tg-spacing-8) 0 0;
            border-radius: var(--tg-radius-lg);
            font-weight: var(--tg-font-weight-semibold);

            a:hover {
              color: var(--tg-text-white);
            }

            span {
              color: var(--tg-text-white);
            }
          }

          &:nth-child(1) {
            font-size: var(--tg-font-size-xs);

            p {
              margin-top: 0;
            }
          }

          &:nth-child(2) {
            margin: var(--tg-spacing-8) 0 var(--tg-spacing-20);
            font-size: var(--tg-font-size-default);
          }
        }
      }

      .text {
        p {
          color: var(--tg-text-lightgrey);
          margin-bottom: var(--tg-spacing-12);
          line-height: var(--tg-spacing-24);
        }
      }
    }

    .winner-content {
      margin-top: var(--tg-spacing-12);
      --tg-table-even-background: initial;
      --tg-table-odd-background: #02432d;

      .rank-icon {
        display: flex;
        font-size: 21px;
      }

      .img-text-align {
        display: flex;
        align-items: center;

        > svg {
          margin: 0 var(--tg-spacing-4);
        }
      }

      .img-text-align-center {
        justify-content: center;
      }

      .img-text-align-right {
        justify-content: right;
      }
    }

    .challenge-content {
      margin-top: var(--tg-spacing-12);
      padding: var(--tg-spacing-16);
    }
  }

  .cursor-help {
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: help;

    span {
      font-size: var(--tg-font-size-default);
      margin-left: var(--tg-spacing-4);
      font-weight: var(--tg-font-weight-semibold);
      white-space: nowrap;
      @include webTheme('white') {
        font-weight: 400;
      }
    }
  }

  .player {
    color: var(--tg-text-white);
    font-weight: var(--tg-font-weight-semibold);
    cursor: pointer;

    &:active {
      transform: scale(0.96);
    }
  }
}

.mobile-header {
  display: grid;
  grid-gap: var(--tg-spacing-16);
  grid-template-columns: 156px 1fr;
  margin-bottom: var(--tg-spacing-4);

  .img-wrap {
    position: relative;

    .img {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      border-radius: var(--tg-radius-md);
      overflow: hidden;
    }

    &::before {
      content: '';
      display: block;
      width: 100%;
      padding-top: 133.8235294118%;
    }
  }

  .info-wrap {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: auto;
    min-height: 60%;

    .main-info {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      line-height: 1.5;
      gap: 8px;
      font-weight: 600;

      .game-name {
        font-size: var(--tg-font-size-md);
      }

      .game-provider {
        color: var(--tg-text-lightgrey);
        @include webTheme('white') {
          color: #555555;
        }
      }
    }

    .info-controls {
      display: flex;
      align-items: center;
      width: 100%;
      padding-top: var(--spacing-0-5);
    }
  }
}
.rtp-style {
  color: var(--tg-text-lightgrey);

  @include webTheme('white') {
    color: #f2ca5c;
  }
}
</style>
