<script setup lang='ts'>
import type { ICasinoBetRecordItem } from '@tg/types'
import { ApiOriginalGameDetail } from '@tg/apis'
import { AfunBaseButton } from '@tg/bccomponents'
import { IconUniDoc, IconUniHidden } from '@tg/icons'
import { EnumCasinoPidToVid, EnumGlobalGameType, EnumOriginalLotteryVenue } from '@tg/types'
import { application } from '@tg/utils'
import { getLangConfig, timeToZoneDayFormat } from '@tg/vue-i18n'
import { useClipboard } from '@vueuse/core'
import { GAMES_LIST_ENUM } from 'feie-ui'
import { computed, inject, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRequest } from 'vue-request'
import { useRouter } from 'vue-router'
import AppLoading from '~/components/AppLoading.vue'
import AppMiniGamePartBaseData from './AppMiniGamePartBaseData.vue'
import AppMiniGamePartBlackjackGameResult from './AppMiniGamePartBlackjackGameResult.vue'
import AppMiniGamePartCrashGameResult from './AppMiniGamePartCrashGameResult.vue'
import AppMiniGamePartDiceGameResult from './AppMiniGamePartDiceGameResult.vue'
import AppMiniGamePartDragontowerGameResult from './AppMiniGamePartDragontowerGameResult.vue'
import AppMiniGamePartHiloGameResult from './AppMiniGamePartHiloGameResult.vue'
import AppMiniGamePartKenoGameResult from './AppMiniGamePartKenoGameResult.vue'
import AppMiniGamePartLimboGameResult from './AppMiniGamePartLimboGameResult.vue'
import AppMiniGamePartMinesGameResult from './AppMiniGamePartMinesGameResult.vue'
import AppMiniGamePartPlinkoGameResult from './AppMiniGamePartPlinkoGameResult.vue'
import AppMiniGamePartWheelGameResult from './AppMiniGamePartWheelGameResult.vue'
import AppTooltip from './AppTooltip.vue'

interface CasinoData extends ICasinoBetRecordItem {
  created_at: string
}

interface Props {
  casinoData: CasinoData
}
defineOptions({
  name: 'AppDialogBetSlipCasino',
})
const props = defineProps<Props>()
const { copy } = useClipboard()
const closeDialog = inject('closeDialog', () => { })

const { t } = useI18n()
const router = useRouter()
const currentLangZone = ref(getLangConfig()?.zone)

const isOriginalGame = computed(() => props.casinoData.game_class === EnumGlobalGameType.original)
const betTime = computed(() => props.casinoData.bet_time || +props.casinoData.created_at)
const app_name = computed(() => {
  console.log('-----', props.casinoData)
  const a = props.casinoData.game_name
  const arr = a.split('')
  arr.splice(0, 1, arr[0].toUpperCase())
  return arr.join('')
})

// 原创游戏列表
const isPlinko = computed(() => app_name.value.toLowerCase() === GAMES_LIST_ENUM.PLINKO)
const isDice = computed(() => app_name.value.toLowerCase() === GAMES_LIST_ENUM.DICE)
const isLimbo = computed(() => app_name.value.toLowerCase() === GAMES_LIST_ENUM.LIMBO)
const isMines = computed(() => app_name.value.toLowerCase() === GAMES_LIST_ENUM.MINES)
const isHilo = computed(() => app_name.value.toLowerCase() === GAMES_LIST_ENUM.HILO)
const isBlackjack = computed(() => app_name.value.toLowerCase() === GAMES_LIST_ENUM.BLACKJACK)
const isCrash = computed(() => app_name.value.toLowerCase() === GAMES_LIST_ENUM.CRASH)
const isKeno = computed(() => app_name.value.toLowerCase() === GAMES_LIST_ENUM.KENO)
const isWheel = computed(() => app_name.value.toLowerCase() === GAMES_LIST_ENUM.WHEEI)
const isDragontower = computed(() => app_name.value.toLowerCase() === GAMES_LIST_ENUM.DRAGONTOWER)
// 原创游戏数据
const {
  data: originalGameDetail,
  run: runOriginalGameDetail,
  loading: gameDetailLoading,
} = useRequest(() => ApiOriginalGameDetail({ id: props.casinoData.bill_no, uid: props.casinoData.uid }))

// 前往游戏
function openCasinoGame() {
  const { game_code, platform_id, platform_name, game_name, game_class } = props.casinoData

  let vid = +platform_id
  if (EnumCasinoPidToVid[+platform_id])
    vid = EnumCasinoPidToVid[+platform_id]
  const query: any = {
    id: game_name,
    name: game_name,
    pn: platform_name,
    type: game_class,
    code: game_code,
    vid,
    game_id: game_code,
  }

  let toPath = ''
  // 原创游戏
  if (game_class === EnumGlobalGameType.original) {
    toPath = `?page_dialog=original-game-${game_name.toLowerCase()}`
  }
  // 原创彩票
  else if (platform_id === EnumOriginalLotteryVenue.originalLottery) {
    toPath = application.getOriginalLotteryRouter(game_code)
  }
  else {
    query.page_dialog = 'game-detail'
    toPath = `?${application.objectToUrlParams(query)}`
  }
  closeDialog()
  router.push(toPath)
}

function copyText(text: string) {
  copy(text)
}

if (isOriginalGame.value)
  runOriginalGameDetail()
</script>

<template>
  <div v-if="gameDetailLoading">
    <AppLoading />
  </div>
  <div v-else class="flex flex-col items-center">
    <!-- 上部分 -->
    <div class="w-full px-[16px] pb-[16px] mt-[15px]">
      <div class="flex justify-center">
        <AfunBaseButton type="none" size="none" @click="openCasinoGame">
          <div class="text-[#fff] flex items-center text-[16px] font-[600] capitalize">
            {{ casinoData.game_name }}
          </div>
        </AfunBaseButton>
      </div>
      <div class="text-[#fff] flex-row-8 mb-[16px] flex items-center justify-center text-[16px] font-[600]">
        <div
          class="max-w-full min-w-0 flex-shrink truncate h-[22px]"
        >
          {{ t('编号') }} {{ casinoData.bill_no }}
        </div>
        <AppTooltip
          popper-clazz="deep-tooltip"
          class="shrink-0"
          :text="t('已成功复制')" icon-name="copy" :triggers="['click']"
          @click="copyText((casinoData.bill_no).toString())"
        >
          <template #content>
            <AfunBaseButton type="none" size="none">
              <IconUniDoc class="text-[#b1bad3] w-[14px] h-[14px]" />
            </AfunBaseButton>
          </template>
        </AppTooltip>
      </div>
      <div class="text-tg-text-lightgrey text-center text-[14px] font-[600] text-[#b1bad3]">
        <div class="center mb-[4px] gap-[4px]">
          <span>{{ t('投注者') }}:</span>
          <template v-if="casinoData.state === '2'">
            <VTooltip placement="top" :triggers="['click', 'hover']">
              <div class="center stealth-box">
                <IconUniHidden class="text-[#b1bad3]" />
                <span style="padding-left: 5px;" class="semibold">
                  {{ t('hidden_user') }}
                </span>
              </div>
              <template #popper>
                <div class="tiny-menu-item-title">
                  {{ t('user_turn_on_hidden') }}
                </div>
              </template>
            </VTooltip>
          </template>
          <span v-else>{{ casinoData.username }}</span>
        </div>
        <span class="inline-block h-[21px] font-normal">{{ t('于', timeToZoneDayFormat(betTime, currentLangZone).split(' ')) }}</span>
      </div>
    </div>
    <!-- 通用游戏投注结果 -->
    <div v-if="!isOriginalGame" class="box w-full flex flex-col gap-[16px] px-[16px] pb-[16px]">
      <AppMiniGamePartBaseData
        :bet-amount="casinoData.bet_amount" :settle-amount="casinoData.settle_amount"
        :currency-id="casinoData.currency_id" :multiplier="casinoData.factor"
      />
      <!-- 前往游戏 -->
      <AfunBaseButton class="mx-auto block capitalize" type="default" style="--afun-base-button-font-size:14px" @click="openCasinoGame">
        {{ t('前往', { app_name }) }}
      </AfunBaseButton>
    </div>

    <!-- 小游戏 -->
    <!-- Plinko -->
    <AppMiniGamePartPlinkoGameResult v-if="isPlinko && originalGameDetail" :data="originalGameDetail" />
    <AppMiniGamePartDiceGameResult v-else-if="isDice && originalGameDetail" :data="originalGameDetail" />
    <AppMiniGamePartLimboGameResult v-else-if="isLimbo && originalGameDetail" :data="originalGameDetail" />
    <AppMiniGamePartMinesGameResult v-else-if="isMines && originalGameDetail" :data="originalGameDetail" />
    <AppMiniGamePartHiloGameResult v-else-if="isHilo && originalGameDetail" :data="originalGameDetail" />
    <AppMiniGamePartBlackjackGameResult v-else-if="isBlackjack && originalGameDetail" :data="originalGameDetail" />
    <AppMiniGamePartCrashGameResult v-else-if="isCrash && originalGameDetail" :data="originalGameDetail" />
    <AppMiniGamePartKenoGameResult v-else-if="isKeno && originalGameDetail" :data="originalGameDetail" />
    <AppMiniGamePartWheelGameResult v-else-if="isWheel && originalGameDetail" :data="originalGameDetail" />
    <AppMiniGamePartDragontowerGameResult v-else-if="isDragontower && originalGameDetail" :data="originalGameDetail" />
  </div>
</template>

<style lang='scss' scoped>
.flex-row-8 {
  > *:not(:first-child) {
    margin-left: 8px;
  }
}
</style>
