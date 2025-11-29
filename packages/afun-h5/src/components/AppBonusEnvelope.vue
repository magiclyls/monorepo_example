<script lang="ts" setup>
import { AfunBaseImage } from '@tg/bccomponents'
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

const emit = defineEmits(['open'])

function openDialog() {
  props.bonusState === 1 && emit('open')
}
</script>

<template>
  <div
    class="app-bonus-envelope"
    :class="{ disabled: bonusState === 2 }"
    @click="openDialog"
  >
    <div class="top">
      <IconUniTransfer class="transfer text-[28px] mr-[8px]" />
      <div>
        <div class="money text-[18px]">
          <AfunBaseImage class="mr-[4px] w-[18px]" url="/m/afun-h5/png/coin-usdt.png" />
          {{ amount }}
        </div>
        <div class="label">
          {{ bonusState === 2 ? $t('已领取') : $t('待领取') }}
        </div>
      </div>
    </div>
    <div class="bot">
      {{ $t('客服转账') }}
    </div>
  </div>
</template>

<style lang="scss" scoped>
.app-bonus-envelope {
  width: 230px;
  height: 90px;
  border-radius: 4px;
  background: #ff9800;
  color: white;
  font-size: 12px;
  position: relative;
  cursor: pointer;
  &.disabled::after {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    background-color: white;
    border-radius: 4px;
    opacity: 0.4;
    top: 0;
    left: 0;
    cursor: not-allowed;
  }
  .top {
    padding-left: 12px;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    height: 60px;
    border-bottom: 1px solid #{rgba($color: #fff, $alpha: 0.5)};
    svg:first-of-type {
      margin-right: 8px;
    }
    .money {
      font-weight: 700;
      display: flex;
      align-items: center;
      svg:first-of-type {
        margin-right: 4px;
      }
    }
    .label {
      font-size: 12px;
      font-weight: 600;
      line-height: 18px;
    }
  }
  .bot {
    padding-left: 12px;
    overflow: hidden;
    text-overflow: ellipsis;
    margin-top: 4px;
  }
}
</style>
