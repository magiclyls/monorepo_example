<script lang="ts" setup>
import { GAMES_LIST, GAMES_LIST_ENUM } from 'feie-ui'

const route = useRoute()
const { t } = useI18n()

const game = ref(route.query.game ? route.query.game.toString() : GAMES_LIST_ENUM.PLINKO)
const isPlinko = computed(() => game.value.toLowerCase() === GAMES_LIST_ENUM.PLINKO)
const isDice = computed(() => game.value.toLowerCase() === GAMES_LIST_ENUM.DICE)
const isMines = computed(() => game.value.toLowerCase() === GAMES_LIST_ENUM.MINES)
const isLimbo = computed(() => game.value.toLowerCase() === GAMES_LIST_ENUM.LIMBO)
const isHilo = computed(() => game.value.toLowerCase() === GAMES_LIST_ENUM.HILO)
const isBlackJack = computed(() => game.value.toLowerCase() === GAMES_LIST_ENUM.BLACKJACK)
const isCrash = computed(() => game.value.toLowerCase() === GAMES_LIST_ENUM.CRASH)
const isWheel = computed(() => game.value.toLowerCase() === GAMES_LIST_ENUM.WHEEI)
</script>

<template>
  <div class="w-full p-[12px]">
    <div
      class="calculation-container mx-auto max-w-[600px] w-full flex flex-col"
    >
      <BaseLabel :label="t('game')" class="mb-[16px]">
        <BaseSelect v-model="game" :options="GAMES_LIST" small />
      </BaseLabel>

      <AppMiniGamePlinkoCalculationPage v-if="isPlinko" />
      <AppMiniGameDiceCalculationPage v-else-if="isDice" />
      <AppMiniGameMinesCalculationPage v-else-if="isMines" />
      <AppMiniGameLimboCalculationPage v-else-if="isLimbo" />
      <AppMiniGameHiloCalculationPage v-else-if="isHilo" />
      <AppMiniGameBlackJackCalculationPage v-else-if="isBlackJack" />
      <AppMiniGameCrashCalculationPage v-else-if="isCrash" />
      <AppMiniGameWheelCalculationPage v-else-if="isWheel" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.calculation-container {
  @include webTheme('white'){
    --tg-base-input-style-border:1px solid #fff;
    --tg-base-input-style-bg:#fff;
  }
  @include webTheme('green') {
    --tg-border-color-deep-grey: #feffb0;
    --tg-base-input-style-bg:#02432d;
  }
}
</style>
