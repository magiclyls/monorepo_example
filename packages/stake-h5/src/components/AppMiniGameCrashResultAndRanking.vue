<script lang="ts" setup>
import { IconUniDoc, IconUniHidden, IconNavbarUserBet } from '@tg/icons'
import { ApiExchangeRateFromTo, ApiGameOriginCrashIssueRanking, ApiGameOriginCrashIssueRecord } from '@tg/apis'

interface Props {
  issueId: string
}
defineOptions({
  name: 'AppMiniGameCrashResultAndRanking',
})
const props = defineProps<Props>()

const closeDialog = inject('closeDialog', () => { })

const { push } = useLocalRouter()
const { openDialogOriginalGameProvablyFair } = useDialogOriginalGameProvablyFair()
const appStore = useAppStore()
const { isLogin, userInfo } = storeToRefs(appStore)

const {
  data: list,
  runAsync: runGetRecordAsync,
  loading,
} = useRequest(ApiGameOriginCrashIssueRecord)

const { data: rankData, loading: rankingLoading, runAsync: runGetRanking } = useRequest(ApiGameOriginCrashIssueRanking)

const restCurrencyCodes = computed(() => Object.keys(currencyConfig).map(ty => currencyConfig[ty].cur).join(','))
const { data: allRateData, runAsync: runGetRateFromTo } = useRequest(() => ApiExchangeRateFromTo({ from: restCurrencyCodes.value, to: '706' }), {
  manual: true,
  refreshDeps: [restCurrencyCodes],
  refreshDepsAction() {
    runGetRateFromTo()
  },
  onSuccess(res) {
  },
})
runGetRateFromTo()

const rankingList = computed(() => rankData.value?.map(item => ({ ...item, rankings_multiple: floor(+item.payout_multiplier || 0, 2).toFixed(2), rankings_amount: item.payout })))
// 排序
const sortedCashInList = computed(() => {
  if (rankingList.value && rankingList.value.length && allRateData.value) {
    const arr = rankingList.value.map((c) => {
      const rate = c.currency === '706' ? 1 : allRateData.value[c.currency]
      return { ...c, currentCurrencyAmount: +c.bet_amount * (+rate) }
    })
    const rest = arr.filter(a => a.uid !== userInfo.value?.uid).sort((a, b) => b.currentCurrencyAmount - a.currentCurrencyAmount)
    if (isLogin.value && userInfo.value?.uid) {
      const temp = arr.filter(a => a.uid === userInfo.value?.uid)
      return temp.concat(rest).slice(0, 50)
    }
    else {
      return rest.slice(0, 50)
    }
  }
})

runGetRanking({ issue: props.issueId })

const { t } = useI18n()

const tabValue = ref('result')
const tab = computed(() => [
  { label: t('mini_result'), value: 'result' },
  { label: t('ranking_label'), value: 'rank' },
])

const data = computed(() => list.value && list.value.d && list.value.d.length ? list.value.d[0] : undefined)

runGetRecordAsync({ page_size: 1, issue: props.issueId, page: 1 })

// 验证赌注
function verifyMyBets() {
  openDialogOriginalGameProvablyFair({
    game: 'Crash',
    tab: 'verify',
    gameData: {
      clientSeed: '',
      serverSeed: '',
      nonce: '',
      base_seed: data.value?.base_seed ?? '',
      hash: data.value?.hash ?? '',
    },
  })

  closeDialog()
}

// 什么是可证明的公平？
function whatIsVerifyFairnesses() {
  push('/provably-fair/overview')
  closeDialog()
}
</script>

<template>
  <div class="app-crash-result-ranking">
    <div v-if="loading || !data || data === undefined" class="h-[249px] w-full">
      <AppLoading />
    </div>
    <div v-else class="flex flex-col items-center leading-[1.5]">
      <!-- 上部分 -->
      <div class="w-full flex flex-col items-center p-[16px] pt-0">
        <div class="flex-row-8 text-tg-text-white mb-[16px] h-[24px] flex items-center text-[16px] font-semibold">
          <span>CrashGame: {{ application.formatNumber(`${data.issue_id}` ?? `${data.issue_id}`, {
            separator: $t('bet_order_separator'),
          }) }}</span>
          <AppTooltip popper-clazz="deep-tooltip" :text="t('copy_addr_suc')" icon-name="uni-doc" :triggers="['click']"
            @click="application.copy((data?.issue_id ?? '').toString())">
            <template #content>
              <div class="items-center">
                <IconUniDoc />
              </div>
            </template>
          </AppTooltip>
        </div>
        <div class="text-tg-text-lightgrey text-center text-[14px] font-semibold">
          <span class="inline-block h-[21px] font-normal">{{ t('time_on', timeToCustomizeFormat(data.start_at).split(' ')) }}</span>
        </div>
      </div>
      <div>
        <BaseTab v-model="tabValue" :list="tab" />
        <div v-show="tabValue === 'result'"
          class="text-tg-text-white py-[16px] text-center text-[32px] font-semibold leading-[48px]">
          {{ floor(data.crash_point, 2).toFixed(2) }}x
        </div>
      </div>
    </div>
    <div v-show="tabValue === 'result'" class="flex-col-16 bg-tg-secondary-dark w-full flex flex-col p-[16px]">
      <BaseLabel :label="t('hash_short_label')">
        <AppCopyLine :msg="data?.hash ?? ''" :placeholder="t('seed_not_be_revealed_yet')" />
      </BaseLabel>
      <BaseLabel :label="t('plinko_fairnesses_seed')">
        <AppCopyLine :msg="data?.base_seed ?? ''" />
      </BaseLabel>

      <div class="flex flex-col items-center">
        <BaseButton type="text" size="none" @click="verifyMyBets">
          {{ t('verify_game_label') }}
        </BaseButton>
      </div>
      <div class="flex flex-col items-center">
        <BaseButton type="text" size="none" @click="whatIsVerifyFairnesses">
          {{ t('what_is_verify_fairnesses') }}
        </BaseButton>
      </div>
    </div>
    <div v-show="tabValue === 'rank'" class="ranking-table w-full grow p-[16px]">
      <div class="scroll-y h-[230px]">
        <div class="bg-tg-secondary-dark scroll-y scroll-wrapper h-full w-full rounded pb-[8px]">
          <table v-if="sortedCashInList && sortedCashInList.length" class="h-min min-w-[250px] w-full leading-[21px]">
            <tr v-for="(item, idx) in sortedCashInList" :key="idx"
              class="text-tg-secondary-light text-sm font-semibold">
              <td class="h-[21px] w-[30%] pl-[12px]">
                <div v-if="!item.username" class="hoverable flex flex-nowrap items-center leading-[21px]">
                  <div class="ghost flex items-center text-sm font-semibold">
                    <VTooltip placement="top" :triggers="['click', 'hover']">
                      <div class="center stealth-box">
                        <IconUniHidden />
                        <span class="ml-[3px]">{{ t('hidden_user') }}</span>
                      </div>
                      <template #popper>
                        <div class="tiny-menu-item-title">
                          {{ t('user_turn_on_hidden') }}
                        </div>
                      </template>
                    </VTooltip>
                  </div>
                </div>
                <div v-else>
                  <div
                    class="max-w-[130px] overflow-hidden text-ellipsis whitespace-nowrap pr-[4px] leading-[21px] @md:max-w-[170px]">
                    {{ item.username }}
                  </div>
                </div>
              </td>
              <td class="text-tg-text-white h-[21px] w-[35%] leading-[21px]">
                <span v-if="+item.rankings_multiple > 0">{{ item.rankings_multiple }}x</span>
                <span v-else>0.00x</span>
              </td>
              <td class="text-tg-text-white h-[21px] w-[35%] flex pr-[8px] text-left leading-[21px]">
                <VTooltip placement="top" :triggers="['click', 'hover']">
                  <AppAmount :amount="item.rankings_amount" :currency-code="item.currency_id" reverse
                    :show-color="+item.rankings_amount > 0" />
                  <template #popper>
                    <div class="tiny-menu-item-title">
                      <AppAmount :amount="item.rankings_amount" :currency-code="item.currency_id" />
                    </div>
                  </template>
                </VTooltip>
              </td>
            </tr>
          </table>
          <BaseEmpty v-else :description="t('no_content')" icon="navbar-user-bet" style="padding-top: 60px;">
            <template #icon>
              <IconNavbarUserBet />
            </template>
          </BaseEmpty>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
table tr td {
  vertical-align: middle;
  box-sizing: border-box;
}

.stealth-box {
  --tg-icon-color: white;

  @include webTheme('white') {
    --tg-icon-color: #555555;
  }
}

.app-crash-result-ranking {
  .flex-row-8 {
    >*:not(:first-child) {
      margin-left: var(--tg-spacing-8);
    }
  }

  .flex-col-16 {
    >*:not(:first-child) {
      margin-top: var(--tg-spacing-16);
    }
  }

  @include webTheme('white') {
    --tg-tab-style-wrap-bg-color: #f5f5f5;
  }
}
</style>
