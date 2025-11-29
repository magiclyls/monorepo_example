<script lang="ts" setup>
import { ApiGameOriginalSeedDecryptHash } from '@tg/apis'
import { PhBaseButton, PhBaseInput, PhBaseLabel } from '@tg/bccomponents'
import { useField } from 'vee-validate'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRequest } from 'vue-request'
import AppCopyLine from '~/components/AppCopyLine.vue'

const { t } = useI18n()
const {
  value: serverSeedHash,
  errorMessage: seedMsg,
  validate: valiSeed,
} = useField<string>('seed', (v) => {
  if (!v)
    return t('此字段为必填项')
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
  <div class="layout-spacing reset gap-[16rem] flex flex-col">
    <PhBaseLabel :label="$t('服务器种子（散列化）')">
      <PhBaseInput
        v-model="serverSeedHash"
        class="theme-color" type="text" :msg="seedMsg"
        style="--ph-base-input-padding-right: 0;--ph-base-input-padding-y: 9rem"
        @on-right-button="handleUnhash"
      >
        <template #right>
          <PhBaseButton style="--ph-base-button-font-size: 14rem;--ph-base-button-border-radius: 0; --ph-base-button-padding-y: 7rem">
            {{ $t('取消散列') }}
          </PhBaseButton>
        </template>
      </PhBaseInput>
    </PhBaseLabel>
    <PhBaseLabel :label="$t('服务器种子')">
      <AppCopyLine :loading="loading" :msg="serverSeed" />
    </PhBaseLabel>
  </div>
</template>
