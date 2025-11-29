<script lang="ts" setup>
import { ApiGameOriginalSeedDecryptHash } from '@tg/apis'

const { t } = useI18n()
const {
  value: serverSeedHash,
  errorMessage: seedMsg,
  validate: valiSeed,
} = useField<string>('seed', (v) => {
  if (!v)
    return t('this_field_is_required')
  return ''
})
const serverSeed = ref('N/A')

const { run, loading } = useRequest(() => ApiGameOriginalSeedDecryptHash(serverSeedHash.value), {
  onSuccess(res) {
    if (res.server_seed)
      serverSeed.value = res.server_seed
  },
})

async function handleUnhash() {
  serverSeed.value = 'N/A'
  await valiSeed()
  if (!seedMsg.value)
    run()
}
</script>

<template>
  <div class="layout-spacing reset gap-[16px]">
    <BaseLabel :label="$t('server_seed_hash')">
      <BaseInput
        v-model="serverSeedHash"
        class="theme-color" type="text" :msg="seedMsg"
        @on-right-button="handleUnhash"
      >
        <template #right-button>
          <span class="text-tg-text-black">{{ $t('unhash') }}</span>
        </template>
      </BaseInput>
    </BaseLabel>
    <BaseLabel :label="$t('server_seed')">
      <AppCopyLine :loading="loading" :msg="serverSeed" />
    </BaseLabel>
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
</style>

<style lang="scss" scoped>
.theme-color {
  --tg-base-input-right-button-bg: var(--app-mini-game-provably-fair-seed-input-bg);
  --tg-base-input-right-button-hover-bg: var(--app-mini-game-provably-fair-seed-input-hover-bg);
  @include webTheme('green') {
    --tg-base-input-right-button-bg: #0e6746;
    --tg-base-input-right-button-hover-bg: #1f9a75;
  }
  @include webTheme('white') {
    --tg-base-input-right-button-bg: #d4d4d4;
  }
}
.layout-spacing {
  --tg-base-input-right-button-bg: var(--tg-primary-success);
  --tg-base-input-right-button-hover-bg: var(--tg-primary-success);
  @include webTheme('green') {
    --tg-primary-success: #197b59;
    --tg-text-black: #fff;
  }
}
</style>
