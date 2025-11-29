<script setup lang='ts'>
import { BaseAspectRatio } from '@tg/bccomponents'
import { Local, STORAGE_MENU_EXPAND_DOMID } from '@tg/utils'
import { computed, onUnmounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import AppCasinoSearch from '~/components/AppCasinoSearch.vue'
import { useLeftSidebar } from '~/hooks/useLeftSidebar'
import { useMenuStore } from '~/stores/menu'
import AppSidebarBig from './AppSidebarBig.vue'

interface Props {
  isSwitching?: boolean
  switchTo?: 'big' | 'small' | ''
}
defineOptions({
  name: 'AppLeftSidebar',
})
defineProps<Props>()
const { t } = useI18n()
const { navButtons, beforePage, setBeforePage } = useLeftSidebar()

const menuStore = useMenuStore()
const router = useRouter()
const route = useRoute()
const isFocus = ref(false)

const isCasino = computed(() => beforePage.value === ('/'))
const isSports = computed(() => beforePage.value.includes('sports'))

// 搜索栏
const gameType = ref(isCasino.value ? '1' : isSports.value ? '2' : '')

function reset() {
  setBeforePage('/')
  gameType.value = '1'
}

// function onGameTypeChange(v: string) {
//   gameType.value = v
// }
function push(title: string) {
  Local.remove(STORAGE_MENU_EXPAND_DOMID)
  menuStore.setSideBigActiveMenu('')
  const path = title === 'casino' ? '/' : `/sports`
  router.push(path)
}

document.body.style.backgroundColor = '#0f212e'

onUnmounted(() => {
  document.body.style.backgroundColor = '#1a2c38'
})
</script>

<template>
  <div class="relative px-[16px] bg-[#0f212e]" :class="[isFocus && 'pt-[16px]']">
    <div :class="[isFocus ? '' : 'w-full flex justify-center z-20 h-[141px] ']">
      <div :class="[isFocus ? '' : 'bg-[#0F212E] pt-[16px]', { 'custom-width': !isFocus }]">
        <AppCasinoSearch v-model:show="isFocus" page="sidebar" />
        <div v-if="!isFocus" class="buttons">
          <div class="grid grid-cols-2 w-full gap-[8px]">
            <BaseAspectRatio v-for="n in navButtons" :key="n.value" ratio="3.5/1">
              <div
                :class="[n.value, { 'casino-active': n.value === 'casino' && isCasino }, { 'sports-active': n.value === 'sports' && isSports }]"
                @click="push(n.value)"
              >
                <span class="text-[16px]">{{ t(n.title).toLocaleUpperCase() }}</span>
              </div>
            </BaseAspectRatio>
          </div>
        </div>
      </div>
    </div>
    <div v-if="!isFocus" @touchstart.stop @touchmove.stop>
      <Transition name="slide-fade">
        <AppSidebarBig
          v-if="switchTo !== 'big'"
          :current-type="gameType"
          :is-switching="isSwitching"
          @reset="reset"
        />
      </Transition>
    </div>
  </div>
</template>

<style lang='scss' scoped>
@import '../../styles/global-function-mixin.scss';
.custom-width {
  width: var(--pc-max-width);
}
.sidebar-top {
  height: 60px;
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.2),
    0 2px 4px -1px rgba(0, 0, 0, 0.122);
}

.buttons {
  display: flex;
  overflow: hidden;
  flex-shrink: 0;

  .casino,
  .sports {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    background-size: cover;
    background-repeat: no-repeat;
    border-radius: 4px;
    color: #fff;
    font-size: 14px;
    font-weight: 700;
    text-shadow:
      0 1px 2px rgba(0, 0, 0, 0.12),
      0 1px 3px rgba(0, 0, 0, 0.2);
    cursor: pointer;
    height: 50px;
    justify-content: center;
    @include getBackgroundImage('/left-casino');

    &:active {
      span {
        transform: scale(0.96);
      }
    }
  }

  .sports {
    @include getBackgroundImage('/left-sport');
    // &.maintained {
    //   &:hover {
    //     @include getBackgroundImage('/left-sport');
    //   }
    // }
  }
  .sports-active {
    @include getBackgroundImage('/left-sport-active');
  }
  .casino-active {
    @include getBackgroundImage('/left-casino-active');
  }
}

.scrollable-content {
  display: flex;
  flex-direction: column;
  gap: 8px;
  scrollbar-gutter: stable;
  padding: 0 2px 0 8px;
}

.is-small {
  flex-direction: column;
  padding: 0 0 8px;
  box-shadow: none;

  .button {
    box-shadow:
      0 10px 15px -3px rgba(0, 0, 0, 0.2),
      0 4px 6px -2px rgba(0, 0, 0, 0.1);
  }

  .game-type {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    padding: 16px 0 0;
    > *:not(:first-child) {
      margin-top: 8px;
    }
    span {
      display: none;
    }

    .casino,
    .sports {
      width: 44px;
      height: 44px;
      flex: unset;
    }
  }
}
.casino-sport-fade-top-enter-active {
  transition:
    transform 0.25s linear,
    opacity 0.3s ease;
  will-change: transform, opacity;
}

.casino-sport-fade-top-enter-from {
  transform: translate3d(0, 100%, 0);
  opacity: 0;
}

.casino-sport-fade-top-enter-to {
  transform: translate3d(0, 0, 0);
  opacity: 1;
}

.casino-sport-fade-top-leave-active {
  transition: none;
}

.casino-sport-fade-top-leave-from,
.casino-sport-fade-top-leave-to {
  transform: translate3d(0, 0, 0);
  opacity: 0;
}
</style>
