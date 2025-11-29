<script lang="ts" setup>
import { AfunBaseLabel, AfunBaseSelect } from '@tg/bccomponents'
import { GAMES_LIST, GAMES_LIST_ENUM } from 'feie-ui'
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import AppMiniGameBlackJackCalculationPage from '~/components/AppMiniGameBlackJackCalculationPage.vue'
import AppMiniGameCrashCalculationPage from '~/components/AppMiniGameCrashCalculationPage.vue'
import AppMiniGameDiceCalculationPage from '~/components/AppMiniGameDiceCalculationPage.vue'
import AppMiniGameHiloCalculationPage from '~/components/AppMiniGameHiloCalculationPage.vue'
import AppMiniGameLimboCalculationPage from '~/components/AppMiniGameLimboCalculationPage.vue'
import AppMiniGameMinesCalculationPage from '~/components/AppMiniGameMinesCalculationPage.vue'
import AppMiniGamePlinkoCalculationPage from '~/components/AppMiniGamePlinkoCalculationPage.vue'
import AppMiniGameWheelCalculationPage from '~/components/AppMiniGameWheelCalculationPage.vue'

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
  <div
    class="calculation-container mx-auto w-full flex flex-col"
  >
    <AfunBaseLabel :label="t('游戏')" class="mb-[16px]">
      <AfunBaseSelect v-model="game" :options="GAMES_LIST" small />
    </AfunBaseLabel>
    <AppMiniGamePlinkoCalculationPage v-if="isPlinko" />
    <AppMiniGameDiceCalculationPage v-else-if="isDice" />
    <AppMiniGameMinesCalculationPage v-else-if="isMines" />
    <AppMiniGameLimboCalculationPage v-else-if="isLimbo" />
    <AppMiniGameHiloCalculationPage v-else-if="isHilo" />
    <AppMiniGameBlackJackCalculationPage v-else-if="isBlackJack" />
    <AppMiniGameCrashCalculationPage v-else-if="isCrash" />
    <AppMiniGameWheelCalculationPage v-else-if="isWheel" />
  </div>
</template>
