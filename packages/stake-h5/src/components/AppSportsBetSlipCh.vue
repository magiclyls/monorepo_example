<script setup lang='ts'>
import type { ICartInfoData } from '~/types'
import { IconEmpty1,IconUniClose, IconSportSuccess, IconSportError } from '@tg/icons';

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
  <div v-show="!isClosed" class="app-sports-bet-slip pb-[14px] leading-[1.5]" :class="{ error: isError }">
    <div class="header round-header">
      <div class="flex overflow-hidden">
        <component v-if="cartInfoData.result"
          :is="cartInfoData.result === 'fulfilled' ? IconSportSuccess : IconSportError"
          :class="{
            'text-[#1FFF20]': cartInfoData.result === 'fulfilled',
            'text-[#FF4444]': cartInfoData.result === 'rejected'
          }" />
        <span class="truncate" :class="{ 'ml-[6px]': cartInfoData.result }">{{ cartInfoData.cn }}</span>
      </div>
      <BaseButton v-if="!cartInfoData.result" type="text" size="none" :disabled="disabled"
        @click="sportStore.cart.remove(cartInfoData.wid)">
        <IconUniClose />
      </BaseButton>
    </div>
    <div class="px-[12px]">
      <div class="flex items-center justify-between pt-[8px]">
        <span class="text-tg-text-white">{{ cartInfoData.sn }}</span>
        <div v-if="cartInfoData.appointingOv && cartInfoData.result" class="flex items-center">
          <span class="text-tg-text-white mr-[4px]">预约</span>
          <AppSportsOdds :odds="String(cartInfoData.appointingOv)" arrow="right"
            :show-arrow="cartInfoData.result === void 0" prefix="@" keep text-color />
        </div>
        <AppSportsOdds v-else :odds="cartInfoData.ov" arrow="right" :show-arrow="cartInfoData.result === void 0"
          prefix="@" keep text-color />
      </div>
      <div class="flex items-center pt-[6px] text-[12px]">
        <div class="theme-left-line mr-[5px] h-[40px] w-[2px] flex-shrink-0" />
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
          <div class="theme-text-color truncate pt-[6px]">
            {{ cartInfoData.homeTeamName }} VS {{ cartInfoData.awayTeamName }}
          </div>
        </div>
      </div>
    </div>
  </div>
  <div v-show="isClosed" class="relative">
    <BaseButton class="absolute right-[10px] top-[15px]" type="text" size="none"
      @click="sportStore.cart.remove(cartInfoData.wid)">
      <IconUniClose />
    </BaseButton>
    <BaseEmpty description="盘口已暂停" icon="empty-1" class="bg-tg-secondary-grey rounded-[4px]">
      <template #icon>
        <BaseImage class="w-[80px]" url="/png/icon/empty-1.png" />
      </template>
    </BaseEmpty>
  </div>
</template>

<style lang='scss' scoped>
.app-sports-bet-slip {
  position: relative;
  color: var(--tg-text-lightgrey);
  width: 100%;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  background: var(--tg-secondary-grey);
  border-radius: var(--tg-radius-default);
  font-size: var(--tg-font-size-default);
  font-weight: var(--tg-font-weight-semibold);
  box-shadow: 0px 1px 2px -1px rgba(0, 0, 0, 0.25), 0px 2px 3px -1px rgba(0, 0, 0, 0.30);

  @include webTheme('green') {
    background: #0E6746;
    ;
  }

  @include webTheme('white') {
    background: #F5F5F5;
  }

  &.disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &.error {
    cursor: not-allowed;

    .header {
      background: var(--tg-bet-slip-error);
    }
  }

  .header {
    position: relative;
    grid-area: header;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px;
    line-height: 20px;
    border-bottom: 1px solid rgba(#f5f5f5, 0.1);
    color: var(--tg-text-white);

    @include webTheme('green') {
      border-color: #177655;
    }

    @include webTheme('white') {
      border-bottom: 1px solid #e4e4e4;
    }
  }

  .round-header {
    border-radius: var(--tg-radius-default) var(--tg-radius-default) 0 0;
  }

  .status {
    font-size: var(--tg-font-size-xs);
    display: inline-flex;
    font-weight: 600;
    align-items: center;
    justify-content: center;
    color: var(--tg-text-lightgrey);
    border-radius: 3px;
    padding: 0 var(--tg-spacing-4);
    font-feature-settings: "tnum";
    white-space: nowrap;
    line-height: 1.5;

    &.live {
      background: var(--tg-button-secondary-main);
      color: #fff;
      margin-right: 4px;
    }
  }

  .odds-up {
    color: var(--tg-sports-odds-up-color)
  }

  .odds-down {
    color: var(--tg-sports-odds-down-color)
  }
}

.theme-left-line {
  background-color: var(--tg-secondary-light);

  @include webTheme('green') {
    background-color: #3CB389;
  }
}

.theme-text-color {
  @include webTheme('green') {
    color: #3CB389;
  }
}
</style>
