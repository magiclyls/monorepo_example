<script lang="ts" setup>
import { IconUniCircleAdd, IconUniRecordSuccess } from '@tg/icons'

interface Props {
  data: Array<BaseMenuItem>
  activeTab: string
}

interface BaseMenuItem {
  title: string
  value: string
  path: string
  icon?: string
}
defineOptions({
  name: 'AppRebateBaseMenu',
})
const props = defineProps<Props>()

const router = useLocalRouter()
const { isCompleteKYC } = storeToRefs(useAppStore())
const { isMobile } = storeToRefs(useWindowStore())
const { t } = useI18n()

const activeIdx = computed(() => props.data.findIndex(a => a.value === props.activeTab))
const percent = computed(() => activeIdx.value >= 0 ? activeIdx.value * 100 : 0)
const height = computed(() => (100 / props.data.length).toFixed(2))

function menuItemClick(item: BaseMenuItem) {
  router.push(item.path)
}
</script>

<template>
  <section class="tg-base-menu">
    <div class="outer-wrapper">
      <div class="wrapper">
        <a
          v-for="item, idx in data"
          :key="idx"
          class="link"
          :class="{ active: activeIdx === idx }"
          @click="menuItemClick(item)"
        >
          <span class="content-or-loader"><span>{{ item.title }}</span></span>
          <div v-if="item.path === '/settings/kyc' && !isMobile" class="ml-[12px] flex items-center gap-[4px] text-[14px]">
            <template v-if="isCompleteKYC">
              <IconUniRecordSuccess />
              <span class="custom-text-color1">{{ t('verified') }}</span>
            </template>
            <template v-else>
              <div class="rotate-45">
                <IconUniCircleAdd />
              </div>
              <span class="custom-text-color2">{{ t('verified_yet') }}</span>
            </template>
          </div>
        </a>
        <div
          class="dash"
          :style="{ height: `${height}%`, transform: `translateY(${percent}%)` }"
        />
      </div>
    </div>
  </section>
</template>

<style>
:root {
  --tg-base-menu-item-active-bg: var(--tg-secondary-deepdark);
  --tg-base-menu-item-hover-active-bg: var(--tg-secondary-deepdark);
  --tg-base-menu-item-active-active-bg: var(--tg-secondary-deepdark);
  --tg-base-menu-item-active-color: var(--tg-text-white);
}

[theme="greenblack"] {
  --tg-base-menu-item-active-bg: var(--tg-secondary-grey);
  --tg-base-menu-item-hover-active-bg: var(--tg-secondary-grey);
  --tg-base-menu-item-active-active-bg: var(--tg-secondary-grey);
  --tg-base-menu-item-active-color: var(--tg-text-greenblack-main);
}

[theme="white"] {
  --tg-base-menu-item-active-bg: var(--tg-white-primary-active-bg);
  --tg-base-menu-item-hover-active-bg: var(--tg-white-primary-active-bg);
  --tg-base-menu-item-active-active-bg: var(--tg-white-primary-active-bg);
  --tg-base-menu-item-active-color: var(--tg-text-white);
}
</style>

<style lang="scss" scoped>
.custom-text-color1 {
  color: #00E701;

}
.custom-text-color2 {
  color: var(--tg-text-lightgrey);
  @include webTheme('green') {
    color: #42BC91;
  }
}
.tg-base-menu {
  position: sticky;
  top: 2em;
  max-width: 100%;
  min-width: 180px;
  background: var(--tg-secondary-dark);
  color: var(--tg-border-color-grey);
  border-radius: var(--tg-radius-md);
  @include webTheme('white'){
    border-radius: var(--tg-radius-default);
  }
  .outer-wrapper {
    padding: var(--tg-spacing-8) 0;
    .wrapper {
      position: relative;
      .link {
        font-size: var(--tg-font-size-default);
        color: var(--tg-text-white);
        display: flex;
        width: 100%;
        padding: var(--tg-spacing-button-padding-vertical-md) var(--tg-spacing-button-padding-horizontal-md);
        align-items: center;
        justify-content: flex-start;
        appearance: none;
        margin: 0;
        border: none;
        font-weight: var(--tg-font-weight-semibold);
        &:hover {
          background: var(--tg-base-menu-item-hover-active-bg);
          color: var(--tg-base-menu-item-active-color)
        }
       &.active {
          background: var(--tg-base-menu-item-active-bg);
          color: var(--tg-base-menu-item-active-color)
        }
        &:active {
          background: var(--tg-base-menu-item-active-active-bg);
          color: var(--tg-base-menu-item-active-color)
        }
      }
      .dash {
        height: 100%;
        position: absolute;
        left: 0;
        top: 0;
        width: 3px;
        background: var(--tg-tab-active-bar);
        transition: all .2s ease-out;
      }
    }
  }
}
</style>
