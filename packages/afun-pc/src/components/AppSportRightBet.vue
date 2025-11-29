<script lang="ts" setup>
import { IconUniClose, IconNavbarUserBet } from '@tg/icons'
import AppSportRightBetSlip from './AppSportRightBetSlip.vue'
import AppSportRightMyBets from './AppSportRightMyBets.vue'
import { EnumsBetSlipHeadStatus } from '~/utils/enums'

defineOptions({
  name: 'AppSportRightBet',
})
const { t } = useI18n()
const { isLogin } = storeToRefs(useAppStore())
const { isMobile } = storeToRefs(useWindowStore())
const sportStore = useSportsStore()
const { closeRightSidebar } = useRightSidebar()
const headSelectValue = ref<EnumsBetSlipHeadStatus>(isMobile.value ? EnumsBetSlipHeadStatus.myBets : EnumsBetSlipHeadStatus.betSlip)
const headSelectData = computed(() => {
  if (isMobile.value) {
    return [
      {
        label: t('my_bets'),
        value: EnumsBetSlipHeadStatus.myBets,
        icon: 'navbar-user-bet',
        disabled: !isLogin.value,
      },
    ]
  }

  return [
    {
      label: t('bet_slip'),
      value: EnumsBetSlipHeadStatus.betSlip,
      icon: 'spt-user-bet',
    },
    {
      label: t('my_bets'),
      value: EnumsBetSlipHeadStatus.myBets,
      icon: 'navbar-user-bet',
      disabled: !isLogin.value,
    },
  ]
})

const {
  settle,
} = useSportSelectSettle()

const {
  totalUnsettled,
  fetch: getBetListData,
} = useApiSportBetList(settle, undefined, false, true)

const betCount = computed(() => {
  return sportStore.cart.count
})

const unsettledCount = computed(() => {
  return totalUnsettled.value
})

const headRenderCount = computed(() => {
  if (headSelectValue.value === EnumsBetSlipHeadStatus.betSlip)
    return betCount.value
  else if (headSelectValue.value === EnumsBetSlipHeadStatus.myBets)
    return unsettledCount.value
})

const renderComponent = computed(() => {
  switch (headSelectValue.value) {
    case EnumsBetSlipHeadStatus.betSlip:
      return AppSportRightBetSlip
    case EnumsBetSlipHeadStatus.myBets:
      return AppSportRightMyBets
  }
})

function changeHeadSelectValue(value: EnumsBetSlipHeadStatus) {
  headSelectValue.value = value
}

function getBetListDataHandle() {
  if (isLogin.value)
    getBetListData()
}

onMounted(() => {
  if (isLogin.value)
    getBetListData()
})
</script>

<template>
  <div class="app-sport-right-bet">
    <div class="navigation-header">
      <div v-if="isMobile" class="text-tg-text-white item-center flex text-[14px] font-semibold" style="--tg-icon-color:#fff;">
        <IconNavbarUserBet />
        <span class="ml-[8px]">{{ t('my_bets') }}</span>
      </div>
      <BaseSelect
        v-else
        v-model="headSelectValue" class="theme-select"
        :distance="8"
        :options="headSelectData" no-hover popper
      >
        <template #label="{ data }">
          <div class="type-select">
            <component :is="data?.icon" />
            <span class="th-leading-5 ml-[8px]">{{ data?.label }}</span>
            <BaseBadge
              v-if="headRenderCount" :count="headRenderCount" :max="99999"
              class="ml-[8px]"
              style="--tg-badge-padding-x: var(--tg-spacing-7);
                --tg-badge-font-size:var(--tg-font-size-default)"
              mode="active"
            />
          </div>
        </template>
        <template #option="{ data: { item } }">
          <div class="type-option">
            <span>{{ item.label }}</span>
            <BaseBadge
              v-if="item.value === 0 && betCount"
              class="ml-[8px]"
              :count="betCount" :max="99999"
              mode="active"
            />
            <BaseBadge
              v-if="item.value === 1 && unsettledCount"
              class="ml-[8px]"
              :count="unsettledCount" :max="99999"
              mode="active"
            />
          </div>
        </template>
      </BaseSelect>

      <VTooltip placement="bottom" :triggers="['hover']">
        <div class="item hoverable">
          <BaseButton type="text" @click="closeRightSidebar">
            <IconUniClose />
          </BaseButton>
        </div>
        <template #popper>
          <div class="tiny-menu-item-title">
            {{ t('chat_close_side') }}
          </div>
        </template>
      </VTooltip>
    </div>
    <div class="content">
      <KeepAlive>
        <component
          :is="renderComponent"
          @change-head-select-value="changeHeadSelectValue"
          @get-bet-list="getBetListData()"
        />
      </KeepAlive>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.theme-select{
  --tg-base-select-popper-style-padding-x:0;
  --tg-base-select-popper-style-padding-y:0;
  @include webTheme('white'){
    --tg-base-select-popper-bg-color:#cbcbcb;
  }
}
.app-sport-right-bet {
  display: flex;
  flex-direction: column;
  height: 100%;
  .content {
    flex: 1;
  }
}
.type-option {
  display: flex;
  align-items: center;
  // gap: var(--tg-spacing-8);
}
.navigation-header {
    background: var(--tg-secondary-dark);
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: var(--tg-header-height);
    z-index: 2;
    position: relative;
    box-shadow: var(--tg-box-shadow-lg);
    touch-action: none;
    padding-right: var(--tg-scrollbar-size);
    padding-left: var(--tg-spacing-16);
    :deep(.popper-label) {
      height: 16.5px;
      align-items: flex-start;
    }
    .type-select {
      display: flex;
      align-items: center;
      // gap:var(--tg-spacing-8);
      line-height: 1;
    }

    .hoverable {
      padding: var(--tg-spacing-1) var(--tg-spacing-4);
      border-radius: 50%;
      transition: all ease .25s;
      background-color: transparent;
      &:hover {
        background-color: var(--tg-popper-hover-bg);
        --tg-icon-color: var(--tg-text-white);
        @include webTheme('green'){
          background-color: #0E6746;
        }
      }
    }
  }
</style>
