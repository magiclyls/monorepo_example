<script lang="ts" setup name="base-dialog">
import { IconUniClose, IconNotice, IconUniNoticeGg, IconWalletSet, IconUniNoticeYgg, IconUniNoticePmd, IconChatRule } from '@tg/icons';

interface Props {
  id?: string
  show: boolean
  title?: string
  icon?: string | Component
  iconRight?: string
  teleport?: boolean
  closeOnClickOverlay?: boolean
  funcCall?: boolean
  maxWidth?: number
  showButtons?: boolean
  transparent?: boolean
  showClose?: boolean
  noMoreToday?: boolean
  height?: number | string
  maxHeight?: number | string
  showLoad?: boolean
  modalContentScrollY?: boolean
  hasPadding?: boolean
  clazz?: string
  backgroundColor?: string
  preload?: string
  statistics?: boolean
  account?: boolean
  /** 层级默认8888 */
  zIndex?: number | string
  closeIcon?: string
  closeIconStyle?: string
  showIcon?:boolean
}
defineOptions({
  name: 'BaseDialog',
})
const props = withDefaults(defineProps<Props>(), {
  closeOnClickOverlay: true,
  maxWidth: 500,
  showClose: true,
  showLoad: true,
  modalContentScrollY: true,
  hasPadding: true,
  statistics: false,
  account: false,
  zIndex: 'var(--tg-z-index-secondary)',
  showIcon:true
})

const emit = defineEmits(['update:show', 'close', 'cancel', 'confirm', 'dialogBeforeUnmount', 'beforeClose', 'clickTitle'])

const { bool: _show, setTrue: setBShowTrue, setFalse: setBShowFalse } = useBoolean(false)
const { closeAllDialog } = useDialogState()
const { isMobile } = storeToRefs(useWindowStore())
const { isOpenCPFOnRegister } = storeToRefs(useBrandStore())
const {
  isLoginDialogOpen,
  isRegisterDialogOpen,
  toggleLoginDialogState,
  toggleRegisterDialogState,
} = useGlobalStateLoginRegisterDialogOpen()

const scrollContainer = ref()
/** 目前只有登陆注册两个会涉及全屏，以下是相关判断 */
const isLoginOrRegister = computed(() => props.id == 'unique_tg_login_dialog_id_local' || props.id == 'unique_tg_register_dialog_id_local')
const isNeedFullScreenLogin = computed(() => ['white', 'green'].includes(globalInitMap.currentTheme) || isMobile.value)
const isNeedFull = computed(() => isLoginOrRegister.value && isNeedFullScreenLogin.value)
const _hasPadding = computed(() => isNeedFull.value ? false : props.hasPadding)
const _icon = computed<Component | string>(() => {
  if (props.icon === 'uni-notice-yznx') {
    return 'uni-notice-yznx'
  }
  else if (props.icon === 'uni-notice-znx') {
    return 'uni-notice-znx'
  }
  else if (props.icon === 'uni-notice-gg') {
    return IconUniNoticeGg
  }
  else if (props.icon === 'uni-notice-ygg') {
    return IconUniNoticeYgg
  }
  else if (props.icon === 'uni-notice-pmd') {
    return IconUniNoticePmd
  }
  else if (props.icon === 'chat-rule') {
    return IconChatRule
  }
  else if (props.icon === 'wallet-set') {
    return IconWalletSet
  }
  else {
    return props.icon as string
  }
})
const background = computed(() => {
  if (props.transparent)
    return 'transparent'

  if (props.backgroundColor)
    return props.backgroundColor

  return 'var(--tg-dialog_style-bg)'
})
/** 手机浏览器滚动时导致视窗高度变化，解决满屏弹窗时的高度问题 */
const _maxHeight = computed(() => {
  if (isLoginOrRegister.value) {
    if (props.maxHeight === undefined && isNeedFull.value)
      return '100%'
  }
  if (props.maxHeight === undefined)
    return 'calc(100% - 4em)'
  if (typeof props.maxHeight === 'number')
    return `${props.maxHeight}px`
  return props.maxHeight
})
const _height = computed(() => {
  if (isLoginOrRegister.value) {
    if (props.maxHeight === undefined && isNeedFull.value)
      return '100%'
  }
  if (props.height === undefined)
    return 'auto'
  if (typeof props.height === 'number')
    return +props.height > 1 ? `${props.height}px` : 'auto'
  return props.height
})

function updateShow(value: boolean) {
  emit('update:show', value)

  if (!value) {
    /** 关闭弹窗时更新状态 */
    if (isLoginDialogOpen.value)
      toggleLoginDialogState(false)
    if (isRegisterDialogOpen.value)
      toggleRegisterDialogState(false)

    setTimeout(() => {
      emit('close')
    }, 300)
  }
}

function close() {
  emit('beforeClose')
  if (props.funcCall)
    _show.value = false
  updateShow(false)
}

function onCancel() {
  emit('cancel')
}

function onConfirm() {
  emit('confirm')
}

function clickTitle() {
  emit('clickTitle')
}

const { lockScroll } = useScrollPrevent()

provide('closeDialog', close)

onMounted(() => {
  if (props.funcCall) {
    setTimeout(() => {
      setBShowTrue()
      updateShow(true)
    }, 0)
  }
  setTimeout(() => {
    const overlay = document.querySelector('.tg-dialog-overlay')
    if (overlay) {
      overlay.addEventListener('touchmove', (e) => {
        e.preventDefault()
      }, { passive: false })
    }
  }, 0)

  setTimeout(() => {
    const allScrollyEl = document.querySelectorAll('.tg-base-dialog .scroll-y')
    lockScroll(allScrollyEl)
  }, 300)
})

onBeforeUnmount(() => {
  emit('dialogBeforeUnmount')
})

onUnmounted(() => {
  setBShowFalse()
})

watch(closeAllDialog, (val) => {
  if (val === true)
    close()
})
</script>

<template>
  <Teleport to="body" :disabled="!teleport">
    <Transition>
      <section v-if="preload || show || _show" :id="id" class="tg-base-dialog"
        :class="[_hasPadding ? '' : 'no-padding']" :style="{ zIndex }">
        <div class="overlay tg-dialog-overlay" @click="closeOnClickOverlay && close()" />
        <div class="card tg-dialog-card" :class="[clazz]" :style="`
            --tg-dialog-style-maxwidth:${maxWidth}px;
            background: ${background};
            height: ${_height};
            max-height:${_maxHeight};
          `">
          <div v-if="icon || title" class="header" :class="{ statistics, account }">
            <h2 @click="clickTitle">
              <component v-if="typeof _icon === 'object' && showIcon " :is="_icon" class="mr-[8px] text-[16px]"></component>
              <BaseImage v-if="typeof _icon === 'string' && showIcon" :url="`/png/icon/${_icon}.png`" class="mr-[8px] w-[16px]" />
              <span>{{ title }}</span>
              <component v-if="iconRight" :is="iconRight"></component>
              <slot name="titleRight" />
            </h2>
            <a v-if="showClose" class="close ml-[12px]" @click.stop="close">
              <component v-if="closeIcon" :is="closeIcon" :style="closeIconStyle"></component>
              <IconUniClose v-else :style="closeIconStyle" />
            </a>
          </div>
          <div ref="scrollContainer" class="scroll-contain" :class="{ 'scroll-y': modalContentScrollY }">
            <div class="modal-content">
              <template v-if="preload">
                <AppDialogLoginCenter v-if="preload === 'login_dialog'" preload />
                <template v-else-if="preload === 'register_dialog'">
                  <AppDialogRegisterCenterV1 preload />
                </template>
              </template>
              <template v-else>
                <Suspense timeout="0">
                  <slot />
                  <template #fallback>
                    <div v-if="showLoad" class="center dialog-loading-height">
                      <BaseLoading />
                    </div>
                  </template>
                </Suspense>
              </template>
            </div>
            <div v-if="showButtons" class="footer-buttons">
              <div class="buttons">
                <BaseButton size="md" bg-style="empty" @click="onCancel">
                  {{ $t('cancel') }}
                </BaseButton>
                <BaseButton bg-style="primary" size="md" @click="onConfirm">
                  {{ $t('confirm') }}
                </BaseButton>
              </div>
            </div>
          </div>
          <a v-if="showClose && !icon && !title" class="close-only" :style="closeIcon ? 'padding-right: 0' : ''"
            @click.stop="close">
            <component v-if="closeIcon" :is="closeIcon" :style="closeIconStyle"></component>
            <IconUniClose v-else :style="closeIconStyle" />
          </a>

          <!-- 今日不再显示 -->
          <div v-if="noMoreToday" class="no-more-today">
            <slot name="bottom" />
          </div>
        </div>
      </section>
    </Transition>
  </Teleport>
</template>

<style>
:root {
  --tg-dialog-style-maxwidth: 500px;
  --tg-dialog_style-bg: var(--tg-primary-main);
  --tg-base-dialog-close-only-padding-top: 20.5px;
  --tg-base-dialog-card-border-radius: var(--tg-radius-default);
  --tg-dialog_style-bg2: var(--tg-dialog_style-bg);
  --tg-dialog_style_login_register-bg: var(--tg-primary-main);
}

html[theme="white"] {
  --tg-dialog_style-bg: #f5f5f5;
  --tg-dialog_style-bg2: white;
  --tg-dialog_style_login_register-bg: #fff;
}

html[theme="green"] {
  --tg-dialog_style-bg: #055434;
  --tg-text-lightgrey: #3CB389;
  --tg-dialog_style_login_register-bg: #055434;
}
</style>

<style lang="scss" scoped>
.v-enter-active,
.v-leave-active {
  transition: all .3s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

.tg-base-dialog {
  position: fixed;
  left: var(--pc-h5model-left, 0);
  top: 0;
  bottom: 0;
  right: 0;
  width: var(--pc-h5model-width, 100%);
  // z-index: var(--tg-z-index-secondary);
  padding: var(--tg-spacing-16);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--tg-font-size-default);

  &.no-padding {
    padding: 0;
  }

  .register-white {
    @include webTheme('white') {
      --tg-dialog_style-bg: #ffffff;
    }
  }

  .overlay {
    position: absolute;
    left: 0;
    top: -500px;
    bottom: -500px;
    right: 0;
    background: rgba(0, 0, 0, .7);
    touch-action: none;
    z-index: var(--tg-z-index-50);
  }

  .card {
    position: relative;
    z-index: var(--tg-z-index-secondary);
    width: 100%;
    min-width: 200px;
    max-width: var(--tg-dialog-style-maxwidth);
    // max-height: calc(100% - 4em);
    border-radius: var(--tg-base-dialog-card-border-radius);
    background: var(--tg-dialog_style-bg);
    display: flex;
    flex-direction: column;
    color: var(--tg-text-white);

    .header {
      padding: 20px 16px 16px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: var(--tg-font-size-lg);
      touch-action: none;

      &.statistics {
        padding: 20px var(--tg-spacing-12) 12px;
      }

      >*:not(:first-child) {
        margin-left: var(--tg-spacing-12);
      }

      h2 {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        font-size: 18px;
        line-height: 24px;

        >span {
          font-weight: var(--tg-font-weight-semibold);
          margin-right: var(--tg-spacing-8);
        }

        >svg {
          margin-right: var(--tg-spacing-8);
        }
      }

      &.account {
        padding: 16px 16px 0;

        &>h2 {
          font-size: 18px;
        }
      }

      @include webTheme('white') {
        --tg-icon-color: #555555;
      }
    }

    .modal-content {
      display: flex;
      flex-direction: column;
      position: relative;
    }

    .footer-buttons {
      padding: 0 var(--tg-spacing-16) var(--tg-spacing-16);

      .buttons {
        display: flex;

        >*:not(:first-child) {
          margin-left: var(--tg-spacing-16);
        }

        button {
          flex: 1;
        }
      }
    }
  }

  .close {
    cursor: pointer;
    font-size: var(--tg-font-size-base);
    display: flex;
    position: relative;
    z-index: var(--tg-z-index-top);

    &:hover {
      --tg-icon-color: var(--tg-text-white);
    }
  }

  .close-only {
    display: flex;
    position: absolute;
    right: 0;
    top: 0;
    z-index: var(--tg-z-index-top);
    padding: 20.5px 16px 16px;
    padding-top: var(--tg-base-dialog-close-only-padding-top);
    font-size: var(--tg-font-size-base);
    cursor: pointer;
    transition: all 0.2s;
    color: var(--tg-text-lightgrey);

    @include webTheme('white') {
      --tg-icon-color: #555555;
    }

    &:hover {
      --tg-icon-color: var(--tg-text-white);
    }

  }

  .no-more-today {
    position: absolute;
    bottom: -35px;
    left: 50%;
    transform: translateX(-50%);
  }
}
</style>
