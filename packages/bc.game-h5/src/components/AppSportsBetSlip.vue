<script setup lang='ts'>
import { BaseIcon } from '@tg/bccomponents'
import { ref, watch } from 'vue'

defineOptions({ name: 'AppSportsBetSlip' })
const props = defineProps<{ num: number }>()

const isNumUpdated = ref(false)
const oldNum = ref < undefined | number > (undefined)
let updateTimer: any = null

function animationend() {
  oldNum.value = undefined
}

watch(() => props.num, (newVal, oldVal) => {
  clearTimeout(updateTimer)

  oldNum.value = oldVal
  isNumUpdated.value = true

  updateTimer = setTimeout(() => {
    isNumUpdated.value = false
    clearTimeout(updateTimer)
  }, 1600)
})
</script>

<template>
  <div class="app-sports-bet-slip">
    <div class="top-0 left-0 right-0 absolute overflow-hidden" style="bottom:var(--tg-footer-height);">
      <div class="right-0 box-border bottom-0 mx-[4px] absolute" style="width:calc(100% - 8px);">
        <!-- 球 -->
        <div class="z-[101] absolute left-[50%] bottom-[16px] ml-[-29px] pointer-events-auto">
          <div class="w-[58px] h-[58px] rounded-[50%]" style="box-shadow: var(--tg-sports-bet-slip-box-shadow);">
            <div
              class="text-[32px] w-full h-full flex items-center justify-center cursor-pointer bg-[#24ee89] rounded-[50%]"
            >
              <BaseIcon name="sports-bets" style="--tg-base-icon-color:#000;" />
              <div
                id="bet-slip-header-total"
                class="absolute text-[14px] top-[-2px] left-[40px] h-[22px] min-w-[22px] font-semibold"
              >
                <!-- 旧数字 -->
                <div
                  v-if="oldNum"
                  class="num-wrap absolute" :class="{ 'ani-fadeOut': oldNum }"
                  @animationend="animationend"
                >
                  <div
                    class="num "
                  >
                    {{ oldNum }}
                  </div>
                </div>

                <!-- 新数字 -->
                <div
                  class="num-wrap" :class="{ 'is-update': isNumUpdated, 'ani-fadeIn': oldNum }"
                >
                  <div class="num" :class="{ 'is-update': isNumUpdated }">
                    {{ num }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang='scss' scoped>
.app-sports-bet-slip {
  left: 0;
  right: 0;
  bottom: 0;
  height: 100%;
  position: fixed;
  pointer-events: none;
  z-index: 100;

  .num-wrap {
    &::before {
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      content: '';
      opacity: 0;
      position: absolute;
      border-radius: 11px;
      background: rgba(0, 0, 0, 0.3);
    }

    &.is-update {
      &::before {
        opacity: 1;
        animation: bt2548 600ms 1000ms;
        transition: all 600ms ease-in-out 1000ms;
        border-radius: 11px;
        background: radial-gradient(50% 50% at 50% 50%, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.1) 100%);
      }
    }

    .num {
      color: #24ee89;
      height: 22px;
      display: flex;
      padding: 0px 5px;
      min-width: 22px;
      background: rgb(0, 0, 0);
      box-shadow: rgba(0, 0, 0, 0.2) 0px 2px 10px 0px;
      box-sizing: border-box;
      align-items: center;
      line-height: 22px;
      white-space: nowrap;
      border-radius: 11px;
      justify-content: center;

      &.is-update {
        animation: bt2547 600ms 1000ms;
      }
    }
  }
}

.ani-fadeOut {
  animation: fade-out 600ms ease-in-out;
}
.ani-fadeIn {
  animation: fade-in 600ms ease-in-out;
}

@keyframes fade-out {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}

@keyframes fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes bt2548 {
  0% {
    opacity: 1;
    transform: scale(1);
  }

  5% {
    opacity: 1;
    transform: scale(1.116901757628817);
  }

  40% {
    opacity: 1;
    transform: scale(3.3549959100745377);
  }

  45% {
    opacity: 1;
    transform: scale(3.5054274675326322);
  }

  50% {
    opacity: 1;
    transform: scale(3.603793686377848);
  }

  55% {
    opacity: 1;
    transform: scale(3.659353388357259);
  }

  60% {
    opacity: 1;
    transform: scale(3.681931318137855);
  }

  62% {
    opacity: 0.9;
    transform: scale(3.683852625310354);
  }

  100% {
    opacity: 0;
    transform: scale(3.5167078773270264);
  }
}

@keyframes bt2547 {
  0% {
    transform: scale(1);
  }

  50% {
    transform: scale(1.6);
  }

  100% {
    transform: scale(1);
  }
}
</style>
