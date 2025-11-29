<script setup lang='ts'>
import { ApiOriginalGameDetail } from '@tg/apis'
import { GAMES_LIST_ENUM } from 'feie-ui'
import { IconUniDoc } from '@tg/icons'

interface Props {
  data: {
    id: string
    game: string
    uid: string
  }
}
defineOptions({
  name: 'AppDialogBetSlipOriginalGame',
})
const props = defineProps<Props>()
console.log('props.data:', props.data)
const closeDialog = inject('closeDialog', () => { })

const { t } = useI18n()
const { push } = useLocalRouter()
const isPlinko = computed(() => props.data.game === GAMES_LIST_ENUM.PLINKO)
const isDice = computed(() => props.data.game === GAMES_LIST_ENUM.DICE)
const isLimbo = computed(() => props.data.game === GAMES_LIST_ENUM.LIMBO)
const isMines = computed(() => props.data.game === GAMES_LIST_ENUM.MINES)
const isHilo = computed(() => props.data.game === GAMES_LIST_ENUM.HILO)
const isBlackjack = computed(() => props.data.game === GAMES_LIST_ENUM.BLACKJACK)
const isCrash = computed(() => props.data.game === GAMES_LIST_ENUM.CRASH)
const isKeno = computed(() => props.data.game === GAMES_LIST_ENUM.KENO)
const isWheel = computed(() => props.data.game === GAMES_LIST_ENUM.WHEEI)
const {
  data: detailData,
  loading,
} = useRequest(() => ApiOriginalGameDetail({ id: props.data.id, uid: props.data.uid }), { manual: false })

// 前往游戏
function openCasinoGame() {
  closeDialog()

  if (isFlutterApp())
    sendMsgToFlutterApp(SendFlutterAppMessage.OPEN_GAME, props.data.game.toLowerCase())

  else
    push(`/casino/original-game/${props.data.game.toLowerCase()}`)
}
</script>

<template>
  <div v-if="loading" class="loading h-[249px] w-full">
    <AppLoading />
  </div>

  <div v-else class="flex flex-col items-center leading-[1.5]">
    <!-- 上部分 -->
    <div class="w-full px-[16px] pb-[30px]">
      <div class="flex justify-center">
        <template v-if="isAdmin()">
          <div class="text-tg-text-white h-[24px] flex items-center text-[16px] font-semibold capitalize">
            {{ data.game }}
          </div>
        </template>
        <template v-else>
          <BaseButton type="text" size="none" @click="openCasinoGame">
            <div class="text-tg-text-white h-[24px] flex items-center text-[16px] font-semibold capitalize">
              {{ data.game }}
            </div>
          </BaseButton>
        </template>
      </div>
      <div class="text-tg-text-white flex-row-8 mb-[16px] h-[24px] flex items-center justify-center text-[16px] font-semibold">
        <span class="max-w-full min-w-[0px] flex-shrink truncate">{{ t('serial_number') }} {{ detailData?.order_id }}</span>
        <AppTooltip
          v-if="!isAdmin()"
          class="shrink-0"
          :text="t('copy_addr_suc')" icon-name="uni-doc" :triggers="['click']"
          @click="application.copy(detailData?.order_id ?? '')"
        >
          <template #content>
            <BaseButton type="text" size="none">
              <IconUniDoc />
            </BaseButton>
          </template>
        </AppTooltip>
      </div>
      <div class="text-tg-text-lightgrey text-center text-[14px] font-semibold">
        <span class="mb-[4px] inline-block h-[21px]">{{ t('investor') }} {{ detailData?.username }}</span><br>
        <span class="inline-block h-[21px] font-normal">{{ t('time_on', timeToCustomizeFormat(detailData?.created_at ?? 0).split(' ')) }}</span>
      </div>
    </div>

    <!-- Plinko -->
    <AppMiniGamePartPlinkoGameResult v-if="isPlinko && detailData" :data="detailData" />
    <!-- Dice -->
    <AppMiniGamePartDiceGameResult v-else-if="isDice && detailData" :data="detailData" />
    <!-- Limbo -->
    <AppMiniGamePartLimboGameResult v-else-if="isLimbo && detailData" :data="detailData" />
    <AppMiniGamePartMinesGameResult v-else-if="isMines && detailData" :data="detailData" />
    <AppMiniGamePartHiloGameResult v-else-if="isHilo && detailData" :data="detailData" />
    <AppMiniGamePartBlackjackGameResult v-else-if="isBlackjack && detailData" :data="detailData" />
    <AppMiniGamePartCrashGameResult v-else-if="isCrash && detailData" :data="detailData" />
    <AppMiniGamePartKenoGameResult v-else-if="isKeno && detailData" :data="detailData" />
    <AppMiniGamePartWheelGameResult v-else-if="isWheel && detailData" :data="detailData" />
  </div>
</template>

<style lang='scss' scoped>
.flex-row-8 {
  > *:not(:first-child) {
    margin-left: var(--tg-spacing-8);
  }
}
.loading {
  @include webTheme('white') {
    --tg-secondary-main: #cbcbcb;
  }
}
</style>
