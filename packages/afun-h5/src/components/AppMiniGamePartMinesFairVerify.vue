<script setup lang='ts'>
import { AfunBaseInput, AfunBaseLabel, AfunBaseSelect } from '@tg/bccomponents'
import { IconUniArrowDown, IconUniArrowUpSmall2 } from '@tg/icons'
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
    <div class="flex-col-16 flex flex-col p-[16px]">
      <div
        class="border-tg-secondary text-lfet min-h-[200px] flex flex-col items-center justify-center border-2 rounded-[8px] border-dotted p-[16px]"
      >
        <!-- no result -->
        <div v-show="!hasResult" class="flex flex-col items-center">
          <span class="text-tg-text-grey-light text-[14px] leading-[1.5]">
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

    <div class="bg-tg-secondary-dark flex-col-16 flex flex-col p-[16px]">
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
          v-model="minesParams.clientSeed" style="
        --afun-base-input-padding-y: 9px
        "
          @input="onClientSeedInput"
        />
      </AfunBaseLabel>
      <AfunBaseLabel :label="t('服务端种子')" style="--afun-base-label-margin-bottom: 2px">
        <AfunBaseInput
          v-model="minesParams.serverSeed" style="
        --afun-base-input-padding-y: 9px
        "
          @input="onServerSeedInput"
        />
      </AfunBaseLabel>
      <AfunBaseLabel :label="t('现时标志')" style="--afun-base-label-margin-bottom: 2px">
        <AfunBaseInput
          v-model.number="minesParams.nonce" style="
        --afun-base-input-padding-right: 0;
        --afun-base-input-padding-y: 9px
        "
          type="number" @input="onNonceInput"
        >
          <template #right>
            <div class="relative flex">
              <div
                class="bg-[#2f4553] flex items-center justify-center w-[32px] h-[32px] mt-[3px] rounded-[4px] mr-[2px]"
                style="--tg-icon-color:var(--tg-text-white)"
                @click="changeNoncePlinko('down')"
              >
                <IconUniArrowDown />
              </div>
              <div
                class="bg-[#2f4553] flex items-center justify-center w-[32px] h-[32px] mt-[3px] rounded-[4px] mr-[4px]"
                style="--tg-icon-color:var(--tg-text-white)"
                @click="changeNoncePlinko('up')"
              >
                <IconUniArrowUpSmall2 />
              </div>
              <div class="bg-tg-primary absolute left-53 top-11 h-22 w-2" />
            </div>
          </template>
        </AfunBaseInput>
      </AfunBaseLabel>
      <AfunBaseLabel label="Mines" style="--afun-base-label-margin-bottom: 2px">
        <AfunBaseSelect
          v-model="minesParams.mines" :options="minesList" style="
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
