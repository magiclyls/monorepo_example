<script setup lang='ts'>
import type { IBasePanelType, ISportsMyBetSlipItem } from '@tg/types'
import { PhBaseAmount, PhBaseDialog, PhBaseImage } from '@tg/bccomponents'
import { useBoolean } from '@tg/hooks'
import { IconTabbarBet, IconUniShareSlip, IconUniTrend } from '@tg/icons'
import { useAppStore, useCurrency, useSportsStore } from '@tg/stores'
import { replaceSportsPlatId } from '@tg/utils'
import { timeToDateWithDayFormat, timeToFormatDiffOnChinese } from '@tg/vue-i18n'
import dayjs from 'dayjs'
import { cloneDeep } from 'lodash'
import { storeToRefs } from 'pinia'
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import AppDialogBetSlipSports from '~/components/AppDialogBetSlipSports.vue'
import AppMatchStatistics from '~/components/AppMatchStatistics.vue'
import AppSportsOdds from '~/components/AppSportsOdds.vue'

type ISportsMyBetSlipItemWithShowRe = {
  [K in keyof ISportsMyBetSlipItem]: K extends 'bi' ? Array<{
    showResult: boolean
    result: IBasePanelType
    betMarketName: string
    ono: string
  } & ISportsMyBetSlipItem['bi'][number]> : ISportsMyBetSlipItem[K];
}
type ISportsMyBetSlipItemBi = ISportsMyBetSlipItemWithShowRe['bi'][number]
interface Props {
  data: ISportsMyBetSlipItem
  isDialog?: boolean
  /**
   * @description 是否隐藏赛果
   */
  disableResult?: boolean
}
defineOptions({
  name: 'AppSportsMyBetSlip',
})
const props = withDefaults(defineProps<Props>(), {
  disableResult: false,
})

const emit = defineEmits(['show'])
const { t } = useI18n()
const { currentGlobalCurrencyMap } = storeToRefs(useCurrency())
const { userInfo } = storeToRefs(useAppStore())
const sportsStore = useSportsStore()
const router = useRouter()
const { bool: isShowDetailDialog } = useBoolean(false)

const betSlipStatusText: { [t: number]: string } = {
  2: t('处理中'),
  3: t('拒绝'),
  4: t('取消'),
}
const settledStatus: { [t: number]: string } = {
  0: t('未结算'),
  1: t('赢'),
  2: t('输'),
  3: t('平'),
  4: t('赢一半'),
  5: t('输一半'),
  6: t('输部分'),
}
/** 添加开关赛果 */
const slipData = ref<ISportsMyBetSlipItemWithShowRe>(addShowResult(props.data))
const detailDialogProps = ref()

const list = computed(() => slipData.value.bi)
const isNotSettled = computed(() => slipData.value.os === 0) // 未结算
const isSettled = computed(() => slipData.value.os === 1) // 已结算
const statusText = computed(() => {
  if (isSettled.value)
    return settledStatus[slipData.value.oc]
  return betSlipStatusText[slipData.value.os]
})
const statusClass = computed(() => {
  if (isSettled.value)
    return slipData.value.oc === 1 || slipData.value.oc === 3 ? 'green' : 'grey'
  return 'grey'
})

/**
 * 跳转详情
 */
function goEventDetailPage(data: ISportsMyBetSlipItemBi) {
  router.push(replaceSportsPlatId(`/sports/${data.si}/${data.pgid ?? 0}/${data.ci ?? 0}/${data.ei}`))
}

// 是否已经开赛
function checkIsStarted(ts: number) {
  return dayjs().isAfter((ts * 1000))
}

function addShowResult(origin: ISportsMyBetSlipItem) {
  const copyData = cloneDeep(origin)
  copyData.bi = copyData.bi.map((a: ISportsMyBetSlipItemBi) => {
    return {
      ...a,
      showResult: false,
      result: {
        startTime: timeToDateWithDayFormat(a.ed),
        homeTeamName: a.htn,
        awayTeamName: a.atn,
        remark: '',
        homeTeamScore: a.hp,
        awayTeamScore: a.ap,
        atpic: a.atpic,
        htpic: a.htpic,
        spic: a.spic,
        si: a.si,
        pol: a.pol,
      },
      betMarketName: makeMarketInfo(a),
    }
  })
  return copyData
}
function makeMarketInfo(item: ISportsMyBetSlipItemBi) {
  switch (item.bt) {
    case 1:
      return item.sn.includes(item.hdp) ? item.sn : `${item.sn} (${item.hdp})`
    case 2:
      return item.sn.includes(item.hdp) ? item.sn : `${item.sn} ${item.hdp}`
    default:
      return item.sn
  }
}
function showDetail() {
  isShowDetailDialog.value = true
  detailDialogProps.value = { data: { ...props.data, username: userInfo.value?.username } }
}
</script>

<template>
  <div class="relative slip">
    <div class="flex justify-between bg-[#EBEBEB] px-[16rem] py-[8rem] items-center rounded-t-[4rem]">
      <div class="flex gap-[8rem] items-center">
        <div v-if="!isNotSettled" class="h-[18rem] text-[#FFF] text-[12rem] font-[500] px-[3rem] bg-[#6D7693] rounded-[2rem]" :class="[statusClass]">
          {{ statusText }}
        </div>
        <span class="text-[#6D7693] font-[500]">{{ timeToFormatDiffOnChinese(slipData.bt) }}</span>
      </div>
      <IconUniShareSlip v-if="!isDialog" type="text" class="text-[14rem] text-[#9DABC8]" @click="showDetail" />
    </div>
    <div class="bg-[#F6F7F8]">
      <!-- 盘口信息 -->
      <div class="bet-outcome-list border-b border-b-[#EBEBEB]">
        <div
          v-for="item in list"
          :key="item.ono"
          :class="{ 'is-multi': list.length > 1 }"
        >
          <div class="overview py-[8rem] px-[16rem] pt-[5rem]">
            <div class="title-wrapper">
              <div
                type="text" size="none"
                class="flex items-center gap-[4rem] w-full"
                style="--tg-base-button-text-default-color:#0D2245"
                @click="goEventDetailPage(item)"
              >
                <div v-if="isDialog" class="icon w-[14rem] shrink-0">
                  <PhBaseImage
                    is-cloud
                    width="14rem"
                    :url="sportsStore.getSportsIconBySi(item.si)"
                  />
                </div>
                <div class="text-[#0D2245] font-[500] text-[14rem]-wrap line-clamp-1 truncate">
                  <span v-if="item.et === 1" class="text-[#0D2245] font-[600] text-[14rem] line-clamp-1 truncate">
                    {{ item.htn }} - {{ item.atn }}
                  </span>
                  <span v-else-if="item.et === 2" class="text-[#0D2245] font-[600] text-[14rem] line-clamp-1 truncate">{{ item.cn }}</span>
                </div>
              </div>
              <div class="text-[#6D7693] text-[14rem] font-[600] my-[2rem] h-[21rem]">
                {{ item.btn }}
              </div>
            </div>
            <div class="odds-wrapper flex items-center justify-between">
              <div class="text-[#0D2245] font-[600] text-[14rem]">
                {{ item.betMarketName }}
              </div>
              <AppSportsOdds :odds="item?.ov ?? ''" arrow="left" class="text-[#025BE8] font-[600]" />
            </div>
            <div class="flex justify-between mt-[2rem] items-center h-[16rem] mb-[24rem] font-[500]">
              <div class="fixture-details">
                <span v-if="isSettled" class="text-[#F88D22]">
                  {{ item.hp || 0 }} - {{ item.ap || 0 }}
                </span>
                <span v-else-if="!checkIsStarted(item.ed)">
                  {{ timeToDateWithDayFormat(item.ed) }}
                </span>
              </div>
              <div class="h-[16rem]">
                <VTooltip placement="top" :triggers="['hover']" class="h-[16rem] overflow-hidden">
                  <div
                    v-if="!props.disableResult" @click="item.showResult = !item.showResult"
                  >
                    <IconUniTrend class="text-[#9DABC8] text-[16rem]" />
                  </div>
                  <template #popper>
                    <div class="tiny-menu-item-title">
                      {{ t('比分') }}
                    </div>
                  </template>
                </VTooltip>
              </div>
            </div>
          </div>

          <div class="score">
            <AppMatchStatistics
              v-if="item.showResult" :round="false"
              :data="item.result" :show-skeleton="item.m === 100"
              style="--tg-app-match-statistics-max-width:100%;"
            />
          </div>
        </div>
      </div>
      <!-- logo分割线 -->

      <!-- 总计 -->
      <div class="px-[16rem] py-[12rem]">
        <div class="item mb-[2rem] flex justify-between">
          <label class="text-[#6D7693] font-[500]">{{ t('赔率') }}</label>
          <AppSportsOdds :odds="slipData.ov" arrow="left" class="text-[#025BE8] font-[600]" />
        </div>
        <div class="item mb-[2rem] flex justify-between">
          <label class="text-[#6D7693] font-[500]">{{ t('投注额') }}</label>
          <PhBaseAmount
            :amount="slipData.a"
            :currency-type="currentGlobalCurrencyMap.type"
          />
        </div>
        <div class="item flex justify-between">
          <label class="text-[#6D7693] font-[500]">
            {{ isSettled ? t('赢')
              : t('预计赢利') }}
          </label>
          <PhBaseAmount
            :amount="isSettled ? slipData.pa > 0 ? slipData.pa : 0 : slipData.mwa + slipData.a"
            :currency-type="currentGlobalCurrencyMap.type"
          />
        </div>
      </div>
    </div>

    <PhBaseDialog v-if="isShowDetailDialog" v-model="isShowDetailDialog" :icon="IconTabbarBet" :title="t('投注')" style="--ph-base-dialog-icon-color: #9DABC8">
      <AppDialogBetSlipSports v-bind="detailDialogProps" />
    </PhBaseDialog>
  </div>
</template>

<style scoped lang="scss">
.slip:after {
  content: '';
  display: block;
  width: 100%;
  height: 20rem;
  background-size: 20rem 20rem; /* 一个repeat的大小 */
  background-repeat: repeat-x;
  background-image: radial-gradient(#fff 8rem, transparent 0rem);
  position: absolute;
  bottom: -14rem;
}
</style>
