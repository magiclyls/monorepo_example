<script setup lang='ts'>
import type { ICasinoBetRecordItem } from '@tg/types'
import { IconUniDoc, IconUniHidden } from '@tg/icons'
import { ApiOriginalGameDetail } from '@tg/apis'
import { GAMES_LIST_ENUM } from 'feie-ui'

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
const closeDialog = inject('closeDialog', () => { })

const { t } = useI18n()
const { push } = useLocalRouter()
const { rightIsExpand, closeRightSidebar } = useRightSidebar()
const { isMobile } = storeToRefs(useWindowStore())
const { currentLangZone } = storeToRefs(useLanguageStore())

const isOriginalGame = computed(() => props.casinoData.game_class === EnumGlobalGameType.original)
const betTime = computed(() => props.casinoData.bet_time || +props.casinoData.created_at)
const app_name = computed(() => {
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
  const { game_code, platform_id, platform_name, game_name, game_type, game_class, id } = props.casinoData
  const r = Math.random().toString(36).slice(-10)

  if (isMobile.value) {
    setTimeout(() => {
      rightIsExpand.value && closeRightSidebar()
    }, 50)
  }
  // 原创游戏
  if (isOriginalGame.value) {
    closeDialog()
    return push(`/casino/original-game/${game_name.toLowerCase()}`)
  }

  let vid = +platform_id
  if (EnumCasinoPidToVid[+platform_id])
    vid = EnumCasinoPidToVid[+platform_id]

  push(`/casino/games/${id || r}?name=${game_name}&pn=${platform_name}&vid=${vid}&game_id=${game_code}&pid=${platform_id}${game_type ? `&type=${game_type}` : ''}&game_class=${game_class}`)
  closeDialog()
}

if (isOriginalGame.value)
  runOriginalGameDetail()
</script>

<template>
  <div v-if="gameDetailLoading" class="h-[249px] w-full">
    <AppLoading />
  </div>
  <div v-else class="flex flex-col items-center leading-[1.5]">
    <!-- 上部分 -->
    <div class="w-full px-[16px] pb-[30px]">
      <div class="flex justify-center">
        <BaseButton type="text" size="none" @click="openCasinoGame">
          <div class="text-tg-text-white h-[24px] flex items-center text-[16px] font-semibold capitalize">
            {{ casinoData.game_name }}
          </div>
        </BaseButton>
      </div>
      <div class="text-tg-text-white flex-row-8 mb-[16px] h-[24px] flex items-center justify-center text-[16px] font-semibold">
        <div
          class="max-w-full min-w-[0px] flex-shrink truncate"
        >
          {{ t('serial_number') }} {{ casinoData.bill_no }}
        </div>
        <AppTooltip
          popper-clazz="deep-tooltip"
          class="shrink-0"
          :text="t('copy_addr_suc')" icon-name="uni-doc" :triggers="['click']"
          @click="application.copy((casinoData.bill_no).toString())"
        >
          <template #content>
            <BaseButton type="text" size="none">
              <IconUniDoc />
            </BaseButton>
          </template>
        </AppTooltip>
      </div>
      <div class="text-tg-text-lightgrey text-center text-[14px] font-semibold">
        <div class="center mb-[4px] gap-[4px]">
          <span>{{ t('investor') + $t('colon') }}</span>
          <template v-if="casinoData.state === '2'">
            <VTooltip placement="top" :triggers="['click', 'hover']">
              <div class="center stealth-box">
                <IconUniHidden />
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
        <span class="inline-block h-[21px] font-normal">{{ t('time_on', timeToZoneDayFormat(betTime, currentLangZone).split(' ')) }}</span>
      </div>
    </div>
    <!-- 通用游戏投注结果 -->
    <div v-if="!isOriginalGame" class="box w-full flex flex-col gap-[16px] px-[16px] pb-[16px]">
      <AppMiniGamePartBaseData
        :bet-amount="casinoData.bet_amount" :settle-amount="casinoData.settle_amount"
        :currency-id="casinoData.currency_id" :multiplier="casinoData.factor"
      />
      <!-- 前往游戏 -->
      <BaseButton class="mx-auto block capitalize" shadow size="md" bg-style="primary" @click="openCasinoGame">
        {{ t('go_to', { app_name }) }}
      </BaseButton>
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
    margin-left: var(--tg-spacing-8);
  }
}
.box {
  @include webTheme('green') {
    --tg-base-button-secondary-bg: #197b59;
    --tg-secondary-text-color-theme-green: #fff;
  }
}
</style>
