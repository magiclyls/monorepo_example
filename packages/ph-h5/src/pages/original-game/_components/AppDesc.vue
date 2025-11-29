<script setup lang="ts">
import type { Column, GameDetails } from '@tg/types'
import { ApiMemberBigWinnerList, ApiMemberFavDelete, ApiMemberFavInsert, ApiMemberLuckyWinnerList } from '@tg/apis'
import { PhBaseAmount, PhBaseButton, PhBaseImage, PhBaseTable, PhBaseTabs } from '@tg/bccomponents'
import { useBoolean } from '@tg/hooks'
import { IconChessStar, IconUniArrowDown, IconUniFavorites, IconUniHidden } from '@tg/icons'
import { useCasinoStore } from '@tg/stores'
import { application, getCurrencyConfig, toFixed } from '@tg/utils'
import { timeToFormatDiffOnChinese } from '@tg/vue-i18n'
import { storeToRefs } from 'pinia'
import { computed, ref, watch, watchEffect } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRequest } from 'vue-request'
import { useRoute, useRouter } from 'vue-router'

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

const route = useRoute()
const router = useRouter()
const { t } = useI18n()
const { venueList: allPlatformList } = storeToRefs(useCasinoStore())
const { query } = useRoute()
const { bool: isFavorite } = useBoolean(+props?.gameDetails?.is_fav === 1)
const { bool: showContent, toggle: toggleShowContent } = useBoolean(props.showContent)
const id = ref(props.gameDetails ? props.gameDetails.id : '')

const tab = ref('1')
const tabList = computed(() => {
  const arr = [
    { value: '1', label: t('大赢家') },
    { value: '0', label: t('幸运赢家') },
  ]
  return arr
})
const columns = ref<Column[]>([
  {
    title: t('排名'),
    width: '10%',
    dataIndex: 'rank',
    slot: 'rank',
    align: 'left',
    skeWidth: '30px',
  },
  {
    title: t('玩家'),
    width: '20%',
    dataIndex: 'username',
    slot: 'player',
    align: 'center',
    skeWidth: '30px',
  },
  {
    title: t('日期'),
    width: '20%',
    dataIndex: 'created_at',
    slot: 'bet_time',
    align: 'center',
    skeWidth: '50px',
  },
  {
    title: t('投注'),
    width: '20%',
    dataIndex: 'bet_amount',
    slot: 'betMoney',
    align: 'center',
    skeWidth: '50px',
  },
  {
    title: t('乘数'),
    width: '10%',
    dataIndex: 'factor',
    slot: 'factor',
    align: 'center',
    skeWidth: '50px',
  },
  {
    title: t('支付额'),
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
const list: any[] = computed(() => {
  if (isBigWinner.value && bigWinnerData.value)
    return bigWinnerData.value

  else if (isLuckyWinner.value && luckyWinnerData.value)
    return luckyWinnerData.value

  return []
})
const luckyFactor = computed(() => list.value[0]?.factor)
const luckyWinner = computed(() => list.value[0]?.username)
const gameProviderName = computed(() => {
  return allPlatformList.value?.find(
    a => a.id === props.gameDetails?.platform_id,
  )?.name ?? '-'
})

function checkPlatGameList() {
  if (props.isOriginalGame)
    router.push('/group/provider/801?vid=801&ty=5') // ${query.ty ? `&ty=${query.ty}` : ''}
  else
    router.push(`/group/provider/${props.vid}?vid=${props.vid}${query.ty ? `&ty=${query.ty}` : ''}`)
}

function onClickFavorite() {
  if (isFavorite.value)
    return runFavDelete()
  runFavInsert()
}

const prefixTitle = computed(() => props.name?.charAt(0).toUpperCase() + props.name?.slice(1))

// usePageTitle({
//   prefix: prefixTitle,
// })

watch(() => props.name, () => {
  runBigWinner()
  runLuckyWinner()
})

watchEffect(() => {
  isFavorite.value = +props.gameDetails?.is_fav === 1
})
</script>

<template>
  <div
    class="app-desc margin-auto home-container"
  >
    <div class="desc-title" @click="toggleShowContent">
      <div class="title-left">
        <span class="game-name">{{ name }}</span>
        <span class="plat-name" @click="checkPlatGameList">
          {{ platName }}
        </span>
      </div>
      <div class="title-right">
        <!-- <div v-if="list && list.length" class="r-status">
          <img
            :src="`/ph-h5/svg/uni-cup1.svg`" alt=""
          >
          <span v-if="list && list.length">{{ application.numberToLocaleString(Number(luckyFactor ?? 0)) }}x</span>
          <div v-if="luckyWinner" class="player">
            {{ luckyWinner }}
          </div>
          <VTooltip v-else placement="top">
            <div class="cursor-help">
              <IconUniHidden />
              <span>{{ t('隐身') }}</span>
            </div>
            <template #popper>
              <div class="tiny-menu-item-title">
                {{ t('此玩家启用了私密功能') }}
              </div>
            </template>
          </VTooltip>
        </div> -->
        <div class="r-arrow" :class="[showContent ? 'down' : 'left']">
          <IconUniArrowDown />
        </div>
      </div>
    </div>
    <!-- 包裹过渡 -->
    <div v-show="showContent" class="wrap mt-[12rem]">
      <div class="desc-tab">
        <PhBaseTabs
          v-model="tab" :list="tabList" :center="false" :type="5"
          style="--tabs-wrap-padding-y: 5rem;"
        />
      </div>
      <div class="scroll-x winner-content">
        <PhBaseTable
          v-if="tab !== '2'"
          class="theme-table mt-[12rem]"
          style="--tg-table-odd-background: #F6F7F8"
          :columns="columns"
          :data-source="list"
        >
          <template #rank="{ index }">
            <div v-if="index < 3" class="rank-icon">
              <img
                :src="`/ph-h5/svg/uni-rank${index + 1}.svg`" alt=""
              >
            </div>
            <div v-else>
              {{ index + 1 }}th
            </div>
          </template>

          <template #player>
            <VTooltip placement="top">
              <div class="cursor-help">
                <IconUniHidden />
                <span>{{ t('隐身') }}</span>
              </div>
              <template #popper>
                <div class="tiny-menu-item-title">
                  {{ t('此玩家启用了私密功能') }}
                </div>
              </template>
            </VTooltip>
          </template>

          <template #bet_time="{ record }">
            <div>
              {{ timeToFormatDiffOnChinese(record.created_at, 'MM/DD') }}
            </div>
          </template>

          <template #betMoney="{ record }">
            <div class="img-text-align img-text-align-center">
              <PhBaseAmount
                :amount="record.bet_amount" :show-icon="false" :currency-type="getCurrencyConfig(record.currency_id)?.name"
                style="--tg-app-amount-font-weight:var(--tg-font-weight-normal);"
              />
            </div>
          </template>

          <template #payAmount="{ record }">
            <div class="img-text-align img-text-align-right">
              <PhBaseAmount
                :amount="record.pay_amount" :currency-type="getCurrencyConfig(record.currency_id)?.name"
                style="--tg-app-amount-font-weight:var(--tg-font-weight-normal);"
              />
            </div>
          </template>

          <template #factor="{ record: { factor } }">
            {{ `${application.numberToLocaleString(Number(factor ?? 0))}x` }}
          </template>
        </PhBaseTable>
        <div v-if="tab === '2'">
          <div class="mobile-header">
            <div class="img-wrap">
              <div v-if="gameDetails?.img" class="img">
                <PhBaseImage :url="gameDetails?.img" is-cloud />
              </div>
            </div>
            <div class="info-wrap">
              <div class="main-info">
                <div class="flex">
                  <span class="game-name">
                    {{ gameDetails?.name }}
                  </span>
                  <div
                    class="icon-button ml-[11rem] flex items-center text-[18rem]"
                    :class="{ 'is-isFavorite': isFavorite }"
                    @click="onClickFavorite"
                  >
                    <IconUniFavorites v-if="isFavorite" />
                    <IconChessStar v-else />
                  </div>
                </div>
                <PhBaseButton size="none">
                  <span
                    class="game-provider"
                    @click="router.push(`/group/provider/${vid}?vid=${vid}`)"
                  >
                    {{ gameProviderName }}
                  </span>
                </PhBaseButton>
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
}
.app-desc {
  background-color: #fff;
  color: #0d2245;
  border-radius: 8rem;
  margin-top: 14rem;
  padding: 24rem 16rem;

  .desc-title {
    font-weight: 500;
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 32.5px;

    .title-left {
      width: 100%;
      overflow: hidden;
      display: flex;
      font-size: 16rem;
      // gap: var(--tg-spacing-8);

      .game-name {
        max-width: 100%;
        display: inline;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        text-transform: capitalize;
        margin-right: 8rem;
      }

      .plat-name {
        max-width: 100%;
        display: inline;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        color: #6d7693;
        text-transform: capitalize;
      }
    }

    .title-right {
      display: flex;
      justify-content: right;
      align-items: center;

      .r-arrow {
        padding: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 17.5px;
        cursor: pointer;
        transition: all 0.3s;

        &.left {
          transform: rotate(90deg);
        }

        &.down {
          transform: rotate(0);
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
      font-weight: 500;

      .game-name {
        font-size: var(--tg-font-size-md);
      }

      .game-provider {
        color: var(--tg-text-lightgrey);
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
}
</style>
