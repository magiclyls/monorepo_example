<script lang="ts" setup>
import type { PokerCardProps } from '@tg/types'
import { IconFangkuai, IconHeitao, IconHontao, IconMeihua } from '@tg/icons'
import { PokerColors } from '@tg/types'
import gsap from 'gsap'
import { computed, ref, watch } from 'vue'
import { useMiniGamePublicPlayMp3 } from '../../composables'

defineOptions({
  name: 'AppMiniGamePokerCard',
})
const props = withDefaults(defineProps<PokerCardProps>(), {
  faceDown: true,
  lose: false,
  win: false,
  active: false,
  draw: false,
  disabled: false,
  closeDuration: 0.4,
  flipDuration: 0.4,
  animateEnabled: true,
})

// const colorSet = {
//   S: 'heitao',
//   H: 'hontao',
//   D: 'fangkuai',
//   C: 'meihua',
// }

const { play: playFlip } = useMiniGamePublicPlayMp3('/audio/poker.flip.mp3')

const pokerCardContent = ref()
const _faceDown = ref(props.faceDown)

const _rank = computed(() => props.faceDown ? '' : props.rank)

watch(() => props.faceDown, (val, old) => {
  if (val) {
    gsap.fromTo(pokerCardContent.value, {
      rotateY: '180deg',
    }, {
      duration: props.animateEnabled ? props.closeDuration : 0,
      rotateY: '0deg',
    }).then(() => {
      _faceDown.value = val
    })
  }
  else {
    gsap.fromTo(pokerCardContent.value, {
      rotateY: '0deg',
    }, {
      duration: props.animateEnabled ? props.flipDuration : 0,
      rotateY: '180deg',
    }).then(() => {
      _faceDown.value = val
    })
    playFlip()
  }
})
</script>

<template>
  <button
    :class="[`rank-${_rank}`, color]" class="wrap poker-card leading-normal disabled:pointer-events-none"
    :disabled="disabled"
  >
    <div class="horizontal">
      <div
        ref="pokerCardContent" class="content relative select-none rounded-[0.25em]"
        :class="{ 'face-down': _faceDown }"
      >
        <div
          class="face absolute h-full w-full rounded-[0.25em] bg-white"
          :class="{ lose: (!faceDown) && lose, win, active, draw }"
        >
          <div class="face-content ml-[10%] w-max flex flex-col items-center" :class="[color]">
            <template v-if="_rank && color">
              <span>{{ _rank }}</span>
              <template v-if="color">
                <IconHeitao v-if="color === PokerColors.HEITAO" />
                <IconHontao v-else-if="color === PokerColors.HONTAO" />
                <IconFangkuai v-else-if="color === PokerColors.FANGKUAI" />
                <IconMeihua v-else-if="color === PokerColors.MEIHUA" />
              </template>
            </template>
          </div>
        </div>
        <div
          class="back absolute h-full w-full rounded-[0.25em] bg-white bg-cover bg-center bg-no-repeat"
        />
      </div>
    </div>
  </button>
</template>

<style lang="scss">
:root {
  --tg-mini-game-poker-card-width: 5em;
  --tg-mini-game-poker-card-height: 7.9em;
  --tg-mini-game-poker-rank-font-size: 2.2em;
}
</style>

<style lang="scss" scoped>
button.poker-card {
  display: block;
  .content {
    width: var(--tg-mini-game-poker-card-width);
    height: var(--tg-mini-game-poker-card-height);
    perspective: 700px;
    transform-style: preserve-3d;
    box-shadow: 0 0 0.25em #0710174d;
    transform-style: preserve-3d;
    transition-timing-function: ease-out;
    transition-property: transform, box-shadow;
    &:not(.face-down) {
      transform: rotateY(180deg);
    }

    .face {
      transform: scaleX(-1);
      &.lose {
        box-shadow: 0 0 0 0.3em #e9113c;
      }
      &.win {
        box-shadow: 0 0 0 0.3em #24ee89;
      }
      &.active {
        box-shadow: 0 0 0 0.3em #1475e1;
      }
      &.draw {
        box-shadow: 0 0 0 0.3em #ff9d00;
      }
      .face-content {
        font-family: brandon-grotesque, sans-serif;
        font-size: var(--tg-mini-game-poker-rank-font-size);
        transition: none;
        &.fangkuai,
        &.hontao,
        &.H,
        &.D {
          color: #e9113c;
          --tg-base-icon-color: #e9113c;
        }
        &.heitao,
        &.meihua,
        &.S,
        &.C {
          color: #1a2c38;
          --tg-base-icon-color: #1a2c38;
        }
      }
    }
    .back {
      backface-visibility: hidden;
      background-image: url('/afun-h5/svg/poker-back.svg');
    }
  }
}
</style>
