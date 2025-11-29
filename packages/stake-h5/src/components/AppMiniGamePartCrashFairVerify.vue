<script setup lang='ts'>
import { IconChessPlinko } from '@tg/icons'
import { GAMES_LIST } from 'feie-ui'

interface Props {
  game: string
  clientSeed: string
  serverSeed: string
  nonce: number
  base_seed: string
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
const { push } = useLocalRouter()

const _game = ref(props.game)
const params = ref({
  clientSeed: props.clientSeed,
  serverSeed: props.serverSeed,
  nonce: props.nonce,
  hash: props.hash,
  base_seed: props.base_seed,
})

const result = computed(() => {
  if (props.hash && props.base_seed) {
    try {
      const temp = getCrashPoint(props.hash, props.base_seed)
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
        class="border-tg-secondary text-left min-h-[200px] flex flex-col items-center justify-center border-[2px] rounded-[8px] border-dotted p-[16px]"
      >
        <!-- no result -->
        <div v-show="!result" class="flex flex-col items-center">
          <span class="text-tg-text-grey-light text-[14px] leading-[1.5]">
            {{ t('plinko_fairnesses_verifyText1') }}
          </span>
          <IconChessPlinko class="plinko-icon-loading mt-[16px] block" />
        </div>
        <!-- result -->
        <div v-if="result" class="w-full">
          <AppMiniGamePartCrashGameResultComponent :key="result" :result="result" />
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
      <BaseLabel :label="t('hash_short_label')">
        <BaseInput
          v-model="params.hash" style="
        --tg-base-input-style-pad-x:7px;
        --tg-base-input-style-pad-y:7px;
        --tg-base-input-style-pad-left:7px;
        --tg-base-input-line-height:1.5;
        " @input="onHashInput"
        />
      </BaseLabel>
      <BaseLabel :label="t('plinko_fairnesses_seed')">
        <BaseInput
          v-model="params.base_seed" style="
        --tg-base-input-style-pad-x:7px;
        --tg-base-input-style-pad-y:7px;
        --tg-base-input-style-pad-left:7px;
        --tg-base-input-line-height:1.5;
        " @input="onBaseSeedInput"
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
