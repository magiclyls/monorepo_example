<script lang="ts" setup>
import { ApiExchangeRateFromTo, ApiGameOriginCrashIssueRanking, ApiGameOriginCrashIssueRecord } from '@tg/apis'
import { AfunBaseAmount, AfunBaseButton, AfunBaseDialog, AfunBaseEmpty, AfunBaseLabel, AfunBaseTabs } from '@tg/bccomponents'
import { IconIconUniScales, IconNavbarUserBet, IconUniDoc, IconUniHidden } from '@tg/icons'
import { useAppStore } from '@tg/stores'
import { application, currencyMap } from '@tg/utils'
import { i18n, timeToCustomizeFormat } from '@tg/vue-i18n'
import { floor } from 'lodash'
import { storeToRefs } from 'pinia'
import { computed, ref } from 'vue'
import { useRequest } from 'vue-request'
import { useRouter } from 'vue-router'
import AppCopyLine from '~/components/AppCopyLine.vue'
import AppLoading from '~/components/AppLoading.vue'
import AppMiniGameProvablyFair from '~/components/AppMiniGameProvablyFair.vue'
import AppTooltip from '~/components/AppTooltip.vue'

interface Props {
  issueId: string
}
defineOptions({
  name: 'AppMiniGameCrashResultAndRanking',
})
const props = defineProps<Props>()

// const closeDialog = inject('closeDialog', () => { })

const router = useRouter()
const appStore = useAppStore()
const { isLogin, userInfo } = storeToRefs(appStore)

const {
  data: list,
  runAsync: runGetRecordAsync,
  loading,
} = useRequest(ApiGameOriginCrashIssueRecord)

const { data: rankData, runAsync: runGetRanking } = useRequest(ApiGameOriginCrashIssueRanking)

const restCurrencyCodes = computed(() => Object.keys(currencyMap).map(ty => currencyMap[ty as keyof typeof currencyMap].cur).join(','))
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
      const rate = c.currency_id === '706' ? 1 : allRateData.value?.[c.currency_id] ?? 0
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

const { t } = i18n.global

const tabValue = ref('result')
const showSeedDialog = ref(false)
const game = ref('Crash')
const tabs = ref<'seed' | 'verify'>('verify')
const gameData = ref({
  clientSeed: '',
  serverSeed: '',
  nonce: '',
  base_seed: '',
  hash: '',
})
const tab = computed(() => [
  { label: t('结果'), value: 'result' },
  { label: t('排行榜'), value: 'rank' },
])

const data = computed(() => list.value && list.value.d && list.value.d.length ? list.value.d[0] : undefined)

runGetRecordAsync({ page_size: 1, issue: props.issueId, page: 1 })

// 验证赌注
function verifyMyBets() {
  gameData.value = {
    clientSeed: '',
    serverSeed: '',
    nonce: '',
    base_seed: data.value?.base_seed ?? '',
    hash: data.value?.hash ?? '',
  }
  showSeedDialog.value = true
  // closeDialog()
}

// 什么是可证明的公平？
function whatIsVerifyFairnesses() {
  // showSeedDialog.value = true
  router.push('/provably-fair/overview')
  // closeDialog()
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
          <span>CrashGame: {{ application.formatNumber(`${data.issue_id}`, {
            separator: t('逗号'),
          }) }}</span>
          <AppTooltip
            popper-clazz="deep-tooltip"
            :text="t('复制成功')" icon-name="IconUniDoc" :triggers="['click']"
            @click="application.copy((data?.issue_id ?? '').toString())"
          >
            <template #content>
              <div class="items-center">
                <IconUniDoc />
              </div>
            </template>
          </AppTooltip>
        </div>
        <div class="text-tg-text-lightgrey text-center text-[14px] font-semibold">
          <span class="inline-block h-[21px] font-normal">{{ t('于', timeToCustomizeFormat(data.start_at).split(' ')) }}</span>
        </div>
      </div>
      <div>
        <AfunBaseTabs v-model="tabValue" :list="tab" :type="5" style="--afun-tabs-wrap-padding-y: 6rem; " />
        <div v-show="tabValue === 'result'" class="text-tg-text-white py-[16px] text-center text-[32px] font-semibold leading-[48px]">
          {{ floor(+data.crash_point, 2).toFixed(2) }}x
        </div>
      </div>
    </div>
    <div v-show="tabValue === 'result'" class="flex-col-16 bg-tg-secondary-dark w-full flex flex-col p-[16px]">
      <AfunBaseLabel :label="t('哈希值')">
        <AppCopyLine :msg="data?.hash ?? ''" :placeholder="t('seed_not_be_revealed_yet')" />
      </AfunBaseLabel>
      <AfunBaseLabel :label="t('公平性种子')">
        <AppCopyLine :msg="data?.base_seed ?? ''" />
      </AfunBaseLabel>

      <div class="flex flex-col items-center">
        <AfunBaseButton type="none" size="none" @click="verifyMyBets">
          {{ t('验证游戏') }}
        </AfunBaseButton>
      </div>
      <div class="flex flex-col items-center">
        <AfunBaseButton type="none" size="none" @click="whatIsVerifyFairnesses">
          {{ t('什么是公平性') }}
        </AfunBaseButton>
      </div>
    </div>
    <div v-show="tabValue === 'rank'" class="ranking-table w-full grow p-[16px]">
      <div class="scroll-y h-[230px]">
        <div class="bg-tg-secondary-dark scroll-y scroll-wrapper h-full w-full rounded pb-[8px]">
          <table v-if="sortedCashInList && sortedCashInList.length" class="h-min min-w-[250px] w-full leading-[21px]">
            <tr v-for="(item, idx) in sortedCashInList" :key="idx" class="text-tg-secondary-light font-semibold">
              <td class="h-[21px] w-[30%] pl-[12px]">
                <div v-if="!item.username" class="hoverable flex flex-nowrap items-center leading-[21px]">
                  <div class="ghost flex items-center font-semibold">
                    <VTooltip placement="top" :triggers="['click', 'hover']">
                      <div class="center stealth-box">
                        <IconUniHidden />
                        <span class="ml-3">{{ t('隐藏用户') }}</span>
                      </div>
                      <template #popper>
                        <div class="tiny-menu-item-title">
                          {{ t('用户开启隐藏') }}
                        </div>
                      </template>
                    </VTooltip>
                  </div>
                </div>
                <div v-else>
                  <div class="max-w-[130px] overflow-hidden text-ellipsis whitespace-nowrap pr-[4px] leading-[21px] @md:max-w-[170px]">
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
                  <AfunBaseAmount :amount="item.rankings_amount" :currency-type="item.currency_id as any" reverse :show-color="+item.rankings_amount > 0" />
                  <template #popper>
                    <div class="tiny-menu-item-title">
                      <AfunBaseAmount :amount="item.rankings_amount" :currency-type="item.currency_id as any" />
                    </div>
                  </template>
                </VTooltip>
              </td>
            </tr>
          </table>
          <AfunBaseEmpty v-else :description="t('暂无内容')" :icon="IconNavbarUserBet" style="padding-top: 60px;" />
        </div>
      </div>
    </div>
  </div>
  <AfunBaseDialog v-model="showSeedDialog" :title="t('公平性')" style="--afun-base-dialog-background-color: #1A2C38; ">
    <AppMiniGameProvablyFair v-if="showSeedDialog" :game-data="gameData" :tab="tabs" :game="game" />
    <template #icon>
      <IconIconUniScales class="text-[#9DABC8] mr-[8px]" />
    </template>
  </AfunBaseDialog>
</template>

<style lang="scss" scoped>
table tr td {
  vertical-align: middle;
  box-sizing: border-box;
}
.stealth-box {
  --tg-icon-color: white;
}
.app-crash-result-ranking {
  --afun-base-amount-font-size: 14px;
  --afun-app-currency-icon-size: 16rem;
  --afun-base-button-font-size: 14rem;

  .flex-row-8 {
    > *:not(:first-child) {
      margin-left: 8px;
    }
  }
  .flex-col-16 {
    > *:not(:first-child) {
      margin-top: 16px;
    }
  }
}
</style>
