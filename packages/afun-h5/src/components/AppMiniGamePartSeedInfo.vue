<script setup lang='ts'>
import { AfunBaseButton, AfunBaseDialog, AfunBaseLabel } from '@tg/bccomponents'
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
  <div class="w-full flex flex-col rounded-bl-[4px] rounded-br-[4px] bg-[#0f212e]">
    <div class="flex flex-col cursor-pointer px-[16px] pt-[13px] pb-[12px]">
      <div
        @click="toggleShowSeedDetail"
      >
        <div class="w-full flex justify-between">
          <span class="text-[#fff] font-[600]">{{ t('可证明的公平') }}</span>
          <div class="drop-icon flex items-center text-[16px]" :class="[showSeedDetail ? 'rotate-[270deg]' : '']">
            <IconUniArrowLeft class="text-[#b1bad3]" />
          </div>
        </div>
      </div>
    </div>

    <template v-if="game === GAMES_LIST_ENUM.CRASH">
      <div v-show="showSeedDetail" class="gap-[16px] w-full flex flex-col p-[16px] pt-0">
        <AfunBaseLabel :label="t('散列')">
          <AppCopyLine :msg="data?.hash ?? ''" :placeholder="t('种子尚未揭示')" />
        </AfunBaseLabel>
        <AfunBaseLabel :label="t('种子')">
          <AppCopyLine :msg="data?.base_seed ?? ''" />
        </AfunBaseLabel>
        <div class="flex flex-col items-center">
          <AfunBaseButton type="none" size="none" @click="verifyMyBets">
            {{ t('验证赌注') }}
          </AfunBaseButton>
        </div>
      </div>
    </template>
    <template v-else>
      <div v-show="showSeedDetail" class="gap-[16px] w-full flex flex-col p-[16px] pt-0">
        <AfunBaseLabel :label="t('服务器种子')" style="--afun-base-label-margin-bottom: 3px; --afun-base-label-font-weight: 500">
          <AppCopyLine :hide-copy="true" :msg="serverSeed" :placeholder="t('种子尚未揭示')" />
        </AfunBaseLabel>
        <AfunBaseLabel :label="t('服务器种子（散列化）')" style="--afun-base-label-margin-bottom: 3px; --afun-base-label-font-weight: 500">
          <AppCopyLine class="h-[40px]" :msg="serverSeedHash" style="--tg-app-copyline-theme-icon-color:#b1bad3" />
        </AfunBaseLabel>
        <div class="flex flex-col gap-[16px]">
          <AfunBaseLabel :label="t('客户端种子')" style="--afun-base-label-margin-bottom: 3px; --afun-base-label-font-weight: 500">
            <AppCopyLine class="h-[40px]" :msg="clientSeed" style="--tg-app-copyline-theme-icon-color:#b1bad3" />
          </AfunBaseLabel>
          <AfunBaseLabel :label="t('现时标志')" style="--afun-base-label-margin-bottom: 3px; --afun-base-label-font-weight: 500">
            <AppCopyLine class="h-[40px]" :msg="nonce.toString()" style="--tg-app-copyline-theme-icon-color:#b1bad3" />
          </AfunBaseLabel>
        </div>
        <div>
          <div v-if="serverSeed" class="text-[#b1bad3] font-[600] text-center" @click="verifyMyBets">
            {{ t('验证赌注') }}
          </div>
          <div v-else class="text-[#b1bad3] font-[600] text-center" @click="changeYourSeed">
            {{ t('轮换您的种子配对以验证这笔赌注') }}
          </div>
          <div class="text-[#b1bad3] font-[600] mt-[9px] text-center" @click="whatIsVerifyFairnesses">
            {{ t('什么是可证明的公平？') }}
          </div>
        </div>
      </div>
    </template>
    <AfunBaseDialog v-model="showSeedDialog" :title="t('公平性')" style="--afun-base-dialog-background-color: #F6F7F8; ">
      <AppMiniGameProvablyFair v-if="showSeedDialog" :game-data="gameData" />
      <template #icon>
        <IconIconUniScales class="text-[#b1bad3] mr-[8px]" />
      </template>
    </AfunBaseDialog>
  </div>
</template>

<style lang='scss' scoped>
.flex-col-16 {
  > *:not(:first-child) {
    margin-top: 16px;
  }
}
</style>
