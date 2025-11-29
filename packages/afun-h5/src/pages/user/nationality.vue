<script setup lang='ts'>
import { ApiMemberUpdate } from '@tg/apis'
import { AfunBaseButton, AfunBaseLabel, AfunBaseSelect } from '@tg/bccomponents'
import { useApiMemberTreeList } from '@tg/hooks'
import { useAppStore } from '@tg/stores'
import { isZhcn } from '@tg/vue-i18n'
import { storeToRefs } from 'pinia'
import { useField } from 'vee-validate'
import { computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRequest } from 'vue-request'
import AppPageLayout from '~/components/AppPageLayout.vue'
import AppSettingCardWrap from '~/components/AppSettingCardWrap.vue'
import { Message } from '~/utils'

defineOptions({ name: 'AppUserNationality' })

const { t } = useI18n()
const appStore = useAppStore()
const { userInfo } = storeToRefs(appStore)
const { updateUserInfo } = appStore
const { data: areaCodeData } = useApiMemberTreeList('011')

const {
  value: nationality,
  errorMessage: nationErrorMsg,
  validate: valiNationality,
} = useField<string>('password', (value) => {
  if (!value)
    return t('请输入国籍')
  return ''
})
watch(userInfo, (_info) => {
  if (_info) {
    nationality.value = _info.nationality
  }
}, { immediate: true })

const countryList = computed(() => {
  if (areaCodeData.value && areaCodeData.value.length > 0) {
    return areaCodeData.value.map((a) => {
      return {
        label: isZhcn() ? a.name.match(/[\u4E00-\u9FA5]+/g)?.join('') || '' : a.name.match(/[A-Z]+/gi)?.join(' ') || '',
        value: a.id,
      }
    })
  }
  return []
})

const { runAsync: runMemberUpdate, loading: loadingUpdate } = useRequest(ApiMemberUpdate, {
  onSuccess() {
    Message.success(t('修改成功'))
    updateUserInfo()
  },
})

// 提交
async function updateInfo() {
  await valiNationality()
  if (!nationErrorMsg) {
    runMemberUpdate({
      record: {
        nationality: nationality.value,
      },
      uid: userInfo.value?.uid,
    })
  }
}
</script>

<template>
  <AppPageLayout :title="t('国籍')">
    <AppSettingCardWrap>
      <AfunBaseLabel :label="t('国籍')" required class="mb-[16px]">
        <AfunBaseSelect v-model="nationality" :options="countryList" :width="331">
          <template #label="{ data, isMenuShown }">
            <div
              class="w-full h-[43px] leading-[36px] px-[10px] text-[14px] font-[600] rounded-[6px] border-solid border-[2px] border-[#2F4553] shadow-[0_1px_3px_0_rgba(0,0,0,0.20)]"
              :class="isMenuShown ? 'border-[#557086]' : ''"
            >
              <span v-if="nationality">{{ data?.label }}</span>
              <span v-else class="text-[#57646D]">{{ t('请选择您的国籍') }}</span>
            </div>
          </template>
        </AfunBaseSelect>
      </AfunBaseLabel>
      <AfunBaseButton class="w-full" :loading="loadingUpdate" style="--afun-base-button-padding-y:10px;" show-shadow @click="updateInfo">
        {{ t('确认绑定') }}
      </AfunBaseButton>
    </AppSettingCardWrap>
  </AppPageLayout>
</template>

<style lang='scss' scoped></style>
