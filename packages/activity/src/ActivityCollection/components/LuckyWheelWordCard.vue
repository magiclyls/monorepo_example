<script lang="ts" setup>
import { useI18n } from 'vue-i18n'

const props = defineProps<{
  cards: Card[]
  small?: boolean
}>()
const { t } = useI18n()
interface Card {
  world: string
  count: number
  colorCode: string
  color: string
}
</script>

<template>
  <div class="card-container">
    <template v-for="(card, index) in props.cards || []" :key="index">
      <div class="card" :class="`card-${card?.colorCode} ${props.small ? 'small' : ''}`">
        <div class="word" :style="{ color: card.color }">
          {{ card?.world }}
        </div>
        <div class="coupon">
          {{ t('券') }}x{{ card?.count }}
        </div>
      </div>
    </template>
  </div>
</template>

<style lang="scss" scoped>
    .card-container {
  display: flex;
  justify-content: center;
  gap: 4px; /* 卡片间距 */
  width: 100%;
  flex-wrap: wrap;
}

.card {
  width: 65px;
  height: 82px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  padding-bottom: 4px;
  font-size: clamp(16px, 4vw, 36px); /* 随卡片大小缩放文字 */
  background-size: 100% 100%;
  box-shadow: 0 2.744px 5.122px 0 rgba(0, 0, 0, 0.2);
  &.card-99357 {
    background-image: url('/activity/png/word-collection/99357.png');
  }
  &.card-99358 {
    background-image: url('/activity/png/word-collection/99358.png');
  }
  &.card-99359 {
    background-image: url('/activity/png/word-collection/99359.png');
  }
  &.card-99360 {
    background-image: url('/activity/png/word-collection/99360.png');
  }
  &.card-99361 {
    background-image: url('/activity/png/word-collection/99361.png');
  }
  &.card-99362 {
    background-image: url('/activity/png/word-collection/99362.png');
  }
  &.card-99363 {
    background-image: url('/activity/png/word-collection/99363.png');
  }
  .word {
    text-align: center;
    -webkit-text-stroke-width: 1px;
    -webkit-text-stroke-color: rgba(255, 255, 255, 0.8);
    font-family: Saira;
    font-size: 34px;
    font-style: normal;
    font-weight: 700;
    line-height: 30px;
  }
  .coupon {
    background-color: rgba(0, 0, 0, 0.2);
    border-radius: 100px;
    font-size: 14px;
    font-weight: 600;
    color: #fff;
    text-align: center;
    padding: 3px 10px;
    margin-top: 14px;
  }
  &.small {
    width: 59px;
    height: 75px;
    .coupon {
      padding: 2px 10px;
      margin-top: 10px;
    }
  }
}
</style>
