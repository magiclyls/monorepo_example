<script setup lang='ts'>
import { ApiMemberNoticeLimitCount } from '@tg/apis'
import { PhBaseCheckbox } from '@tg/bccomponents'
import { useBoolean, useDialogSiteAnnouncementList } from '@tg/hooks'
import { useAppStore } from '@tg/stores'
import { storeToRefs } from 'pinia'
import { onMounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'

defineOptions({
  name: 'AppDialogNoMoreToday',
})
const { t } = useI18n()
const { isLogin } = storeToRefs(useAppStore())
const {
  currentNoticeId,
  noticeList,
  saveCurrentNoticeId,
  removeCurrentNoticeId,
  checkIsNoMore,
  checkHideNoMoreTip,
} = useDialogSiteAnnouncementList()
const { bool: checked } = useBoolean(false)
const { bool: hide } = useBoolean(false)

function onNoMoreTipChecked(v: boolean) {
  if (isLogin.value) {
    ApiMemberNoticeLimitCount({
      types: 2,
      is_check: checked.value ? 1 : 2,
      ids: [noticeList.value.find(a => a.id === currentNoticeId.value)?.id ?? ''],
    })
  }
  if (v)
    return saveCurrentNoticeId()
  removeCurrentNoticeId()
}

watch(currentNoticeId, (a) => {
  checked.value = checkIsNoMore(a)
  hide.value = checkHideNoMoreTip(a)
})

onMounted(() => {
  checked.value = checkIsNoMore(currentNoticeId.value)
  hide.value = checkHideNoMoreTip(currentNoticeId.value)
})
</script>

<template>
  <div v-show="!hide" class="no-more flex items-center whitespace-nowrap">
    <PhBaseCheckbox
      v-model="checked"
      style="--tg-base-checked-color:#ffbb00"
      @change="onNoMoreTipChecked"
    />
    <span class="ml-[8rem] text-[#fff]">{{ t('今日不再提示') }}</span>
  </div>
</template>

<style lang='scss' scoped>

</style>
