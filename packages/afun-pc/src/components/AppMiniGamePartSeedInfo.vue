<script setup lang='ts'>
import { IconUniArrowLeft } from '@tg/icons'
import { GAMES_LIST_ENUM } from 'feie-ui'

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
const { push } = useLocalRouter()
const closeDialog = inject('closeDialog', () => { })
const { openDialogOriginalGameProvablyFair } = useDialogOriginalGameProvablyFair()

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

// 轮换您的种子配对以验证这笔赌注
function changeYourSeed() {
  openDialogOriginalGameProvablyFair({ game: props.game })
  closeDialog()
}

// 验证赌注
function verifyMyBets() {
  if (isPlinko.value) {
    openDialogOriginalGameProvablyFair({
      game: props.game,
      tab: 'verify',
      gameData: {
        clientSeed: props.data.clientSeed,
        serverSeed: props.data.serverSeed,
        nonce: props.data.nonce,
        risk: props.data.risk,
        row: props.data.plinkoRow,
      },
    })
  }
  else if (isDice.value || isLimbo.value || isBlackjack.value || isKeno.value) {
    openDialogOriginalGameProvablyFair({
      game: props.game,
      tab: 'verify',
      gameData: {
        clientSeed: props.data.clientSeed,
        serverSeed: props.data.serverSeed,
        nonce: props.data.nonce,
      },
    })
  }
  else if (isMines.value) {
    openDialogOriginalGameProvablyFair({
      game: props.game,
      tab: 'verify',
      gameData: {
        clientSeed: props.data.clientSeed,
        serverSeed: props.data.serverSeed,
        nonce: props.data.nonce,
        mines: props.data.mines,
      },
    })
  }
  else if (isCrash.value) {
    openDialogOriginalGameProvablyFair({
      game: props.game,
      tab: 'verify',
      gameData: {
        clientSeed: props.data.clientSeed,
        serverSeed: props.data.serverSeed,
        nonce: props.data.nonce,
        base_seed: props.data.base_seed,
        hash: props.data.hash,
      },
    })
  }

  closeDialog()
}

// 什么是可证明的公平？
function whatIsVerifyFairnesses() {
  closeDialog()

  if (isFlutterApp())
    sendMsgToFlutterApp(SendFlutterAppMessage.PROVABLY_FAIR_OVERVIEW)

  else
    push('/provably-fair/overview')
}
</script>

<template>
  <div class="theme-bg w-full flex flex-col rounded-bl-[4px] rounded-br-[4px]">
    <div class="flex flex-col cursor-pointer px-[20px] py-[15px]">
      <BaseButton
        size="none" type="text" disabled-click-transition style="--tg-base-button-text-default-color:var(--tg-text-white);"
        @click="toggleShowSeedDetail"
      >
        <div class="w-full flex justify-between">
          <span class="leading-[1]">{{ t('provable_fairness') }}</span>
          <div class="drop-icon flex items-center text-[16px]" :class="[showSeedDetail ? 'rotate-[270deg]' : '']">
            <IconUniArrowLeft />
          </div>
        </div>
      </BaseButton>
    </div>

    <template v-if="game === GAMES_LIST_ENUM.CRASH">
      <div v-show="showSeedDetail" class="flex-col-16 w-full flex flex-col p-[16px] pt-0">
        <BaseLabel :label="t('hash_short_label')">
          <AppCopyLine :msg="data?.hash ?? ''" :placeholder="t('seed_not_be_revealed_yet')" />
        </BaseLabel>
        <BaseLabel :label="t('plinko_fairnesses_seed')">
          <AppCopyLine :msg="data?.base_seed ?? ''" />
        </BaseLabel>
        <div class="flex flex-col items-center">
          <BaseButton type="text" size="none" @click="verifyMyBets">
            {{ t('verify_my_bets') }}
          </BaseButton>
        </div>
      </div>
    </template>
    <template v-else>
      <div v-show="showSeedDetail" class="flex-col-16 w-full flex flex-col p-[16px] pt-0">
        <BaseLabel :label="t('server_seed')">
          <AppCopyLine :hide-copy="true" :msg="serverSeed" :placeholder="t('seed_not_be_revealed_yet')" />
        </BaseLabel>
        <BaseLabel :label="t('server_seed_hash')">
          <AppCopyLine class="h-[40px]" :msg="serverSeedHash" />
        </BaseLabel>
        <div class="@xm:grid @xm:grid-cols-[7fr,3fr] flex flex-col gap-[16px]">
          <BaseLabel :label="t('client_seed')">
            <AppCopyLine class="h-[40px]" :msg="clientSeed" />
          </BaseLabel>
          <BaseLabel :label="t('present_sign')">
            <AppCopyLine class="h-[40px]" :msg="nonce.toString()" />
          </BaseLabel>
        </div>

        <div v-if="serverSeed" class="flex flex-col items-center">
          <BaseButton type="text" size="none" @click="verifyMyBets">
            {{ t('verify_my_bets') }}
          </BaseButton>
        </div>
        <div v-else class="flex flex-col items-center">
          <BaseButton type="text" size="none" @click="changeYourSeed">
            {{ t('change_your_seed_pair_to_verify_your_bet') }}
          </BaseButton>
        </div>
        <div class="flex flex-col items-center">
          <BaseButton type="text" size="none" @click="whatIsVerifyFairnesses">
            {{ t('what_is_verify_fairnesses') }}
          </BaseButton>
        </div>
      </div>
    </template>
  </div>
</template>

<style lang='scss' scoped>
.theme-bg{
  background-color: var(--tg-secondary-dark);
  @include webTheme('white'){
    background-color: #fff;
    --tg-app-copy-line-input-wrap-box-shadow:none;
    --tg-base-input-style-placeholder-color:#555;
    --tg-app-copy-line-input-background-color:#E8E8E8;
    --tg-app-copy-line-button-box-background-color:#E8E8E8;
    --tg-app-copy-line-input-border-color:#E8E8E8;
  }
  @include webTheme('green'){
    background-color:#02432D;
    --tg-app-copy-line-input-wrap-box-shadow:none;
    --tg-icon-color:white;
    --app-copyline-theme-icon-color:white;
  }
}
.flex-col-16{
  > *:not(:first-child) {
    margin-top: var(--tg-spacing-16);
  }
}
</style>
