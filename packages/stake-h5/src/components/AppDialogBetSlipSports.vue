<script setup lang='ts'>
import type { ISportsMyBetSlipItem } from '@tg/types'
import { IconUniHidden } from '@tg/icons'

interface ISportsDialogMyBetSlipItem extends ISportsMyBetSlipItem {
  username: string
}

interface Props {
  sportsData: ISportsDialogMyBetSlipItem
}
defineOptions({
  name: 'AppDialogBetSlipSports',
})
const props = defineProps<Props>()
const closeDialog = inject('closeDialog', () => { })
const betList = ref<any>([])

const { t } = useI18n()
const { openRightSidebar, rightIsExpand, currentRightSidebarContent } = useRightSidebar()
const windowStore = useWindowStore()
const { isMobile } = storeToRefs(windowStore)
const sportStore = useSportsStore()

const betTime = computed(() => props.sportsData.bt)
const isSettled = computed(() => {
  return props.sportsData.os === 1 || betList.value.length === 0
})

function clickHandler() {
  if (!rightIsExpand.value && !isMobile.value)
    openRightSidebar(EnumRightSidebarContent.BETTING)

  else if (currentRightSidebarContent.value !== EnumRightSidebarContent.BETTING && !isMobile.value)
    openRightSidebar(EnumRightSidebarContent.BETTING)

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
  for (const item of props.sportsData.bi) {
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
    <div class="w-full flex flex-col items-center p-[16px] pt-0">
      <div class="text-tg-text-white text-[14px] font-semibold">
        {{ t('sports') }}
      </div>
      <div class="text-tg-text-lightgrey text-center text-[14px] font-semibold">
        <div class="flex items-center justify-center">
          <span>{{ t('investor') }}</span>
          <span v-if="sportsData.username" class="ml-[4px]">{{ sportsData.username }}</span>
          <div v-else class="center ml-[4px]">
            <IconUniHidden />
            <span class="ml-[4px]">
              {{ t('hidden_user') }}
            </span>
          </div>
        </div>
        <span class="font-normal">{{ t('on') }} {{ timeToCustomizeFormat(betTime) }}</span>
      </div>
    </div>
    <div class="bg-tg-secondary-dark w-full flex flex-col items-center p-[16px]">
      <AppSportsMyBetSlip :data="sportsData" is-dialog disable-result />
      <BaseButton v-if="!isSettled" size="md" class="mt-[16px]" @click="clickHandler">
        {{ t('add_one_bet', { num: betList.length }) }}
      </BaseButton>
    </div>
  </div>
</template>

<style lang='scss' scoped>

</style>
