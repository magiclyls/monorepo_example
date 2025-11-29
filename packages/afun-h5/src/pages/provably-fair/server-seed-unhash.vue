<script lang="ts" setup>
import { ApiGameOriginalSeedDecryptHash } from '@tg/apis'
import { AfunBaseButton, AfunBaseInput, AfunBaseLabel } from '@tg/bccomponents'
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
  <div class="layout-spacing reset gap-[16px] flex flex-col">
    <AfunBaseLabel :label="$t('服务器种子（散列化）')">
      <AfunBaseInput
        v-model="serverSeedHash"
        class="theme-color" type="text" :msg="seedMsg"
        style="--afun-base-input-padding-right: 0;--afun-base-input-padding-y: 9px"
        @on-right-button="handleUnhash"
      >
        <template #right>
          <AfunBaseButton style="--afun-base-button-font-size: 14px;--afun-base-button-border-radius: 0; --afun-base-button-padding-y: 7px">
            {{ $t('取消散列') }}
          </AfunBaseButton>
        </template>
      </AfunBaseInput>
    </AfunBaseLabel>
    <AfunBaseLabel :label="$t('服务器种子')">
      <AppCopyLine :loading="loading" :msg="serverSeed" />
    </AfunBaseLabel>
  </div>
</template>
