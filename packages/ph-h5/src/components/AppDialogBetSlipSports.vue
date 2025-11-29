<script setup lang='ts'>
import type { ISportsMyBetSlipItem } from '@tg/types'
import { PhBaseButton } from '@tg/bccomponents'
import { IconUniHidden } from '@tg/icons'
import { useAppStore, useSportsStore } from '@tg/stores'
import { getCartObject } from '@tg/utils'
import { timeToFormatDiffOnChinese } from '@tg/vue-i18n'
import { storeToRefs } from 'pinia'
import { computed, inject, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
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
const closeDialog = inject('closeDialog', () => { })
const betList = ref<any>([])

const { t } = useI18n()
const { userInfo } = storeToRefs(useAppStore())
const sportStore = useSportsStore()
const router = useRouter()

const betTime = computed(() => props.data.bt)
const isSettled = computed(() => {
  return props.data.os === 1 || betList.value.length === 0
})

function clickHandler() {
  betList.value.forEach((item: any) => {
    console.log('🚸🚸🚸 ~ clickHandler ~ item:', item)
    if (!sportStore.cart.checkWid(item.wid))
      sportStore.cart.add(item)
  })

  closeDialog()
  router.push('/sports')
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

function goToBet() {
  closeDialog()
  router.push('/sports')
}

onMounted(() => {
  initBetList()
})
</script>

<template>
  <div class="px-[16rem]">
    <div class="w-full px-[16rem] pb-[16rem] mt-[15rem]">
      <div class="flex justify-center">
        <PhBaseButton type="none" size="none" @click="goToBet">
          <div class="text-tg-text-white flex items-center text-[16px] font-semibold capitalize">
            {{ t('体育') }}
          </div>
        </PhBaseButton>
      </div>
      <div class="text-tg-text-lightgrey text-center text-[14px] font-semibold text-[#6D7693]">
        <div class="center mb-[4rem] gap-[4rem]">
          <span>{{ t('投注者') + $t('冒号') }}</span>
          <span v-if="userInfo?.username ">{{ userInfo?.username }}</span>
          <template v-else>
            <VTooltip placement="top" :triggers="['click', 'hover']">
              <div class="center stealth-box">
                <IconUniHidden class="text-[#9DABC8]" />
                <span style="padding-left: 5px;" class="semibold">
                  {{ t('隐身') }}
                </span>
              </div>
              <template #popper>
                <div class="tiny-menu-item-title">
                  {{ t('此玩家启用了私密功能') }}
                </div>
              </template>
            </VTooltip>
          </template>
        </div>
        <span class="inline-block h-[21rem] font-normal">{{ t('于') }}{{ timeToFormatDiffOnChinese(data.bt) }}</span>
      </div>
    </div>
    <AppSportsMyBetSlip :data="data" is-dialog disable-result />
    <PhBaseButton
      v-if="!isSettled && betList.length > 0" style="--ph-base-button-font-size:14rem;" class="my-[16rem] mx-auto"
      @click="clickHandler"
    >
      {{ t('添加到我的投注单', { num: betList.length }) }}
    </PhBaseButton>
  </div>
</template>

<style lang='scss' scoped>

</style>
