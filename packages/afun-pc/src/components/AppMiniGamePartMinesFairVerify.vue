<script setup lang='ts'>
import { IconUniArrowDown, IconChessPlinko, IconUniArrowUpSmall2 } from '@tg/icons'
import { GAMES_LIST, useMines } from 'feie-ui'

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
const { push } = useLocalRouter()

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
        class="border-tg-secondary text-left min-h-[200px] flex flex-col items-center justify-center border-[2px] rounded-[8px] border-dotted p-[16px]"
      >
        <!-- no result -->
        <div v-show="!hasResult" class="flex flex-col items-center">
          <span class="text-tg-text-grey-light text-[14px] leading-[1.5]">
            {{ t('plinko_fairnesses_verifyText1') }}
          </span>
          <IconChessPlinko class="plinko-icon-loading mt-[16px] block" />
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
      <BaseLabel :label="t('plinko_verifyTexts_game')">
        <BaseSelect
          v-model="_game" :options="GAMES_LIST" style="
        --tg-base-select-style-padding-y:7px;
        --tg-base-select-style-padding-x:7px;
        " @select="onGameSelect"
        />
      </BaseLabel>
      <BaseLabel :label="t('plinko_verifyTexts_clientSeed')">
        <BaseInput
          v-model="minesParams.clientSeed" style="
        --tg-base-input-style-pad-x:7px;
        --tg-base-input-style-pad-y:7px;
        --tg-base-input-style-pad-left:7px;
        --tg-base-input-line-height:1.5;
        "
          @input="onClientSeedInput"
        />
      </BaseLabel>
      <BaseLabel :label="t('plinko_verifyTexts_serverSeed')">
        <BaseInput
          v-model="minesParams.serverSeed" style="
        --tg-base-input-style-pad-x:7px;
        --tg-base-input-style-pad-y:7px;
        --tg-base-input-style-pad-left:7px;
        --tg-base-input-line-height:1.5;
        "
          @input="onServerSeedInput"
        />
      </BaseLabel>
      <BaseLabel :label="t('plinko_verifyTexts_nonce')">
        <BaseInput
          v-model.number="minesParams.nonce" style="
        --tg-base-input-style-pad-x:7px;
        --tg-base-input-style-pad-y:7px;
        --tg-base-input-style-pad-left:7px;
        --tg-base-input-line-height:1.5;
        "
          type="number" @input="onNonceInput"
        >
          <template #right>
            <div class="relative flex">
              <div
                class="bg-tg-secondary active:bg-tg-secondary-dark group-hover:bg-tg-text-grey-hover flex items-center px-[20px] py-[13.5px]"
                style="--tg-icon-color:var(--tg-text-white)"
                @click="changeNoncePlinko('down')"
              >
                <IconUniArrowDown />
              </div>
              <div
                class="bg-tg-secondary active:bg-tg-secondary-dark group-hover:bg-tg-text-grey-hover flex items-center px-[20px] py-[13.5px]"
                style="--tg-icon-color:var(--tg-text-white)"
                @click="changeNoncePlinko('up')"
              >
                <IconUniArrowUpSmall2 />
              </div>
              <div class="bg-tg-primary absolute left-[53px] top-[11px] h-[22px] w-[2px]" />
            </div>
          </template>
        </BaseInput>
      </BaseLabel>
      <BaseLabel label="Mines">
        <BaseSelect
          v-model="minesParams.mines" :options="minesList" style="
        --tg-base-select-style-padding-y:7px;
        --tg-base-select-style-padding-x:7px;
        "
        />
      </BaseLabel>
      <div class="flex justify-center">
        <BaseButton type="text" size="none" @click="checkFairnessesCalcButton">
          <span>{{ t('plinko_fairnesses_calcButton') }}</span>
        </BaseButton>
      </div>
    </div>
  </div>
</template>

<style lang='scss' scoped>
.flex-col-16{
  > *:not(:first-child) {
    margin-top: var(--tg-spacing-16);
  }
}
.group-hover\:bg-tg-text-grey-hover:hover:not(:active) {
  background-color: var(--tg-third-grey);
}
</style>
