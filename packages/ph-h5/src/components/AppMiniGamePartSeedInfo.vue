<script setup lang='ts'>
import { PhBaseButton, PhBaseDialog, PhBaseLabel } from '@tg/bccomponents'
import { useBoolean } from '@tg/hooks'
import { IconIconUniScales, IconUniArrowLeft } from '@tg/icons'
import { GAMES_LIST_ENUM } from 'feie-ui'
import { computed, inject, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import AppCopyLine from './AppCopyLine.vue'
import AppMiniGameProvablyFair from './AppMiniGameProvablyFair.vue'

interface Props {
  game: GAMES_LIST_ENUM
  data: {
    [k: string]: any
    serverSeed: string
    serverSeedHash: string
    clientSeed: string
    nonce: number
  }
}
defineOptions({
  name: 'AppMiniGamePartSeedInfo',
})
const props = defineProps<Props>()
const { t } = useI18n()
const { push } = useRouter()
const gameData = ref({})
const showSeedDialog = ref(false)
const closeDialog = inject('closeDialog', () => { })

const isPlinko = computed(() => props.game === GAMES_LIST_ENUM.PLINKO)
const isDice = computed(() => props.game === GAMES_LIST_ENUM.DICE)
const isLimbo = computed(() => props.game === GAMES_LIST_ENUM.LIMBO)
const isMines = computed(() => props.game === GAMES_LIST_ENUM.MINES)
const isBlackjack = computed(() => props.game === GAMES_LIST_ENUM.BLACKJACK)
const isCrash = computed(() => props.game === GAMES_LIST_ENUM.CRASH)
const isKeno = computed(() => props.game === GAMES_LIST_ENUM.KENO)
/** 种子数据 */
const { bool: showSeedDetail, toggle: toggleShowSeedDetail } = useBoolean(false)
const serverSeed = computed(() => props.data.serverSeed ?? '')
const serverSeedHash = computed(() => props.data.serverSeedHash ?? '')
const clientSeed = computed(() => props.data.clientSeed ?? '')
const nonce = computed(() => props.data.nonce ?? 0)

// 验证赌注
function verifyMyBets() {
  if (isPlinko.value) {
    gameData.value = {
      clientSeed: props.data.clientSeed,
      serverSeed: props.data.serverSeed,
      nonce: props.data.nonce,
      risk: props.data.risk,
      row: props.data.plinkoRow,
    }
  }
  else if (isDice.value || isLimbo.value || isBlackjack.value || isKeno.value) {
    gameData.value = {
      clientSeed: props.data.clientSeed,
      serverSeed: props.data.serverSeed,
      nonce: props.data.nonce,
    }
  }
  else if (isMines.value) {
    gameData.value = {
      clientSeed: props.data.clientSeed,
      serverSeed: props.data.serverSeed,
      nonce: props.data.nonce,
      mines: props.data.mines,
    }
  }
  else if (isCrash.value) {
    gameData.value = {
      clientSeed: props.data.clientSeed,
      serverSeed: props.data.serverSeed,
      nonce: props.data.nonce,
      base_seed: props.data.base_seed,
      hash: props.data.hash,
    }
  }
}

// 轮换您的种子配对以验证这笔赌注
function changeYourSeed() {
  verifyMyBets()
  showSeedDialog.value = true
}

// 什么是可证明的公平？
function whatIsVerifyFairnesses() {
  closeDialog()

  push('/provably-fair')
}
</script>

<template>
  <div class="w-full flex flex-col rounded-bl-[4rem] rounded-br-[4rem] bg-[#fff]">
    <div class="flex flex-col cursor-pointer px-[16rem] pt-[13rem] pb-[12rem]">
      <div
        @click="toggleShowSeedDetail"
      >
        <div class="w-full flex justify-between">
          <span class="text-[#0D2245] font-[500]">{{ t('可证明的公平') }}</span>
          <div class="drop-icon flex items-center text-[16rem]" :class="[showSeedDetail ? 'rotate-[270deg]' : '']">
            <IconUniArrowLeft class="text-[#0D2245]" />
          </div>
        </div>
      </div>
    </div>

    <template v-if="game === GAMES_LIST_ENUM.CRASH">
      <div v-show="showSeedDetail" class="gap-[16rem] w-full flex flex-col p-[16rem] pt-0">
        <PhBaseLabel :label="t('散列')">
          <AppCopyLine :msg="data?.hash ?? ''" :placeholder="t('种子尚未揭示')" />
        </PhBaseLabel>
        <PhBaseLabel :label="t('种子')">
          <AppCopyLine :msg="data?.base_seed ?? ''" />
        </PhBaseLabel>
        <div class="flex flex-col items-center">
          <PhBaseButton type="none" size="none" @click="verifyMyBets">
            {{ t('验证赌注') }}
          </PhBaseButton>
        </div>
      </div>
    </template>
    <template v-else>
      <div v-show="showSeedDetail" class="gap-[16rem] w-full flex flex-col p-[16rem] pt-0">
        <PhBaseLabel :label="t('服务器种子')" style="--ph-base-label-margin-bottom: 3rem; --ph-base-label-font-weight: 500">
          <AppCopyLine :hide-copy="true" :msg="serverSeed" :placeholder="t('种子尚未揭示')" />
        </PhBaseLabel>
        <PhBaseLabel :label="t('服务器种子（散列化）')" style="--ph-base-label-margin-bottom: 3rem; --ph-base-label-font-weight: 500">
          <AppCopyLine class="h-[40rem]" :msg="serverSeedHash" style="--tg-app-copyline-theme-icon-color:#0D2245" />
        </PhBaseLabel>
        <div class="flex flex-col gap-[16rem]">
          <PhBaseLabel :label="t('客户端种子')" style="--ph-base-label-margin-bottom: 3rem; --ph-base-label-font-weight: 500">
            <AppCopyLine class="h-[40rem]" :msg="clientSeed" style="--tg-app-copyline-theme-icon-color:#0D2245" />
          </PhBaseLabel>
          <PhBaseLabel :label="t('现时标志')" style="--ph-base-label-margin-bottom: 3rem; --ph-base-label-font-weight: 500">
            <AppCopyLine class="h-[40rem]" :msg="nonce.toString()" style="--tg-app-copyline-theme-icon-color:#0D2245" />
          </PhBaseLabel>
        </div>
        <div>
          <div v-if="serverSeed" class="text-[#6D7693] font-[500] text-center" @click="verifyMyBets">
            {{ t('验证赌注') }}
          </div>
          <div v-else class="text-[#6D7693] font-[500] text-center" @click="changeYourSeed">
            {{ t('轮换您的种子配对以验证这笔赌注') }}
          </div>
          <div class="text-[#6D7693] font-[500] mt-[9rem] text-center" @click="whatIsVerifyFairnesses">
            {{ t('什么是可证明的公平？') }}
          </div>
        </div>
      </div>
    </template>
    <PhBaseDialog v-model="showSeedDialog" :title="t('公平性')" style="--ph-base-dialog-background-color: #F6F7F8; ">
      <AppMiniGameProvablyFair v-if="showSeedDialog" :game-data="gameData" />
      <template #icon>
        <IconIconUniScales class="text-[#9DABC8] mr-[8rem]" />
      </template>
    </PhBaseDialog>
  </div>
</template>

<style lang='scss' scoped>
.flex-col-16 {
  > *:not(:first-child) {
    margin-top: 16rem;
  }
}
</style>
