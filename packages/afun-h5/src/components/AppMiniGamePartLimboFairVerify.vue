<script setup lang='ts'>
import { IconIconChessPlinko, IconUniArrowDown, IconUniArrowUpSmall2 } from '@tg/icons'
import { toFixed } from '@tg/utils'
import { GAMES_LIST, useLimbo } from 'feie-ui'
import { computed, inject, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'

interface Props {
  game: string
  clientSeed: string
  serverSeed: string
  nonce: number
}
defineOptions({
  name: 'AppMiniGamePartLimboFairVerify',
})
const props = defineProps<Props>()
const emit = defineEmits([
  'update:game',
  'update:clientSeed',
  'update:serverSeed',
  'update:nonce',
])

const { t } = useI18n()
const closeDialog = inject('closeDialog', () => { })
const { push } = useRouter()

const _game = ref(props.game)
const limboParams = ref({
  clientSeed: props.clientSeed,
  serverSeed: props.serverSeed,
  nonce: props.nonce,
})

const { limboResult } = useLimbo(limboParams)
const hasResult = computed(() => limboResult.value !== 0)

function changeNonceDice(type: 'up' | 'down') {
  if (type === 'up')
    limboParams.value.nonce += 1

  else if (type === 'down' && limboParams.value.nonce > 0)
    limboParams.value.nonce -= 1
}
function onGameSelect(v: string) {
  emit('update:game', v)
}
function onClientSeedInput(v: string) {
  emit('update:clientSeed', v)
}
function onServerSeedInput(v: string) {
  emit('update:serverSeed', v)
}
function onNonceInput(v: number) {
  emit('update:nonce', +v)
}
// 查看计算细目
function checkFairnessesCalcButton() {
  // if (isFlutterApp())
  //   sendMsgToFlutterApp(SendFlutterAppMessage.PROVABLY_FAIR_CALCULATION, _game.value)

  // else
  push(`/provably-fair/calculation?game=${_game.value}`)
  closeDialog()
}
</script>

<template>
  <div>
    <!-- top -->
    <div class="flex-col-16 flex flex-col p-[16px]">
      <div
        class="border-tg-secondary text-lfet min-h-[200px] flex flex-col items-center justify-center border-2 rounded-[8px] border-dotted p-[16px]"
      >
        <!-- no result -->
        <div v-show="!hasResult" class="flex flex-col items-center">
          <span class="text-tg-text-grey-light text-[14px] leading-[1.5]">
            {{ t('需要更多输入才能验证结果') }}
          </span>
          <IconIconChessPlinko class="plinko-icon-loading mt-[16px] block" />
        </div>
        <!-- result -->
        <div v-if=" hasResult" class="w-full text-center">
          <div class="text-tg-text-white text-[18px] font-semibold leading-[27px]" style="font-family: proxima-nova, sans-serif;">
            {{ toFixed(limboResult) }} ×
          </div>
        </div>
      </div>
    </div>

    <div class="bg-tg-secondary-dark flex-col-16 flex flex-col p-[16px] gap-[16px]">
      <BaseLabel :label="t('游戏')">
        <BaseSelect
          v-model="_game" :options="GAMES_LIST" style="
        --tg-base-select-style-padding-y:7px;
        --tg-base-select-style-padding-x:7px;
        " @change="onGameSelect"
        />
      </BaseLabel>
      <BaseLabel :label="t('客户端种子')">
        <BaseInput
          v-model="limboParams.clientSeed" style="
        --afun-base-input-padding-y: 9px
        " @input="onClientSeedInput"
        />
      </BaseLabel>
      <BaseLabel :label="t('服务端种子')">
        <BaseInput
          v-model="limboParams.serverSeed" style="
        --afun-base-input-padding-y: 9px
        " @input="onServerSeedInput"
        />
      </BaseLabel>
      <BaseLabel :label="t('现时标志')">
        <BaseInput
          v-model.number="limboParams.nonce" style="
        --afun-base-input-padding-right: 0;
        --afun-base-input-padding-y: 9px
        " type="number" @input="onNonceInput"
        >
          <template #right>
            <div class="relative flex">
              <div
                class="bg-[#EBEBEB] flex items-center justify-center w-[32px] h-[32px] mt-[3px] rounded-[4px] mr-[2px]"
                style="--tg-icon-color:var(--tg-text-white)"
                @click="changeNonceDice('down')"
              >
                <IconUniArrowDown />
              </div>
              <div
                class="bg-[#EBEBEB] flex items-center justify-center w-[32px] h-[32px] mt-[3px] rounded-[4px] mr-[4px]"
                style="--tg-icon-color:var(--tg-text-white)"
                @click="changeNonceDice('up')"
              >
                <IconUniArrowUpSmall2 />
              </div>
              <div class="bg-tg-primary absolute left-[53px] top-[11px] h-[22px] w-[2px]" />
            </div>
          </template>
        </BaseInput>
      </BaseLabel>
      <div class="flex justify-center">
        <div class="text-[#b1bad3] font-[600]" @click="checkFairnessesCalcButton">
          <span>{{ t('查看计算细目') }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang='scss' scoped>
.flex-col-16 {
  > *:not(:first-child) {
    margin-top: var(--tg-spacing-16);
  }
}
.group-hover\:bg-tg-text-grey-hover:hover:not(:active) {
  background-color: var(--tg-third-grey);
}
</style>
