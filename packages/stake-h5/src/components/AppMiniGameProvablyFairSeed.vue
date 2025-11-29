<script setup lang='ts'>
import type { MiniGameSeedDetail } from '@tg/types'
import { ApiGameOriginalSeedDetail, ApiGameOriginalSeedUpdate } from '@tg/apis'
import { nanoid } from 'nanoid'

defineOptions({
  name: 'AppMiniGameProvablyFairSeed',
})
const { t } = useI18n()
const { isLogin } = storeToRefs(useAppStore())
const { openNotify } = useNotify()

const { value: newClientSeed, errorMessage: errorNCS } = useField<string>('newClientSeed', (v) => {
  if (!v)
    return t('this_field_is_required')

  return ''
}, { initialValue: nanoid().slice(0, 10) })
const dataObj = ref<MiniGameSeedDetail>({
  active_casino_bets: [],
  active_client_seed: '',
  active_server_seed_hash: '',
  next_server_seed_hash: '',
  nonce: 0,
})

const { run: runGetSeedDetail, loading: detailLoading } = useRequest(ApiGameOriginalSeedDetail, {
  onSuccess(res) {
    dataObj.value = res
  },
})
const { run: runClientSeedUpdate, loading: updateLoading } = useRequest(() => ApiGameOriginalSeedUpdate({ seed: newClientSeed.value }), {
  onSuccess(res) {
    dataObj.value = res
    newClientSeed.value = nanoid().slice(0, 10)
  },
})

function onClientSeedChange() {
  if (errorNCS.value)
    return

  if (dataObj.value.active_casino_bets && dataObj.value.active_casino_bets.length)
    return

  dataObj.value = {
    active_casino_bets: [],
    active_client_seed: '',
    active_server_seed_hash: '',
    next_server_seed_hash: '',
    nonce: 0,
  }
  runClientSeedUpdate()
}

if (isLogin.value) {
  runGetSeedDetail()
}
else {
  openNotify({
    type: 'error',
    message: t('notify_error_forbid_operation'),
  })
}
</script>

<template>
  <div class="flex-col-16 flex flex-col p-[16px]">
    <BaseLabel :label="t('plinko_fairnesses_text1')">
      <AppCopyLine :loading="detailLoading || updateLoading" class="h-[40px]" :msg="dataObj.active_client_seed" />
    </BaseLabel>
    <BaseLabel :label="t('plinko_fairnesses_text2')">
      <AppCopyLine :loading="detailLoading || updateLoading" :msg="dataObj.active_server_seed_hash" />
    </BaseLabel>
    <BaseLabel :label="t('plinko_fairnesses_text3')">
      <AppCopyLine :loading="detailLoading || updateLoading" hide-copy :msg="dataObj.nonce.toString()" />
    </BaseLabel>
  </div>

  <div class="flex-col-16 box bg-tg-secondary-dark flex flex-col p-[16px]">
    <h3 class="text-tg-text-white text-center font-semibold leading-[1.5]">
      {{ t('plinko_fairnesses_text4') }}
    </h3>
    <BaseLabel :label="t('plinko_fairnesses_text5')" must-small>
      <div :class="{ 'opacity-50': detailLoading || updateLoading }">
        <BaseInput
          v-model="newClientSeed" :msg="errorNCS"
          :disabled="!!(dataObj.active_casino_bets && dataObj.active_casino_bets.length)"
          style="
              --tg-base-input-right-button-bg:var(--app-mini-game-provably-fair-seed-input-bg);
              --tg-base-input-right-button-hover-bg:var(--app-mini-game-provably-fair-seed-input-hover-bg);
              --tg-base-input-right-button-color:var(--tg-text-black);
              --tg-base-input-right-button-min-width:12ch;
              --tg-base-input-right-button-max-width:100%;"
          @on-right-button="onClientSeedChange"
        >
          <template #right-button>
            {{ t('plinko_fairnesses_button') }}
          </template>
        </BaseInput>
      </div>
    </BaseLabel>
    <BaseLabel :label="t('plinko_fairnesses_text6')">
      <AppCopyLine :loading="detailLoading || updateLoading" :msg="dataObj.next_server_seed_hash" />
    </BaseLabel>

    <span v-if="dataObj.active_casino_bets && dataObj.active_casino_bets.length" class="text-tg-text-lightgrey text-[14px] leading-[1.5]">
      {{ t('plinko_fairnesses_text7') }}
      <span class="text-tg-text-white font-semibold capitalize">
        {{ dataObj.active_casino_bets?.map(a => a.game_name).join(', ') }}
      </span>
    </span>
  </div>
</template>

<style>
:root {
  --app-mini-game-provably-fair-seed-input-bg: var(--tg-text-green);
  --app-mini-game-provably-fair-seed-input-hover-bg: var(--tg-primary-success);
}

[theme='greenblack'] {
  --app-mini-game-provably-fair-seed-input-bg: var(--tg-primary-active);
  --app-mini-game-provably-fair-seed-input-hover-bg: #00ae85;
}
[theme='green'] {
  --app-mini-game-provably-fair-seed-input-bg: #42bc91;
  --app-mini-game-provably-fair-seed-input-hover-bg: #00ae85;
}
[theme='white'] {
  --app-mini-game-provably-fair-seed-input-bg: #e8e8e8;
  --app-mini-game-provably-fair-seed-input-hover-bg: #d8d8d8;
  --tg-secondary-main: #e8e8e8;
}
</style>

<style lang='scss' scoped>
.flex-col-16 {
  > *:not(:first-child) {
    margin-top: var(--tg-spacing-16);
  }
}
:deep(.right-button.disabled) {
  opacity: 0.5;
  cursor: not-allowed !important;
  &:active {
    .content {
      transform: scale(1) !important;
    }
  }
  &:hover:not(:active) {
    background-color: var(--tg-base-input-right-button-bg) !important;
  }
}
.box {
  @include webTheme('green') {
    --tg-text-black: #fff;
  }
  @include webTheme('white') {
    background-color: #e8e8e8;
  }
}
</style>
