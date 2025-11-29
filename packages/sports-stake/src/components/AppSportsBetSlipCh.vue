<script setup lang='ts'>
import type { ICartInfoData } from '@tg/types'
import { BaseImage, SSBaseButton, SSBaseEmpty } from '@tg/bccomponents'
import { IconCheck2, IconSportError, IconUniClose } from '@tg/icons'
import { useAppStore, useSportsStore } from '@tg/stores'
import { storeToRefs } from 'pinia'
import { computed, ref, watch } from 'vue'
import { useSportsConfig } from '../../config/index'
import AppSportsOdds from './AppSportsOdds.vue'

interface Props {
  index: number
  /**
   * 下注类型
   *
   * 单项：EnumsBetSlipBetSlipTabStatus.single
   *
   * 组合：EnumsBetSlipBetSlipTabStatus.multi
   */
  isMulti: boolean
  /** 渲染的List数据 */
  cartInfoData: ICartInfoData
  /** 购物车所有注单 */
  cartDataList: ICartInfoData[]
  /** 禁用 */
  disabled: boolean

}
const props = withDefaults(defineProps<Props>(), {})
const { projectName } = useSportsConfig()
const sportStore = useSportsStore()
const { isLogin } = storeToRefs(useAppStore())

const isLive = computed(() => {
  if (props.cartInfoData.m === 3)
    return true
  else
    return false
})

/** 是否已关闭 */
const isClosed = computed(() => props.cartInfoData.os === 0)

const isError = computed(() => {
  if (!isLogin.value)
    return false

  if (props.cartInfoData.result === 'rejected')
    return true

  if (
    sportStore.cart.getExistSameEventIdList.includes(props.cartInfoData.ei) && props.isMulti
  )
    return true

  if (
    sportStore.cart.getNotSupportWidList.includes(props.cartInfoData.wid) && props.isMulti
  )
    return true

  if (
    sportStore.cart.getOddsLessThanOnePointOneWidList.includes(props.cartInfoData.wid) && props.isMulti
  )
    return true

  if (
    sportStore.cart.getExistIcList.includes(props.cartInfoData.ic) && props.isMulti
  )
    return true

  return false
})

/** 更新赔率显示 */
let timer: any
const saveNum = ref(props.cartInfoData.ov)
const upDown = ref('')
function resetUpDown() {
  clearTimeout(timer)
  timer = setTimeout(() => {
    upDown.value = ''
    clearTimeout(timer)
  }, 3200)
}
watch(() => props.cartInfoData.ov, (newOdds) => {
  if (+saveNum.value !== +newOdds) {
    upDown.value = +newOdds > +saveNum.value ? 'up' : 'down'
    resetUpDown()
    saveNum.value = newOdds
  }
})
</script>

<template>
  <div v-show="!isClosed" class="app-sports-bet-slip pb-[14rem] leading-[1.5]" :class="{ error: isError }">
    <div class="header round-header">
      <div class="flex items-center overflow-hidden">
        <template v-if="cartInfoData.result">
          <IconCheck2 v-if="cartInfoData.result === 'fulfilled'" class="text-[var(--ss-spt-bet-slip-ch-color1)]" />
          <IconSportError v-else class="text-[var(--ss-spt-bet-slip-ch-color2)]" />
        </template>
        <span class="truncate" :class="{ 'ml-[6rem]': cartInfoData.result }">{{ cartInfoData.cn }}</span>
      </div>
      <SSBaseButton
        v-if="!cartInfoData.result" type="text" size="none" :disabled="disabled"
        @click="sportStore.cart.remove(cartInfoData.wid)"
      >
        <IconUniClose :class="isError ? 'text-[var(--ss-spt-bet-slip-ch-color3)]' : 'text-[var(--ss-spt-bet-slip-ch-color4)]'" />
      </SSBaseButton>
    </div>
    <div class="px-[12rem]">
      <div class="flex items-center justify-between pt-[8rem]">
        <span class="text-[var(--ss-spt-bet-slip-ch-color5)]">{{ cartInfoData.sn }}</span>
        <div v-if="cartInfoData.appointingOv && cartInfoData.result" class="flex items-center">
          <span class="text-[var(--ss-spt-bet-slip-ch-color6)] mr-[4rem]">预约</span>
          <AppSportsOdds
            :odds="String(cartInfoData.appointingOv)" arrow="right"
            :show-arrow="cartInfoData.result === void 0" prefix="@" keep text-color
          />
        </div>
        <AppSportsOdds
          v-else :odds="cartInfoData.ov" arrow="right" :show-arrow="cartInfoData.result === void 0"
          prefix="@" keep text-color
        />
      </div>
      <div class="flex items-center pt-[6rem] text-[12rem]">
        <div class="theme-left-line mr-[5rem] h-[40rem] w-[2rem] flex-shrink-0" />
        <div class="w-full">
          <div class="w-full flex items-center justify-between">
            <div>
              <span v-if="isLive && cartInfoData.result === void 0" class="status live">
                滚球
              </span>
              <span class="theme-text-color">{{ cartInfoData.btn }}</span>
            </div>
            <div v-show="upDown" :class="[`odds-${upDown}`]">
              赔率已改变
            </div>
          </div>
          <div class="theme-text-color truncate pt-[6rem]">
            {{ cartInfoData.homeTeamName }} VS {{ cartInfoData.awayTeamName }}
          </div>
        </div>
      </div>
    </div>
  </div>
  <div v-show="isClosed" class="relative">
    <SSBaseButton
      class="absolute right-[10rem] top-[15rem]" type="text" size="none"
      @click="sportStore.cart.remove(cartInfoData.wid)"
    >
      <IconUniClose class="text-[var(--ss-spt-bet-slip-ch-color7)]" />
    </SSBaseButton>
    <SSBaseEmpty description="盘口已暂停" class="bg-[var(--ss-spt-bet-slip-ch-bg1)] rounded-[4rem]" style="--ss-empty-padding:12rem 16rem;">
      <template #icon>
        <div class="w-[80rem]">
          <BaseImage :url="`/${projectName}/png/uni-empty-market.png`" />
        </div>
      </template>
    </SSBaseEmpty>
  </div>
</template>

<style lang='scss' scoped>
.app-sports-bet-slip {
  position: relative;
  color: var(--ss-spt-bet-slip-ch-color8);
  width: 100%;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  background: var(--ss-spt-bet-slip-ch-bg2);
  border-radius: 4rem;
  font-size: 14rem;
  font-weight: 600;

  &.disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &.error {
    cursor: not-allowed;

    .header {
      background: var(--ss-spt-bet-slip-ch-bg3);
      color: var(--ss-spt-bet-slip-ch-color9);
    }
  }

  .header {
    position: relative;
    grid-area: header;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10rem;
    line-height: 20rem;
    border-bottom: var(--ss-spt-bet-slip-ch-border1);
    color: var(--ss-spt-bet-slip-ch-color10);
  }

  .round-header {
    border-radius: 4rem 4rem 0 0;
  }

  .status {
    font-size: 12rem;
    display: inline-flex;
    font-weight: 600;
    align-items: center;
    justify-content: center;
    color: var(--ss-spt-bet-slip-ch-color11);
    border-radius: 3rem;
    padding: 0 4rem;
    font-feature-settings: 'tnum';
    white-space: nowrap;
    line-height: 1.5;

    &.live {
      background: var(--ss-spt-bet-slip-ch-bg4);
      color: var(--ss-spt-bet-slip-ch-color12);
      margin-right: 4rem;
    }
  }

  .odds-up {
    color: var(--ss-spt-bet-slip-ch-color13);
  }

  .odds-down {
    color: var(--ss-spt-bet-slip-ch-color14);
  }
}

.theme-left-line {
  background-color: var(--ss-spt-bet-slip-ch-bg5);
}
.theme-text-color {
  color: var(--ss-spt-bet-slip-ch-color15);
}
</style>
