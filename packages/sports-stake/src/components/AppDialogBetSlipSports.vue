<script setup lang='ts'>
import type { ISportsMyBetSlipItem } from '@tg/types'
import { SSBaseButton } from '@tg/bccomponents'
import { IconUniHidden } from '@tg/icons'
import { useSportsStore } from '@tg/stores'
import { getCartObject } from '@tg/utils'
import { timeToCustomizeFormat } from '@tg/vue-i18n'
import { computed, inject, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import AppSportsMyBetSlip from './AppSportsMyBetSlip.vue'

interface ISportsDialogMyBetSlipItem extends ISportsMyBetSlipItem {
  username: string
}

interface Props {
  data: ISportsDialogMyBetSlipItem
}
defineOptions({
  name: 'AppDialogBetSlipSports',
})
const props = defineProps<Props>()
console.log('🚸🚸🚸 ~ props:', props.data)
const closeDialog = inject('closeDialog', () => { })
const betList = ref<any>([])

const { t } = useI18n()

const sportStore = useSportsStore()

const betTime = computed(() => props.data.bt)
const isSettled = computed(() => {
  return props.data.os === 1 || betList.value.length === 0
})

function clickHandler() {
  closeDialog()

  betList.value.forEach((item: any) => {
    if (!sportStore.cart.checkWid(item.wid))
      sportStore.cart.add(item)
  })
}

/**
 * 初始化投注列表，组合数据，过滤不可以投注的
 */
function initBetList() {
  for (const item of props.data.bi) {
    const _o = item
    const infoObject: any = {
      ic: _o.ic,
      pgid: _o.pgid,
      ci: _o.ci,
      ap: _o.ap,
      hp: _o.hp,
      ed: _o.ed,
      m: _o.m,
      ei: _o.ei,
      si: _o.si,
      htn: _o.htn,
      atn: _o.atn,
      cn: _o.cn,
    }

    const mlObject: any = {
      bt: _o.bt,
      mlid: _o.mlid,
      mll: _o.mll,
      pid: _o.pid,
      btn: _o.btn,
    }

    const msObject: any = {
      sn: _o.sn,
      hdp: _o.hdp,
      wid: _o.wid,
      ov: _o.ov,
      sid: _o.sid,
    }

    if (_o.reb === 1)
      betList.value.push(getCartObject(mlObject, msObject, infoObject))
  }
}

onMounted(() => {
  initBetList()
})
</script>

<template>
  <div class="flex flex-col items-center leading-[1.5]">
    <div class="w-full flex flex-col items-center px-[16rem]">
      <div class="text-[var(--ss-spt-dialog-bet-slip-sports-color1)] text-[14rem] font-semibold">
        {{ t('体育') }}
      </div>
      <div class="text-[var(--ss-spt-dialog-bet-slip-sports-color2)] text-center text-[14rem] font-semibold">
        <div class="flex items-center justify-center">
          <span>{{ t('投注者') }}</span>
          <span v-if="data.username" class="ml-[4rem]">{{ data.username }}</span>
          <div v-else class="center ml-[4rem]">
            <IconUniHidden />
            <span class="ml-[4rem]">
              {{ t('隐身') }}
            </span>
          </div>
        </div>
        <span class="font-normal">on {{ timeToCustomizeFormat(betTime) }}</span>
      </div>
    </div>
    <div class="w-full flex flex-col items-center p-[16rem] mt-[var(--ss-spt-dialog-bet-slip-sports-mt1)] bg-[var(--ss-spt-dialog-bet-slip-sports-bg1)]">
      <AppSportsMyBetSlip :data="data" is-dialog disable-result />
      <SSBaseButton v-if="!isSettled && betList.length > 0" size="md" class="mt-[16rem]" @click="clickHandler">
        {{ t('添加到我的投注单', { num: betList.length }) }}
      </SSBaseButton>
    </div>
  </div>
</template>

<style lang='scss' scoped>

</style>
