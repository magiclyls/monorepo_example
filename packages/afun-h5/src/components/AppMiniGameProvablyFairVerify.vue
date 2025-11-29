<script setup lang='ts'>
import { GAMES_LIST_ENUM } from 'feie-ui'
import { computed, inject, ref } from 'vue'
import AppMiniGamePartBlackJackFairVerify from './AppMiniGamePartBlackJackFairVerify.vue'
import AppMiniGamePartCrashFairVerify from './AppMiniGamePartCrashFairVerify.vue'
import AppMiniGamePartDiamondsFairVerify from './AppMiniGamePartDiamondsFairVerify.vue'
import AppMiniGamePartDiceFairVerify from './AppMiniGamePartDiceFairVerify.vue'
import AppMiniGamePartHiloFairVerify from './AppMiniGamePartHiloFairVerify.vue'
import AppMiniGamePartKenoFairVerify from './AppMiniGamePartKenoFairVerify.vue'
import AppMiniGamePartLimboFairVerify from './AppMiniGamePartLimboFairVerify.vue'
import AppMiniGamePartMinesFairVerify from './AppMiniGamePartMinesFairVerify.vue'
import AppMiniGamePartPlinkoFairVerify from './AppMiniGamePartPlinkoFairVerify.vue'
import AppMiniGamePartWheelFairVerify from './AppMiniGamePartWheelFairVerify.vue'

interface Props {
  gameData?: {
    [k: string]: any
  }
}
defineOptions({
  name: 'AppMiniGameProvablyFairVerify',
})
const props = defineProps<Props>()
const initGameName = inject('initGameName', props.gameData?.gameType ?? GAMES_LIST_ENUM.PLINKO)

const _game = ref(initGameName)
const baseParams = ref({
  clientSeed: props.gameData?.clientSeed ?? '',
  serverSeed: props.gameData?.serverSeed ?? '',
  nonce: props.gameData?.nonce ?? 0,
  baseSeed: props.gameData?.base_seed ?? '',
  hash: props.gameData?.hash ?? '',
})

const isPlinko = computed(() => _game.value === GAMES_LIST_ENUM.PLINKO)
const isDice = computed(() => _game.value === GAMES_LIST_ENUM.DICE)
const isLimbo = computed(() => _game.value === GAMES_LIST_ENUM.LIMBO)
const isMines = computed(() => _game.value === GAMES_LIST_ENUM.MINES)
const isBlackJack = computed(() => _game.value === GAMES_LIST_ENUM.BLACKJACK)
const isHilo = computed(() => _game.value === GAMES_LIST_ENUM.HILO)
const isCrash = computed(() => _game.value === GAMES_LIST_ENUM.CRASH)
const isKeno = computed(() => _game.value === GAMES_LIST_ENUM.KENO)
const isWheel = computed(() => _game.value === GAMES_LIST_ENUM.WHEEI)
const isDiamonds = computed(() => _game.value === GAMES_LIST_ENUM.DIAMONDS)
</script>

<template>
  <div class="w-full">
    <!-- Plinko -->
    <AppMiniGamePartPlinkoFairVerify
      v-if="isPlinko"
      v-model:game="_game"
      v-model:client-seed="baseParams.clientSeed"
      v-model:server-seed="baseParams.serverSeed"
      v-model:nonce="baseParams.nonce"
      :game-data="gameData"
    />
    <!-- Dice -->
    <AppMiniGamePartDiceFairVerify
      v-else-if="isDice"
      v-model:game="_game"
      v-model:client-seed="baseParams.clientSeed"
      v-model:server-seed="baseParams.serverSeed"
      v-model:nonce="baseParams.nonce"
    />
    <!-- Limbo -->
    <AppMiniGamePartLimboFairVerify
      v-else-if="isLimbo"
      v-model:game="_game"
      v-model:client-seed="baseParams.clientSeed"
      v-model:server-seed="baseParams.serverSeed"
      v-model:nonce="baseParams.nonce"
    />
    <!-- Mines -->
    <AppMiniGamePartMinesFairVerify
      v-else-if="isMines"
      v-model:game="_game"
      v-model:client-seed="baseParams.clientSeed"
      v-model:server-seed="baseParams.serverSeed"
      v-model:nonce="baseParams.nonce"
      :game-data="gameData"
    />
    <!-- BlackJack -->
    <AppMiniGamePartBlackJackFairVerify
      v-else-if="isBlackJack"
      v-model:game="_game"
      v-model:client-seed="baseParams.clientSeed"
      v-model:server-seed="baseParams.serverSeed"
      v-model:nonce="baseParams.nonce"
    />
    <!-- Hilo -->
    <AppMiniGamePartHiloFairVerify
      v-else-if="isHilo"
      v-model:game="_game"
      v-model:client-seed="baseParams.clientSeed"
      v-model:server-seed="baseParams.serverSeed"
      v-model:nonce="baseParams.nonce"
    />
    <!-- Crash -->
    <AppMiniGamePartCrashFairVerify
      v-else-if="isCrash"
      v-model:game="_game"
      v-model:client-seed="baseParams.clientSeed"
      v-model:server-seed="baseParams.serverSeed"
      v-model:nonce="baseParams.nonce"
      v-model:base-seed="baseParams.baseSeed"
      v-model:hash="baseParams.hash"
    />
    <!-- Wheel -->
    <AppMiniGamePartWheelFairVerify
      v-else-if="isWheel"
      v-model:game="_game"
      v-model:client-seed="baseParams.clientSeed"
      v-model:server-seed="baseParams.serverSeed"
      v-model:nonce="baseParams.nonce"
      :game-data="gameData"
    />
    <!-- Keno -->
    <AppMiniGamePartKenoFairVerify
      v-else-if="isKeno"
      v-model:game="_game"
      v-model:client-seed="baseParams.clientSeed"
      v-model:server-seed="baseParams.serverSeed"
      v-model:nonce="baseParams.nonce"
    />
    <!-- DIAMONDS -->
    <AppMiniGamePartDiamondsFairVerify
      v-else-if="isDiamonds"
      v-model:game="_game"
      v-model:client-seed="baseParams.clientSeed"
      v-model:server-seed="baseParams.serverSeed"
      v-model:nonce="baseParams.nonce"
    />
  </div>
</template>

<style lang='scss' scoped>
.group-hover\:bg-tg-text-grey-hover:hover:not(:active) {
  background-color: var(--tg-third-grey);
}
</style>
