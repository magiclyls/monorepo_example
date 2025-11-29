<script setup lang='ts'>
import { PhBaseInput, PhBaseLabel, PhBaseSelect } from '@tg/bccomponents'
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
    <div class="flex-col-16 flex flex-col p-[16rem]">
      <div
        class="border-tg-secondary text-left min-h-[200rem] flex flex-col items-center justify-center border-2 rounded-[8rem] border-dotted p-[16rem]"
      >
        <!-- no result -->
        <div v-show="!hasResult" class="flex flex-col items-center">
          <span class="text-tg-text-grey-light text-[14rem] leading-[1.5]">
            {{ t('需要更多输入才能验证结果') }}
          </span>
          <IconIconChessPlinko class="plinko-icon-loading mt-[16rem] block" />
        </div>
        <!-- result -->
        <ResultPlinko
          v-if="hasResult" :key="`${plinkoResult}-${plinkoMulNum}-${plinkoParams.line}`" class="mx-auto" :index="plinkoResult"
          :result="(+plinkoMulNum).toFixed(1).toString()"
          :row="plinkoParams.line.toString()"
        />
      </div>
    </div>

    <div class="bg-tg-secondary-dark flex-col-16 flex flex-col p-[16rem] gap-[16rem]">
      <PhBaseLabel :label="t('游戏')" style="--ph-base-label-margin-bottom: 2rem">
        <PhBaseSelect
          v-model="_game" :options="GAMES_LIST" style="
        --tg-base-select-style-padding-y:7px;
        --tg-base-select-style-padding-x:7px;
        " @change="onGameSelect"
        />
      </PhBaseLabel>
      <PhBaseLabel :label="t('客户端种子')" style="--ph-base-label-margin-bottom: 2rem">
        <PhBaseInput
          v-model="plinkoParams.clientSeed" style="
        --ph-base-input-padding-y: 9rem
        "
          @input="onClientSeedInput"
        />
      </PhBaseLabel>
      <PhBaseLabel :label="t('服务端种子')" style="--ph-base-label-margin-bottom: 2rem">
        <PhBaseInput
          v-model="plinkoParams.serverSeed" style="
        --ph-base-input-padding-y: 9rem
        "
          @input="onServerSeedInput"
        />
      </PhBaseLabel>
      <PhBaseLabel :label="t('现时标志')" style="--ph-base-label-margin-bottom: 2rem">
        <PhBaseInput
          v-model.number="plinkoParams.nonce" style="
        --ph-base-input-padding-right: 0;
        --ph-base-input-padding-y: 9rem
        "
          type="number" @input="onNonceInput"
        >
          <template #right>
            <div class="relative flex">
              <div
                class="bg-[#EBEBEB] flex items-center justify-center w-[32rem] h-[32rem] mt-[3rem] rounded-[4rem] mr-[2rem]"
                style="--tg-icon-color:var(--tg-text-white)"
                @click="changeNoncePlinko('down')"
              >
                <IconUniArrowDown />
              </div>
              <div
                class="bg-[#EBEBEB] flex items-center justify-center w-[32rem] h-[32rem] mt-[3rem] rounded-[4rem] mr-[4rem]"
                style="--tg-icon-color:var(--tg-text-white)"
                @click="changeNoncePlinko('up')"
              >
                <IconUniArrowUpSmall2 />
              </div>
              <div class="bg-tg-primary absolute left-[53rem] top-[11rem] h-[22rem] w-[2rem]" />
            </div>
          </template>
        </PhBaseInput>
      </PhBaseLabel>
      <PhBaseLabel :label="t('风险')" style="--ph-base-label-margin-bottom: 2rem">
        <PhBaseSelect
          v-model="plinkoParams.level" :options="levelList" style="
        --tg-base-select-style-padding-y:7px;
        --tg-base-select-style-padding-x:7px;
        "
        />
      </PhBaseLabel>
      <PhBaseLabel :label="t('排数')" style="--ph-base-label-margin-bottom: 2rem">
        <PhBaseSelect
          v-model="plinkoParams.line" :options="rowList" style="
        --tg-base-select-style-padding-y:7px;
        --tg-base-select-style-padding-x:7px;
        "
        />
      </PhBaseLabel>
      <div class="flex justify-center">
        <div class="text-[#6D7693] font-[500]" @click="checkFairnessesCalcButton">
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
  background-color: var(--tg-text-grey);
}
</style>
