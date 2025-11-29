<script setup lang='ts'>
interface Props {
  payoutMultiplier: string
  amount: string
}
defineOptions({
  name: 'AppMiniGamePartDragonResultWrap',
})
const props = defineProps<Props>()
</script>

<template>
  <div class="game-result-wrap win">
    <div class="game-result-content">
      <span class="number-multiplier">
        <span class="size-default variant-success numeric weight-bold line-height-default align-left with-icon-space text-size-default">{{ payoutMultiplier }}×</span>
      </span>
      <div class="divider" />
      <div class="currency" role="presentation">
        <span class="content">
          <span class="weight-bold line-height-default size-default text-size-default variant-success numeric with-icon-space is-truncate align-center" style="max-width: 12ch;">{{ amount }}</span>
        </span>
        <span class="line-height-default align-left size-default text-size-default is-truncate variant-subtle weight-normal" title="usdt" style="max-width: 12ch;">
          <svg fill="none" viewBox="0 0 96 96" class="svg-icon"> <title /> <path d="M96 48c0 26.51-21.49 48-48 48S0 74.51 0 48 21.49 0 48 0s48 21.49 48 48Z" fill="#26A17B" /><path d="M53.766 52.149v-.006c-.33.024-2.031.126-5.826.126-3.03 0-5.163-.09-5.913-.126v.009c-11.664-.513-20.37-2.544-20.37-4.974 0-2.427 8.706-4.458 20.37-4.98v7.932c.762.054 2.946.183 5.964.183 3.62 0 5.436-.15 5.775-.18v-7.929c11.64.519 20.325 2.55 20.325 4.974 0 2.43-8.685 4.455-20.325 4.971Zm0-10.77v-7.098h16.242V23.457H25.785v10.824h16.242v7.095c-13.2.606-23.127 3.222-23.127 6.354s9.927 5.745 23.127 6.354V76.83h11.739V54.078c13.179-.606 23.082-3.219 23.082-6.348s-9.903-5.742-23.082-6.351Z" fill="#fff" /></svg>
        </span>
      </div>
    </div>
  </div>
</template>

<style>
:root {
  --dragon-tower-text-size-default:.875rem;
  --dragon-tower-radius-md:.5rem;
  --dragon-tower-shadows-lg:0 10px 15px -3px rgba(0, 0, 0, .2), 0 4px 6px -2px rgba(0, 0, 0, .1);
  --dragon-tower-space-1:.25rem;
  --dragon-tower-space-2:.5rem;
  --dragon-tower-duration: 300ms;
  --dragon-tower-grey-600:#1a2c38;
  --dragon-tower-grey-500:#213743;
  --dragon-tower-grey-400:var(--tg-secondary-main);
  --dragon-tower-green-500:#00e701;
  --dragon-tower-grey-300:#557086;
  --dragon-tower-spacingEm-0-75:.75em;
  --dragon-tower-spacingEm-1:1em;
}
</style>

<style lang='scss'>
@keyframes revealCss {
  0% {
    opacity: 1;
    border-color: var(--dragon-tower-grey-500);
  }

  to {
    opacity: .4;
    border-color: var(--dragon-tower-grey-300);
    background-color: #1a2c38;
  }
}
@keyframes reveal {
  0% {
    opacity: 0;
    transform: scale(0);
  }

  to {
    opacity: 1;
    transform: scale(1);
  }
}
@keyframes fetching {
  0%,to {
    transform: scale(1)
  }

  50% {
    transform: scale(1.03)
  }
}
/** 投注结果显示区 */
.game-result-wrap.hide {
  display: none;
}
.game-result-wrap {
  z-index: 10;
}
.game-result-wrap {
  font-size: var(--dragon-tower-text-size-default);
  background: var(--dragon-tower-grey-600);
  border-radius: var(--dragon-tower-radius-md);
  text-align: center;
  position: absolute;
  font-weight: 800;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) scale(1);
  max-width: 100%;
  min-width: 150px;
  animation-duration: var(--dragon-tower-duration);
  border: 3px solid;
  box-shadow: var(--dragon-tower-shadows-lg);
}
.game-result-wrap.win {
  border-color: var(--dragon-tower-green-500);
}
.game-result-wrap >* {
  z-index: 10;
}
.game-result-content {
  display: flex;
  text-align: center;
  width: 100%;
  padding: var(--dragon-tower-spacingEm-0-75) var(--dragon-tower-spacingEm-1);
  flex-direction: column;
  align-items: center;
}
span.variant-success {
  color: var(--dragon-tower-green-500);
}
span.line-height-default {
  line-height: 1.5;
}
span.align-left {
  text-align: left;
  justify-content: flex-start;
}
span.numeric {
  font-variant-numeric: tabular-nums;
}
.number-multiplier > * {
  font-size: 2em !important;
}
.divider {
  background: var(--dragon-tower-grey-400);
  height: 3px;
  width: 30%;
  margin: var(--dragon-tower-space-1) 0 var(--dragon-tower-space-2);
}
.currency {
  display: inline-flex;
  align-items: center;
  .content {
    display: inline-block;
    overflow: hidden;
    white-space: nowrap;
    font-variant-numeric: tabular-nums;
  }
}
</style>
