<script setup lang='ts'>
import { PhBaseInput, PhBaseLabel, PhBaseSelect } from '@tg/bccomponents'
import { GAMES_LIST, useMines } from 'feie-ui'
import { computed, inject, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import AppMiniGamePartMinesGameResultComponents from './AppMiniGamePartMinesGameResultComponents.vue'

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
  name: 'AppMiniGamePartMinesFairVerify',
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
const minesParams = ref({
  clientSeed: props.clientSeed,
  serverSeed: props.serverSeed,
  nonce: props.nonce,
  mines: props.gameData?.mines,
})
const minesList = [
  { label: '1', value: 1 },
  { label: '2', value: 2 },
  { label: '3', value: 3 },
  { label: '4', value: 4 },
  { label: '5', value: 5 },
  { label: '6', value: 6 },
  { label: '7', value: 7 },
  { label: '8', value: 8 },
  { label: '9', value: 9 },
  { label: '10', value: 10 },
  { label: '11', value: 11 },
  { label: '12', value: 12 },
  { label: '13', value: 13 },
  { label: '14', value: 14 },
  { label: '15', value: 15 },
  { label: '16', value: 16 },
  { label: '17', value: 17 },
  { label: '18', value: 18 },
  { label: '19', value: 19 },
  { label: '20', value: 20 },
  { label: '21', value: 21 },
  { label: '22', value: 22 },
  { label: '23', value: 23 },
  { label: '24', value: 24 },
]
const openByPlayerList = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24]
const { resultMap } = useMines(minesParams)
const hasResult = computed(() => (minesParams.value.clientSeed || minesParams.value.serverSeed) && minesParams.value.mines)

function changeNoncePlinko(type: 'up' | 'down') {
  if (type === 'up')
    minesParams.value.nonce += 1

  else if (type === 'down' && minesParams.value.nonce > 0)
    minesParams.value.nonce -= 1
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
        class="border-tg-secondary text-lfet min-h-[200rem] flex flex-col items-center justify-center border-2 rounded-[8rem] border-dotted p-[16rem]"
      >
        <!-- no result -->
        <div v-show="!hasResult" class="flex flex-col items-center">
          <span class="text-tg-text-grey-light text-[14rem] leading-[1.5]">
            {{ t('需要更多输入才能验证结果') }}
          </span>
          <BaseIcon class="plinko-icon-loading mt-16 block" name="chess-plinko" />
        </div>
        <!-- result -->
        <div v-if="hasResult" class="w-full">
          <AppMiniGamePartMinesGameResultComponents
            :key="`${minesParams.clientSeed}-${minesParams.serverSeed}-${minesParams.nonce}-${minesParams.mines}`"
            :mines="resultMap.renderValues" :open-by-player-list="openByPlayerList"
          />
        </div>
      </div>
    </div>

    <div class="bg-tg-secondary-dark flex-col-16 flex flex-col p-16">
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
          v-model="minesParams.clientSeed" style="
        --ph-base-input-padding-y: 9rem
        "
          @input="onClientSeedInput"
        />
      </PhBaseLabel>
      <PhBaseLabel :label="t('服务端种子')" style="--ph-base-label-margin-bottom: 2rem">
        <PhBaseInput
          v-model="minesParams.serverSeed" style="
        --ph-base-input-padding-y: 9rem
        "
          @input="onServerSeedInput"
        />
      </PhBaseLabel>
      <PhBaseLabel :label="t('现时标志')" style="--ph-base-label-margin-bottom: 2rem">
        <PhBaseInput
          v-model.number="minesParams.nonce" style="
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
                <BaseIcon name="uni-arrow-down" />
              </div>
              <div
                class="bg-[#EBEBEB] flex items-center justify-center w-[32rem] h-[32rem] mt-[3rem] rounded-[4rem] mr-[4rem]"
                style="--tg-icon-color:var(--tg-text-white)"
                @click="changeNoncePlinko('up')"
              >
                <BaseIcon name="uni-arrow-up-small2" />
              </div>
              <div class="bg-tg-primary absolute left-53 top-11 h-22 w-2" />
            </div>
          </template>
        </PhBaseInput>
      </PhBaseLabel>
      <PhBaseLabel label="Mines" style="--ph-base-label-margin-bottom: 2rem">
        <PhBaseSelect
          v-model="minesParams.mines" :options="minesList" style="
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
  background-color: var(--tg-third-grey);
}
</style>
