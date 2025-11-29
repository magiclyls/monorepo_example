<script setup lang="ts">
import { IconUniArrowleftLine ,IconUniArrowrightLine} from '@tg/icons'

interface ComponentItem {
  cid: string
  name: string
  icon: string
  ty: string | number
  total: number
  platform_id: string
  path: string
  gameList: {
    item_nums: number
    list: any[]
  }[]
}

interface Props {
  showManCount?: boolean
  detail: ComponentItem
}

defineOptions({ name: 'AppCasinoMultiLine' })

const props = defineProps<Props>()
const router = useLocalRouter()
const { t } = useI18n()
const { appContentWidth } = storeToRefs(useWindowStore())

const PCItemNum = ref(0)
const gapX = ref('5px')
const gapY = ref('10px')

const wrapper = ref()

const { x } = useScroll(wrapper, { behavior: 'smooth' }) // , isScrolling, arrivedState, directions

// 获取最长一行的长度
const maxLineLength = ref(0)

const wrapperWidth = ref(0)

const isPrevAactive = computed(() => {
  if (x.value > 0)
    return true

  else
    return false
})

const isNextAactive = computed(() => {
  if (x.value + wrapperWidth.value < maxLineLength.value)
    return true

  else
    return false
})

function next() {
  x.value += wrapperWidth.value
}

function prev() {
  const temp = x.value - wrapperWidth.value
  if (temp > 0)
    x.value = temp
  else
    x.value = 0
}

function onTitleClick() {
  if (props.detail.path)
    router.push(props.detail.path)
}

watch([wrapper, PCItemNum], () => {
  if (props.detail && wrapper.value) {
    const arr = props.detail.gameList?.map(item => item.list.length / (appContentWidth.value >= 500 ? PCItemNum.value : item.item_nums || 4))
    if (!arr)
      return
    const max = Math.max(...arr)
    maxLineLength.value = wrapper.value.offsetWidth * max
    wrapperWidth.value = wrapper.value.offsetWidth
  }
})

watchEffect(() => {
  if (appContentWidth.value >= 1150) {
    gapX.value = '15px'
    gapY.value = '30px'
    PCItemNum.value = 7
  }
  else if (appContentWidth.value >= 1000) {
    gapX.value = '15px'
    gapY.value = '30px'
    PCItemNum.value = 6
  }
  else if (appContentWidth.value >= 850) {
    gapX.value = '15px'
    gapY.value = '30px'
    PCItemNum.value = 5
  }
  else if (appContentWidth.value >= 700) {
    gapX.value = '15px'
    gapY.value = '30px'
    PCItemNum.value = 4
  }
  else if (appContentWidth.value >= 500) {
    gapX.value = '5px'
    gapY.value = '10px'
    PCItemNum.value = 4
  }
  else {
    gapX.value = '5px'
    gapY.value = '10px'
    //小于500从接口数据
    PCItemNum.value = globalInitMap.currentTemplate === 1 ? 3 : 4
  }
})

onActivated(() => {
  x.value = 0
})
</script>

<template>
  <div class="mt-[10px]">
    <div class="header">
      <div class="title">
        <BaseButton
          type="text" size="none" style="--tg-base-button-text-default-color:var(--tg-text-white);"
          @click="onTitleClick"
        >
          <div class="icon">
            <AppImage
              class="icon-img" :url="detail.icon" loading="eager" is-cloud
            />
          </div>
          <h3 class="text-left">
            {{ detail.name }}
          </h3>
        </BaseButton>
      </div>
      <div class="right-wrap flex">
        <BaseButton
          type="square-line" class="mr-[6px] h-28"
          style="--tg-base-button-color:var(--tg-text-lightgrey);--tg-base-button-padding-x:18px; --tg-base-button-font-size:16px;--tg-base-button-square-line-border-color:var(--tg-border-color-grey-light);"
          @click="onTitleClick"
        >
          <span class="whitespace-nowrap">{{ t('finance_other_tab_all') }}</span>
          <span class="total text-tg-text-green ml-5">{{ detail.total }}</span>
        </BaseButton>
        <div class="arrows">
          <BaseButton class="mr-[6px]" type="square-line" size="none" :disabled="!isPrevAactive" @click="prev">
            <div class="left a-inner">
              <IconUniArrowleftLine class="left" />
            </div>
          </BaseButton>
          <BaseButton size="none" type="square-line" :disabled="!isNextAactive" @click="next">
            <div class="a-inner right">
              <IconUniArrowrightLine class="right"  />
            </div>
          </BaseButton>
        </div>
      </div>
    </div>
    <div
      ref="wrapper" class="detail-wrapper hide-scroll flex flex-col overflow-scroll"
      :style="{ '--sg-game-gap-x': gapX, '--sg-game-gap-y': gapY }"
    >
      <div
        v-for="item, index in detail.gameList" :key="index" class="item-wrapper"
        :class="`cols-${appContentWidth >= 500 ? PCItemNum : item.item_nums || 4}`"
      >
        <BaseGameItem
          v-for="game in item.list" :key="game.id" :game-info="game" :show-man-count="showManCount"
          class="max-big"
        />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.detail-wrapper {
  scroll-snap-type: x mandatory; //todo
  scroll-behavior: smooth;
  /* 平滑滚动（可选） */
}

.item-wrapper {
  display: grid;
  grid-auto-flow: column;
  margin-bottom: var(--sg-game-gap-y);

  &:last-child {
    margin-bottom: 0rem;
  }

  &.cols-2 {
    grid-auto-columns: calc((100% - var(--sg-game-gap-x)) / 2);
    gap: var(--sg-game-gap-x);
  }

  &.cols-3 {
    grid-auto-columns: calc((100% - calc((var(--sg-game-gap-x)) * 2)) / 3);
    gap: var(--sg-game-gap-x);
  }

  &.cols-4 {
    grid-auto-columns: calc((100% - calc((var(--sg-game-gap-x)) * 3)) / 4);
    gap: var(--sg-game-gap-x);
  }
  &.cols-5 {
    grid-auto-columns: calc((100% - calc((var(--sg-game-gap-x)) * 4)) / 5);
    gap: var(--sg-game-gap-x);
  }
  &.cols-6 {
    grid-auto-columns: calc((100% - calc((var(--sg-game-gap-x)) * 5)) / 6);
    gap: var(--sg-game-gap-x);
  }
  &.cols-7 {
    grid-auto-columns: calc((100% - calc((var(--sg-game-gap-x)) * 6)) / 7);
    gap: var(--sg-game-gap-x);
  }
}

.max-big {
  scroll-snap-align: start;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
  height: 36px;

  .title {
    font-size: var(--tg-font-size-xl);
    color: var(--tg-text-white);
    display: inline-flex;
    position: relative;
    align-items: center;
    font-weight: 500;

    h3 {
      font-size: var(--tg-font-size-md);
      line-height: 1.5;
    }

    .icon {
      font-size: var(--tg-font-size-base);
      margin-right: var(--tg-spacing-8);
      display: flex;
      align-items: center;
      --app-sport-image-error-icon-size: 28px;

      .icon-img {
        width: 28px;
        height: 28px;
      }
    }

    &:hover {
      --tg-icon-color: var(--tg-text-white);

      .icon-img {
        // filter: brightness(2);
      }
    }
  }

  .right-wrap {
    // gap: 6px;
  }

  .arrows {
    display: flex;
    align-items: center;
    // gap: 6px;

    button {
      width: 32px;
      height: 28px;

      .a-inner {

        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all .2s;

        &.left svg {
          transform-origin: center center;
        }

        &.right svg {
          transform-origin: center center;
        }
      }

      &:not(:disabled) {
        .a-inner {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all .2s;

          &:hover svg {
            transform: scale(1.1426);
            opacity: 0.8;
            color: var(--tg-text-white);
          }

          &.left svg {
            transform-origin: center center;
          }

          &.right svg {
            transform-origin: center center;
          }
        }
      }

      &:disabled {
        cursor: default;
      }
    }

    button {
      border-color: var(--tg-border-color-grey-light);
    }

    .app-svg-icon {
      font-size: var(--tg-font-size-default);
      --tg-icon-color: var(--tg-text-lightgrey);
    }
  }
}
</style>
