<script setup lang='ts'>
import { AfunBaseInput, AfunBaseLabel, AfunBaseSelect } from '@tg/bccomponents'
import { IconIconChessPlinko } from '@tg/icons'
import { getCrashPoint } from '@tg/utils'
import { GAMES_LIST } from 'feie-ui'
import { computed, inject, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import AppMiniGamePartCrashGameResultComponent from './AppMiniGamePartCrashGameResultComponent.vue'

interface Props {
  game: string
  clientSeed: string
  serverSeed: string
  nonce: number
  baseSeed: string
  hash: string
}
defineOptions({
  name: 'AppMiniGamePartCrashFairVerify',
})
const props = defineProps<Props>()
const emit = defineEmits([
  'update:game',
  'update:clientSeed',
  'update:serverSeed',
  'update:nonce',
  'update:base_seed',
  'update:hash',
])

const { t } = useI18n()
const closeDialog = inject('closeDialog', () => { })
const { push } = useRouter()

const _game = ref(props.game)
const params = ref({
  clientSeed: props.clientSeed,
  serverSeed: props.serverSeed,
  nonce: props.nonce,
  hash: props.hash,
  base_seed: props.baseSeed,
})

const result = computed(() => {
  if (props.hash && props.baseSeed) {
    try {
      const temp = getCrashPoint(props.hash, props.baseSeed)
      if (temp)
        return temp[0]
    }
    catch {}
  }
})

function changeNonceDice(type: 'up' | 'down') {
  if (type === 'up')
    params.value.nonce += 1

  else if (type === 'down' && params.value.nonce > 0)
    params.value.nonce -= 1
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
function onHashInput(v: string) {
  emit('update:hash', v)
}
function onBaseSeedInput(v: string) {
  emit('update:base_seed', v)
}
// 查看计算细目
function checkFairnessesCalcButton() {
  // if (isFlutterApp())
  //   sendMsgToFlutterApp(SendFlutterAppMessage.PROVABLY_FAIR_CALCULATION, _game.value)

  // else
  push(`/provably-fair/calculation?game=${_game.value}&hash=${params.value.hash}&base_seed=${params.value.base_seed}`)
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
        <div v-show="!result" class="flex flex-col items-center">
          <span class="text-tg-text-grey-light text-[14px] leading-[1.5]">
            {{ t('需要更多输入才能验证结果') }}
          </span>
          <IconIconChessPlinko class="plinko-icon-loading mt-[16px] block" />
        </div>
        <!-- result -->
        <div v-if="result" class="w-full">
          <AppMiniGamePartCrashGameResultComponent :key="result" :result="result" />
        </div>
      </div>
    </div>

    <div class="bg-tg-secondary-dark flex-col-16 flex flex-col p-[16px] gap-[16px]">
      <AfunBaseLabel :label="t('游戏')">
        <AfunBaseSelect
          v-model="_game" :options="GAMES_LIST" style="
        --tg-base-select-style-padding-y:7px;
        --tg-base-select-style-padding-x:7px;
        " @change="onGameSelect"
        />
      </AfunBaseLabel>
      <AfunBaseLabel :label="t('散列')">
        <AfunBaseInput
          v-model="params.hash" style="
        --tg-base-input-style-pad-x:7px;
        --tg-base-input-style-pad-y:7px;
        --tg-base-input-style-pad-left:7px;
        --tg-base-input-line-height:1.5;
        " @input="onHashInput"
        />
      </AfunBaseLabel>
      <AfunBaseLabel :label="t('种子')">
        <AfunBaseInput
          v-model="params.base_seed" style="
        --tg-base-input-style-pad-x:7px;
        --tg-base-input-style-pad-y:7px;
        --tg-base-input-style-pad-left:7px;
        --tg-base-input-line-height:1.5;
        " @input="onBaseSeedInput"
        />
      </AfunBaseLabel>
      <!-- <BaseLabel :label="t('plinko_verifyTexts_clientSeed')">
        <BaseInput
          v-model="params.clientSeed" style="
        --tg-base-input-style-pad-x:7px;
        --tg-base-input-style-pad-y:7px;
        --tg-base-input-style-pad-left:7px;
        --tg-base-input-line-height:1.5;
        " @input="onClientSeedInput"
        />
      </BaseLabel>
      <BaseLabel :label="t('plinko_verifyTexts_serverSeed')">
        <BaseInput
          v-model="params.serverSeed" style="
        --tg-base-input-style-pad-x:7px;
        --tg-base-input-style-pad-y:7px;
        --tg-base-input-style-pad-left:7px;
        --tg-base-input-line-height:1.5;
        " @input="onServerSeedInput"
        />
      </BaseLabel>
      <BaseLabel :label="t('plinko_verifyTexts_nonce')">
        <BaseInput
          v-model.number="params.nonce" style="
        --tg-base-input-style-pad-x:7px;
        --tg-base-input-style-pad-y:7px;
        --tg-base-input-style-pad-left:7px;
        --tg-base-input-line-height:1.5;
        " type="number" @input="onNonceInput"
        >
          <template #right>
            <div class="relative flex">
              <div
                class="bg-tg-secondary active:bg-tg-secondary-dark group-hover:bg-tg-text-grey-hover flex items-center px-20 py-[13.5px]"
                style="--tg-icon-color:var(--tg-text-white)"
                @click="changeNonceDice('down')"
              >
                <BaseIcon name="uni-arrow-down" />
              </div>
              <div
                class="bg-tg-secondary active:bg-tg-secondary-dark group-hover:bg-tg-text-grey-hover flex items-center px-20 py-[13.5px]"
                style="--tg-icon-color:var(--tg-text-white)"
                @click="changeNonceDice('up')"
              >
                <BaseIcon name="uni-arrow-up-small2" />
              </div>
              <div class="bg-tg-primary absolute left-53 top-11 h-22 w-2" />
            </div>
          </template>
        </BaseInput>
      </BaseLabel> -->
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
