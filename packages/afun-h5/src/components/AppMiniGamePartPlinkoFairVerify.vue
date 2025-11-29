<script setup lang='ts'>
import { AfunBaseInput, AfunBaseLabel, AfunBaseSelect } from '@tg/bccomponents'
import { IconIconChessPlinko, IconUniArrowDown, IconUniArrowUpSmall2 } from '@tg/icons'
import { GAMES_LIST, usePlinko } from 'feie-ui'
import { computed, inject, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'

interface Props {
  game: string
  clientSeed: string
  serverSeed: string
  nonce: number
  gameData?: {
    [k: string]: any
  }
}

defineOptions({
  name: 'AppMiniGamePartPlinkoFairVerify',
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
const plinkoParams = ref({
  clientSeed: props.clientSeed,
  serverSeed: props.serverSeed,
  nonce: props.nonce,
  level: props.gameData?.risk ?? 'low',
  line: props.gameData?.row ? +props.gameData?.row : 16,
})
const levelList = [
  { value: 'low', label: t('低等') },
  { value: 'middle', label: t('中等') },
  { value: 'high', label: t('高等') },
]
const rowList = [
  { value: 8, label: '8' },
  { value: 9, label: '9' },
  { value: 10, label: '10' },
  { value: 11, label: '11' },
  { value: 12, label: '12' },
  { value: 13, label: '13' },
  { value: 14, label: '14' },
  { value: 15, label: '15' },
  { value: 16, label: '16' },
]
const { plinkoResult, plinkoMulNum } = usePlinko(plinkoParams)
const hasResult = computed(() => plinkoMulNum.value !== 0)

function changeNoncePlinko(type: 'up' | 'down') {
  if (type === 'up')
    plinkoParams.value.nonce += 1

  else if (type === 'down' && plinkoParams.value.nonce > 0)
    plinkoParams.value.nonce -= 1
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
        class="border-tg-secondary text-left min-h-[200px] flex flex-col items-center justify-center border-2 rounded-[8px] border-dotted p-[16px]"
      >
        <!-- no result -->
        <div v-show="!hasResult" class="flex flex-col items-center">
          <span class="text-tg-text-grey-light text-[14px] leading-[1.5]">
            {{ t('需要更多输入才能验证结果') }}
          </span>
          <IconIconChessPlinko class="plinko-icon-loading mt-[16px] block" />
        </div>
        <!-- result -->
        <ResultPlinko
          v-if="hasResult" :key="`${plinkoResult}-${plinkoMulNum}-${plinkoParams.line}`" class="mx-auto" :index="plinkoResult"
          :result="(+plinkoMulNum).toFixed(1).toString()"
          :row="plinkoParams.line.toString()"
        />
      </div>
    </div>

    <div class="bg-tg-secondary-dark flex-col-16 flex flex-col p-[16px] gap-[16px]">
      <AfunBaseLabel :label="t('游戏')" style="--afun-base-label-margin-bottom: 2px">
        <AfunBaseSelect
          v-model="_game" :options="GAMES_LIST" style="
        --tg-base-select-style-padding-y:7px;
        --tg-base-select-style-padding-x:7px;
        " @change="onGameSelect"
        />
      </AfunBaseLabel>
      <AfunBaseLabel :label="t('客户端种子')" style="--afun-base-label-margin-bottom: 2px">
        <AfunBaseInput
          v-model="plinkoParams.clientSeed" style="
        --afun-base-input-padding-y: 9px
        "
          @input="onClientSeedInput"
        />
      </AfunBaseLabel>
      <AfunBaseLabel :label="t('服务端种子')" style="--afun-base-label-margin-bottom: 2px">
        <AfunBaseInput
          v-model="plinkoParams.serverSeed" style="
        --afun-base-input-padding-y: 9px
        "
          @input="onServerSeedInput"
        />
      </AfunBaseLabel>
      <AfunBaseLabel :label="t('现时标志')" style="--afun-base-label-margin-bottom: 2px">
        <AfunBaseInput
          v-model.number="plinkoParams.nonce" style="
        --afun-base-input-padding-right: 0;
        --afun-base-input-padding-y: 9px
        "
          type="number" @input="onNonceInput"
        >
          <template #right>
            <div class="relative flex">
              <div
                class="bg-secondary flex items-center justify-center w-[32px] h-[32px] mt-[3px] rounded-[4px] mr-[2px]"
                style="--tg-icon-color:var(--tg-text-white)"
                @click="changeNoncePlinko('down')"
              >
                <IconUniArrowDown />
              </div>
              <div
                class="bg-secondary flex items-center justify-center w-[32px] h-[32px] mt-[3px] rounded-[4px] mr-[4px]"
                style="--tg-icon-color:var(--tg-text-white)"
                @click="changeNoncePlinko('up')"
              >
                <IconUniArrowUpSmall2 />
              </div>
              <div class="bg-tg-primary absolute left-[53px] top-[11px] h-[22px] w-[2px]" />
            </div>
          </template>
        </AfunBaseInput>
      </AfunBaseLabel>
      <AfunBaseLabel :label="t('风险')" style="--afun-base-label-margin-bottom: 2px">
        <AfunBaseSelect
          v-model="plinkoParams.level" :options="levelList" style="
        --tg-base-select-style-padding-y:7px;
        --tg-base-select-style-padding-x:7px;
        "
        />
      </AfunBaseLabel>
      <AfunBaseLabel :label="t('排数')" style="--afun-base-label-margin-bottom: 2px">
        <AfunBaseSelect
          v-model="plinkoParams.line" :options="rowList" style="
        --tg-base-select-style-padding-y:7px;
        --tg-base-select-style-padding-x:7px;
        "
        />
      </AfunBaseLabel>
      <div class="flex justify-center">
        <div class="text-[#b1bad3] font-[600]" @click="checkFairnessesCalcButton">
          <span>{{ t('查看计算细目') }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
:root {
  --afun-base-dialog-secondary-background-color: #2f4553;
}
</style>

<style lang='scss' scoped>
.flex-col-16 {
  > *:not(:first-child) {
    margin-top: var(--tg-spacing-16);
  }
}
.group-hover\:bg-tg-text-grey-hover:hover:not(:active) {
  background-color: var(--tg-text-grey);
}
.bg-secondary {
  background-color: var(--afun-base-dialog-secondary-background-color);
}
</style>
