<script setup lang='ts'>
import type { MiniGameSeedDetail } from '@tg/types'
import { ApiGameOriginalSeedDetail, ApiGameOriginalSeedUpdate } from '@tg/apis'
import { AfunBaseButton, AfunBaseInput, AfunBaseLabel } from '@tg/bccomponents'
import { useAppStore } from '@tg/stores'
import { nanoid } from 'nanoid'
import { storeToRefs } from 'pinia'
import { useField } from 'vee-validate'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRequest } from 'vue-request'
import { Message } from '~/utils'
import AppCopyLine from './AppCopyLine.vue'

defineOptions({
  name: 'AppMiniGameProvablyFairSeed',
})
const { t } = useI18n()
const { isLogin } = storeToRefs(useAppStore())

const { value: newClientSeed, errorMessage: errorNCS } = useField<string>('newClientSeed', (v) => {
  if (!v)
    return t('此字段为必填项')

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
  Message.error(t('不允许此操作'))
}
</script>

<template>
  <div class="flex-col-16 flex flex-col p-[16px] pt-[20px] gap-[16px]">
    <AfunBaseLabel :label="t('活跃客户端种子')">
      <AppCopyLine :loading="detailLoading || updateLoading" class="h-[40px]" :msg="dataObj.active_client_seed" />
    </AfunBaseLabel>
    <AfunBaseLabel :label="t('活跃服务器种子（散列化）')">
      <AppCopyLine :loading="detailLoading || updateLoading" :msg="dataObj.active_server_seed_hash" />
    </AfunBaseLabel>
    <AfunBaseLabel :label="t('种子配对的投注次数')">
      <AppCopyLine :loading="detailLoading || updateLoading" hide-copy :msg="dataObj.nonce.toString()" />
    </AfunBaseLabel>
  </div>

  <div class="flex-col-16 box flex flex-col p-[16px] gap-[16px]">
    <h3 class="text-tg-text-white text-center font-[600] leading-[1.5] text-[16px]">
      {{ t('轮换种子配对') }}
    </h3>
    <AfunBaseLabel :label="t('新客户端种子')">
      <div :class="{ 'opacity-50': detailLoading || updateLoading }">
        <AfunBaseInput
          v-model="newClientSeed" :msg="errorNCS"
          :disabled="!!(dataObj.active_casino_bets && dataObj.active_casino_bets.length)"
          style="--afun-base-input-font-weight: 500; --afun-base-input-padding-right: 0; --afun-base-input-padding-y: 9px"
        >
          <template #right>
            <AfunBaseButton
              :disabled="!!(dataObj.active_casino_bets && dataObj.active_casino_bets.length)"
              type="primary" style="--afun-base-button-font-size: 14px; --afun-base-button-padding-x: 38px; --afun-base-button-border-radius: 0; --afun-base-button-padding-y: 7px;" @click="onClientSeedChange"
            >
              {{ t('更换') }}
            </AfunBaseButton>
          </template>
        </AfunBaseInput>
      </div>
    </AfunBaseLabel>
    <AfunBaseLabel :label="t('下一个服务器种子（散列化）')">
      <AppCopyLine :loading="detailLoading || updateLoading" :msg="dataObj.next_server_seed_hash" />
    </AfunBaseLabel>

    <span v-if="dataObj.active_casino_bets && dataObj.active_casino_bets.length" class="text-tg-text-lightgrey text-[14px] leading-[1.5]">
      {{ t('您必须完成以下游戏才能轮换种子配对') }}
      <span class="text-tg-text-white font-semibold capitalize">
        {{ dataObj.active_casino_bets?.map(a => a.game_name).join(', ') }}
      </span>
    </span>
  </div>
</template>

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
}
</style>
