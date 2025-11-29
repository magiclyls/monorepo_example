<script lang="ts" setup>
import { IconUniTransfer } from '@tg/icons'
interface Props {
  /** 1待领取 2已领取 */
  bonusState: 1 | 2
  amount: string
}
defineOptions({
  name: 'AppBonusEnvelope',
})
const props = defineProps<Props>()

const { openReceiveBonusDialog } = useDialogReceiveBonus()

const { feedBackItem } = storeToRefs(useChatStore())

function openDialog() {
  if (props.bonusState === 1)
    openReceiveBonusDialog({ feedBackItem: feedBackItem.value })
}
</script>

<template>
  <div
    class="app-bonus-envelope"
    :class="{ disabled: bonusState === 2 }"
    @click="openDialog"
  >
    <div class="top">
      <IconUniTransfer class="transfer" />
      <div>
        <div class="money">
          <BaseImage url="/png/icon/coin-usdt.png" />
          {{ amount }}
        </div>
        <div class="label">
          {{ bonusState === 2 ? $t('received') : $t('wait_receive') }}
        </div>
      </div>
    </div>
    <div class="bot">
      {{ $t('service_transfer') }}
    </div>
  </div>
</template>

<style lang="scss" scoped>
.app-bonus-envelope {
  width: 230px;
  height: 90px;
  border-radius: var(--tg-radius-default);
  background: #ff9800;
  color: white;
  font-size: var(--tg-font-size-xs);
  position: relative;
  cursor: pointer;
  &.disabled::after {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    background-color: white;
    border-radius: var(--tg-radius-default);
    opacity: 0.4;
    top: 0;
    left: 0;
    cursor: not-allowed;
  }
  .top {
    padding-left: var(--tg-spacing-12);
    display: flex;
    align-items: center;
    justify-content: flex-start;
    font-size: var(--tg-font-size-2xl);
    height: 60px;
    border-bottom: 1px solid #{rgba($color: var(--tg-color-white-rgb), $alpha: 0.4)};
    svg:first-of-type{
        margin-right:var(--tg-spacing-8);
    }
    .money {
      font-size: var(--tg-font-size-lg);
      font-weight: var(--tg-font-weight-bold);
      display: flex;
      align-items: center;
      margin-bottom: var(--tg-spacing-4);
      padding-top: var(--tg-spacing-4);
      svg:first-of-type{
        margin-right:var(--tg-spacing-4);
      }
    }
    .label {
      font-size: var(--tg-font-size-xs);
      font-weight: var(--tg-font-weight-semibold);
      line-height: var(--tg-spacing-18);
    }
  }
  .bot {
    padding-left: var(--tg-spacing-12);
    line-height: var(--tg-spacing-30);
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
</style>
